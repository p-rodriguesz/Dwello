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
  fastify.post('/uploads/visitantes/:visitanteId/foto', uploadController.visitorPhoto);
  fastify.post('/uploads/encomendas/:encomendaId/foto', uploadController.packagePhoto);
  fastify.post('/uploads/pagamentos-fornecedores/:pagamentoId/comprovante', uploadController.paymentReceipt);
  fastify.get('/uploads/documentos/:id', { schema: { params: idSchema } }, uploadController.documentFile);
  fastify.get('/uploads/anexos-manifestacoes/:id', { schema: { params: idSchema } }, uploadController.manifestationFile);
  fastify.get('/uploads/evidencias-ocorrencias/:id', { schema: { params: idSchema } }, uploadController.occurrenceFile);
  fastify.get('/uploads/visitantes/:id/foto', { schema: { params: idSchema } }, uploadController.visitorPhotoFile);
  fastify.get('/uploads/encomendas/:id/foto', { schema: { params: idSchema } }, uploadController.packagePhotoFile);
  fastify.get('/uploads/pagamentos-fornecedores/:id/comprovante', { schema: { params: idSchema } }, uploadController.paymentReceiptFile);
};

export default uploadsRoutes;
