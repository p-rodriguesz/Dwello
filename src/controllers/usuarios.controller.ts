import type { FastifyReply, FastifyRequest } from 'fastify';
import { usuarios } from '../db/schema.js';
import {
  atualizarUsuario as atualizarUsuarioService,
  buscarUsuarioPorId as buscarUsuarioPorIdService,
  criarUsuario as criarUsuarioService,
  excluirUsuario as excluirUsuarioService,
  listarUsuarios as listarUsuariosService
} from '../services/usuarios.service.js';
import { invalidData, invalidId, isNonEmptyString, parseId } from './helpers.js';

type UsuarioBody = { nome?: unknown; email?: unknown; perfil?: unknown; ativo?: unknown };
type IdRequest = FastifyRequest<{ Params: { id: string } }>;
type UsuarioRequest = FastifyRequest<{ Body: UsuarioBody }>;
type UsuarioUpdateRequest = FastifyRequest<{ Params: { id: string }; Body: UsuarioBody }>;
type BuscaRequest = FastifyRequest<{ Querystring: { q?: string; page?: string; pageSize?: string } }>;

const perfis = new Set([
  'SUPER_ADMIN',
  'ADMINISTRADORA',
  'SINDICO',
  'SUBSINDICO',
  'CONSELHEIRO',
  'PORTEIRO',
  'ZELADOR',
  'FUNCIONARIO',
  'PROPRIETARIO',
  'MORADOR',
  'VISITANTE',
  'PRESTADOR'
]);
const perfilValues = [
  'SUPER_ADMIN',
  'ADMINISTRADORA',
  'SINDICO',
  'SUBSINDICO',
  'CONSELHEIRO',
  'PORTEIRO',
  'ZELADOR',
  'FUNCIONARIO',
  'PROPRIETARIO',
  'MORADOR',
  'VISITANTE',
  'PRESTADOR'
] as const;

function isEmail(value: unknown): value is string {
  return isNonEmptyString(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function publicUsuario(usuario: typeof usuarios.$inferSelect) {
  const { senhaHash: _senhaHash, authUserId: _authUserId, ...dados } = usuario;
  return dados;
}

export async function listarUsuarios(request: BuscaRequest, reply: FastifyReply) {
  const page = Math.max(1, Number.parseInt(request.query.page ?? '1', 10) || 1);
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(request.query.pageSize ?? '100', 10) || 100));
  const dados = await listarUsuariosService(request.query.q);
  const start = (page - 1) * pageSize;
  reply.header('X-Total-Count', String(dados.length));
  reply.header('X-Page', String(page));
  reply.header('X-Page-Size', String(pageSize));
  return reply.send(dados.slice(start, start + pageSize).map(publicUsuario));
}

export async function buscarUsuarioPorId(request: IdRequest, reply: FastifyReply) {
  const id = parseId(request.params.id);
  if (!id) return invalidId(reply);
  const usuario = await buscarUsuarioPorIdService(id);
  return usuario ? reply.send(publicUsuario(usuario)) : reply.status(404).send({ error: 'Usuário não encontrado.' });
}

export async function criarUsuario(request: UsuarioRequest, reply: FastifyReply) {
  const { nome, email, perfil = 'MORADOR', ativo = true } = request.body ?? {};
  if (!isNonEmptyString(nome) || !isEmail(email) || typeof perfil !== 'string' || !perfis.has(perfil) || typeof ativo !== 'boolean') {
    return invalidData(reply);
  }

  const usuario = await criarUsuarioService({
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    perfil: perfil as typeof perfilValues[number],
    ativo
  });

  return reply.status(201).send(publicUsuario(usuario!));
}

export async function atualizarUsuario(request: UsuarioUpdateRequest, reply: FastifyReply) {
  const id = parseId(request.params.id);
  if (!id) return invalidId(reply);

  const body = request.body ?? {};
  const campos = Object.keys(body);
  if (
    !campos.length ||
    campos.some((campo) => !['nome', 'email', 'perfil', 'ativo'].includes(campo)) ||
    (body.nome !== undefined && !isNonEmptyString(body.nome)) ||
    (body.email !== undefined && !isEmail(body.email)) ||
    (body.perfil !== undefined && (typeof body.perfil !== 'string' || !perfis.has(body.perfil))) ||
    (body.ativo !== undefined && typeof body.ativo !== 'boolean')
  ) {
    return invalidData(reply);
  }

  const values: Partial<typeof usuarios.$inferInsert> = {};
  if (body.nome !== undefined) values.nome = body.nome.trim();
  if (body.email !== undefined) values.email = body.email.trim().toLowerCase();
  if (body.perfil !== undefined) values.perfil = body.perfil as typeof perfilValues[number];
  if (body.ativo !== undefined) values.ativo = body.ativo;

  const usuario = await atualizarUsuarioService(id, values);
  return usuario ? reply.send(publicUsuario(usuario)) : reply.status(404).send({ error: 'Usuário não encontrado.' });
}

export async function excluirUsuario(request: IdRequest, reply: FastifyReply) {
  const id = parseId(request.params.id);
  if (!id) return invalidId(reply);
  const removido = await excluirUsuarioService(id);
  return removido ? reply.status(204).send() : reply.status(404).send({ error: 'Usuário não encontrado.' });
}
