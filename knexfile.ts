import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  main: {
    client: "mysql2",
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'expressjs-knex'
    },
    migrations: {
      directory: "./migrations",
      tableName: "migrations"
    }
  },

  secondary: {
    client: "postgresql",
    connection: {
      host: '127.0.0.1',
      port: 5432,
      database: "expressjs-knex",
      user: "postgres",
      password: "Namikaze123"
    },
    migrations: {
      tableName: "pg_migrations"
    }
  },

};

export default config;

