// 0003_keyword_guides.cjs
// Applies the SQL migration from lib/database/migrations.

const fs = require("node:fs");
const path = require("node:path");

function readSql(name) {
  const p = path.join(process.cwd(), "lib", "database", "migrations", name);
  return fs.readFileSync(p, "utf8");
}

exports.up = async function up(knex) {
  await knex.raw(readSql("0003_keyword_guides.sql"));
};

exports.down = async function down(_knex) {
  // No-op (safe). We don't drop tables automatically in production.
};

