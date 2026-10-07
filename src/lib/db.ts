// src/lib/db.ts
// Single entry point for the database client — re-exports the shared pool so
// `@/lib/db` and `@/lib/db/` resolve to exactly one connection pool.
export { db } from './db/index';
