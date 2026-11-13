import type { FastifyReply, FastifyRequest } from 'fastify';
import type { RowDataPacket } from 'mysql2';
import type { ResourceName, ResourceValues } from '../services/recursos.service.js';
import { recursosServices } from '../services/recursos.service.js';
import { invalidData, invalidId, isNonEmptyString, parseId } from './helpers.js';
import { authorizeResource, resourceScope } from '../auth/rbac.js';
import { requirePool } from '../db/index.js';

type Body = Record<string, unknown>;
type ResourceConfig = { fields: readonly string[]; normalize: (body: Body) => ResourceValues | null };
type IdRequest = FastifyRequest<{ Params: { id: string } }>;
type BodyRequest = FastifyRequest<{ Body: Body }>;
type UpdateRequest = FastifyRequest<{ Params: { id: string }; Body: Body }>;
const tiposVinculo = new Set(['proprietario', 'inquilino', 'dependente']);
const statusOcorrencia = new Set(['aberta', 'em_andamento', 'resolvida', 'cancelada']);
const positivo = (value: unknown) => Number.isSafeInteger(value) && (value as number) > 0;
const textoOpcional = (value: unknown) => value === undefined || value === null || isNonEmptyString(value);

const configs: Record<ResourceName, ResourceConfig> = {
  condominios: { fields: ['nome', 'endereco'], normalize: (b) => isNonEmptyString(b.nome) && textoOpcional(b.endereco) ? { nome: b.nome.trim(), endereco: b.endereco == null ? null : (b.endereco as string).trim() } : null },
  unidades: { fields: ['condominio_id', 'bloco', 'numero'], normalize: (b) => positivo(b.condominio_id) && isNonEmptyString(b.bloco) && isNonEmptyString(b.numero) ? { condominio_id: b.condominio_id, bloco: b.bloco.trim(), numero: b.numero.trim() } : null },
  moradores: { fields: ['usuario_id', 'unidade_id', 'tipo_vinculo'], normalize: (b) => positivo(b.usuario_id) && positivo(b.unidade_id) && (b.tipo_vinculo === undefined || (typeof b.tipo_vinculo === 'string' && tiposVinculo.has(b.tipo_vinculo))) ? { usuario_id: b.usuario_id, unidade_id: b.unidade_id, ...(b.tipo_vinculo === undefined ? {} : { tipo_vinculo: b.tipo_vinculo }) } : null },
  ocorrencias: { fields: ['unidade_id', 'usuario_id', 'titulo', 'descricao', 'status'], normalize: (b) => (b.unidade_id == null || positivo(b.unidade_id)) && positivo(b.usuario_id) && isNonEmptyString(b.titulo) && isNonEmptyString(b.descricao) && (b.status === undefined || (typeof b.status === 'string' && statusOcorrencia.has(b.status))) ? { unidade_id: b.unidade_id ?? null, usuario_id: b.usuario_id, titulo: b.titulo.trim(), descricao: b.descricao.trim(), ...(b.status === undefined ? {} : { status: b.status }) } : null }
};

async function condominiumId(resource: ResourceName, values: Record<string, unknown>) {
  if (resource === 'condominios') return Number(values.id);
  if (resource === 'unidades') return Number(values.condominio_id);
  const unitId = Number(values.unidade_id);
  if (!Number.isSafeInteger(unitId) || unitId < 1) return undefined;
  const [rows] = await requirePool().query<(RowDataPacket & { condominio_id: number })[]>('SELECT condominio_id FROM unidades WHERE id = ?', [unitId]);
  return rows[0]?.condominio_id;
}

function api(resource: ResourceName) {
  const config = configs[resource];
  const service = recursosServices[resource];
  return {
    list: async (request: FastifyRequest, reply: FastifyReply) => {
      const access = await authorizeResource(request, resource, 'read');
      const scope = access.condominioIds.length ? resourceScope(resource, access.condominioIds) : undefined;
      return reply.send(await service.list(scope));
    },
    get: async (request: IdRequest, reply: FastifyReply) => {
      const id = parseId(request.params.id);
      if (!id) return invalidId(reply);
      const existing = await service.get(id);
      if (!existing) return reply.status(404).send({ error: 'Registro não encontrado.' });
      const access = await authorizeResource(request, resource, 'read', await condominiumId(resource, existing));
      const scope = access.condominioIds.length ? resourceScope(resource, access.condominioIds) : undefined;
      const row = await service.get(id, scope);
      return row ? reply.send(row) : reply.status(404).send({ error: 'Registro não encontrado.' });
    },
    create: async (request: BodyRequest, reply: FastifyReply) => {
      const body = request.body ?? {};
      const values = config.normalize(body);
      if (!values || Object.keys(body).some((key) => !config.fields.includes(key))) return invalidData(reply);
      await authorizeResource(request, resource, 'create', await condominiumId(resource, values));
      return reply.status(201).send(await service.create(values));
    },
    update: async (request: UpdateRequest, reply: FastifyReply) => {
      const id = parseId(request.params.id);
      if (!id) return invalidId(reply);
      const body = request.body ?? {};
      if (!Object.keys(body).length || Object.keys(body).some((key) => !config.fields.includes(key))) return invalidData(reply);
      const existing = await service.get(id);
      if (!existing) return reply.status(404).send({ error: 'Registro não encontrado.' });
      const access = await authorizeResource(request, resource, 'update', await condominiumId(resource, existing));
      const normalized = config.normalize({ ...existing, ...body });
      if (!normalized) return invalidData(reply);
      const values = Object.fromEntries(Object.keys(body).map((key) => [key, normalized[key]]));
      const scope = access.condominioIds.length ? resourceScope(resource, access.condominioIds) : undefined;
      const row = await service.update(id, values, scope);
      return row ? reply.send(row) : reply.status(404).send({ error: 'Registro não encontrado.' });
    },
    remove: async (request: IdRequest, reply: FastifyReply) => {
      const id = parseId(request.params.id);
      if (!id) return invalidId(reply);
      const existing = await service.get(id);
      if (!existing) return reply.status(404).send({ error: 'Registro não encontrado.' });
      const access = await authorizeResource(request, resource, 'delete', await condominiumId(resource, existing));
      const scope = access.condominioIds.length ? resourceScope(resource, access.condominioIds) : undefined;
      const removed = await service.remove(id, scope);
      return removed ? reply.status(204).send() : reply.status(404).send({ error: 'Registro não encontrado.' });
    }
  };
}

export const condominiosController = api('condominios');
export const unidadesController = api('unidades');
export const moradoresController = api('moradores');
export const ocorrenciasController = api('ocorrencias');
