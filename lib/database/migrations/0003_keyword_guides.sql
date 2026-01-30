-- 0003_keyword_guides.sql
-- Keyword-driven landing pages stored in MySQL for build-time static generation (SSG).

CREATE TABLE IF NOT EXISTS keyword_guides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  keyword VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,

  -- SEO fields
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  h1 VARCHAR(500) NOT NULL,

  -- Structured content (rendered by app/blog/[slug])
  toc JSON NULL COMMENT 'Array of {id, label}',
  sections JSON NOT NULL COMMENT 'Array of sections {id, heading, type, ...}',
  faqs JSON NULL COMMENT 'Array of FAQ objects {question, answer}',

  -- Publishing state
  status ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  published_time DATETIME NULL,
  modified_time DATETIME NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_published_time (published_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

