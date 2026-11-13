// Grava a matriz de permissões padrão (src/auth/rbac.ts) nas tabelas perfis/permissoes/perfil_permissoes.
//   npm run seed:permissoes            -> só acrescenta o que falta
//   npm run seed:permissoes -- --reset -> apaga e regrava igual à matriz padrão
import 'dotenv/config';
import { RBAC_MATRIX } from '../src/auth/rbac.js';
import { syncPermissionsToDb } from '../src/auth/permissions-store.js';
import { pool } from '../src/db/index.js';

const reset = process.argv.includes('--reset');
try {
  const { inserted } = await syncPermissionsToDb(RBAC_MATRIX, { reset });
  console.log(`Permissões ${reset ? 'regravadas' : 'sincronizadas'}: ${inserted} vínculos cargo↔permissão inseridos.`);
} finally {
  await pool?.end();
}
