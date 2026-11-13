import { FastifyPluginAsync } from 'fastify';
import { condominiosController, moradoresController, ocorrenciasController, unidadesController } from '../controllers/recursos.controller.js';
import { idParamsSchema, resourceSchemas } from './schemas.js';
import { requireSession } from '../middleware/require-session.js';

const registrarCrud = (fastify: Parameters<FastifyPluginAsync>[0], rota: string, schema: object, controller: typeof condominiosController) => {
  fastify.get(rota, controller.list);
  fastify.get(`${rota}/:id`, { schema: { params: idParamsSchema } }, controller.get);
  fastify.post(rota, { schema: { body: schema } }, controller.create);
  fastify.put(`${rota}/:id`, { schema: { params: idParamsSchema, body: { ...schema, required: [] } } }, controller.update);
  fastify.delete(`${rota}/:id`, { schema: { params: idParamsSchema } }, controller.remove);
};

const recursosRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', requireSession);
  registrarCrud(fastify, '/condominios', resourceSchemas.condominios, condominiosController);
  registrarCrud(fastify, '/unidades', resourceSchemas.unidades, unidadesController);
  registrarCrud(fastify, '/moradores', resourceSchemas.moradores, moradoresController);
  registrarCrud(fastify, '/ocorrencias', resourceSchemas.ocorrencias, ocorrenciasController);
};

export default recursosRoutes;
