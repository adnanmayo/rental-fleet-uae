/**
 * Blog Repository - MySQL Implementation
 * Stores and loads long-form blog articles from the DB.
 */

import { query, queryOne } from "./mysql";

export type BlogFAQ = { question: string; answer: string };

export type BlogArticleRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  primary_keyword: string;
  secondary_keywords: any;
  excerpt: string | null;
  content_html: string;
  faqs: any;
  status: "draft" | "published";
  published_time: Date | string | null;
  modified_time: Date | string | null;
};

export type BlogArticle = {
  slug: string;
  title: string;
  category: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  excerpt?: string;
  contentHtml: string;
  faqs?: BlogFAQ[];
  publishedTime: string;
  modifiedTime: string;
};

function toIsoString(value: Date | string | null | undefined, fallbackIso: string): string {
  if (!value) return fallbackIso;
  const d = typeof value === "string" ? new Date(value) : value;
  const iso = d.toISOString();
  return Number.isNaN(Date.parse(iso)) ? fallbackIso : iso;
}

function safeParseJson<T>(value: any, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function rowToArticle(row: BlogArticleRow): BlogArticle {
  const nowIso = new Date().toISOString();
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    primaryKeyword: row.primary_keyword,
    secondaryKeywords: safeParseJson<string[]>(row.secondary_keywords, []),
    excerpt: row.excerpt || undefined,
    contentHtml: row.content_html,
    faqs: safeParseJson<BlogFAQ[] | undefined>(row.faqs, undefined),
    publishedTime: toIsoString(row.published_time, nowIso),
    modifiedTime: toIsoString(row.modified_time, row.published_time ? toIsoString(row.published_time, nowIso) : nowIso),
  };
}

export async function getAllPublishedBlogArticles(): Promise<BlogArticle[]> {
  const rows = await query<BlogArticleRow>(
    `
      SELECT *
      FROM blog_articles
      WHERE status = 'published'
      ORDER BY COALESCE(published_time, created_at) DESC
    `
  );
  return rows.map(rowToArticle);
}

export async function getBlogArticleBySlug(slug: string): Promise<BlogArticle | null> {
  const row = await queryOne<BlogArticleRow>(
    `
      SELECT *
      FROM blog_articles
      WHERE slug = ?
      LIMIT 1
    `,
    [slug]
  );
  return row ? rowToArticle(row) : null;
}

export async function upsertBlogArticle(input: {
  slug: string;
  title: string;
  category: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  excerpt?: string;
  contentHtml: string;
  faqs?: BlogFAQ[];
  status?: "draft" | "published";
  publishedTime?: string;
  modifiedTime?: string;
}): Promise<void> {
  const status = input.status ?? "published";
  await query(
    `
      INSERT INTO blog_articles (
        slug, title, category,
        primary_keyword, secondary_keywords, excerpt,
        content_html, faqs,
        status, published_time, modified_time
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        category = VALUES(category),
        primary_keyword = VALUES(primary_keyword),
        secondary_keywords = VALUES(secondary_keywords),
        excerpt = VALUES(excerpt),
        content_html = VALUES(content_html),
        faqs = VALUES(faqs),
        status = VALUES(status),
        published_time = VALUES(published_time),
        modified_time = VALUES(modified_time)
    `,
    [
      input.slug,
      input.title,
      input.category,
      input.primaryKeyword,
      JSON.stringify(input.secondaryKeywords ?? []),
      input.excerpt ?? null,
      input.contentHtml,
      input.faqs ? JSON.stringify(input.faqs) : null,
      status,
      input.publishedTime ? new Date(input.publishedTime) : null,
      input.modifiedTime ? new Date(input.modifiedTime) : null,
    ]
  );
}

