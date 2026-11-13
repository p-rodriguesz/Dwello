import type { FastifyPluginAsync } from 'fastify';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { usuarioPerfis, usuarios } from '../db/schema.js';
import { AppError } from '../errors/app-error.js';
import { requireSession } from '../middleware/require-session.js';

const meRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/me', { onRequest: requireSession }, async (request) => {
    if (!db) throw new AppError(503, 'Banco de dados não configurado.', 'DATABASE_UNAVAILABLE');
    const session = (request as typeof request & { authSession?: { user: { id: string; name: string; email: string } } }).authSession;
    if (!session) throw new AppError(401, 'Autenticação obrigatória.', 'UNAUTHENTICATED');
    const [profile] = await db.select({ id: usuarios.id, nome: usuarios.nome, email: usuarios.email, perfil: usuarios.perfil, ativo: usuarios.ativo })
      .from(usuarios).where(eq(usuarios.authUserId, session.user.id)).limit(1);
    if (!profile) throw new AppError(404, 'Perfil não encontrado.', 'PROFILE_NOT_FOUND');
    const memberships = await db.select({ condominioId: usuarioPerfis.condominioId, perfil: usuarioPerfis.perfil })
      .from(usuarioPerfis).where(eq(usuarioPerfis.usuarioId, profile.id));
    return { ...profile, memberships };
  });
};

export default meRoutes;
