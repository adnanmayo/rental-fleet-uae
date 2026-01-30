/**
 * Build Optimization Utilities
 *
 * Optimizes build performance for large-scale programmatic SEO
 * by managing priority-based generation, batch processing, and resource usage.
 */

import { ProgrammaticEntity, PageType } from '../programmatic/types';
import { estimateBuildTime, PriorityTier, determinePriorityTier } from './isr-config';

/**
 * Build configuration
 */
export interface BuildConfig {
  maxBuildTimePages: number;
  batchSize: number;
  parallelLimit: number;
  priorityThreshold: number;
  enableProgressLogging: boolean;
}

/**
 * Default build configuration
 */
export const DEFAULT_BUILD_CONFIG: BuildConfig = {
  maxBuildTimePages: 1000,
  batchSize: 50,
  parallelLimit: 10,
  priorityThreshold: 8,
  enableProgressLogging: true
};

/**
 * Build statistics
 */
export interface BuildStatistics {
  totalEntities: number;
  buildTimePages: number;
  isrPages: number;
  onDemandPages: number;
  estimatedBuildTime: {
    minutes: number;
    seconds: number;
  };
  breakdown: {
    hubs: number;
    spokes: number;
    comparisons: number;
  };
}

/**
 * Calculate build statistics for entity sets
 */
export function calculateBuildStatistics(
  entities: Record<string, ProgrammaticEntity[]>,
  config: Partial<BuildConfig> = {}
): BuildStatistics {
  const finalConfig = { ...DEFAULT_BUILD_CONFIG, ...config };
  const statistics: BuildStatistics = {
    totalEntities: 0,
    buildTimePages: 0,
    isrPages: 0,
    onDemandPages: 0,
    estimatedBuildTime: { minutes: 0, seconds: 0 },
    breakdown: {
      hubs: 0,
      spokes: 0,
      comparisons: 0
    }
  };

  // Count hub pages (single entity pages)
  for (const entityList of Object.values(entities)) {
    statistics.totalEntities += entityList.length;

    for (const entity of entityList) {
      const tier = determinePriorityTier(entity);

      statistics.breakdown.hubs++;

      if (tier === PriorityTier.CRITICAL) {
        statistics.buildTimePages++;
      } else if (tier === PriorityTier.HIGH || tier === PriorityTier.MEDIUM) {
        statistics.isrPages++;
      } else {
        statistics.onDemandPages++;
      }
    }
  }

  // Calculate spoke pages (emirate × vehicle combinations)
  if (entities.emirates && entities.vehicles) {
    const totalSpokes = entities.emirates.length * entities.vehicles.length;
    statistics.breakdown.spokes = totalSpokes;

    // Count high-priority spokes
    for (const emirate of entities.emirates) {
      for (const vehicle of entities.vehicles) {
        const tier = determinePriorityTier(emirate, [vehicle]);

        if (tier === PriorityTier.CRITICAL) {
          statistics.buildTimePages++;
        } else if (tier === PriorityTier.HIGH || tier === PriorityTier.MEDIUM) {
          statistics.isrPages++;
        } else {
          statistics.onDemandPages++;
        }
      }
    }
  }

  // Calculate comparison pages (vehicle × vehicle)
  if (entities.vehicles && entities.vehicles.length > 1) {
    const comparisons = (entities.vehicles.length * (entities.vehicles.length - 1)) / 2;
    statistics.breakdown.comparisons = comparisons;
    // Most comparisons are ISR or on-demand
    statistics.isrPages += Math.floor(comparisons * 0.3);
    statistics.onDemandPages += Math.ceil(comparisons * 0.7);
  }

  // Estimate build time for build-time pages only
  const estimateSeconds = estimateBuildTime(statistics.buildTimePages);
  statistics.estimatedBuildTime = {
    minutes: Math.floor(estimateSeconds / 60),
    seconds: estimateSeconds % 60
  };

  return statistics;
}

/**
 * Get pages to generate at build time
 */
export function getBuildTimePages(
  entities: Record<string, ProgrammaticEntity[]>,
  config: Partial<BuildConfig> = {}
): Array<{
  path: string;
  priority: number;
  type: PageType;
  entityIds: string[];
}> {
  const finalConfig = { ...DEFAULT_BUILD_CONFIG, ...config };
  const pages: Array<{
    path: string;
    priority: number;
    type: PageType;
    entityIds: string[];
  }> = [];

  // Add hub pages
  for (const [type, entityList] of Object.entries(entities)) {
    for (const entity of entityList) {
      if (entity.priority >= finalConfig.priorityThreshold) {
        pages.push({
          path: `/${entity.slug}`,
          priority: entity.priority,
          type: 'hub',
          entityIds: [entity.id]
        });
      }
    }
  }

  // Add high-priority spoke pages
  if (entities.emirates && entities.vehicles) {
    for (const emirate of entities.emirates) {
      for (const vehicle of entities.vehicles) {
        const minPriority = Math.min(emirate.priority, vehicle.priority);

        if (minPriority >= finalConfig.priorityThreshold) {
          pages.push({
            path: `/${emirate.slug}/${vehicle.slug}`,
            priority: minPriority,
            type: 'spoke',
            entityIds: [emirate.id, vehicle.id]
          });
        }
      }
    }
  }

  // Sort by priority and limit
  return pages
    .sort((a, b) => b.priority - a.priority)
    .slice(0, finalConfig.maxBuildTimePages);
}

/**
 * Batch processing for large-scale generation
 */
export async function* batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  options: {
    batchSize?: number;
    parallelLimit?: number;
    onProgress?: (completed: number, total: number) => void;
  } = {}
): AsyncGenerator<R[], void, unknown> {
  const { batchSize = 50, parallelLimit = 10, onProgress } = options;
  const total = items.length;
  let completed = 0;

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const results: R[] = [];

    // Process batch in parallel with limit
    for (let j = 0; j < batch.length; j += parallelLimit) {
      const parallel = batch.slice(j, j + parallelLimit);
      const parallelResults = await Promise.all(parallel.map(item => processor(item)));
      results.push(...parallelResults);

      completed += parallel.length;
      if (onProgress) {
        onProgress(completed, total);
      }
    }

    yield results;
  }
}

/**
 * Priority queue for build order optimization
 */
export class BuildQueue {
  private queue: Array<{
    page: {
      path: string;
      priority: number;
      type: PageType;
      entityIds: string[];
    };
    dependencies: string[];
  }> = [];

  add(
    page: {
      path: string;
      priority: number;
      type: PageType;
      entityIds: string[];
    },
    dependencies: string[] = []
  ): void {
    this.queue.push({ page, dependencies });
  }

  /**
   * Get next batch respecting dependencies and priority
   */
  getNextBatch(batchSize: number, completed: Set<string>): typeof this.queue {
    const batch: typeof this.queue = [];

    // Sort by priority
    const sorted = [...this.queue].sort((a, b) => b.page.priority - a.page.priority);

    for (const item of sorted) {
      if (batch.length >= batchSize) break;

      // Check if all dependencies are completed
      const allDepsCompleted = item.dependencies.every(dep => completed.has(dep));

      if (allDepsCompleted) {
        batch.push(item);
      }
    }

    // Remove batch items from queue
    for (const item of batch) {
      const index = this.queue.indexOf(item);
      if (index > -1) {
        this.queue.splice(index, 1);
      }
    }

    return batch;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }
}

/**
 * Resource usage monitoring
 */
export class ResourceMonitor {
  private startTime: number = Date.now();
  private pageCount: number = 0;
  private errorCount: number = 0;

  recordPageGeneration(): void {
    this.pageCount++;
  }

  recordError(): void {
    this.errorCount++;
  }

  getMetrics(): {
    pagesGenerated: number;
    errors: number;
    elapsedSeconds: number;
    pagesPerSecond: number;
    errorRate: number;
  } {
    const elapsedSeconds = (Date.now() - this.startTime) / 1000;
    const pagesPerSecond = this.pageCount / elapsedSeconds;
    const errorRate = this.pageCount > 0 ? this.errorCount / this.pageCount : 0;

    return {
      pagesGenerated: this.pageCount,
      errors: this.errorCount,
      elapsedSeconds: Math.round(elapsedSeconds),
      pagesPerSecond: Math.round(pagesPerSecond * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100
    };
  }

  reset(): void {
    this.startTime = Date.now();
    this.pageCount = 0;
    this.errorCount = 0;
  }
}

/**
 * Progress logger for build process
 */
export class BuildProgressLogger {
  private total: number;
  private completed: number = 0;
  private startTime: number = Date.now();
  private lastLogTime: number = Date.now();
  private logInterval: number;

  constructor(total: number, logIntervalMs: number = 5000) {
    this.total = total;
    this.logInterval = logIntervalMs;
  }

  update(increment: number = 1): void {
    this.completed += increment;

    const now = Date.now();
    if (now - this.lastLogTime >= this.logInterval) {
      this.log();
      this.lastLogTime = now;
    }
  }

  log(): void {
    const percentage = Math.round((this.completed / this.total) * 100);
    const elapsed = Math.round((Date.now() - this.startTime) / 1000);
    const rate = this.completed / elapsed;
    const remaining = Math.round((this.total - this.completed) / rate);

    console.log(
      `[Build Progress] ${this.completed}/${this.total} (${percentage}%) | ` +
      `${rate.toFixed(2)} pages/sec | ` +
      `${remaining}s remaining`
    );
  }

  finish(): void {
    const elapsed = Math.round((Date.now() - this.startTime) / 1000);
    const avgRate = this.completed / elapsed;

    console.log(
      `[Build Complete] ${this.completed} pages generated in ${elapsed}s ` +
      `(${avgRate.toFixed(2)} pages/sec)`
    );
  }
}

/**
 * Optimize build order based on dependencies
 */
export function optimizeBuildOrder(
  pages: Array<{
    path: string;
    priority: number;
    type: PageType;
    entityIds: string[];
  }>
): Array<{
  path: string;
  priority: number;
  type: PageType;
  entityIds: string[];
}> {
  // Hub pages should be built before spoke pages that depend on them
  const hubs = pages.filter(p => p.type === 'hub');
  const spokes = pages.filter(p => p.type === 'spoke');
  const comparisons = pages.filter(p => p.type === 'comparison');
  const directories = pages.filter(p => p.type === 'directory');

  // Build order: hubs → spokes → comparisons → directories
  return [
    ...hubs.sort((a, b) => b.priority - a.priority),
    ...spokes.sort((a, b) => b.priority - a.priority),
    ...comparisons.sort((a, b) => b.priority - a.priority),
    ...directories.sort((a, b) => b.priority - a.priority)
  ];
}

/**
 * Estimate memory usage for build
 */
export function estimateMemoryUsage(pageCount: number): {
  estimatedMB: number;
  recommended: string;
} {
  // Rough estimate: 2MB per page during build
  const estimatedMB = pageCount * 2;

  let recommended: string;
  if (estimatedMB < 1024) {
    recommended = '2GB RAM minimum';
  } else if (estimatedMB < 2048) {
    recommended = '4GB RAM recommended';
  } else if (estimatedMB < 4096) {
    recommended = '8GB RAM recommended';
  } else {
    recommended = '16GB+ RAM recommended';
  }

  return {
    estimatedMB: Math.round(estimatedMB),
    recommended
  };
}

/**
 * Generate build report
 */
export function generateBuildReport(statistics: BuildStatistics): string {
  const { totalEntities, buildTimePages, isrPages, onDemandPages, estimatedBuildTime, breakdown } = statistics;

  return `
═══════════════════════════════════════════════════════════════
                    BUILD CONFIGURATION REPORT
═══════════════════════════════════════════════════════════════

ENTITY SUMMARY:
  Total Entities:       ${totalEntities}

PAGE DISTRIBUTION:
  Build-Time Pages:     ${buildTimePages} (generated at build)
  ISR Pages:            ${isrPages} (generated on first request)
  On-Demand Pages:      ${onDemandPages} (generated as needed)

  Total Pages:          ${buildTimePages + isrPages + onDemandPages}

PAGE BREAKDOWN:
  Hub Pages:            ${breakdown.hubs}
  Spoke Pages:          ${breakdown.spokes}
  Comparison Pages:     ${breakdown.comparisons}

BUILD ESTIMATE:
  Estimated Time:       ${estimatedBuildTime.minutes} minutes (${estimatedBuildTime.seconds} seconds)
  Pages/Minute:         ${Math.round(buildTimePages / Math.max(1, estimatedBuildTime.minutes))}

MEMORY ESTIMATE:
  ${estimateMemoryUsage(buildTimePages).recommended}
  Approximate Usage:    ${estimateMemoryUsage(buildTimePages).estimatedMB} MB

OPTIMIZATION RECOMMENDATIONS:
  ${buildTimePages > 2000 ? '⚠ Consider reducing build-time pages to improve build speed' : '✓ Build-time page count is optimal'}
  ${estimatedBuildTime.minutes > 15 ? '⚠ Build time exceeds 15 minutes - consider CI/CD optimizations' : '✓ Build time within acceptable range'}
  ${onDemandPages > 50000 ? 'ℹ Large number of on-demand pages - ensure ISR is properly configured' : '✓ On-demand page count is manageable'}

═══════════════════════════════════════════════════════════════
`.trim();
}

/**
 * Validate build configuration
 */
export function validateBuildConfig(
  config: Partial<BuildConfig>,
  statistics: BuildStatistics
): {
  valid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  const finalConfig = { ...DEFAULT_BUILD_CONFIG, ...config };

  // Check if build-time pages exceed recommendation
  if (statistics.buildTimePages > 2000) {
    warnings.push(
      `Build-time pages (${statistics.buildTimePages}) exceeds recommended maximum (2000). ` +
      `Consider increasing priorityThreshold to reduce build time.`
    );
  }

  // Check if estimated build time is too long
  if (statistics.estimatedBuildTime.minutes > 20) {
    warnings.push(
      `Estimated build time (${statistics.estimatedBuildTime.minutes} minutes) is very long. ` +
      `Consider splitting into multiple builds or increasing priority threshold.`
    );
  }

  // Check batch size configuration
  if (finalConfig.batchSize > 100) {
    warnings.push(`Batch size (${finalConfig.batchSize}) is high. May cause memory issues.`);
  }

  if (finalConfig.batchSize < 10) {
    warnings.push(`Batch size (${finalConfig.batchSize}) is low. Build may be slow.`);
  }

  // Check parallel limit
  if (finalConfig.parallelLimit > 20) {
    errors.push(
      `Parallel limit (${finalConfig.parallelLimit}) is too high. Risk of rate limiting or memory issues.`
    );
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors
  };
}
