/**
 * Simple SQL migration runner (MySQL).
 *
 * - Reads SQL files from `lib/database/migrations/*.sql`
 * - Tracks applied migrations in `schema_migrations`
 * - Designed to be safe to run during `npm run build`
 *
 * Behavior:
 * - If MYSQL_* env vars are not set, it will SKIP (exit 0).
 * - If env vars are set but DB is unreachable, it FAILS (exit 1).
 */

import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

type MigrationRow = { name: string };

function mustEnv(name: string): string | null {
  const v = process.env[name];
  return v && v.trim() ? v : null;
}

function getMigrationDir(): string {
  return path.join(process.cwd(), "lib", "database", "migrations");
}

async function main() {
  const host = mustEnv("MYSQL_HOST");
  const user = mustEnv("MYSQL_USER");
  const database = mustEnv("MYSQL_DATABASE");
  const password = process.env.MYSQL_PASSWORD || "";
  const port = Number(process.env.MYSQL_PORT || "3306");

  // If DB env isn't configured, skip migrations (don’t break build/dev).
  if (!host || !user || !database) {
    // eslint-disable-next-line no-console
    console.log("[db:migrate] Skipping (MYSQL_* env vars not set).");
    return;
  }

  const migrationsDir = getMigrationDir();
  if (!fs.existsSync(migrationsDir)) {
    // eslint-disable-next-line no-console
    console.log(`[db:migrate] No migrations dir found at ${migrationsDir}. Skipping.`);
    return;
  }

  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  if (migrationFiles.length === 0) {
    // eslint-disable-next-line no-console
    console.log("[db:migrate] No migration files found. Skipping.");
    return;
  }

  const conn = await mysql.createConnection({
    host,
    user,
    password,
    database,
    port,
    multipleStatements: true,
  });

  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name VARCHAR(255) PRIMARY KEY,
        run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    const [rows] = await conn.execute<mysql.RowDataPacket[]>(
      "SELECT name FROM schema_migrations"
    );
    const applied = new Set((rows as unknown as MigrationRow[]).map((r) => r.name));

    for (const file of migrationFiles) {
      if (applied.has(file)) continue;
      const fullPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(fullPath, "utf8").trim();
      if (!sql) continue;

      // eslint-disable-next-line no-console
      console.log(`[db:migrate] Applying ${file}...`);
      await conn.query(sql);
      await conn.execute("INSERT INTO schema_migrations (name) VALUES (?)", [file]);
      // eslint-disable-next-line no-console
      console.log(`[db:migrate] Applied ${file}`);
    }
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[db:migrate] Failed:", err);
  process.exit(1);
});

