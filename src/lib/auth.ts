import { betterAuth } from 'better-auth';
import { eq } from 'drizzle-orm';
import { env } from '../config/env.js';
import { db, pool } from '../db/index.js';
import { usuarioPerfis, usuarios } from '../db/schema.js';

const socialProviders = {
  ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET
        }
      }
    : {}),
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }
      }
    : {})
};

export const auth = pool && env.betterAuthSecret
  ? betterAuth({
      database: pool,
      secret: env.betterAuthSecret,
      baseURL: env.betterAuthUrl,
      trustedOrigins: [env.betterAuthUrl, env.frontendUrl],
      emailAndPassword: {
        enabled: true
      },
      databaseHooks: {
        user: {
          create: {
            after: async (user) => {
              if (!db) return;

              const [profile] = await db
                .select()
                .from(usuarios)
                .where(eq(usuarios.email, user.email))
                .limit(1);

              let usuarioId: number;
              if (profile) {
                await db
                  .update(usuarios)
                  .set({ authUserId: user.id, nome: user.name, ativo: true })
                  .where(eq(usuarios.id, profile.id));
                usuarioId = profile.id;
              } else {
                const [inserted] = await db.insert(usuarios).values({
                  authUserId: user.id,
                  nome: user.name,
                  email: user.email,
                  senhaHash: null,
                  perfil: 'morador',
                  ativo: true
                }).$returningId();
                usuarioId = inserted.id;
              }

              // O RBAC lê os papéis de usuario_perfis; sem uma linha aqui o usuário recebe 403 em tudo.
              const [membership] = await db
                .select({ id: usuarioPerfis.id })
                .from(usuarioPerfis)
                .where(eq(usuarioPerfis.usuarioId, usuarioId))
                .limit(1);
              if (!membership) {
                await db.insert(usuarioPerfis).values({ usuarioId, condominioId: null, perfil: 'MORADOR', ativo: true });
              }
            }
          },
          delete: {
            after: async (user) => {
              if (!db) return;
              await db
                .update(usuarios)
                .set({ ativo: false })
                .where(eq(usuarios.authUserId, user.id));
            }
          }
        }
      },
      ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {})
    })
  : null;
