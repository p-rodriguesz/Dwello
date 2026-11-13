import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyRequest } from 'fastify';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { usuarios } from '../db/schema.js';
import { AppError } from '../errors/app-error.js';
import { auth } from '../lib/auth.js';

export async function requireSession(request: FastifyRequest) {
  if (!auth) {
    throw new AppError(503, 'Autenticação indisponível.', 'AUTH_UNAVAILABLE');
  }

  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers)
  });

  if (!session) {
    throw new AppError(401, 'Autenticação obrigatória.', 'UNAUTHENTICATED');
  }

  const [profile] = db
    ? await db.select({ ativo: usuarios.ativo }).from(usuarios).where(eq(usuarios.authUserId, session.user.id)).limit(1)
    : [];
  if (profile && !profile.ativo) {
    throw new AppError(403, 'Usuário inativo.', 'INACTIVE_USER');
  }

  (request as FastifyRequest & { authSession?: typeof session }).authSession = session;

  return session;
}
