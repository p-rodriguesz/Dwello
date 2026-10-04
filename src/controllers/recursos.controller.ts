import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { FastifyReply, FastifyRequest } from 'fastify';
import { pool } from '../db';
import { databaseError, databaseUnavailable, invalidData, invalidId, isNonEmptyString, parseId } from './helpers';

type Body = Record<string, unknown>;
type Config = { table: 'condominios' | 'unidades' | 'moradores' | 'ocorrencias'; fields: readonly string[]; required: readonly string[]; normalize: (body: Body) => Record<string, unknown> | null };
type IdRequest = FastifyRequest<{ Params: { id: string } }>;
type BodyRequest = FastifyRequest<{ Body: Body }>;
type UpdateRequest = FastifyRequest<{ Params: { id: string }; Body: Body }>;

const tiposVinculo = new Set(['proprietario', 'inquilino', 'dependente']);
const statusOcorrencia = new Set(['aberta', 'em_andamento', 'resolvida', 'cancelada']);
const positivo = (value: unknown) => Number.isSafeInteger(value) && (value as number) > 0;
const textoOpcional = (value: unknown) => value === undefined || value === null || isNonEmptyString(value);

const configs = {
  condominios: { table: 'condominios', fields: ['nome', 'endereco'], required: ['nome'], normalize: (b) => isNonEmptyString(b.nome) && textoOpcional(b.endereco) ? { nome: b.nome.trim(), endereco: b.endereco === undefined ? null : b.endereco === null ? null : (b.endereco as string).trim() } : null },
  unidades: { table: 'unidades', fields: ['condominio_id', 'bloco', 'numero'], required: ['condominio_id', 'bloco', 'numero'], normalize: (b) => positivo(b.condominio_id) && isNonEmptyString(b.bloco) && isNonEmptyString(b.numero) ? { condominio_id: b.condominio_id, bloco: b.bloco.trim(), numero: b.numero.trim() } : null },
  moradores: { table: 'moradores', fields: ['usuario_id', 'unidade_id', 'tipo_vinculo'], required: ['usuario_id', 'unidade_id'], normalize: (b) => positivo(b.usuario_id) && positivo(b.unidade_id) && (b.tipo_vinculo === undefined || (typeof b.tipo_vinculo === 'string' && tiposVinculo.has(b.tipo_vinculo))) ? { usuario_id: b.usuario_id, unidade_id: b.unidade_id, ...(b.tipo_vinculo === undefined ? {} : { tipo_vinculo: b.tipo_vinculo }) } : null },
  ocorrencias: { table: 'ocorrencias', fields: ['unidade_id', 'usuario_id', 'titulo', 'descricao', 'status'], required: ['usuario_id', 'titulo', 'descricao'], normalize: (b) => (b.unidade_id === undefined || b.unidade_id === null || positivo(b.unidade_id)) && positivo(b.usuario_id) && isNonEmptyString(b.titulo) && isNonEmptyString(b.descricao) && (b.status === undefined || (typeof b.status === 'string' && statusOcorrencia.has(b.status))) ? { unidade_id: b.unidade_id ?? null, usuario_id: b.usuario_id, titulo: b.titulo.trim(), descricao: b.descricao.trim(), ...(b.status === undefined ? {} : { status: b.status }) } : null }
} as const satisfies Record<string, Config>;

function api(config: Config) {
  const list = async (_request: FastifyRequest, reply: FastifyReply) => {
    if (!pool) return databaseUnavailable(reply);
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${config.table} ORDER BY id`);
    return reply.send(rows);
  };
  const get = async (request: IdRequest, reply: FastifyReply) => {
    if (!pool) return databaseUnavailable(reply); const id = parseId(request.params.id); if (!id) return invalidId(reply);
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${config.table} WHERE id = ?`, [id]);
    return rows[0] ? reply.send(rows[0]) : reply.status(404).send({ error: 'Registro não encontrado.' });
  };
  const create = async (request: BodyRequest, reply: FastifyReply) => {
    if (!pool) return databaseUnavailable(reply); const values = config.normalize(request.body ?? {}); if (!values || Object.keys(request.body ?? {}).some((key) => !config.fields.includes(key))) return invalidData(reply);
    try { const columns = Object.keys(values); const [result] = await pool.execute<ResultSetHeader>(`INSERT INTO ${config.table} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`, Object.values(values) as any[]); const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${config.table} WHERE id = ?`, [result.insertId]); return reply.status(201).send(rows[0]); } catch (error) { return databaseError(reply, error); }
  };
  const update = async (request: UpdateRequest, reply: FastifyReply) => {
    if (!pool) return databaseUnavailable(reply); const id = parseId(request.params.id); if (!id) return invalidId(reply);
    const body = request.body ?? {}; if (!Object.keys(body).length || Object.keys(body).some((key) => !config.fields.includes(key))) return invalidData(reply);
    const [existing] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${config.table} WHERE id = ?`, [id]);
    if (!existing[0]) return reply.status(404).send({ error: 'Registro não encontrado.' });
    const normalized = config.normalize({ ...existing[0], ...body });
    if (!normalized) return invalidData(reply);
    const values = Object.fromEntries(Object.keys(body).map((key) => [key, normalized[key]]));
    try { const columns = Object.keys(values); const [result] = await pool.execute<ResultSetHeader>(`UPDATE ${config.table} SET ${columns.map((key) => `${key} = ?`).join(', ')} WHERE id = ?`, [...Object.values(values), id] as any[]); if (!result.affectedRows) return reply.status(404).send({ error: 'Registro não encontrado.' }); const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${config.table} WHERE id = ?`, [id]); return reply.send(rows[0]); } catch (error) { return databaseError(reply, error); }
  };
  const remove = async (request: IdRequest, reply: FastifyReply) => {
    if (!pool) return databaseUnavailable(reply); const id = parseId(request.params.id); if (!id) return invalidId(reply);
    try { const [result] = await pool.execute<ResultSetHeader>(`DELETE FROM ${config.table} WHERE id = ?`, [id]); return result.affectedRows ? reply.status(204).send() : reply.status(404).send({ error: 'Registro não encontrado.' }); } catch (error) { return databaseError(reply, error); }
  };
  return { list, get, create, update, remove };
}

export const condominiosController = api(configs.condominios);
export const unidadesController = api(configs.unidades);
export const moradoresController = api(configs.moradores);
export const ocorrenciasController = api(configs.ocorrencias);
