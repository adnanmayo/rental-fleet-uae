/**
 * Entity Repository - MySQL Implementation
 * Replaces JSON file loading with MySQL queries
 */

import { query, queryOne } from './mysql';
import {
  ProgrammaticEntity,
  EntityType,
  EntityMetadata,
  EntityContent,
  EntitySEO,
  EntityRelationship
} from '../programmatic/types';

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

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Convert database row to ProgrammaticEntity
 */
function rowToEntity(row: any): ProgrammaticEntity {
  return {
    id: row.id,
    type: row.type as EntityType,
    slug: row.slug,
    name: row.name,
    displayName: row.display_name,
    priority: row.priority,
    metadata: row.metadata ? (typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata) : {},
    content: {
      description: row.content_description || '',
      longDescription: row.content_long_description,
      benefits: row.content_benefits ? (typeof row.content_benefits === 'string' ? JSON.parse(row.content_benefits) : row.content_benefits) : [],
      features: row.content_features ? (typeof row.content_features === 'string' ? JSON.parse(row.content_features) : row.content_features) : [],
      faqs: row.content_faqs ? (typeof row.content_faqs === 'string' ? JSON.parse(row.content_faqs) : row.content_faqs) : [],
      highlights: row.content_highlights ? (typeof row.content_highlights === 'string' ? JSON.parse(row.content_highlights) : row.content_highlights) : [],
    },
    seo: {
      titleTemplate: row.seo_title_template || '',
      descriptionTemplate: row.seo_description_template || '',
      keywords: row.seo_keywords ? (typeof row.seo_keywords === 'string' ? JSON.parse(row.seo_keywords) : row.seo_keywords) : [],
      h1Template: row.seo_h1_template,
      schemaType: row.seo_schema_type,
    },
    relationships: [], // Loaded separately if needed
  };
}

/**
 * Load entities by type from MySQL
 */
export async function getEntitiesByType(
  type: EntityType,
  options: {
    useCache?: boolean;
    minPriority?: number;
    limit?: number;
  } = {}
): Promise<ProgrammaticEntity[]> {
  const { useCache = true, minPriority, limit } = options;

  // Check cache
  if (useCache && entityCache[type]) {
    const cacheAge = Date.now() - (entityCache.lastUpdated[type] || 0);
    if (cacheAge < CACHE_TTL) {
      return filterAndLimitEntities(entityCache[type]!, minPriority, limit);
    }
  }

  // Build SQL query
  let sql = 'SELECT * FROM entities WHERE type = ?';
  const params: any[] = [type];

  if (minPriority !== undefined) {
    sql += ' AND priority >= ?';
    params.push(minPriority);
  }

  sql += ' ORDER BY priority DESC, name ASC';

  if (limit !== undefined) {
    sql += ' LIMIT ?';
    params.push(limit);
  }

  try {
    const rows = await query(sql, params);
    const entities = rows.map(rowToEntity);

    // Update cache
    if (useCache) {
      entityCache[type] = entities;
      entityCache.lastUpdated[type] = Date.now();
    }

    return entities;
  } catch (error) {
    console.error(`Failed to load ${type} entities from MySQL:`, error);
    return [];
  }
}

/**
 * Get entity by ID
 */
export async function getEntityById(
  id: string,
  type?: EntityType
): Promise<ProgrammaticEntity | null> {
  try {
    let sql = 'SELECT * FROM entities WHERE id = ?';
    const params: any[] = [id];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    sql += ' LIMIT 1';

    const row = await queryOne(sql, params);
    if (!row) return null;

    const entity = rowToEntity(row);

    // Load relationships
    entity.relationships = await getEntityRelationships(id);

    return entity;
  } catch (error) {
    console.error(`Failed to load entity ${id}:`, error);
    return null;
  }
}

/**
 * Get entity by slug
 */
export async function getEntityBySlug(
  slug: string,
  type?: EntityType
): Promise<ProgrammaticEntity | null> {
  try {
    let sql = 'SELECT * FROM entities WHERE slug = ?';
    const params: any[] = [slug];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    sql += ' LIMIT 1';

    const row = await queryOne(sql, params);
    if (!row) return null;

    const entity = rowToEntity(row);

    // Load relationships
    entity.relationships = await getEntityRelationships(entity.id);

    return entity;
  } catch (error) {
    console.error(`Failed to load entity by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get entity relationships
 */
export async function getEntityRelationships(
  entityId: string
): Promise<EntityRelationship[]> {
  try {
    const sql = `
      SELECT
        relationship_type as type,
        related_entity_id as entityId,
        related_entity_type as entityType,
        weight
      FROM entity_relationships
      WHERE entity_id = ?
      ORDER BY weight DESC
    `;

    const rows = await query(sql, [entityId]);

    return rows.map(row => ({
      type: row.type,
      entityId: row.entityId,
      entityType: row.entityType,
      weight: row.weight,
    }));
  } catch (error) {
    console.error(`Failed to load relationships for entity ${entityId}:`, error);
    return [];
  }
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
  const { minWeight = 5, maxResults = 10, types } = options;

  if (!entity.relationships || entity.relationships.length === 0) {
    return [];
  }

  // Filter relationships
  const relevantRelationships = entity.relationships
    .filter(rel => (!minWeight || rel.weight! >= minWeight))
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
 * Search entities by keywords
 */
export async function searchEntities(
  queryText: string,
  options: {
    types?: EntityType[];
    limit?: number;
  } = {}
): Promise<ProgrammaticEntity[]> {
  const { types, limit = 20 } = options;

  try {
    let sql = `
      SELECT *,
        (
          CASE
            WHEN name LIKE ? THEN 100
            WHEN slug LIKE ? THEN 50
            WHEN content_description LIKE ? THEN 20
            ELSE 0
          END
        ) as relevance_score
      FROM entities
      WHERE (
        name LIKE ?
        OR slug LIKE ?
        OR content_description LIKE ?
        OR seo_keywords LIKE ?
      )
    `;

    const searchPattern = `%${queryText}%`;
    const params: any[] = [
      searchPattern, searchPattern, searchPattern,
      searchPattern, searchPattern, searchPattern, searchPattern
    ];

    if (types && types.length > 0) {
      sql += ' AND type IN (?' + ',?'.repeat(types.length - 1) + ')';
      params.push(...types);
    }

    sql += ' ORDER BY relevance_score DESC, priority DESC LIMIT ?';
    params.push(limit);

    const rows = await query(sql, params);
    return rows.map(rowToEntity);
  } catch (error) {
    console.error('Entity search failed:', error);
    return [];
  }
}

/**
 * Get entities by priority range
 */
export async function getEntitiesByPriority(
  minPriority: number,
  maxPriority: number = 10
): Promise<Record<EntityType, ProgrammaticEntity[]>> {
  const allTypes: EntityType[] = ['emirate', 'vehicle', 'service', 'intent'];
  const result: Record<EntityType, ProgrammaticEntity[]> = {
    emirate: [],
    vehicle: [],
    service: [],
    intent: [],
    location: []
  };

  try {
    const sql = `
      SELECT * FROM entities
      WHERE priority >= ? AND priority <= ?
      ORDER BY priority DESC, type, name
    `;

    const rows = await query(sql, [minPriority, maxPriority]);
    const entities = rows.map(rowToEntity);

    // Group by type
    for (const entity of entities) {
      if (result[entity.type]) {
        result[entity.type].push(entity);
      }
    }

    return result;
  } catch (error) {
    console.error('Failed to get entities by priority:', error);
    return result;
  }
}

/**
 * Get popular entities
 */
export async function getPopularEntities(
  type?: EntityType,
  limit: number = 10
): Promise<ProgrammaticEntity[]> {
  try {
    let sql = `
      SELECT *,
        (priority * 10 + COALESCE(JSON_EXTRACT(metadata, '$.rating'), 0)) as popularity_score
      FROM entities
    `;

    const params: any[] = [];

    if (type) {
      sql += ' WHERE type = ?';
      params.push(type);
    }

    sql += ' ORDER BY popularity_score DESC LIMIT ?';
    params.push(limit);

    const rows = await query(sql, params);
    return rows.map(rowToEntity);
  } catch (error) {
    console.error('Failed to get popular entities:', error);
    return [];
  }
}

/**
 * Generate page combinations
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

    // Vehicle comparisons
    for (let i = 0; i < vehicles.length && comparisons.length < 50; i++) {
      for (let j = i + 1; j < vehicles.length && comparisons.length < 50; j++) {
        comparisons.push({ entities: [vehicles[i], vehicles[j]] });
      }
    }
  }

  return { hubs, spokes, comparisons };
}

/**
 * Get entity statistics
 */
export async function getEntityStatistics(): Promise<{
  total: number;
  byType: Record<EntityType, number>;
  byPriority: Record<number, number>;
  averagePriority: number;
}> {
  try {
    const sql = `
      SELECT
        type,
        priority,
        COUNT(*) as count,
        AVG(priority) as avg_priority
      FROM entities
      GROUP BY type, priority
    `;

    const rows = await query(sql);

    const byType: Record<EntityType, number> = {
      emirate: 0,
      vehicle: 0,
      service: 0,
      intent: 0,
      location: 0
    };

    const byPriority: Record<number, number> = {};
    let total = 0;
    let totalPriority = 0;

    for (const row of rows) {
      const count = parseInt(row.count);
      byType[row.type as EntityType] = (byType[row.type as EntityType] || 0) + count;
      byPriority[row.priority] = (byPriority[row.priority] || 0) + count;
      total += count;
      totalPriority += row.priority * count;
    }

    return {
      total,
      byType,
      byPriority,
      averagePriority: total > 0 ? totalPriority / total : 0
    };
  } catch (error) {
    console.error('Failed to get entity statistics:', error);
    return {
      total: 0,
      byType: { emirate: 0, vehicle: 0, service: 0, intent: 0, location: 0 },
      byPriority: {},
      averagePriority: 0
    };
  }
}

/**
 * Clear entity cache
 */
export function clearEntityCache(type?: EntityType): void {
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
