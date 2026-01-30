// knexfile.cjs
// Knex configuration for MySQL migrations.
//
// Uses `mysql2` driver (already in dependencies).

const connection = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  // Needed because our migrations run raw SQL files containing many statements.
  multipleStatements: true,
};

module.exports = {
  client: "mysql2",
  connection,
  migrations: {
    directory: "./knex/migrations",
    tableName: "knex_migrations",
  },
};

