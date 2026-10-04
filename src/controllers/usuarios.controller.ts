import { createHash } from 'node:crypto';
import { eq, like, or } from 'drizzle-orm';
import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../db';
import { usuarios } from '../db/schema';
import { databaseError, databaseUnavailable, invalidData, invalidId, isNonEmptyString, parseId } from './helpers';

type UsuarioBody = { nome?: unknown; email?: unknown; senha?: unknown; perfil?: unknown; ativo?: unknown };
type IdRequest = FastifyRequest<{ Params: { id: string } }>;
type UsuarioRequest = FastifyRequest<{ Body: UsuarioBody }>;
type UsuarioUpdateRequest = FastifyRequest<{ Params: { id: string }; Body: UsuarioBody }>;
type BuscaRequest = FastifyRequest<{ Querystring: { q?: string } }>;

const perfis = new Set(['morador', 'sindico', 'porteiro', 'prestador', 'admin']);
const perfilValues = ['morador', 'sindico', 'porteiro', 'prestador', 'admin'] as const;

function isEmail(value: unknown): value is string {
  return isNonEmptyString(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hashSenha(senha: string) { return createHash('sha256').update(senha).digest('hex'); }
function publicUsuario(usuario: typeof usuarios.$inferSelect) {
  const { senhaHash: _senhaHash, ...dados } = usuario;
  return dados;
}

export async function listarUsuarios(request: BuscaRequest, reply: FastifyReply) {
  if (!db) return databaseUnavailable(reply);
  const q = request.query.q?.trim();
  const dados = await db.select().from(usuarios)
    .where(q ? or(like(usuarios.nome, `%${q}%`), like(usuarios.email, `%${q}%`)) : undefined);
  return reply.send(dados.map(publicUsuario));
}

export async function buscarUsuarioPorId(request: IdRequest, reply: FastifyReply) {
  if (!db) return databaseUnavailable(reply);
  const id = parseId(request.params.id);
  if (!id) return invalidId(reply);
  const [usuario] = await db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
  return usuario ? reply.send(publicUsuario(usuario)) : reply.status(404).send({ error: 'Usuário não encontrado.' });
}

export async function criarUsuario(request: UsuarioRequest, reply: FastifyReply) {
  if (!db) return databaseUnavailable(reply);
  const { nome, email, senha, perfil = 'morador', ativo = true } = request.body ?? {};
  if (!isNonEmptyString(nome) || !isEmail(email) || !isNonEmptyString(senha) || typeof perfil !== 'string' || !perfis.has(perfil) || typeof ativo !== 'boolean') return invalidData(reply);
  try {
    const result = await db.insert(usuarios).values({ nome: nome.trim(), email: email.trim().toLowerCase(), senhaHash: hashSenha(senha), perfil: perfil as typeof perfilValues[number], ativo });
    const [usuario] = await db.select().from(usuarios).where(eq(usuarios.id, Number(result[0].insertId))).limit(1);
    return reply.status(201).send(publicUsuario(usuario));
  } catch (error) { return databaseError(reply, error); }
}

export async function atualizarUsuario(request: UsuarioUpdateRequest, reply: FastifyReply) {
  if (!db) return databaseUnavailable(reply);
  const id = parseId(request.params.id);
  if (!id) return invalidId(reply);
  const body = request.body ?? {};
  const campos = Object.keys(body);
  if (!campos.length || campos.some((campo) => !['nome', 'email', 'senha', 'perfil', 'ativo'].includes(campo)) || (body.nome !== undefined && !isNonEmptyString(body.nome)) || (body.email !== undefined && !isEmail(body.email)) || (body.senha !== undefined && !isNonEmptyString(body.senha)) || (body.perfil !== undefined && (typeof body.perfil !== 'string' || !perfis.has(body.perfil))) || (body.ativo !== undefined && typeof body.ativo !== 'boolean')) return invalidData(reply);
  const values: Partial<typeof usuarios.$inferInsert> = {};
  if (body.nome !== undefined) values.nome = body.nome.trim();
  if (body.email !== undefined) values.email = body.email.trim().toLowerCase();
  if (body.senha !== undefined) values.senhaHash = hashSenha(body.senha);
  if (body.perfil !== undefined) values.perfil = body.perfil as typeof perfilValues[number];
  if (body.ativo !== undefined) values.ativo = body.ativo;
  try {
    const result = await db.update(usuarios).set(values).where(eq(usuarios.id, id));
    if (!result[0].affectedRows) return reply.status(404).send({ error: 'Usuário não encontrado.' });
    const [usuario] = await db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
    return reply.send(publicUsuario(usuario));
  } catch (error) { return databaseError(reply, error); }
}

export async function excluirUsuario(request: IdRequest, reply: FastifyReply) {
  if (!db) return databaseUnavailable(reply);
  const id = parseId(request.params.id);
  if (!id) return invalidId(reply);
  try {
    const result = await db.delete(usuarios).where(eq(usuarios.id, id));
    return result[0].affectedRows ? reply.status(204).send() : reply.status(404).send({ error: 'Usuário não encontrado.' });
  } catch (error) { return databaseError(reply, error); }
}
