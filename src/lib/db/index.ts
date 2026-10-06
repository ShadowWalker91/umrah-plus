import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL!;

/**
 * A single shared connection pool.
 *
 * The app used to create one pool per module (`src/lib/db.ts` and
 * `src/lib/db/index.ts`), each opening up to 10 connections and never closing
 * idle ones (postgres-js `idle_timeout` defaults to 0). Against the Supabase
 * session pooler (pool_size 15) that exhausted every slot and queries failed
 * with `EMAXCONNSESSION max clients reached`.
 *
 * Storing the client on globalThis keeps one pool alive across dev hot
 * reloads / duplicate module evaluations as well.
 */
const globalForDb = globalThis as unknown as { __pgPool?: ReturnType<typeof postgres> };

const client =
  globalForDb.__pgPool ??
  postgres(connectionString, {
    prepare: false, // required by the Supabase pooler
    idle_timeout: 20, // release idle sessions instead of holding them forever
    max: 5, // stay well below the pooler's 15-session limit
    connect_timeout: 15,
  });

globalForDb.__pgPool = client;

export const db = drizzle(client, { schema });
