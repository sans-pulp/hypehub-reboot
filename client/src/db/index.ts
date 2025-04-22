import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_SESSION_POOL_URL


const client = postgres(connectionString!, {prepare: false})
export const db = drizzle(client)