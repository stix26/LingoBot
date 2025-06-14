import pgPkg from 'pg';
const { Pool } = pgPkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

export let pool: pgPkg.Pool | undefined;
export let db: ReturnType<typeof drizzle> | undefined;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
}
