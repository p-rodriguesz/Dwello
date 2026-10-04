/// <reference types="node" />

import 'dotenv/config';
import { env } from 'node:process';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'mysql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: env.DATABASE_URL ?? ''
  }
});