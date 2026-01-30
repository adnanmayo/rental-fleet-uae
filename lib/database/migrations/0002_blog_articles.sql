-- 0002_blog_articles.sql
-- Blog content stored in MySQL for build-time static generation (SSG).

CREATE TABLE IF NOT EXISTS blog_articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,

  -- SEO fields
  primary_keyword VARCHAR(255) NOT NULL,
  secondary_keywords JSON COMMENT 'Array of keyword strings',
  excerpt TEXT NULL,

  -- Content
  content_html LONGTEXT NOT NULL,
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

