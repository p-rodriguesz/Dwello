import 'dotenv/config';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

export const pool = databaseUrl ? mysql.createPool(databaseUrl) : null;

export const db = pool ? drizzle(pool, { schema, mode: 'default' }) : null;
