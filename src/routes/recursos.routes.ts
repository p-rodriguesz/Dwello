import { FastifyPluginAsync } from 'fastify';
import { condominiosController, moradoresController, ocorrenciasController, unidadesController } from '../controllers/recursos.controller';

const registrarCrud = (fastify: Parameters<FastifyPluginAsync>[0], rota: string, controller: typeof condominiosController) => {
  fastify.get(rota, controller.list);
  fastify.get(`${rota}/:id`, controller.get);
  fastify.post(rota, controller.create);
  fastify.put(`${rota}/:id`, controller.update);
  fastify.delete(`${rota}/:id`, controller.remove);
};

const recursosRoutes: FastifyPluginAsync = async (fastify) => {
  registrarCrud(fastify, '/condominios', condominiosController);
  registrarCrud(fastify, '/unidades', unidadesController);
  registrarCrud(fastify, '/moradores', moradoresController);
  registrarCrud(fastify, '/ocorrencias', ocorrenciasController);
};

export default recursosRoutes;
