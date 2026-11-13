import { and, eq, inArray } from 'drizzle-orm';
import { requireDb } from '../db/index.js';
import { condominios, moradores, ocorrencias, unidades } from '../db/schema.js';

export type ResourceName = 'condominios' | 'unidades' | 'moradores' | 'ocorrencias';
export type ResourceValues = Record<string, unknown>;
type Scope = { sql: string; params: number[] };
type ResourceService = {
  list: (scope?: Scope) => Promise<Record<string, unknown>[]>;
  get: (id: number, scope?: Scope) => Promise<Record<string, unknown> | undefined>;
  create: (values: ResourceValues) => Promise<Record<string, unknown> | undefined>;
  update: (id: number, values: ResourceValues, scope?: Scope) => Promise<Record<string, unknown> | undefined>;
  remove: (id: number, scope?: Scope) => Promise<boolean>;
};

const definitions: Record<ResourceName, { table: any; map: Record<string, string> }> = {
  condominios: { table: condominios, map: { nome: 'nome', endereco: 'endereco' } },
  unidades: { table: unidades, map: { condominio_id: 'condominioId', bloco: 'bloco', numero: 'numero' } },
  moradores: { table: moradores, map: { usuario_id: 'usuarioId', unidade_id: 'unidadeId', tipo_vinculo: 'tipoVinculo' } },
  ocorrencias: { table: ocorrencias, map: { unidade_id: 'unidadeId', usuario_id: 'usuarioId', titulo: 'titulo', descricao: 'descricao', status: 'status' } }
};

function scopeIds(scope?: Scope) {
  return scope?.params ?? [];
}

function condition(resource: ResourceName, id: number | undefined, ids: number[]) {
  const definition = definitions[resource];
  const table = definition.table;
  const parts = id === undefined ? [] : [eq(table.id, id)];
  if (resource === 'condominios') {
    if (ids.length) parts.push(inArray(table.id, ids));
  } else if (resource === 'unidades') {
    if (ids.length) parts.push(inArray(table.condominioId, ids));
  } else if (ids.length) {
    const unitIds = requireDb().select({ id: unidades.id }).from(unidades).where(inArray(unidades.condominioId, ids));
    parts.push(inArray(table.unidadeId, unitIds));
  } else if (scopeIds({ params: ids, sql: '' }).length === 0 && id !== undefined) {
    parts.push(eq(table.id, id));
  }
  return parts.length ? and(...parts) : undefined;
}

function toDb(resource: ResourceName, values: ResourceValues) {
  const map = definitions[resource].map;
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [map[key] ?? key, value]));
}

function toApi(resource: ResourceName, row: Record<string, unknown>) {
  const reverse = Object.fromEntries(Object.entries(definitions[resource].map).map(([api, db]) => [db, api]));
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [reverse[key] ?? key, value]));
}

function createResourceService(resource: ResourceName): ResourceService {
  return {
    async list(scope) {
      const db = requireDb();
      const rows = await db.select().from(definitions[resource].table).where(condition(resource, undefined, scopeIds(scope))).orderBy(definitions[resource].table.id);
      return rows.map((row) => toApi(resource, row));
    },
    async get(id, scope) {
      const db = requireDb();
      const [row] = await db.select().from(definitions[resource].table).where(condition(resource, id, scopeIds(scope))).limit(1);
      return row ? toApi(resource, row) : undefined;
    },
    async create(values) {
      const db = requireDb();
      const result = await db.insert(definitions[resource].table).values(toDb(resource, values));
      return this.get(Number(result[0].insertId));
    },
    async update(id, values, scope) {
      const db = requireDb();
      const result = await db.update(definitions[resource].table).set(toDb(resource, values)).where(condition(resource, id, scopeIds(scope)));
      if (!result[0].affectedRows) return undefined;
      return this.get(id, scope);
    },
    async remove(id, scope) {
      const db = requireDb();
      const result = await db.delete(definitions[resource].table).where(condition(resource, id, scopeIds(scope)));
      return result[0].affectedRows > 0;
    }
  };
}

export const recursosServices: Record<ResourceName, ResourceService> = {
  condominios: createResourceService('condominios'),
  unidades: createResourceService('unidades'),
  moradores: createResourceService('moradores'),
  ocorrencias: createResourceService('ocorrencias')
};
