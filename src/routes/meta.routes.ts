import type { FastifyPluginAsync } from 'fastify';
import { dwelloFormFields } from '../controllers/dwello.controller.js';
import { requireSession } from '../middleware/require-session.js';
import { getUserPermissions } from '../auth/rbac.js';
import { dwelloDefinitions } from '../services/dwello.service.js';
import type { DwelloResource } from '../services/dwello.service.js';

type Field = { key: string; type: 'text' | 'id' | 'number' | 'boolean' | 'date'; required: boolean };

// Recursos "principais" têm controller próprio (recursos.controller.ts).
const coreFields: Record<string, Field[]> = {
  condominios: [{ key: 'nome', type: 'text', required: true }, { key: 'endereco', type: 'text', required: false }],
  unidades: [{ key: 'condominio_id', type: 'id', required: true }, { key: 'bloco', type: 'text', required: true }, { key: 'numero', type: 'text', required: true }],
  moradores: [{ key: 'usuario_id', type: 'id', required: true }, { key: 'unidade_id', type: 'id', required: true }, { key: 'tipo_vinculo', type: 'text', required: false }],
  ocorrencias: [{ key: 'usuario_id', type: 'id', required: true }, { key: 'unidade_id', type: 'id', required: false }, { key: 'titulo', type: 'text', required: true }, { key: 'descricao', type: 'text', required: true }]
};

const metaRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', requireSession);

  fastify.get('/me/permissoes', async (request) => getUserPermissions(request));

  fastify.get<{ Params: { recurso: string } }>('/meta/recursos/:recurso', async (request, reply) => {
    const { recurso } = request.params;
    if (coreFields[recurso]) return { recurso, fields: coreFields[recurso] };
    if (!(recurso in dwelloDefinitions)) return reply.status(404).send({ error: 'Recurso desconhecido.' });
    return { recurso, fields: dwelloFormFields(recurso as DwelloResource) };
  });
};

export default metaRoutes;
