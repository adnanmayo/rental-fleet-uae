-- 0001_programmatic_entities.sql
-- Core schema for programmatic entities + relationships + caching + templates + build stats + views.
--
-- NOTE:
-- - This migration assumes the database already exists (MYSQL_DATABASE).
-- - It is safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE).

-- ==================== Entities Table ====================
CREATE TABLE IF NOT EXISTS entities (
  id VARCHAR(100) PRIMARY KEY,
  type ENUM('emirate', 'vehicle', 'service', 'intent', 'location') NOT NULL,
  slug VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  priority TINYINT NOT NULL DEFAULT 5 COMMENT '1-10 for build prioritization',

  -- Content fields (JSON for flexibility)
  content_description TEXT,
  content_long_description TEXT,
  content_benefits JSON COMMENT 'Array of benefit strings',
  content_features JSON COMMENT 'Array of feature strings',
  content_faqs JSON COMMENT 'Array of FAQ objects',
  content_highlights JSON COMMENT 'Array of highlight strings',

  -- Metadata fields (JSON for flexibility)
  metadata JSON COMMENT 'Entity-specific metadata',

  -- SEO fields
  seo_title_template VARCHAR(500),
  seo_description_template TEXT,
  seo_keywords JSON COMMENT 'Array of keyword strings',
  seo_h1_template VARCHAR(500),
  seo_schema_type VARCHAR(100),

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Indexes
  INDEX idx_type (type),
  INDEX idx_slug (slug),
  INDEX idx_priority (priority),
  INDEX idx_type_priority (type, priority),
  UNIQUE KEY unique_slug_type (slug, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== Entity Relationships Table ====================
CREATE TABLE IF NOT EXISTS entity_relationships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_id VARCHAR(100) NOT NULL,
  related_entity_id VARCHAR(100) NOT NULL,
  related_entity_type ENUM('emirate', 'vehicle', 'service', 'intent', 'location') NOT NULL,
  relationship_type ENUM('parent', 'child', 'related', 'sibling') NOT NULL,
  weight TINYINT DEFAULT 5 COMMENT 'Relationship strength/priority 1-10',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Foreign keys
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
  FOREIGN KEY (related_entity_id) REFERENCES entities(id) ON DELETE CASCADE,

  -- Indexes
  INDEX idx_entity_id (entity_id),
  INDEX idx_related_entity_id (related_entity_id),
  INDEX idx_relationship_type (relationship_type),
  UNIQUE KEY unique_relationship (entity_id, related_entity_id, relationship_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== Generated Pages Cache Table ====================
CREATE TABLE IF NOT EXISTS generated_pages_cache (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(500) NOT NULL UNIQUE,
  page_type ENUM('hub', 'spoke', 'comparison', 'directory', 'blog') NOT NULL,
  entity_ids JSON COMMENT 'Array of entity IDs used in this page',

  -- Generated content
  title VARCHAR(500),
  description TEXT,
  h1 VARCHAR(500),
  content_sections JSON COMMENT 'Array of section objects',
  faqs JSON COMMENT 'Array of FAQ objects',
  metadata JSON COMMENT 'Page metadata',
  schema_markup JSON COMMENT 'Schema.org markup',
  internal_links JSON COMMENT 'Internal links',

  -- Quality metrics
  uniqueness_score DECIMAL(5,2),
  word_count INT,
  readability_score DECIMAL(5,2),
  keyword_density DECIMAL(5,4),

  -- Cache control
  priority TINYINT DEFAULT 5,
  revalidate INT DEFAULT 3600 COMMENT 'ISR revalidation time in seconds',

  -- Timestamps
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_accessed TIMESTAMP NULL,
  access_count INT DEFAULT 0,

  -- Indexes
  INDEX idx_page_type (page_type),
  INDEX idx_priority (priority),
  INDEX idx_generated_at (generated_at),
  INDEX idx_last_accessed (last_accessed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== Content Templates Table ====================
CREATE TABLE IF NOT EXISTS content_templates (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  structure VARCHAR(100) NOT NULL COMMENT 'hero-benefits-faq, stats-guide-cta, etc.',
  sections JSON COMMENT 'Array of template section objects',
  variants JSON COMMENT 'Array of template variant objects',

  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INT DEFAULT 0,
  success_rate DECIMAL(5,2) COMMENT 'Quality score average',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_structure (structure),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== Build Statistics Table ====================
CREATE TABLE IF NOT EXISTS build_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  build_id VARCHAR(100) NOT NULL,

  -- Build metrics
  total_pages INT,
  pages_generated INT,
  pages_cached INT,
  build_time_seconds INT,

  -- Quality metrics
  avg_quality_score DECIMAL(5,2),
  avg_uniqueness DECIMAL(5,2),
  avg_word_count INT,

  -- Entity counts
  entity_counts JSON COMMENT 'Count by entity type',

  -- Errors
  error_count INT DEFAULT 0,
  errors JSON COMMENT 'Array of error objects',

  build_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_build_id (build_id),
  INDEX idx_build_timestamp (build_timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================== Views ====================

CREATE OR REPLACE VIEW entity_statistics AS
SELECT
  type,
  COUNT(*) as total_count,
  AVG(priority) as avg_priority,
  MIN(priority) as min_priority,
  MAX(priority) as max_priority,
  COUNT(CASE WHEN priority >= 8 THEN 1 END) as high_priority_count,
  COUNT(CASE WHEN priority >= 6 AND priority < 8 THEN 1 END) as medium_priority_count,
  COUNT(CASE WHEN priority < 6 THEN 1 END) as low_priority_count
FROM entities
GROUP BY type;

CREATE OR REPLACE VIEW popular_entities AS
SELECT
  e.*,
  (e.priority * 10 + COALESCE(JSON_EXTRACT(e.metadata, '$.rating'), 0)) as popularity_score
FROM entities e
ORDER BY popularity_score DESC;

CREATE OR REPLACE VIEW page_generation_queue AS
SELECT
  e1.id as primary_entity_id,
  e1.type as primary_entity_type,
  e1.slug as primary_slug,
  e1.priority,
  e2.id as secondary_entity_id,
  e2.type as secondary_entity_type,
  e2.slug as secondary_slug,
  CONCAT('/', e1.slug, '/', e2.slug) as page_path,
  LEAST(e1.priority, e2.priority) as combined_priority
FROM entities e1
CROSS JOIN entities e2
WHERE e1.type = 'emirate'
  AND e2.type IN ('vehicle', 'service')
  AND e1.priority >= 6
  AND e2.priority >= 6
ORDER BY combined_priority DESC, e1.priority DESC, e2.priority DESC;

