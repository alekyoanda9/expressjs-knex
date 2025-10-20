import knex, {Knex} from "knex";
import config from "../../knexfile"

// Buat koneksi MySQL (development)
export const mysqlDb: Knex = knex(config.main!);

// Buat koneksi PostgreSQL (staging)
export const pgDb: Knex = knex(config.secondary!);