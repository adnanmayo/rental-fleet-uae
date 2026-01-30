/**
 * ISR (Incremental Static Regeneration) Configuration
 *
 * Manages caching strategy, revalidation rules, and build optimization
 * for programmatic pages at scale (100,000+ pages).
 *
 * @module lib/performance/isr-config
 * @version 2.0
 */

import type {
  ISRConfig,
  ProgrammaticEntity,
} from '../programmatic/types';

// Build strategy types
export type BuildStrategy = 'static' | 'isr' | 'on-demand' | 'dynamic';

// Revalidation strategy type
export interface RevalidationStrategy {
  hubPages: number;
  popularSpokes: number;
  longTail: number;
  seasonal: number;
  default: number;
}

// Generation context for page generation
export interface GenerationContext {
  primary: ProgrammaticEntity;
  secondary?: ProgrammaticEntity[];
}

// ============================================================================
// Configuration Constants
// ============================================================================

/**
 * Default revalidation times (in seconds)
 */
export const REVALIDATION_TIMES = {
  /** Hub pages (high traffic) - 30 minutes */
  HUB: 1800,

  /** Popular spoke pages - 1 hour */
  POPULAR_SPOKE: 3600,

  /** Regular spoke pages - 2 hours */
  SPOKE: 7200,

  /** Long-tail pages - 24 hours */
  LONG_TAIL: 86400,

  /** Seasonal/event pages - 7 days */
  SEASONAL: 604800,

  /** Static pages (rarely change) - 30 days */
  STATIC: 2592000,

  /** Homepage and critical pages - 15 minutes */
  CRITICAL: 900,
} as const;

/**
 * Priority tiers for build ordering
 * Tier 1: Build immediately (top 1000 pages)
 * Tier 2: Build in first batch (next 5000 pages)
 * Tier 3: Build on-demand (next 10000 pages)
 * Tier 4: On-demand only (rest)
 */
export enum PriorityTier {
  CRITICAL = 1,
  HIGH = 2,
  MEDIUM = 3,
  LOW = 4,
  ON_DEMAND = 5,
}

/**
 * Page limits per tier for static generation
 */
export const TIER_LIMITS = {
  [PriorityTier.CRITICAL]: 100,
  [PriorityTier.HIGH]: 1000,
  [PriorityTier.MEDIUM]: 5000,
  [PriorityTier.LOW]: 10000,
  [PriorityTier.ON_DEMAND]: Infinity,
} as const;

// ============================================================================
// Revalidation Strategy
// ============================================================================

/**
 * Default revalidation strategy
 */
export const DEFAULT_REVALIDATION_STRATEGY: RevalidationStrategy = {
  hubPages: REVALIDATION_TIMES.HUB,
  popularSpokes: REVALIDATION_TIMES.POPULAR_SPOKE,
  longTail: REVALIDATION_TIMES.LONG_TAIL,
  seasonal: REVALIDATION_TIMES.SEASONAL,
  default: REVALIDATION_TIMES.SPOKE,
};

/**
 * Get revalidation time for a page based on context
 *
 * @example
 * ```typescript
 * const revalidateTime = getRevalidationTime(context);
 * export const revalidate = revalidateTime;
 * ```
 */
export function getRevalidationTime(context: GenerationContext): number {
  const { primary, secondary } = context;

  // Determine page type
  const isHub = !secondary || secondary.length === 0;
  const priority = primary.priority || 5;

  // Critical pages (homepage, main hubs)
  if (priority >= 9) {
    return REVALIDATION_TIMES.CRITICAL;
  }

  // Hub pages
  if (isHub) {
    if (priority >= 7) {
      return REVALIDATION_TIMES.HUB;
    }
    return REVALIDATION_TIMES.SPOKE;
  }

  // Spoke pages based on priority
  if (priority >= 7) {
    return REVALIDATION_TIMES.POPULAR_SPOKE;
  }

  if (priority >= 5) {
    return REVALIDATION_TIMES.SPOKE;
  }

  // Long-tail pages
  return REVALIDATION_TIMES.LONG_TAIL;
}

/**
 * Get revalidation time by entity
 */
export function getEntityRevalidationTime(entity: ProgrammaticEntity): number {
  const priority = entity.priority || 5;

  if (priority >= 9) {
    return REVALIDATION_TIMES.CRITICAL;
  }

  if (priority >= 7) {
    return REVALIDATION_TIMES.HUB;
  }

  if (priority >= 5) {
    return REVALIDATION_TIMES.SPOKE;
  }

  return REVALIDATION_TIMES.LONG_TAIL;
}

// ============================================================================
// ISR Configuration Builder
// ============================================================================

/**
 * Build ISR configuration for a page
 *
 * @example
 * ```typescript
 * const config = buildISRConfig(context);
 * export const revalidate = config.revalidate;
 * ```
 */
export function buildISRConfig(context: GenerationContext): ISRConfig {
  const { primary, secondary } = context;

  // Determine priority tier
  const tier = determinePriorityTier(primary, secondary);

  // Determine build strategy
  const buildStrategy = determineBuildStrategy(tier, primary);

  // Get revalidation time
  const revalidate = getRevalidationTime(context);

  // Generate cache tags for targeted invalidation
  const tags = generateCacheTags(primary, secondary);

  return {
    revalidate,
    tier,
    buildStrategy,
    tags,
  };
}

/**
 * Determine priority tier for page generation
 */
export function determinePriorityTier(
  primary: ProgrammaticEntity,
  secondary?: ProgrammaticEntity[]
): PriorityTier {
  const priority = primary.priority || 5;

  // Critical pages (homepage, main hubs)
  if (priority >= 9) {
    return PriorityTier.CRITICAL;
  }

  // High priority (popular hubs and spokes)
  if (priority >= 7) {
    return PriorityTier.HIGH;
  }

  // Medium priority (regular spokes)
  if (priority >= 5) {
    return PriorityTier.MEDIUM;
  }

  // Low priority (secondary spokes)
  if (priority >= 3) {
    return PriorityTier.LOW;
  }

  // On-demand only (long-tail)
  return PriorityTier.ON_DEMAND;
}

/**
 * Determine build strategy
 */
function determineBuildStrategy(
  tier: PriorityTier,
  entity: ProgrammaticEntity
): BuildStrategy {
  // Critical and high priority: static generation
  if (tier <= PriorityTier.HIGH) {
    return 'static';
  }

  // Medium priority: ISR
  if (tier === PriorityTier.MEDIUM) {
    return 'isr';
  }

  // Low priority and on-demand: generate on first request
  return 'on-demand';
}

// ============================================================================
// Cache Tag Generation
// ============================================================================

/**
 * Generate cache tags for targeted revalidation
 *
 * @example
 * ```typescript
 * const tags = generateCacheTags(dubaiEntity, [luxuryCarEntity]);
 * // Result: ['entity:dubai', 'type:emirate', 'entity:luxury-car', 'type:vehicle-type']
 * ```
 */
export function generateCacheTags(
  primary: ProgrammaticEntity,
  secondary?: ProgrammaticEntity[]
): string[] {
  const tags = new Set<string>();

  // Entity-specific tag
  tags.add(`entity:${primary.slug}`);

  // Type-specific tag
  tags.add(`type:${primary.type}`);

  // Secondary entity tags
  if (secondary) {
    for (const entity of secondary) {
      tags.add(`entity:${entity.slug}`);
      tags.add(`type:${entity.type}`);
    }
  }

  // Priority-based tag
  const priority = primary.priority || 5;
  if (priority >= 7) {
    tags.add('priority:high');
  } else if (priority >= 5) {
    tags.add('priority:medium');
  } else {
    tags.add('priority:low');
  }

  return Array.from(tags);
}

/**
 * Generate cache tag patterns for bulk revalidation
 *
 * @example
 * ```typescript
 * // Revalidate all Dubai pages
 * const pattern = getCacheTagPattern('entity', 'dubai');
 * // Result: 'entity:dubai'
 * ```
 */
export function getCacheTagPattern(
  tagType: 'entity' | 'type' | 'priority',
  value: string
): string {
  return `${tagType}:${value}`;
}

// ============================================================================
// Build Optimization
// ============================================================================

/**
 * Get pages to generate at build time
 *
 * @example
 * ```typescript
 * export async function generateStaticParams() {
 *   const pages = await getPagesToGenerate(PriorityTier.HIGH);
 *   return pages.map(p => ({ slug: p.slug }));
 * }
 * ```
 */
export async function getPagesToGenerate(
  maxTier: PriorityTier = PriorityTier.HIGH
): Promise<Array<{ slug: string; priority: number }>> {
  // This would typically fetch from your entity registry
  // For now, return empty array - implement based on your data source
  return [];
}

/**
 * Estimate build time for page generation
 *
 * @param pageCount - Number of pages to generate
 * @param avgTimePerPage - Average generation time per page (ms)
 * @returns Estimated build time in seconds
 */
export function estimateBuildTime(
  pageCount: number,
  avgTimePerPage = 200
): number {
  const totalMs = pageCount * avgTimePerPage;
  return Math.ceil(totalMs / 1000);
}

/**
 * Get build statistics
 */
export function getBuildStatistics(tierCounts: Record<PriorityTier, number>): {
  totalPages: number;
  staticPages: number;
  isrPages: number;
  onDemandPages: number;
  estimatedBuildTime: number;
} {
  const staticPages =
    (tierCounts[PriorityTier.CRITICAL] || 0) +
    (tierCounts[PriorityTier.HIGH] || 0);

  const isrPages = tierCounts[PriorityTier.MEDIUM] || 0;

  const onDemandPages =
    (tierCounts[PriorityTier.LOW] || 0) +
    (tierCounts[PriorityTier.ON_DEMAND] || 0);

  const totalPages = staticPages + isrPages + onDemandPages;

  // Only static pages affect build time
  const estimatedBuildTime = estimateBuildTime(staticPages);

  return {
    totalPages,
    staticPages,
    isrPages,
    onDemandPages,
    estimatedBuildTime,
  };
}

// ============================================================================
// Cache Management
// ============================================================================

/**
 * Cache configuration for different page types
 */
export const CACHE_CONFIG = {
  /** Cache-Control header for static pages */
  static: 's-maxage=31536000, stale-while-revalidate=86400',

  /** Cache-Control for ISR pages */
  isr: 's-maxage=3600, stale-while-revalidate=86400',

  /** Cache-Control for on-demand pages */
  onDemand: 's-maxage=60, stale-while-revalidate=300',

  /** Cache-Control for critical pages */
  critical: 's-maxage=900, stale-while-revalidate=300',
} as const;

/**
 * Get Cache-Control header value
 */
export function getCacheControlHeader(strategy: BuildStrategy): string {
  switch (strategy) {
    case 'static':
      return CACHE_CONFIG.static;
    case 'isr':
      return CACHE_CONFIG.isr;
    case 'on-demand':
      return CACHE_CONFIG.onDemand;
    case 'dynamic':
      return 'no-cache, no-store, must-revalidate';
    default:
      return CACHE_CONFIG.isr;
  }
}

// ============================================================================
// On-Demand Revalidation
// ============================================================================

/**
 * Revalidation request payload
 */
export interface RevalidationRequest {
  /** Entity ID or slug to revalidate */
  entity?: string;

  /** Entity type to revalidate */
  type?: string;

  /** Specific paths to revalidate */
  paths?: string[];

  /** Cache tags to revalidate */
  tags?: string[];

  /** Secret token for authentication */
  secret?: string;
}

/**
 * Build revalidation API endpoint handler
 *
 * @example
 * ```typescript
 * // app/api/revalidate/route.ts
 * export async function POST(request: Request) {
 *   const body = await request.json();
 *   return handleRevalidation(body, request);
 * }
 * ```
 */
export async function handleRevalidation(
  request: RevalidationRequest,
  revalidateFunction: (path: string) => Promise<void>
): Promise<{ success: boolean; message: string; revalidated: string[] }> {
  const revalidated: string[] = [];

  try {
    // Validate secret if provided
    if (request.secret && request.secret !== process.env.REVALIDATION_SECRET) {
      return {
        success: false,
        message: 'Invalid secret',
        revalidated: [],
      };
    }

    // Revalidate specific paths
    if (request.paths && request.paths.length > 0) {
      for (const path of request.paths) {
        await revalidateFunction(path);
        revalidated.push(path);
      }
    }

    // Revalidate by entity
    if (request.entity) {
      const paths = await getPathsForEntity(request.entity);
      for (const path of paths) {
        await revalidateFunction(path);
        revalidated.push(path);
      }
    }

    // Revalidate by type
    if (request.type) {
      const paths = await getPathsForEntityType(request.type);
      for (const path of paths) {
        await revalidateFunction(path);
        revalidated.push(path);
      }
    }

    return {
      success: true,
      message: `Successfully revalidated ${revalidated.length} paths`,
      revalidated,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Revalidation failed',
      revalidated,
    };
  }
}

/**
 * Get all paths for an entity (to be implemented with entity registry)
 */
async function getPathsForEntity(entitySlug: string): Promise<string[]> {
  // TODO: Implement with entity registry
  return [`/${entitySlug}`];
}

/**
 * Get all paths for an entity type
 */
async function getPathsForEntityType(entityType: string): Promise<string[]> {
  // TODO: Implement with entity registry
  return [];
}

// ============================================================================
// Performance Monitoring
// ============================================================================

/**
 * Performance metrics for ISR
 */
export interface ISRMetrics {
  /** Total pages generated */
  totalPages: number;

  /** Pages generated at build time */
  buildTimePages: number;

  /** Pages generated on-demand */
  onDemandPages: number;

  /** Cache hit rate (0-1) */
  cacheHitRate: number;

  /** Average generation time (ms) */
  avgGenerationTime: number;

  /** Revalidation count */
  revalidationCount: number;

  /** Error rate (0-1) */
  errorRate: number;
}

/**
 * Track ISR performance metrics
 */
export class ISRMetricsTracker {
  private metrics: Partial<ISRMetrics> = {};

  recordGeneration(isDemand: boolean, duration: number): void {
    this.metrics.totalPages = (this.metrics.totalPages || 0) + 1;

    if (isDemand) {
      this.metrics.onDemandPages = (this.metrics.onDemandPages || 0) + 1;
    } else {
      this.metrics.buildTimePages = (this.metrics.buildTimePages || 0) + 1;
    }

    // Update average generation time
    const currentAvg = this.metrics.avgGenerationTime || 0;
    const currentCount = this.metrics.totalPages || 1;
    this.metrics.avgGenerationTime =
      (currentAvg * (currentCount - 1) + duration) / currentCount;
  }

  recordCacheHit(isHit: boolean): void {
    const totalRequests = (this.metrics.totalPages || 0) + 1;
    const hits = isHit
      ? ((this.metrics.cacheHitRate || 0) * (totalRequests - 1) + 1)
      : (this.metrics.cacheHitRate || 0) * (totalRequests - 1);

    this.metrics.cacheHitRate = hits / totalRequests;
  }

  recordRevalidation(): void {
    this.metrics.revalidationCount = (this.metrics.revalidationCount || 0) + 1;
  }

  recordError(): void {
    const total = this.metrics.totalPages || 1;
    const errors = (this.metrics.errorRate || 0) * total + 1;
    this.metrics.errorRate = errors / (total + 1);
  }

  getMetrics(): ISRMetrics {
    return {
      totalPages: this.metrics.totalPages || 0,
      buildTimePages: this.metrics.buildTimePages || 0,
      onDemandPages: this.metrics.onDemandPages || 0,
      cacheHitRate: this.metrics.cacheHitRate || 0,
      avgGenerationTime: this.metrics.avgGenerationTime || 0,
      revalidationCount: this.metrics.revalidationCount || 0,
      errorRate: this.metrics.errorRate || 0,
    };
  }

  reset(): void {
    this.metrics = {};
  }
}

// ============================================================================
// Next.js Integration Helpers
// ============================================================================

/**
 * Generate Next.js revalidate export
 *
 * @example
 * ```typescript
 * // In your page.tsx
 * export const revalidate = getNextRevalidate(context);
 * ```
 */
export function getNextRevalidate(context: GenerationContext): number {
  return getRevalidationTime(context);
}

/**
 * Generate Next.js dynamic export
 *
 * @example
 * ```typescript
 * // In your page.tsx
 * export const dynamic = getNextDynamic(context);
 * ```
 */
export function getNextDynamic(
  context: GenerationContext
): 'auto' | 'force-dynamic' | 'error' | 'force-static' {
  const config = buildISRConfig(context);

  switch (config.buildStrategy) {
    case 'static':
      return 'force-static';
    case 'dynamic':
      return 'force-dynamic';
    case 'isr':
    case 'on-demand':
    default:
      return 'auto';
  }
}

/**
 * Generate Next.js fetchCache export
 *
 * @example
 * ```typescript
 * // In your page.tsx
 * export const fetchCache = getNextFetchCache(context);
 * ```
 */
export function getNextFetchCache(
  context: GenerationContext
): 'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'force-no-store' {
  const tier = determinePriorityTier(context.primary, context.secondary);

  if (tier <= PriorityTier.HIGH) {
    return 'force-cache';
  }

  return 'auto';
}

// ============================================================================
// Exports
// ============================================================================

export {
  type ISRConfig,
  PriorityTier as default,
};
