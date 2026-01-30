/**
 * Seed Blog Articles into MySQL
 *
 * Usage:
 *   npm run db:seed:blog
 *
 * Requires env:
 *   MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
 */

import "dotenv/config";

// NOTE: use relative imports so ts-node works without path-alias tooling
import { blogArticles } from "../data/blog-articles";
import { upsertBlogArticle } from "../lib/database/blog-repository";
import { testConnection } from "../lib/database/mysql";

async function main() {
  const ok = await testConnection();
  if (!ok) {
    throw new Error("MySQL connection failed. Check MYSQL_* env vars.");
  }

  for (const a of blogArticles) {
    await upsertBlogArticle({
      slug: a.slug,
      title: a.title,
      category: a.category,
      primaryKeyword: a.primaryKeyword,
      secondaryKeywords: a.secondaryKeywords,
      excerpt: a.excerpt,
      contentHtml: a.contentHtml,
      faqs: a.faqs,
      status: "published",
      publishedTime: a.publishedTime,
      modifiedTime: a.modifiedTime,
    });
    // eslint-disable-next-line no-console
    console.log(`Upserted: ${a.slug}`);
  }

  // eslint-disable-next-line no-console
  console.log(`Done. Seeded ${blogArticles.length} articles.`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

