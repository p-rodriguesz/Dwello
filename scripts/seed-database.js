import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || databaseUrl.includes('SEU_USUARIO') || databaseUrl.includes('SUA_SENHA')) {
  throw new Error('Configure DATABASE_URL antes de executar o seed.');
}

const connection = await mysql.createConnection({ uri: databaseUrl, multipleStatements: true });
try {
  const seedPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../database/seed.sql');
  await connection.query(await fs.readFile(seedPath, 'utf8'));
  console.log('Seed aplicado com sucesso.');
} finally {
  await connection.end();
}
