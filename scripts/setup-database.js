require('dotenv').config();

const fs = require('node:fs/promises');
const path = require('node:path');
const mysql = require('mysql2/promise');

async function setupDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes('SEU_USUARIO') || databaseUrl.includes('SUA_SENHA')) {
    console.log('Banco não inicializado: configure DATABASE_URL e execute "npm run setup:db".');
    return;
  }

  const connectionUrl = new URL(databaseUrl);
  connectionUrl.pathname = '/';
  const sqlPath = path.resolve(__dirname, '../database/dwello.sql');
  const sql = await fs.readFile(sqlPath, 'utf8');
  const connection = await mysql.createConnection({
    uri: connectionUrl.toString(),
    multipleStatements: true
  });

  try {
    await connection.query(sql);
    console.log('Banco dwello inicializado com sucesso.');
  } finally {
    await connection.end();
  }
}

setupDatabase().catch((error) => {
  console.error('Não foi possível inicializar o banco:', error.message);
  process.exitCode = 1;
});
