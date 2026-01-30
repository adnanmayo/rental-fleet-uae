/**
 * Seed Keyword Guides into MySQL
 *
 * Usage:
 *   npm run db:seed:keyword-guides
 *
 * Requires env:
 *   MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
 */

import "dotenv/config";

// NOTE: use relative imports so ts-node works without path-alias tooling
import { closePool, testConnection } from "../lib/database/mysql";
import { keywordLandingPages } from "../lib/keyword-landing-pages";
import { upsertKeywordGuide } from "../lib/database/keyword-guides-repository";

function hasDbEnv() {
  return Boolean(process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE);
}

async function main() {
  if (!hasDbEnv()) {
    // eslint-disable-next-line no-console
    console.log("[db:seed:keyword-guides] Skipping (MYSQL_* env vars not set).");
    return;
  }

  try {
    const ok = await testConnection();
    if (!ok) {
      throw new Error("MySQL connection failed. Check MYSQL_* env vars.");
    }

    for (const p of keywordLandingPages) {
      await upsertKeywordGuide({
        slug: p.slug,
        keyword: p.keyword,
        category: p.category,
        title: p.title,
        description: p.description,
        h1: p.h1,
        toc: p.toc,
        sections: p.sections,
        faqs: p.faqs,
        status: "published",
        publishedTime: p.updatedAtISO,
        modifiedTime: p.updatedAtISO,
      });
      // eslint-disable-next-line no-console
      console.log(`Upserted keyword guide: ${p.slug}`);
    }

    // eslint-disable-next-line no-console
    console.log(`Done. Seeded ${keywordLandingPages.length} keyword guides.`);
  } finally {
    await closePool();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

