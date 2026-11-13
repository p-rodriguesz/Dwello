import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { requirePool } from '../db/index.js';

// Permissões ficam no banco:
//   perfis            -> um registro por cargo (nome = SUPER_ADMIN, ZELADOR, ...)
//   permissoes        -> um registro por "recurso:acao" (ex.: ocorrencias:update)
//   perfil_permissoes -> qual cargo tem qual permissão
// Este módulo lê essas tabelas (com cache curto) e sabe preenchê-las a partir da matriz padrão.

export type PermissionAction = 'read' | 'create' | 'update' | 'delete';
export type PermissionMap = Map<string, Map<string, Set<PermissionAction>>>;
export type MatrixLike = Record<string, Partial<Record<string, readonly PermissionAction[]>>>;

const CACHE_MS = 30_000;
let cache: { map: PermissionMap; at: number } | null = null;

export function matrixToMap(matrix: MatrixLike): PermissionMap {
  const map: PermissionMap = new Map();
  for (const [role, resources] of Object.entries(matrix)) {
    const byResource = new Map<string, Set<PermissionAction>>();
    for (const [resource, actions] of Object.entries(resources)) byResource.set(resource, new Set(actions ?? []));
    map.set(role, byResource);
  }
  return map;
}

export function invalidatePermissionCache() {
  cache = null;
}

/** Lê as permissões do banco. Se as tabelas ainda estiverem vazias, usa a matriz padrão. */
export async function loadPermissionMap(fallback: PermissionMap): Promise<PermissionMap> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.map;
  const [rows] = await requirePool().query<(RowDataPacket & { perfil: string; codigo: string })[]>(
    `SELECT p.nome AS perfil, pe.codigo
       FROM perfil_permissoes pp
       JOIN perfis p ON p.id = pp.perfil_id
       JOIN permissoes pe ON pe.id = pp.permissao_id
      WHERE p.condominio_id IS NULL`
  );
  if (!rows.length) return fallback;
  const map: PermissionMap = new Map();
  for (const { perfil, codigo } of rows) {
    const [resource, action] = codigo.split(':');
    if (!resource || !action) continue;
    if (!map.has(perfil)) map.set(perfil, new Map());
    const byResource = map.get(perfil)!;
    if (!byResource.has(resource)) byResource.set(resource, new Set());
    byResource.get(resource)!.add(action as PermissionAction);
  }
  // Cargos sem nenhuma permissão no banco (ex.: VISITANTE) continuam existindo, só que vazios.
  for (const role of fallback.keys()) if (!map.has(role)) map.set(role, new Map());
  cache = { map, at: Date.now() };
  return map;
}

/**
 * Grava a matriz nas tabelas. Por padrão só ACRESCENTA o que falta (não apaga ajustes feitos no banco).
 * Com reset = true, apaga as permissões dos cargos globais e regrava tudo igual à matriz.
 */
export async function syncPermissionsToDb(matrix: MatrixLike, { reset = false } = {}) {
  const pool = requirePool();
  const connection = await pool.getConnection();
  let inserted = 0;
  try {
    await connection.beginTransaction();
    const roleIds = new Map<string, number>();
    for (const role of Object.keys(matrix)) {
      const [found] = await connection.query<RowDataPacket[]>('SELECT id FROM perfis WHERE nome = ? AND condominio_id IS NULL LIMIT 1', [role]);
      if (found.length) roleIds.set(role, Number(found[0].id));
      else {
        const [res] = await connection.query<ResultSetHeader>(
          'INSERT INTO perfis (condominio_id, nome, descricao, created_at, updated_at) VALUES (NULL, ?, ?, NOW(), NOW())',
          [role, `Cargo ${role}`]
        );
        roleIds.set(role, res.insertId);
      }
    }

    const codes = new Set<string>();
    for (const resources of Object.values(matrix)) {
      for (const [resource, actions] of Object.entries(resources)) for (const action of actions ?? []) codes.add(`${resource}:${action}`);
    }
    const permissionIds = new Map<string, number>();
    const [existingPerms] = await connection.query<RowDataPacket[]>('SELECT id, codigo FROM permissoes');
    for (const row of existingPerms) permissionIds.set(String(row.codigo), Number(row.id));
    for (const code of codes) {
      if (permissionIds.has(code)) continue;
      const [resource, action] = code.split(':');
      const [res] = await connection.query<ResultSetHeader>('INSERT INTO permissoes (codigo, descricao) VALUES (?, ?)', [code, `${action} em ${resource}`]);
      permissionIds.set(code, res.insertId);
    }

    if (reset) {
      await connection.query('DELETE FROM perfil_permissoes WHERE perfil_id IN (?)', [[...roleIds.values()]]);
    }
    const [existingLinks] = await connection.query<RowDataPacket[]>('SELECT perfil_id, permissao_id FROM perfil_permissoes');
    const linked = new Set(existingLinks.map((row) => `${row.perfil_id}:${row.permissao_id}`));
    const toInsert: [number, number][] = [];
    for (const [role, resources] of Object.entries(matrix)) {
      const roleId = roleIds.get(role)!;
      for (const [resource, actions] of Object.entries(resources)) {
        for (const action of actions ?? []) {
          const permissionId = permissionIds.get(`${resource}:${action}`)!;
          const key = `${roleId}:${permissionId}`;
          if (linked.has(key)) continue;
          linked.add(key);
          toInsert.push([roleId, permissionId]);
        }
      }
    }
    for (let i = 0; i < toInsert.length; i += 500) {
      const chunk = toInsert.slice(i, i + 500).map(([perfilId, permissaoId]) => [null, perfilId, permissaoId, new Date(), new Date()]);
      await connection.query('INSERT INTO perfil_permissoes (condominio_id, perfil_id, permissao_id, created_at, updated_at) VALUES ?', [chunk]);
    }
    inserted = toInsert.length;
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  invalidatePermissionCache();
  return { inserted };
}

/** Na subida da API: se o banco ainda não tem permissões, grava a matriz padrão. */
export async function ensurePermissionsSeeded(matrix: MatrixLike) {
  const [rows] = await requirePool().query<RowDataPacket[]>('SELECT COUNT(*) AS total FROM perfil_permissoes');
  if (Number(rows[0].total) > 0) return { inserted: 0 };
  return syncPermissionsToDb(matrix);
}
