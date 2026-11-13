// Recria o banco do zero usando apenas database/dwello.sql + database/seed.sql.
// ATENÇÃO: apaga todos os dados do banco configurado em DATABASE_URL.
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('Configure DATABASE_URL antes de executar o reset.');

const url = new URL(databaseUrl);
const databaseName = decodeURIComponent(url.pathname.replace(/^\//, '')).replace(/`/g, '') || 'dwello';
const serverUrl = new URL(url);
serverUrl.pathname = '/';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../database');
const withDatabaseName = (sql) =>
  sql
    .replace(/CREATE DATABASE IF NOT EXISTS dwello\b/, `CREATE DATABASE IF NOT EXISTS \`${databaseName}\``)
    .replace(/^USE dwello;/m, `USE \`${databaseName}\`;`);

const connection = await mysql.createConnection({ uri: serverUrl.toString(), multipleStatements: true });
try {
  await connection.query(`DROP DATABASE IF EXISTS \`${databaseName}\``);
  for (const file of ['dwello.sql', 'seed.sql']) {
    await connection.query(withDatabaseName(await fs.readFile(path.join(dir, file), 'utf8')));
    console.log(`✔ ${file} aplicado`);
  }
  console.log(`Banco "${databaseName}" recriado com sucesso.`);
} finally {
  await connection.end();
}
