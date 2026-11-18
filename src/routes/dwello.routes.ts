import type { FastifyPluginAsync } from 'fastify';
import { requireSession } from '../middleware/require-session.js';
import { dwelloController } from '../controllers/dwello.controller.js';
import { NEW_DWELLO_RESOURCES } from '../services/dwello.service.js';
import type { DwelloResource } from '../services/dwello.service.js';
import { idParamsSchema } from './schemas.js';

const resources: DwelloResource[] = [
  'blocos', 'andares', 'setores', 'gestores', 'mandatos', 'conselheiros',
  'administradoras', 'contratos_administracao', 'condominio_administradoras',
  'vagas_garagem', 'vinculos_vagas', 'veiculos', 'enderecos', 'enderecos_unidades', 'enderecos_complementos',
  'visitantes', 'autorizacoes_visita', 'visitas', 'funcionarios_portaria', 'turnos_portaria', 'postos_portaria',
  'encomendas', 'transportadoras', 'retiradas_encomendas', 'prestadores', 'empresas_prestadoras', 'acessos_prestadores',
  'credenciais_acesso', 'registros_acesso', 'dispositivos_acesso', 'chaves', 'retiradas_chaves', 'historico_chaves',
  'ocorrencias_seguranca', 'envolvidos_ocorrencias', 'evidencias_ocorrencias', 'cameras', 'incidentes', 'registros_monitoramento',
  'evidencias_manutencao',
  'comunicados', 'destinatarios_comunicados', 'leituras_comunicados', 'notificacoes', 'preferencias_notificacao', 'historico_notificacoes',
  ...NEW_DWELLO_RESOURCES
];

const dwelloRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', requireSession);
  for (const resource of resources) {
    const controller = dwelloController(resource);
    const path = `/${resource.replaceAll('_', '-')}`;
    fastify.get(path, controller.list);
    fastify.get(`${path}/:id`, { schema: { params: idParamsSchema } }, controller.get);
    fastify.post(path, controller.create);
    fastify.put(`${path}/:id`, { schema: { params: idParamsSchema } }, controller.update);
    fastify.delete(`${path}/:id`, { schema: { params: idParamsSchema } }, controller.remove);
  }
};

export default dwelloRoutes;
