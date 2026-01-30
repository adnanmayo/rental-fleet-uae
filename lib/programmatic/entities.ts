import {
  ProgrammaticEntity,
  EntityType
} from './types';

import * as dbEntities from '@/lib/database/entities-repository';

const SHOULD_USE_DB = process.env.USE_DB === 'true';

// Entity cache for performance
interface EntityCache {
  emirate: ProgrammaticEntity[] | null;
  vehicle: ProgrammaticEntity[] | null;
  service: ProgrammaticEntity[] | null;
  intent: ProgrammaticEntity[] | null;
  location: ProgrammaticEntity[] | null;
  lastUpdated: Record<string, number>;
}

const entityCache: EntityCache = {
  emirate: null,
  vehicle: null,
  service: null,
  intent: null,
  location: null,
  lastUpdated: {}
};

/**
 * Load entities from JSON files
 */
async function loadEntitiesFromFile(type: EntityType): Promise<ProgrammaticEntity[]> {
  try {
    const data = await import(`@/data/entities/${type}.json`);
    return data.entities || data;
  } catch (error) {
    console.error(`Failed to load ${type} entities:`, error);
    return [];
  }
}

/**
 * Get entities by type with caching
 */
export async function getEntitiesByType(
  type: EntityType,
  options: {
    useCache?: boolean;
    minPriority?: number;
    limit?: number;
  } = {}
): Promise<ProgrammaticEntity[]> {
  if (SHOULD_USE_DB) {
    try {
      return await dbEntities.getEntitiesByType(type, options);
    } catch {
      // fall through to JSON-backed implementation
    }
  }

  const { useCache = true, minPriority, limit } = options;

  // Check cache
  if (useCache && entityCache[type]) {
    return filterAndLimitEntities(entityCache[type]!, minPriority, limit);
  }

  // Load from file
  const entities = await loadEntitiesFromFile(type);

  // Update cache
  entityCache[type] = entities;
  entityCache.lastUpdated[type] = Date.now();

  return filterAndLimitEntities(entities, minPriority, limit);
}

/**
 * Get a single entity by ID
 */
export async function getEntityById(
  id: string,
  type?: EntityType
): Promise<ProgrammaticEntity | null> {
  if (SHOULD_USE_DB) {
    try {
      return await dbEntities.getEntityById(id, type);
    } catch {
      // fall through to JSON-backed implementation
    }
  }

  // If type specified, search only that type
  if (type) {
    const entities = await getEntitiesByType(type);
    return entities.find(e => e.id === id) || null;
  }

  // Search all types
  const allTypes: EntityType[] = ['emirate', 'vehicle', 'service', 'intent'];
  for (const entityType of allTypes) {
    const entities = await getEntitiesByType(entityType);
    const found = entities.find(e => e.id === id);
    if (found) return found;
  }

  return null;
}

/**
 * Get entities by slug
 */
export async function getEntityBySlug(
  slug: string,
  type?: EntityType
): Promise<ProgrammaticEntity | null> {
  if (SHOULD_USE_DB) {
    try {
      return await dbEntities.getEntityBySlug(slug, type);
    } catch {
      // fall through to JSON-backed implementation
    }
  }

  if (type) {
    const entities = await getEntitiesByType(type);
    return entities.find(e => e.slug === slug) || null;
  }

  const allTypes: EntityType[] = ['emirate', 'vehicle', 'service', 'intent'];
  for (const entityType of allTypes) {
    const entities = await getEntitiesByType(entityType);
    const found = entities.find(e => e.slug === slug);
    if (found) return found;
  }

  return null;
}

/**
 * Get related entities based on relationships
 */
export async function getRelatedEntities(
  entity: ProgrammaticEntity,
  options: {
    minWeight?: number;
    maxResults?: number;
    types?: EntityType[];
  } = {}
): Promise<ProgrammaticEntity[]> {
  if (SHOULD_USE_DB) {
    try {
      return await dbEntities.getRelatedEntities(entity, options);
    } catch {
      // fall through to JSON-backed implementation
    }
  }

  const { minWeight = 5, maxResults = 10, types } = options;

  if (!entity.relationships || entity.relationships.length === 0) {
    return [];
  }

  // Filter relationships by weight and type
  const relevantRelationships = entity.relationships
    .filter(rel => (!minWeight || (rel.weight !== undefined && rel.weight >= minWeight)))
    .filter(rel => (!types || types.includes(rel.entityType)))
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .slice(0, maxResults);

  // Load related entities
  const relatedEntities: ProgrammaticEntity[] = [];

  for (const rel of relevantRelationships) {
    const relatedEntity = await getEntityById(rel.entityId, rel.entityType);
    if (relatedEntity) {
      relatedEntities.push(relatedEntity);
    }
  }

  return relatedEntities;
}

/**
 * Generate all possible page combinations
 */
export async function generatePageCombinations(options: {
  maxCombinations?: number;
  minPriority?: number;
  includeComparisons?: boolean;
} = {}): Promise<{
  hubs: ProgrammaticEntity[];
  spokes: Array<{ primary: ProgrammaticEntity; secondary: ProgrammaticEntity }>;
  comparisons?: Array<{ entities: ProgrammaticEntity[] }>;
}> {
  const { maxCombinations = 1000, minPriority = 6, includeComparisons = false } = options;

  // Load high-priority entities
  const emirates = await getEntitiesByType('emirate', { minPriority });
  const vehicles = await getEntitiesByType('vehicle', { minPriority });
  const services = await getEntitiesByType('service', { minPriority });
  const intents = await getEntitiesByType('intent', { minPriority });

  // Hub pages (single entity)
  const hubs: ProgrammaticEntity[] = [...emirates, ...vehicles, ...services, ...intents];

  // Spoke pages (two entity combinations)
  const spokes: Array<{ primary: ProgrammaticEntity; secondary: ProgrammaticEntity }> = [];

  // Emirate + Vehicle combinations
  for (const emirate of emirates) {
    for (const vehicle of vehicles) {
      if (spokes.length >= maxCombinations) break;
      spokes.push({ primary: emirate, secondary: vehicle });
    }
  }

  // Emirate + Service combinations
  for (const emirate of emirates) {
    for (const service of services) {
      if (spokes.length >= maxCombinations) break;
      spokes.push({ primary: emirate, secondary: service });
    }
  }

  // Vehicle + Intent combinations
  for (const vehicle of vehicles) {
    for (const intent of intents) {
      if (spokes.length >= maxCombinations) break;
      spokes.push({ primary: vehicle, secondary: intent });
    }
  }

  let comparisons: Array<{ entities: ProgrammaticEntity[] }> | undefined;

  if (includeComparisons) {
    comparisons = [];

    // Vehicle comparisons (2-3 vehicles)
    for (let i = 0; i < vehicles.length && comparisons.length < 50; i++) {
      for (let j = i + 1; j < vehicles.length && comparisons.length < 50; j++) {
        comparisons.push({ entities: [vehicles[i], vehicles[j]] });
      }
    }

    // Service comparisons
    for (let i = 0; i < services.length && comparisons.length < 100; i++) {
      for (let j = i + 1; j < services.length && comparisons.length < 100; j++) {
        comparisons.push({ entities: [services[i], services[j]] });
      }
    }
  }

  return { hubs, spokes, comparisons };
}

/**
 * Get entities by priority tier
 */
export async function getEntitiesByPriority(
  minPriority: number,
  maxPriority: number = 10
): Promise<Record<EntityType, ProgrammaticEntity[]>> {
  if (SHOULD_USE_DB) {
    try {
      return await dbEntities.getEntitiesByPriority(minPriority, maxPriority);
    } catch {
      // fall through to JSON-backed implementation
    }
  }

  const allTypes: EntityType[] = ['emirate', 'vehicle', 'service', 'intent'];
  const result: Record<EntityType, ProgrammaticEntity[]> = {
    emirate: [],
    vehicle: [],
    service: [],
    intent: [],
    location: []
  };

  for (const type of allTypes) {
    const entities = await getEntitiesByType(type);
    result[type] = entities.filter(
      e => e.priority >= minPriority && e.priority <= maxPriority
    );
  }

  return result;
}

/**
 * Search entities by keywords
 */
export async function searchEntities(
  query: string,
  options: {
    types?: EntityType[];
    limit?: number;
  } = {}
): Promise<ProgrammaticEntity[]> {
  if (SHOULD_USE_DB) {
    try {
      return await dbEntities.searchEntities(query, options);
    } catch {
      // fall through to JSON-backed implementation
    }
  }

  const { types, limit = 20 } = options;
  const searchTypes = types || (['emirate', 'vehicle', 'service', 'intent'] as EntityType[]);
  const results: Array<{ entity: ProgrammaticEntity; score: number }> = [];

  const queryLower = query.toLowerCase();

  for (const type of searchTypes) {
    const entities = await getEntitiesByType(type);

    for (const entity of entities) {
      let score = 0;

      // Name match (highest priority)
      if (entity.name.toLowerCase().includes(queryLower)) {
        score += 100;
      }

      // Slug match
      if (entity.slug.toLowerCase().includes(queryLower)) {
        score += 50;
      }

      // Description match
      if (entity.content.description.toLowerCase().includes(queryLower)) {
        score += 20;
      }

      // Keywords match
      if (entity.seo.keywords.some(k => k.toLowerCase().includes(queryLower))) {
        score += 30;
      }

      // Tags match
      if (entity.metadata.tags?.some(t => t.toLowerCase().includes(queryLower))) {
        score += 25;
      }

      if (score > 0) {
        results.push({ entity, score });
      }
    }
  }

  // Sort by score and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.entity);
}

/**
 * Get popular entities (high priority and high ratings)
 */
export async function getPopularEntities(
  type?: EntityType,
  limit: number = 10
): Promise<ProgrammaticEntity[]> {
  if (SHOULD_USE_DB) {
    try {
      return await dbEntities.getPopularEntities(type, limit);
    } catch {
      // fall through to JSON-backed implementation
    }
  }

  const types = type ? [type] : (['emirate', 'vehicle', 'service', 'intent'] as EntityType[]);
  const allEntities: ProgrammaticEntity[] = [];

  for (const entityType of types) {
    const entities = await getEntitiesByType(entityType);
    allEntities.push(...entities);
  }

  // Sort by priority and rating
  return allEntities
    .sort((a, b) => {
      const scoreA = a.priority * 10 + (a.metadata.rating || 0);
      const scoreB = b.priority * 10 + (b.metadata.rating || 0);
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

/**
 * Clear entity cache
 */
export function clearEntityCache(type?: EntityType): void {
  if (SHOULD_USE_DB) {
    try {
      dbEntities.clearEntityCache(type);
      return;
    } catch {
      // fall through to JSON-backed implementation
    }
  }

  if (type) {
    entityCache[type] = null;
    delete entityCache.lastUpdated[type];
  } else {
    entityCache.emirate = null;
    entityCache.vehicle = null;
    entityCache.service = null;
    entityCache.intent = null;
    entityCache.location = null;
    entityCache.lastUpdated = {};
  }
}

/**
 * Helper: Filter and limit entities
 */
function filterAndLimitEntities(
  entities: ProgrammaticEntity[],
  minPriority?: number,
  limit?: number
): ProgrammaticEntity[] {
  let filtered = entities;

  if (minPriority !== undefined) {
    filtered = filtered.filter(e => e.priority >= minPriority);
  }

  if (limit !== undefined) {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
}

/**
 * Entity registry (stub for linking-engine compatibility)
 */
export const entityRegistry = {
  getByType: async (type: EntityType) => getEntitiesByType(type),
  getById: async (id: string) => getEntityById(id),
  getRelated: async (id: string) => {
    const entity = await getEntityById(id);
    return entity ? getRelatedEntities(entity) : [];
  },
  getAll: async () => {
    const types: EntityType[] = ['emirate', 'vehicle', 'service', 'intent'];
    const all: ProgrammaticEntity[] = [];
    for (const type of types) {
      all.push(...await getEntitiesByType(type));
    }
    return all;
  },
};

/**
 * Get entity statistics
 */
export async function getEntityStatistics(): Promise<{
  total: number;
  byType: Record<EntityType, number>;
  byPriority: Record<number, number>;
  averagePriority: number;
}> {
  if (SHOULD_USE_DB) {
    try {
      return await dbEntities.getEntityStatistics();
    } catch {
      // fall through to JSON-backed implementation
    }
  }

  const allTypes: EntityType[] = ['emirate', 'vehicle', 'service', 'intent'];
  const byType: Record<EntityType, number> = {
    emirate: 0,
    vehicle: 0,
    service: 0,
    intent: 0,
    location: 0
  };
  const byPriority: Record<number, number> = {};
  let totalPriority = 0;
  let total = 0;

  for (const type of allTypes) {
    const entities = await getEntitiesByType(type);
    byType[type] = entities.length;
    total += entities.length;

    for (const entity of entities) {
      byPriority[entity.priority] = (byPriority[entity.priority] || 0) + 1;
      totalPriority += entity.priority;
    }
  }

  return {
    total,
    byType,
    byPriority,
    averagePriority: total > 0 ? totalPriority / total : 0
  };
}
