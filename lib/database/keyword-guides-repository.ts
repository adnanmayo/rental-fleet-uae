/**
 * Keyword Guides Repository - MySQL Implementation
 * Stores and loads keyword-driven landing pages from the DB.
 */

import { query, queryOne } from "./mysql";

export type KeywordGuideRow = {
  id: number;
  slug: string;
  keyword: string;
  category: string;
  title: string;
  description: string;
  h1: string;
  toc: any;
  sections: any;
  faqs: any;
  status: "draft" | "published";
  published_time: Date | string | null;
  modified_time: Date | string | null;
};

export type KeywordGuideTocItem = { id: string; label: string };

export type KeywordGuideSection =
  | { id: string; heading: string; type: "text"; paragraphs: string[] }
  | { id: string; heading: string; type: "bullets"; intro?: string; bullets: string[]; outro?: string }
  | { id: string; heading: string; type: "table"; intro?: string; columns: string[]; rows: Array<Record<string, string>>; outro?: string };

export type KeywordGuideFAQ = { question: string; answer: string };

export type KeywordGuide = {
  slug: string;
  keyword: string;
  category: string;
  title: string;
  description: string;
  h1: string;
  toc: KeywordGuideTocItem[];
  sections: KeywordGuideSection[];
  faqs: KeywordGuideFAQ[];
  publishedTime: string;
  modifiedTime: string;
};

export function hasDbEnv(): boolean {
  return Boolean(process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE);
}

function isMissingTableError(err: unknown): boolean {
  const e = err as { code?: string; errno?: number };
  // MySQL: ER_NO_SUCH_TABLE / errno 1146
  return e?.code === "ER_NO_SUCH_TABLE" || e?.errno === 1146;
}

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

function rowToGuide(row: KeywordGuideRow): KeywordGuide {
  const nowIso = new Date().toISOString();
  return {
    slug: row.slug,
    keyword: row.keyword,
    category: row.category,
    title: row.title,
    description: row.description,
    h1: row.h1,
    toc: safeParseJson<KeywordGuideTocItem[]>(row.toc, []),
    sections: safeParseJson<KeywordGuideSection[]>(row.sections, []),
    faqs: safeParseJson<KeywordGuideFAQ[]>(row.faqs, []),
    publishedTime: toIsoString(row.published_time, nowIso),
    modifiedTime: toIsoString(row.modified_time, row.published_time ? toIsoString(row.published_time, nowIso) : nowIso),
  };
}

export async function getKeywordGuideBySlug(slug: string): Promise<KeywordGuide | null> {
  try {
    const row = await queryOne<KeywordGuideRow>(
      `
        SELECT *
        FROM keyword_guides
        WHERE slug = ?
          AND status = 'published'
        LIMIT 1
      `,
      [slug]
    );
    return row ? rowToGuide(row) : null;
  } catch (err) {
    // In dev it’s common to have MYSQL_* env set but not have tables migrated yet.
    if (isMissingTableError(err)) return null;
    throw err;
  }
}

export async function getAllKeywordGuideSlugs(): Promise<string[]> {
  try {
    const rows = await query<{ slug: string }>(
      `
        SELECT slug
        FROM keyword_guides
        WHERE status = 'published'
        ORDER BY slug ASC
      `
    );
    return rows.map((r) => r.slug);
  } catch (err) {
    if (isMissingTableError(err)) return [];
    throw err;
  }
}

export async function getAllKeywordGuidesLite(): Promise<Array<Pick<KeywordGuide, "slug" | "keyword" | "description" | "category">>> {
  try {
    const rows = await query<{ slug: string; keyword: string; description: string; category: string }>(
      `
        SELECT slug, keyword, description, category
        FROM keyword_guides
        WHERE status = 'published'
        ORDER BY keyword ASC
      `
    );
    return rows;
  } catch (err) {
    if (isMissingTableError(err)) return [];
    throw err;
  }
}

export async function getRelatedKeywordGuides(slug: string, limit: number): Promise<Array<Pick<KeywordGuide, "slug" | "keyword" | "description" | "category">>> {
  try {
    const current = await queryOne<{ slug: string; category: string }>(
      `
        SELECT slug, category
        FROM keyword_guides
        WHERE slug = ?
          AND status = 'published'
        LIMIT 1
      `,
      [slug]
    );

    if (!current) return [];

    // MySQL prepared statements can be finicky about `LIMIT ?` depending on server settings.
    // Since `limit` is controlled by our code (not user input), we safely inline it.
    const safeLimit = Math.max(0, Math.min(50, Number.isFinite(limit) ? Math.floor(limit) : 0));

    const rows = await query<{ slug: string; keyword: string; description: string; category: string }>(
      `
        SELECT slug, keyword, description, category
        FROM keyword_guides
        WHERE status = 'published'
          AND slug <> ?
        ORDER BY
          CASE WHEN category = ? THEN 0 ELSE 1 END,
          COALESCE(modified_time, updated_at) DESC
        LIMIT ${safeLimit}
      `,
      [slug, current.category]
    );

    return rows;
  } catch (err) {
    if (isMissingTableError(err)) return [];
    throw err;
  }
}

export async function upsertKeywordGuide(input: {
  slug: string;
  keyword: string;
  category: string;
  title: string;
  description: string;
  h1: string;
  toc: KeywordGuideTocItem[];
  sections: KeywordGuideSection[];
  faqs: KeywordGuideFAQ[];
  status?: "draft" | "published";
  publishedTime?: string;
  modifiedTime?: string;
}): Promise<void> {
  const status = input.status ?? "published";
  await query(
    `
      INSERT INTO keyword_guides (
        slug, keyword, category,
        title, description, h1,
        toc, sections, faqs,
        status, published_time, modified_time
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        keyword = VALUES(keyword),
        category = VALUES(category),
        title = VALUES(title),
        description = VALUES(description),
        h1 = VALUES(h1),
        toc = VALUES(toc),
        sections = VALUES(sections),
        faqs = VALUES(faqs),
        status = VALUES(status),
        published_time = VALUES(published_time),
        modified_time = VALUES(modified_time)
    `,
    [
      input.slug,
      input.keyword,
      input.category,
      input.title,
      input.description,
      input.h1,
      JSON.stringify(input.toc ?? []),
      JSON.stringify(input.sections ?? []),
      JSON.stringify(input.faqs ?? []),
      status,
      input.publishedTime ? new Date(input.publishedTime) : null,
      input.modifiedTime ? new Date(input.modifiedTime) : null,
    ]
  );
}

