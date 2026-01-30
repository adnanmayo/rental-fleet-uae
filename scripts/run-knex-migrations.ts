/**
 * Run Knex migrations (MySQL) – safe for build.
 *
 * - Uses Knex migration table `knex_migrations`
 * - Runs `latest`
 *
 * Behavior:
 * - If MYSQL_* env vars are missing, SKIP (exit 0) so builds don't fail locally.
 * - If env vars exist but DB is unreachable, FAIL (exit 1).
 */

import "dotenv/config";
import knexFactory from "knex";

function hasDbEnv() {
  return Boolean(process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE);
}

async function main() {
  if (!hasDbEnv()) {
    // eslint-disable-next-line no-console
    console.log("[db:migrate:knex] Skipping (MYSQL_* env vars not set).");
    return;
  }

  const knex = knexFactory({
    client: "mysql2",
    connection: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE,
      // Needed because our migrations run raw SQL files containing many statements.
      multipleStatements: true,
    },
    migrations: {
      directory: "./knex/migrations",
      tableName: "knex_migrations",
    },
  });

  try {
    const [batch, files] = await knex.migrate.latest();
    // eslint-disable-next-line no-console
    console.log(`[db:migrate:knex] Batch ${batch} complete. Ran: ${files.length ? files.join(", ") : "none"}`);
  } finally {
    await knex.destroy();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[db:migrate:knex] Failed:", err);
  process.exit(1);
});

