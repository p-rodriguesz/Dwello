import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const compatibilityColumns = {
  condominios: {
    cnpj: 'VARCHAR(18) NULL',
    tipo_condominio_id: 'INT NULL',
    endereco_id: 'INT NULL',
    status: 'VARCHAR(30) NULL',
    created_at: 'DATETIME NULL',
    updated_at: 'DATETIME NULL'
  },
  unidades: {
    bloco_id: 'INT NULL',
    tipo_unidade_id: 'INT NULL',
    identificacao: 'VARCHAR(30) NULL',
    area_m2: 'DECIMAL(10,2) NULL',
    status: 'VARCHAR(30) NULL',
    created_at: 'DATETIME NULL',
    updated_at: 'DATETIME NULL'
  },
  usuarios: {
    condominio_id: 'INT NULL',
    pessoa_id: 'INT NULL',
    auth_user_id: 'VARCHAR(64) NULL UNIQUE',
    nome: 'VARCHAR(150) NULL',
    perfil: "VARCHAR(30) NULL DEFAULT 'MORADOR'",
    ativo: 'BOOLEAN NOT NULL DEFAULT TRUE',
    criado_em: 'DATETIME NULL'
  },
  visitantes: {
    foto_url: 'VARCHAR(255) NULL'
  },
  encomendas: {
    foto_url: 'VARCHAR(255) NULL'
  },
  pagamentos_fornecedores: {
    comprovante_url: 'VARCHAR(255) NULL'
  },
  moradores: {
    condominio_id: 'INT NULL',
    pessoa_id: 'INT NULL',
    usuario_id: 'INT NULL',
    unidade_id: 'INT NULL',
    tipo_vinculo: "VARCHAR(30) NULL DEFAULT 'proprietario'",
    data_inicio: 'DATE NULL',
    data_fim: 'DATE NULL',
    created_at: 'DATETIME NULL',
    updated_at: 'DATETIME NULL'
  },
  usuario_perfis: {
    perfil_id: 'INT NULL',
    perfil: 'VARCHAR(30) NULL',
    ativo: 'BOOLEAN NOT NULL DEFAULT TRUE',
    criado_em: 'DATETIME NULL'
  }
};

async function columnsOf(connection, table) {
  const [rows] = await connection.query('SHOW COLUMNS FROM ??', [table]);
  return new Set(rows.map((row) => row.Field));
}

async function tableExists(connection, table) {
  const [rows] = await connection.query('SHOW TABLES LIKE ?', [table]);
  return rows.length > 0;
}

async function ensureAutoIncrement(connection, table) {
  const [rows] = await connection.query('SHOW COLUMNS FROM ?? LIKE ?', [table, 'id']);
  if (
    rows[0] &&
    /^(tinyint|smallint|mediumint|int|bigint)/i.test(String(rows[0].Type)) &&
    !String(rows[0].Extra).toLowerCase().includes('auto_increment')
  ) {
    await connection.query(`ALTER TABLE \`${table}\` MODIFY COLUMN \`id\` ${rows[0].Type} NOT NULL AUTO_INCREMENT`);
  }
}

async function ensureAuthPasswordNullable(connection) {
  if (!(await tableExists(connection, 'usuarios'))) return;
  const columns = await columnsOf(connection, 'usuarios');
  if (columns.has('senha_hash')) {
    await connection.query('ALTER TABLE `usuarios` MODIFY COLUMN `senha_hash` VARCHAR(255) NULL');
  }
}

async function applyForeignKeys(connection, source) {
  const pattern = /ALTER TABLE `([^`]+)` ADD FOREIGN KEY \(`([^`]+)`\) REFERENCES `([^`]+)` \(`([^`]+)`\);/g;
  let match;
  while ((match = pattern.exec(source))) {
    const [, table, column, referencedTable, referencedColumn] = match;
    const [existing] = await connection.query(
      `SELECT 1 FROM information_schema.KEY_COLUMN_USAGE
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?
         AND REFERENCED_TABLE_NAME = ? AND REFERENCED_COLUMN_NAME = ? LIMIT 1`,
      [table, column, referencedTable, referencedColumn]
    );
    if (existing.length) continue;
    const constraint = `dwello_fk_${table}_${column}`.slice(0, 60);
    try {
      await connection.query(`ALTER TABLE \`${table}\` ADD CONSTRAINT \`${constraint}\` FOREIGN KEY (\`${column}\`) REFERENCES \`${referencedTable}\` (\`${referencedColumn}\`)`);
    } catch (error) {
      console.warn(`FK não aplicada (${table}.${column} -> ${referencedTable}.${referencedColumn}): ${error.message}`);
    }
  }
}

async function setupDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.includes('SEU_USUARIO') || databaseUrl.includes('SUA_SENHA')) {
    console.log('Banco não inicializado: configure DATABASE_URL e execute "npm run setup:db".');
    return;
  }

  const url = new URL(databaseUrl);
  const databaseName = url.pathname.replace(/^\//, '');
  const serverUrl = new URL(url);
  serverUrl.pathname = '/';
  const connection = await mysql.createConnection({ uri: serverUrl.toString(), multipleStatements: true });
  const sqlPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../database/dwello.sql');
  const source = await fs.readFile(sqlPath, 'utf8');
  const createTablePattern = /CREATE TABLE `([^`]+)` \(([\s\S]*?)\n\);/g;
  const sourceTables = new Set();

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName.replace(/`/g, '')}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE \`${databaseName.replace(/`/g, '')}\``);

    let match;
    while ((match = createTablePattern.exec(source))) {
      const table = match[1];
      sourceTables.add(table);
      if (!(await tableExists(connection, table))) {
        await connection.query(`CREATE TABLE \`${table}\` (${match[2]})`);
      }
    }

    for (const [table, columns] of Object.entries(compatibilityColumns)) {
      if (!(await tableExists(connection, table))) continue;
      const existing = await columnsOf(connection, table);
      for (const [column, definition] of Object.entries(columns)) {
        if (!existing.has(column)) {
          await connection.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
        }
      }
    }

    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    try {
      for (const table of sourceTables) {
        await ensureAutoIncrement(connection, table);
      }
    } finally {
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    }

    await ensureAuthPasswordNullable(connection);
    if (await tableExists(connection, 'usuarios')) {
      await connection.query(
        `UPDATE usuarios SET perfil = CASE LOWER(perfil)
          WHEN 'admin' THEN 'SUPER_ADMIN'
          WHEN 'super_admin' THEN 'SUPER_ADMIN'
          WHEN 'administradora' THEN 'ADMINISTRADORA'
          WHEN 'sindico' THEN 'SINDICO'
          WHEN 'subsindico' THEN 'SUBSINDICO'
          WHEN 'conselheiro' THEN 'CONSELHEIRO'
          WHEN 'porteiro' THEN 'PORTEIRO'
          WHEN 'zelador' THEN 'ZELADOR'
          WHEN 'funcionario' THEN 'FUNCIONARIO'
          WHEN 'proprietario' THEN 'PROPRIETARIO'
          WHEN 'prestador' THEN 'PRESTADOR'
          WHEN 'visitante' THEN 'VISITANTE'
          WHEN 'morador' THEN 'MORADOR'
          ELSE 'MORADOR'
        END`
      );
    }
    if (await tableExists(connection, 'usuario_perfis')) {
      await connection.query(
        `UPDATE usuario_perfis SET perfil = CASE LOWER(perfil)
          WHEN 'admin' THEN 'SUPER_ADMIN'
          WHEN 'super_admin' THEN 'SUPER_ADMIN'
          WHEN 'administradora' THEN 'ADMINISTRADORA'
          WHEN 'sindico' THEN 'SINDICO'
          WHEN 'subsindico' THEN 'SUBSINDICO'
          WHEN 'conselheiro' THEN 'CONSELHEIRO'
          WHEN 'porteiro' THEN 'PORTEIRO'
          WHEN 'zelador' THEN 'ZELADOR'
          WHEN 'funcionario' THEN 'FUNCIONARIO'
          WHEN 'proprietario' THEN 'PROPRIETARIO'
          WHEN 'prestador' THEN 'PRESTADOR'
          WHEN 'visitante' THEN 'VISITANTE'
          WHEN 'morador' THEN 'MORADOR'
          ELSE UPPER(perfil)
        END
        WHERE perfil IS NOT NULL`
      );
    }
    await applyForeignKeys(connection, source);

    console.log('Schema dwello configurado incrementalmente; tabelas e dados existentes foram preservados.');
  } finally {
    await connection.end();
  }
}

setupDatabase().catch((error) => {
  console.error('Não foi possível configurar o schema dwello:', error.message);
  process.exitCode = 1;
});
