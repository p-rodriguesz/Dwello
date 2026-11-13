import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import { databaseError, AppError } from './errors/app-error.js';
import { pool } from './db/index.js';
import statusRoutes from './routes/status.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import recursosRoutes from './routes/recursos.routes.js';
import authRoutes from './routes/auth.routes.js';
import dwelloRoutes from './routes/dwello.routes.js';
import uploadsRoutes from './routes/uploads.routes.js';
import meRoutes from './routes/me.routes.js';
import metaRoutes from './routes/meta.routes.js';
import { RBAC_MATRIX } from './auth/rbac.js';
import { ensurePermissionsSeeded } from './auth/permissions-store.js';
import { MAX_UPLOAD_SIZE } from './services/upload.service.js';

export const app = Fastify({
  logger: true
});

app.setErrorHandler((error, request, reply) => {
  if (reply.sent) return;

  const fastifyError = error as { validation?: unknown };
  if (fastifyError.validation) {
    return reply.status(400).send({ error: 'Dados inválidos.' });
  }

  if ((error as { code?: string }).code === 'FST_REQ_FILE_TOO_LARGE') {
    return reply.status(413).send({ error: 'Arquivo excede o tamanho máximo permitido.', code: 'FILE_TOO_LARGE' });
  }

  if ((error as { code?: string }).code === 'FST_INVALID_MULTIPART_CONTENT_TYPE') {
    return reply.status(400).send({ error: 'A requisição deve usar multipart/form-data.', code: 'INVALID_MULTIPART' });
  }

  const mappedDatabaseError = databaseError(error);
  if (mappedDatabaseError) {
    return reply.status(mappedDatabaseError.statusCode).send({
      error: mappedDatabaseError.message,
      code: mappedDatabaseError.code
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ error: error.message, code: error.code });
  }

  request.log.error({ err: error }, 'Unhandled request error');
  return reply.status(500).send({ error: 'Erro interno do servidor.' });
});

app.setNotFoundHandler((_request, reply) => {
  return reply.status(404).send({ error: 'Rota não encontrada.' });
});

app.register(usuariosRoutes);
app.register(recursosRoutes);
app.register(authRoutes);
app.register(multipart, { limits: { files: 1, fileSize: MAX_UPLOAD_SIZE, parts: 1 } });
app.register(uploadsRoutes);
app.register(meRoutes);
app.register(metaRoutes);
app.register(dwelloRoutes);
app.register(statusRoutes);

// Na primeira subida, grava as permissões padrão nas tabelas perfis/permissoes/perfil_permissoes.
app.addHook('onReady', async () => {
  if (!pool) return;
  try {
    const { inserted } = await ensurePermissionsSeeded(RBAC_MATRIX);
    if (inserted) app.log.info(`Permissões padrão gravadas no banco (${inserted} vínculos).`);
  } catch (error) {
    app.log.warn({ err: error }, 'Não foi possível gravar as permissões padrão; usando a matriz em memória.');
  }
});

app.addHook('onClose', async () => {
  await pool?.end();
});

