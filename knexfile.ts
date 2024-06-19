import type { Knex } from "knex";

const connection: Knex.ConnectionConfig = {
  host: String(process.env.DB_HOST),
  database: String(process.env.POSTGRES_DB),
  user: String(process.env.POSTGRES_USER),
  password: String(process.env.POSTGRES_PASSWORD),
};

const config: Knex.Config = {
  client: "pg",
  connection,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};

export default config;
