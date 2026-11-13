import type { FastifyPluginAsync } from 'fastify';
import { requireSession } from '../middleware/require-session.js';
import { uploadController } from '../controllers/upload.controller.js';

const idSchema = {
  type: 'object',
  required: ['id'],
  properties: { id: { type: 'string', pattern: '^[1-9][0-9]*$' } }
} as const;

const uploadsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', requireSession);
  fastify.post('/uploads/documentos/:documentoId', uploadController.document);
  fastify.post('/uploads/manifestacoes/:manifestacaoId/anexos', uploadController.manifestation);
  fastify.post('/uploads/ocorrencias-seguranca/:ocorrenciaId/evidencias', uploadController.occurrence);
  fastify.get('/uploads/documentos/:id', { schema: { params: idSchema } }, uploadController.documentFile);
  fastify.get('/uploads/anexos-manifestacoes/:id', { schema: { params: idSchema } }, uploadController.manifestationFile);
  fastify.get('/uploads/evidencias-ocorrencias/:id', { schema: { params: idSchema } }, uploadController.occurrenceFile);
};

export default uploadsRoutes;
