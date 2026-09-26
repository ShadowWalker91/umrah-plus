// src/lib/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';

// 1. Connection String (Use the Transaction Pooler / Port 6543 for Drizzle)
const connectionString = process.env.DATABASE_URL!;

// 2. Disable prefetch to work with Serverless/Supabase
const client = postgres(connectionString, { prepare: false });

// 3. Export the DB
export const db = drizzle(client);