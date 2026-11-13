import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { env } from '../config/env.js';
import { databaseUnavailableError } from '../errors/app-error.js';
import * as schema from './schema.js';

export const pool = env.databaseUrl ? mysql.createPool(env.databaseUrl) : null;

export const db = pool ? drizzle(pool, { schema, mode: 'default' }) : null;

export function requirePool() {
  if (!pool) throw databaseUnavailableError();
  return pool;
}

export function requireDb() {
  if (!db) throw databaseUnavailableError();
  return db;
}
