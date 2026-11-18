import { FastifyPluginAsync } from 'fastify';
import {
  atualizarUsuario,
  buscarUsuarioPorId,
  criarUsuario,
  excluirUsuario,
  listarUsuarios
} from '../controllers/usuarios.controller.js';
import { alterarPapel, listarPapeis } from '../controllers/papeis.controller.js';
import { idParamsSchema, usuarioCreateSchema, usuarioQuerySchema, usuarioUpdateSchema } from './schemas.js';
import { requireSession } from '../middleware/require-session.js';
import { requireUserPermission } from '../auth/rbac.js';

const usuariosRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', requireSession);
  // Gestão de papéis (só SUPER_ADMIN global; checado no controller).
  fastify.get('/usuarios/papeis', listarPapeis);
  fastify.put('/usuarios/:id/papel', {
    schema: { params: idParamsSchema, body: { type: 'object', required: ['perfil'], additionalProperties: false, properties: { perfil: { type: 'string' }, condominio_id: { type: ['integer', 'null'], minimum: 1 } } } }
  }, alterarPapel);
  fastify.addHook('onRequest', requireUserPermission);
  fastify.get('/usuarios', { schema: { querystring: usuarioQuerySchema } }, listarUsuarios);
  fastify.get('/usuarios/:id', { schema: { params: idParamsSchema } }, buscarUsuarioPorId);
  fastify.post('/usuarios', { schema: { body: usuarioCreateSchema } }, criarUsuario);
  fastify.put('/usuarios/:id', { schema: { params: idParamsSchema, body: usuarioUpdateSchema } }, atualizarUsuario);
  fastify.delete('/usuarios/:id', { schema: { params: idParamsSchema } }, excluirUsuario);
};

export default usuariosRoutes;
