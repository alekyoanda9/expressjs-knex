import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

const config: { [key: string]: Knex.Config } = {
  main: {
    client: "mysql2",
    connection: {
      host: requireEnv("MYSQL_HOST"),
      port: Number(requireEnv("MYSQL_PORT")),
      user: requireEnv("MYSQL_USER"),
      password: process.env.MYSQL_PASSWORD || "",
      database: requireEnv("MYSQL_DATABASE"),
    },
    migrations: {
      directory: "./migrations",
      tableName: "migrations",
    },
  },

  secondary: {
    client: "postgresql",
    connection: {
      host: requireEnv("PG_HOST"),
      port: Number(requireEnv("PG_PORT")),
      user: requireEnv("PG_USER"),
      password: process.env.PG_PASSWORD || "",
      database: requireEnv("PG_DATABASE"),
    },
    migrations: {
      directory: "./pg_migrations",
      tableName: "pg_migrations",
    },
  },
};

export default config;
