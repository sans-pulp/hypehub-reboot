import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Explicitly load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/db/schema.ts',
    out: './supabase/migrations',
    dbCredentials: {
        // connectionString: process.env.SESSION_POOL_URL!,
        url: process.env.DATABASE_SESSION_POOL_URL!,
        
    },
    verbose: true,
    strict: true,
})
