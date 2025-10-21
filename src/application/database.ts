import knex, { Knex } from "knex";
import config from "../../knex/knexfile";
import { logger } from "./logging";

// Koneksi MySQL & PostgreSQL
export const mysqlDb: Knex = knex(config.main!);
export const pgDb: Knex = knex(config.secondary!);

// Cek apakah query termasuk DML
function isDML(sql: string): boolean {
  const upper = sql.trim().toUpperCase();
  return (
    upper.startsWith("SELECT") ||
    upper.startsWith("INSERT") ||
    upper.startsWith("UPDATE") ||
    upper.startsWith("DELETE")
  );
}

// Simpan waktu mulai tiap query
const startTimes = new Map<string, number>();

function attachLogging(db: Knex, label: string) {
  db.on("query", (queryData) => {
    const queryId = queryData.__knexUid || Math.random().toString();
    startTimes.set(queryId, Date.now());
  });

  db.on("query-response", (_response, queryData) => {
    const sql = queryData.sql;
    const queryId = queryData.__knexUid;
    const start = startTimes.get(queryId);
    if (!start) return;
    const duration = (Date.now() - start).toFixed(2);
    startTimes.delete(queryId);

    if (isDML(sql)) {
      const bindings =
        queryData.bindings && queryData.bindings.length
          ? ` | bindings: ${JSON.stringify(queryData.bindings)}`
          : "";
      logger.info(
        `[${label}] ${sql}${bindings} | ${duration} ms`
      );
    }
  });

  db.on("query-error", (error, queryData) => {
    logger.error(
      `[${label}] ERROR: ${error.message} | QUERY: ${queryData?.sql}`
    );
  });
}

// Pasang logger ke kedua koneksi
attachLogging(mysqlDb, "MySQL");
attachLogging(pgDb, "PostgreSQL");
