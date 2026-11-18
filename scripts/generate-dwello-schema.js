import fs from 'node:fs';

const sql = fs.readFileSync('database/dwello.sql', 'utf8');
const typeMap = (type, name) => {
  const lower = type.toLowerCase();
  if (lower === 'int') return `int('${name}')`;
  if (lower === 'boolean') return `boolean('${name}')`;
  if (lower === 'date') return `date('${name}')`;
  if (lower === 'datetime') return `datetime('${name}')`;
  if (lower === 'timestamp') return `timestamp('${name}')`;
  if (lower === 'text' || lower === 'longtext') return `text('${name}')`;
  if (lower === 'json') return `json('${name}')`;
  const varchar = lower.match(/^varchar\((\d+)\)/);
  if (varchar) return `varchar('${name}', { length: ${varchar[1]} })`;
  const char = lower.match(/^char\((\d+)\)/);
  if (char) return `char('${name}', { length: ${char[1]} })`;
  const decimal = lower.match(/^decimal\((\d+),(\d+)\)/);
  if (decimal) return `decimal('${name}', { precision: ${decimal[1]}, scale: ${decimal[2]} })`;
  const enumType = lower.match(/^enum\((.*)\)$/);
  if (enumType) {
    const values = enumType[1].match(/'([^']*)'/g)?.map((value) => value.slice(1, -1));
    if (values?.length) return `mysqlEnum('${name}', [${values.map((value) => JSON.stringify(value)).join(', ')}])`;
  }
  throw new Error(`Tipo não suportado: ${type}`);
};
const camel = (name) => name.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
const quote = (value) => JSON.stringify(value);
const tables = [];
const tablePattern = /CREATE TABLE `([^`]+)` \(([\s\S]*?)\n\);/g;
let tableMatch;
while ((tableMatch = tablePattern.exec(sql))) {
  const [, tableName, body] = tableMatch;
  const columns = [];
  for (const line of body.split('\n')) {
    const match = line.match(/^  `([^`]+)` ([a-z]+(?:\([^)]*\))?)/i);
    if (!match) continue;
    const [, name, type] = match;
    const definition = typeMap(type, name);
    const primary = /PRIMARY KEY/i.test(line) ? '.primaryKey()' : '';
    columns.push(`    ${camel(name)}: ${definition}${primary}${/ NOT NULL/i.test(line) ? '.notNull()' : ''}${/ UNIQUE/i.test(line) ? '.unique()' : ''}`);
  }
  if (!columns.length) continue;
  tables.push(`export const ${camel(tableName)} = mysqlTable(${quote(tableName)}, {\n${columns.join(',\n')}\n});`);
}
if (tables.length !== 157) throw new Error(`Esperadas 157 tabelas, encontradas ${tables.length}`);
const header = `// Gerado a partir de database/dwello.sql. Não editar manualmente.\nimport { boolean, char, date, datetime, decimal, int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, varchar } from 'drizzle-orm/mysql-core';\n\n`;
fs.writeFileSync('src/db/dwello-schema.ts', header + tables.join('\n\n') + '\n');
console.log(`Schema gerado com ${tables.length} tabelas.`);
