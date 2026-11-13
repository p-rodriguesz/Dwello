import type { FastifyReply, FastifyRequest } from 'fastify';
import type { DwelloResource } from '../services/dwello.service.js';
import { createDwello, dwelloColumns, dwelloDefinitions, getDwello, listDwello, removeDwello, updateDwello, validateDwelloRelationships } from '../services/dwello.service.js';
import { authorizeResource } from '../auth/rbac.js';
import { invalidData, invalidId, isNonEmptyString, parseId } from './helpers.js';

type Body = Record<string, unknown>;
type IdRequest = FastifyRequest<{ Params: { id: string } }>;
type BodyRequest = FastifyRequest<{ Body: Body }>;
type UpdateRequest = FastifyRequest<{ Params: { id: string }; Body: Body }>;

type Field = { key: string; column: string; required?: boolean; type: 'text' | 'id' | 'number' | 'boolean' | 'date' };
type Config = { fields: Field[]; scoped: boolean; condominiumField?: string };

const id = (key: string, column = key, required = false) => ({ key, column, required, type: 'id' as const });
const text = (key: string, column = key, required = false) => ({ key, column, required, type: 'text' as const });
const number = (key: string, column = key, required = false) => ({ key, column, required, type: 'number' as const });
const booleanField = (key: string, column = key, required = false) => ({ key, column, required, type: 'boolean' as const });

const configs: Partial<Record<DwelloResource, Config>> = {
  blocos: { scoped: true, fields: [id('condominio_id', 'condominioId'), text('nome', 'nome', true), text('descricao')] },
  andares: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('bloco_id', 'blocoId'), number('numero', 'numero'), text('descricao')] },
  setores: { scoped: true, fields: [id('condominio_id', 'condominioId'), text('nome', 'nome', true), text('descricao')] },
  gestores: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('pessoa_id', 'pessoaId'), text('tipo_gestor', 'tipoGestor', true)] },
  mandatos: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('gestor_id', 'gestorId'), text('inicio_em', 'inicioEm'), text('fim_em', 'fimEm'), text('status')] },
  conselheiros: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('mandato_id', 'mandatoId'), id('pessoa_id', 'pessoaId'), text('cargo', 'cargo', true)] },
  administradoras: { scoped: false, fields: [text('nome', 'nome', true), text('cnpj'), text('email'), text('telefone')] },
  contratos_administracao: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('administradora_id', 'administradoraId'), text('inicio_em', 'inicioEm'), text('fim_em', 'fimEm'), text('valor_mensal', 'valorMensal'), text('status')] },
  condominio_administradoras: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('administradora_id', 'administradoraId'), text('inicio_em', 'inicioEm'), text('fim_em', 'fimEm')] },
  vagas_garagem: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('unidade_id', 'unidadeId'), text('identificacao'), text('tipo'), text('status')] },
  vinculos_vagas: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('vaga_id', 'vagaId'), id('unidade_id', 'unidadeId'), text('inicio_em', 'inicioEm'), text('fim_em', 'fimEm')] },
  veiculos: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('pessoa_id', 'pessoaId'), id('unidade_id', 'unidadeId'), text('placa'), text('modelo'), text('cor')] },
  enderecos: { scoped: false, fields: [text('logradouro', 'logradouro', true), text('numero', 'numero', true), text('complemento'), text('bairro'), text('cidade'), text('uf'), text('cep')] },
  enderecos_unidades: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('unidade_id', 'unidadeId'), id('endereco_id', 'enderecoId')] },
  enderecos_complementos: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('endereco_id', 'enderecoId'), text('tipo', 'tipo', true), text('valor', 'valor', true)] },
  visitantes: { scoped: true, fields: [id('condominio_id', 'condominioId'), text('nome', 'nome', true), text('documento'), text('telefone')] },
  autorizacoes_visita: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('unidade_id', 'unidadeId', true), id('visitante_id', 'visitanteId', true), id('autorizado_por_usuario_id', 'autorizadoPorUsuarioId'), text('inicio_previsto', 'inicioPrevisto'), text('fim_previsto', 'fimPrevisto'), text('status')] },
  visitas: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('autorizacao_id', 'autorizacaoId', true), text('entrada_em', 'entradaEm'), text('saida_em', 'saidaEm'), id('registrado_por_usuario_id', 'registradoPorUsuarioId')] },
  funcionarios_portaria: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('pessoa_id', 'pessoaId', true), text('matricula'), text('status')] },
  turnos_portaria: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('funcionario_portaria_id', 'funcionarioPortariaId', true), text('inicio_em', 'inicioEm', true), text('fim_em', 'fimEm'), id('posto_id', 'postoId')] },
  postos_portaria: { scoped: true, fields: [id('condominio_id', 'condominioId'), text('nome', 'nome', true), text('localizacao')] },
  encomendas: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('unidade_id', 'unidadeId', true), id('transportadora_id', 'transportadoraId'), id('recebido_por_usuario_id', 'recebidoPorUsuarioId'), text('codigo_rastreio', 'codigoRastreio'), text('recebida_em', 'recebidaEm'), text('status')] },
  transportadoras: { scoped: false, fields: [text('nome', 'nome', true), text('documento')] },
  retiradas_encomendas: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('encomenda_id', 'encomendaId', true), id('retirado_por_pessoa_id', 'retiradoPorPessoaId'), id('entregue_por_usuario_id', 'entreguePorUsuarioId'), text('retirada_em', 'retiradaEm')] },
  prestadores: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('pessoa_id', 'pessoaId', true), id('empresa_id', 'empresaId'), text('especialidade')] },
  empresas_prestadoras: { scoped: false, fields: [text('nome', 'nome', true), text('cnpj'), text('email'), text('telefone')] },
  acessos_prestadores: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('prestador_id', 'prestadorId', true), id('unidade_id', 'unidadeId'), text('entrada_em', 'entradaEm'), text('saida_em', 'saidaEm')] },
  credenciais_acesso: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('pessoa_id', 'pessoaId', true), text('tipo', 'tipo', true), text('codigo_hash', 'codigoHash', true), text('status')] },
  registros_acesso: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('credencial_id', 'credencialId'), id('dispositivo_id', 'dispositivoId'), text('evento'), text('ocorrido_em', 'ocorridoEm')] },
  dispositivos_acesso: { scoped: true, fields: [id('condominio_id', 'condominioId'), text('nome', 'nome', true), text('tipo'), text('localizacao')] },
  chaves: { scoped: true, fields: [id('condominio_id', 'condominioId'), text('identificacao', 'identificacao', true), text('localizacao'), text('status')] },
  retiradas_chaves: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('chave_id', 'chaveId', true), id('usuario_id', 'usuarioId'), text('retirada_em', 'retiradaEm'), text('devolucao_prevista_em', 'devolucaoPrevistaEm'), text('devolvida_em', 'devolvidaEm')] },
  historico_chaves: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('chave_id', 'chaveId', true), id('usuario_id', 'usuarioId'), text('evento', 'evento', true), text('registrado_em', 'registradoEm')] },
  ocorrencias_seguranca: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('unidade_id', 'unidadeId'), id('registrada_por_usuario_id', 'registradaPorUsuarioId'), text('titulo', 'titulo', true), text('descricao'), text('gravidade'), text('ocorrida_em', 'ocorridaEm'), text('status')] },
  envolvidos_ocorrencias: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('ocorrencia_id', 'ocorrenciaId', true), id('pessoa_id', 'pessoaId', true), text('papel')] },
  evidencias_ocorrencias: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('ocorrencia_id', 'ocorrenciaId', true), text('arquivo_url', 'arquivoUrl', true), text('tipo')] },
  cameras: { scoped: true, fields: [id('condominio_id', 'condominioId'), text('nome', 'nome', true), text('localizacao'), text('status')] },
  incidentes: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('camera_id', 'cameraId'), id('ocorrencia_id', 'ocorrenciaId'), text('descricao'), text('ocorrido_em', 'ocorridoEm'), text('status')] },
  registros_monitoramento: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('camera_id', 'cameraId'), id('incidente_id', 'incidenteId'), text('referencia_gravacao', 'referenciaGravacao'), text('registrado_em', 'registradoEm')] },
  comunicados: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('autor_usuario_id', 'autorUsuarioId'), text('titulo', 'titulo', true), text('conteudo', 'conteudo', true), text('publicado_em', 'publicadoEm'), text('status')] },
  destinatarios_comunicados: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('comunicado_id', 'comunicadoId', true), id('usuario_id', 'usuarioId'), booleanField('lido')] },
  leituras_comunicados: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('comunicado_id', 'comunicadoId', true), id('usuario_id', 'usuarioId'), text('lido_em', 'lidoEm')] },
  notificacoes: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('usuario_id', 'usuarioId'), text('titulo', 'titulo', true), text('mensagem', 'mensagem', true), text('canal'), text('lida_em', 'lidaEm'), text('criada_em', 'criadaEm')] },
  preferencias_notificacao: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('usuario_id', 'usuarioId', true), text('canal', 'canal', true), booleanField('habilitada', 'habilitada', true)] },
  historico_notificacoes: { scoped: true, fields: [id('condominio_id', 'condominioId'), id('notificacao_id', 'notificacaoId', true), text('status'), text('detalhes'), text('registrado_em', 'registradoEm')] }
};

// O tipo de cada campo segue a coluna real do banco (data, sim/não, número/decimal), mesmo que a config diga text().
// Sem isso, ex.: um texto numa coluna datetime fazia o Drizzle quebrar com erro 500.
function resolveConfig(resource: DwelloResource): Config {
  const config = configs[resource] ?? dynamicConfig(resource);
  const columns = dwelloColumns(resource);
  return {
    ...config,
    fields: config.fields.map((field): Field => {
      const column = columns[field.column] as { dataType?: string; columnType?: string } | undefined;
      if (!column || field.type === 'id') return field;
      if (column.dataType === 'date') return { ...field, type: 'date' };
      if (column.dataType === 'boolean') return { ...field, type: 'boolean' };
      if (column.dataType === 'number' || /Decimal|Double|Float|Real/.test(column.columnType ?? '')) return { ...field, type: 'number' };
      return field;
    })
  };
}

function dynamicConfig(resource: DwelloResource): Config {
  const scoped = dwelloDefinitions[resource].scoped;
  const columns = dwelloColumns(resource);
  const fields: Field[] = Object.entries(columns)
    .filter(([key]) => !['id', 'createdAt', 'updatedAt'].includes(key))
    .map(([key, column]) => {
      const type = key.endsWith('Id') ? 'id' : column.dataType === 'date' ? 'date' : column.dataType === 'number' || ['numero', 'ordem', 'quantidade', 'valor'].includes(key) ? 'number' : 'text';
      return { key: column.name, column: key, type, required: scoped && key === 'condominioId' } as Field;
    });
  return { scoped, fields };
}

const positive = (value: unknown) => Number.isSafeInteger(value) && Number(value) > 0;
const appendOnlyResources = new Set<DwelloResource>(['logs_auditoria', 'historico_alteracoes', 'sessoes_usuario', 'logs_integracao', 'execucoes_automacao']);

function normalize(config: Config, body: Body, partial = false) {
  const values: Record<string, unknown> = {};
  for (const field of config.fields) {
    const value = body[field.key] ?? body[field.column];
    if (value === undefined) {
      if (!partial && field.required) return null;
      continue;
    }
    if (field.type === 'id') {
      if (!positive(Number(value))) return null;
      values[field.column] = Number(value);
    } else if (field.type === 'number') {
      if (value === '' || value === null || !Number.isFinite(Number(value))) return null;
      values[field.column] = Number(value);
    } else if (field.type === 'date') {
      if (value === null || value === '') { if (field.required) return null; values[field.column] = null; continue; }
      if (typeof value !== 'string' && !(value instanceof Date)) return null;
      const parsed = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(parsed.getTime())) return null;
      values[field.column] = parsed;
    } else if (field.type === 'boolean') {
      if (typeof value !== 'boolean' && value !== 0 && value !== 1) return null;
      values[field.column] = Boolean(value);
    } else {
      if (field.required && !isNonEmptyString(value)) return null;
      if (value !== null && typeof value !== 'string') return null;
      values[field.column] = value === null ? null : String(value).trim();
    }
  }
  return values;
}

function condominiumId(resource: DwelloResource, values: Record<string, unknown>) {
  if (resource === 'administradoras' || resource === 'enderecos') return undefined;
  return Number(values.condominioId ?? values.condominio_id);
}

export function dwelloController(resource: DwelloResource) {
  const config = resolveConfig(resource);
  return {
    list: async (request: FastifyRequest, reply: FastifyReply) => {
      const access = await authorizeResource(request, resource, 'read');
      return reply.send(await listDwello(resource, access.condominioIds, access.condominioIds.length === 0));
    },
    get: async (request: IdRequest, reply: FastifyReply) => {
      const recordId = parseId(request.params.id);
      if (!recordId) return invalidId(reply);
      const existing = await getDwello(resource, recordId, [], true);
      if (!existing) return reply.status(404).send({ error: 'Registro não encontrado.' });
      const access = await authorizeResource(request, resource, 'read', config.scoped ? condominiumId(resource, existing) : undefined);
      const row = await getDwello(resource, recordId, access.condominioIds, access.condominioIds.length === 0);
      return row ? reply.send(row) : reply.status(404).send({ error: 'Registro não encontrado.' });
    },
    create: async (request: BodyRequest, reply: FastifyReply) => {
      const values = normalize(config, request.body ?? {});
      if (!values) return invalidData(reply);
      const access = await authorizeResource(request, resource, 'create', config.scoped ? condominiumId(resource, values) : undefined);
      await validateDwelloRelationships(resource, values);
      const row = await createDwello(resource, values);
      return reply.status(201).send(row);
    },
    update: async (request: UpdateRequest, reply: FastifyReply) => {
      if (appendOnlyResources.has(resource)) return reply.status(403).send({ error: 'Registros de auditoria e execução são imutáveis.' });
      const recordId = parseId(request.params.id);
      if (!recordId) return invalidId(reply);
      const existing = await getDwello(resource, recordId, [], true);
      if (!existing) return reply.status(404).send({ error: 'Registro não encontrado.' });
      const access = await authorizeResource(request, resource, 'update', config.scoped ? condominiumId(resource, existing) : undefined);
      const values = normalize(config, request.body ?? {}, true);
      if (!values || !Object.keys(values).length) return invalidData(reply);
      await validateDwelloRelationships(resource, { ...existing, ...values });
      const row = await updateDwello(resource, recordId, values, access.condominioIds, access.condominioIds.length === 0);
      return row ? reply.send(row) : reply.status(404).send({ error: 'Registro não encontrado.' });
    },
    remove: async (request: IdRequest, reply: FastifyReply) => {
      if (appendOnlyResources.has(resource)) return reply.status(403).send({ error: 'Registros de auditoria e execução não podem ser removidos.' });
      const recordId = parseId(request.params.id);
      if (!recordId) return invalidId(reply);
      const existing = await getDwello(resource, recordId, [], true);
      if (!existing) return reply.status(404).send({ error: 'Registro não encontrado.' });
      const access = await authorizeResource(request, resource, 'delete', config.scoped ? condominiumId(resource, existing) : undefined);
      const removed = await removeDwello(resource, recordId, access.condominioIds, access.condominioIds.length === 0);
      return removed ? reply.status(204).send() : reply.status(404).send({ error: 'Registro não encontrado.' });
    }
  };
}

/** Campos de formulário de um recurso (usado pela tela genérica do frontend). */
export function dwelloFormFields(resource: DwelloResource) {
  const config = resolveConfig(resource);
  return config.fields.map((field) => ({ key: field.key, type: field.type, required: Boolean(field.required) }));
}
