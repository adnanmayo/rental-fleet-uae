/**
 * Data Migration Script: JSON to MySQL
 * Imports entity data from JSON files into MySQL database
 */

import * as fs from 'fs';
import * as path from 'path';
import { getPool, testConnection } from '../lib/database/mysql';
import { ProgrammaticEntity, EntityType } from '../lib/programmatic/types';

const DATA_DIR = path.join(process.cwd(), 'data', 'entities');

interface MigrationStats {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

/**
 * Load JSON entity file
 */
function loadEntityFile(filename: string): ProgrammaticEntity[] {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    return data.entities || data;
  } catch (error) {
    console.error(`Failed to load ${filename}:`, error);
    return [];
  }
}

/**
 * Insert entity into MySQL
 */
async function insertEntity(entity: ProgrammaticEntity, connection: any): Promise<void> {
  const sql = `
    INSERT INTO entities (
      id, type, slug, name, display_name, priority,
      content_description, content_long_description,
      content_benefits, content_features, content_faqs, content_highlights,
      metadata,
      seo_title_template, seo_description_template,
      seo_keywords, seo_h1_template, seo_schema_type
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      display_name = VALUES(display_name),
      priority = VALUES(priority),
      content_description = VALUES(content_description),
      content_long_description = VALUES(content_long_description),
      content_benefits = VALUES(content_benefits),
      content_features = VALUES(content_features),
      content_faqs = VALUES(content_faqs),
      content_highlights = VALUES(content_highlights),
      metadata = VALUES(metadata),
      seo_title_template = VALUES(seo_title_template),
      seo_description_template = VALUES(seo_description_template),
      seo_keywords = VALUES(seo_keywords),
      seo_h1_template = VALUES(seo_h1_template),
      seo_schema_type = VALUES(seo_schema_type),
      updated_at = CURRENT_TIMESTAMP
  `;

  const params = [
    entity.id,
    entity.type,
    entity.slug,
    entity.name,
    entity.displayName,
    entity.priority,
    entity.content.description,
    entity.content.longDescription || null,
    JSON.stringify(entity.content.benefits || []),
    JSON.stringify(entity.content.features || []),
    JSON.stringify(entity.content.faqs || []),
    JSON.stringify(entity.content.highlights || []),
    JSON.stringify(entity.metadata || {}),
    entity.seo.titleTemplate,
    entity.seo.descriptionTemplate,
    JSON.stringify(entity.seo.keywords || []),
    entity.seo.h1Template || null,
    entity.seo.schemaType || null,
  ];

  await connection.execute(sql, params);
}

/**
 * Insert entity relationships
 */
async function insertRelationships(entity: ProgrammaticEntity, connection: any): Promise<void> {
  if (!entity.relationships || entity.relationships.length === 0) {
    return;
  }

  // Delete existing relationships
  await connection.execute(
    'DELETE FROM entity_relationships WHERE entity_id = ?',
    [entity.id]
  );

  // Insert new relationships
  const sql = `
    INSERT INTO entity_relationships (
      entity_id, related_entity_id, related_entity_type, relationship_type, weight
    ) VALUES (?, ?, ?, ?, ?)
  `;

  for (const rel of entity.relationships) {
    try {
      // Map relationship types from content data into the limited enum
      // supported by the DB schema and internal linking engine.
      const relationshipType =
        rel.type === 'parent' || rel.type === 'child' || rel.type === 'related' || rel.type === 'sibling'
          ? rel.type
          : 'related';

      await connection.execute(sql, [
        entity.id,
        rel.entityId,
        rel.entityType,
        relationshipType,
        rel.weight || 5,
      ]);
    } catch (error) {
      console.warn(`Failed to insert relationship for ${entity.id} -> ${rel.entityId}:`, error);
    }
  }
}

/**
 * Migrate entities from JSON file to MySQL
 */
async function migrateFile(
  filename: string,
  type: EntityType,
  connection: any
): Promise<MigrationStats> {
  const stats: MigrationStats = {
    total: 0,
    success: 0,
    failed: 0,
    errors: [],
  };

  console.log(`\nMigrating ${filename}...`);

  const entities = loadEntityFile(filename);
  stats.total = entities.length;

  console.log(`Found ${entities.length} entities`);

  // Pass 1: insert/update all entities first (so FK checks pass later)
  for (const entity of entities) {
    try {
      entity.type = type;
      await insertEntity(entity, connection);
      stats.success++;
      process.stdout.write(`\r  Upserted: ${stats.success}/${stats.total}`);
    } catch (error: any) {
      stats.failed++;
      const errorMsg = `Failed to upsert ${entity.id}: ${error.message}`;
      stats.errors.push(errorMsg);
      console.error(`\n  ${errorMsg}`);
    }
  }

  // Pass 2: insert relationships (now that all referenced rows exist)
  console.log(`\n  Inserting relationships...`);
  for (const entity of entities) {
    try {
      await insertRelationships(entity, connection);
    } catch (error: any) {
      // Relationship insertion is best-effort; log and continue.
      console.warn(`Failed to insert relationships for ${entity.id}:`, error?.message || error);
    }
  }

  console.log(`\n  ✓ Success: ${stats.success}, Failed: ${stats.failed}`);

  return stats;
}

/**
 * Main migration function
 */
async function migrate(): Promise<void> {
  console.log('='.repeat(60));
  console.log('Data Migration: JSON to MySQL');
  console.log('='.repeat(60));

  // Test database connection
  console.log('\nTesting database connection...');
  const connected = await testConnection();

  if (!connected) {
    console.error('❌ Database connection failed!');
    console.error('Please check your MySQL connection settings in .env:');
    console.error('  MYSQL_HOST');
    console.error('  MYSQL_PORT');
    console.error('  MYSQL_USER');
    console.error('  MYSQL_PASSWORD');
    console.error('  MYSQL_DATABASE');
    process.exit(1);
  }

  console.log('✓ Database connection successful');

  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const overallStats: MigrationStats = {
      total: 0,
      success: 0,
      failed: 0,
      errors: [],
    };

    // Migrate each entity type
    const migrations = [
      { filename: 'emirate.json', type: 'emirate' as EntityType },
      { filename: 'vehicle.json', type: 'vehicle' as EntityType },
      { filename: 'service.json', type: 'service' as EntityType },
      { filename: 'intent.json', type: 'intent' as EntityType },
    ];

    for (const { filename, type } of migrations) {
      const stats = await migrateFile(filename, type, connection);
      overallStats.total += stats.total;
      overallStats.success += stats.success;
      overallStats.failed += stats.failed;
      overallStats.errors.push(...stats.errors);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('Migration Summary');
    console.log('='.repeat(60));
    console.log(`Total entities: ${overallStats.total}`);
    console.log(`Successful: ${overallStats.success}`);
    console.log(`Failed: ${overallStats.failed}`);

    if (overallStats.errors.length > 0) {
      console.log('\nErrors:');
      overallStats.errors.forEach(err => console.log(`  - ${err}`));
    }

    // Display final statistics
    console.log('\nEntity counts by type:');
    const [rows] = await connection.execute(`
      SELECT type, COUNT(*) as count
      FROM entities
      GROUP BY type
      ORDER BY type
    `);

    for (const row of rows as any[]) {
      console.log(`  ${row.type}: ${row.count}`);
    }

    console.log('\n✓ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    connection.release();
  }
}

// Run migration
if (require.main === module) {
  migrate()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { migrate };
