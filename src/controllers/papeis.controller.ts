import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { getAuthorizationContext, RBAC_ROLES } from '../auth/rbac.js';
import type { RbacRole } from '../auth/rbac.js';
import { requirePool } from '../db/index.js';
import { AppError } from '../errors/app-error.js';
import { invalidData, invalidId, parseId } from './helpers.js';

type UsuarioPapel = RowDataPacket & { id: number; nome: string | null; email: string | null; ativo: number; papel: string | null };

// Papel "global" = linha de usuario_perfis com condominio_id NULL.
async function requireGlobalSuperAdmin(request: FastifyRequest) {
  const context = await getAuthorizationContext(request);
  if (!context.memberships.some((m) => m.perfil === 'SUPER_ADMIN' && m.condominio_id === null)) {
    throw new AppError(403, 'Apenas o SUPER_ADMIN pode gerenciar papéis.', 'FORBIDDEN');
  }
  return context;
}

export async function listarPapeis(request: FastifyRequest, reply: FastifyReply) {
  await requireGlobalSuperAdmin(request);
  const [rows] = await requirePool().query<UsuarioPapel[]>(
    `SELECT u.id, u.nome, u.email, u.ativo,
            (SELECT up.perfil FROM usuario_perfis up
              WHERE up.usuario_id = u.id AND up.ativo = 1
              ORDER BY up.condominio_id IS NOT NULL, up.id LIMIT 1) AS papel
       FROM usuarios u
      WHERE u.auth_user_id IS NOT NULL
      ORDER BY u.nome`
  );
  return reply.send(rows.map((row) => ({ ...row, ativo: Boolean(row.ativo) })));
}

export async function alterarPapel(request: FastifyRequest<{ Params: { id: string }; Body: { perfil?: unknown } }>, reply: FastifyReply) {
  const context = await requireGlobalSuperAdmin(request);
  const id = parseId(request.params.id);
  if (!id) return invalidId(reply);
  const perfil = request.body?.perfil;
  if (typeof perfil !== 'string' || !RBAC_ROLES.includes(perfil as RbacRole)) return invalidData(reply);
  if (id === context.usuarioId) {
    return reply.status(400).send({ error: 'Você não pode alterar o seu próprio papel.' });
  }

  const pool = requirePool();
  const [users] = await pool.query<RowDataPacket[]>('SELECT id FROM usuarios WHERE id = ?', [id]);
  if (!users.length) return reply.status(404).send({ error: 'Usuário não encontrado.' });

  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE usuario_perfis SET perfil = ?, ativo = 1 WHERE usuario_id = ? AND condominio_id IS NULL',
    [perfil, id]
  );
  if (!result.affectedRows) {
    await pool.query('INSERT INTO usuario_perfis (usuario_id, condominio_id, perfil, ativo) VALUES (?, NULL, ?, 1)', [id, perfil]);
  }
  return reply.send({ id, papel: perfil });
}
