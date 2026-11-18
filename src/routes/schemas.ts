export const idParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: { id: { type: 'string', pattern: '^[1-9][0-9]*$' } },
  additionalProperties: false
} as const;

const usuarioPerfis = [
  'SUPER_ADMIN',
  'ADMINISTRADORA',
  'SINDICO',
  'SUBSINDICO',
  'CONSELHEIRO',
  'PORTEIRO',
  'ZELADOR',
  'FUNCIONARIO',
  'PROPRIETARIO',
  'MORADOR',
  'VISITANTE',
  'PRESTADOR'
] as const;

export const usuarioCreateSchema = {
  type: 'object',
  required: ['nome', 'email'],
  additionalProperties: false,
  properties: {
    nome: { type: 'string', minLength: 1 },
    email: { type: 'string', minLength: 3 },
    perfil: { type: 'string', enum: usuarioPerfis },
    ativo: { type: 'boolean' }
  }
} as const;

export const usuarioUpdateSchema = {
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: {
    nome: { type: 'string', minLength: 1 },
    email: { type: 'string', minLength: 3 },
    perfil: { type: 'string', enum: usuarioPerfis },
    ativo: { type: 'boolean' }
  }
} as const;

export const usuarioQuerySchema = {
  type: 'object',
  additionalProperties: false,
  properties: { q: { type: 'string' } }
} as const;

export const resourceSchemas = {
  condominios: {
    type: 'object',
    additionalProperties: false,
    properties: { nome: { type: 'string', minLength: 1 }, endereco: { type: ['string', 'null'] } }
  },
  unidades: {
    type: 'object',
    additionalProperties: false,
    required: ['condominio_id', 'bloco', 'numero'],
    properties: { condominio_id: { type: 'integer', minimum: 1 }, bloco: { type: 'string', minLength: 1 }, numero: { type: 'string', minLength: 1 } }
  },
  moradores: {
    type: 'object',
    additionalProperties: false,
    required: ['usuario_id', 'unidade_id'],
    properties: { usuario_id: { type: 'integer', minimum: 1 }, unidade_id: { type: 'integer', minimum: 1 }, tipo_vinculo: { type: 'string', enum: ['proprietario', 'inquilino', 'dependente'] } }
  },
  ocorrencias: {
    type: 'object',
    additionalProperties: false,
    required: ['usuario_id', 'titulo', 'descricao'],
    properties: { unidade_id: { type: ['integer', 'null'], minimum: 1 }, usuario_id: { type: 'integer', minimum: 1 }, titulo: { type: 'string', minLength: 1 }, descricao: { type: 'string', minLength: 1 }, status: { type: 'string', enum: ['aberta', 'em_andamento', 'resolvida', 'cancelada'] } }
  }
} as const;
