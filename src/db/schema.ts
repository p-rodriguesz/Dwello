import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  datetime,
  decimal,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from 'drizzle-orm/mysql-core';

export const perfisRbac = [
  'SUPER_ADMIN', 'ADMINISTRADORA', 'SINDICO', 'SUBSINDICO', 'CONSELHEIRO',
  'PORTEIRO', 'ZELADOR', 'FUNCIONARIO', 'PROPRIETARIO', 'MORADOR',
  'VISITANTE', 'PRESTADOR'
] as const;

export const condominios = mysqlTable('condominios', {
  id: int('id').autoincrement().primaryKey(),
  nome: varchar('nome', { length: 150 }).notNull(),
  endereco: varchar('endereco', { length: 255 }),
  criadoEm: timestamp('criado_em').defaultNow()
});

export const unidades = mysqlTable(
  'unidades',
  {
    id: int('id').autoincrement().primaryKey(),
    condominioId: int('condominio_id')
      .notNull()
      .references(() => condominios.id),
    bloco: varchar('bloco', { length: 50 }).notNull(),
    numero: varchar('numero', { length: 20 }).notNull()
  },
  (table) => [
    uniqueIndex('condominio_id').on(
      table.condominioId,
      table.bloco,
      table.numero
    )
  ]
);

export const usuarios = mysqlTable('usuarios', {
  id: int('id').autoincrement().primaryKey(),
  nome: varchar('nome', { length: 150 }).notNull(),
  email: varchar('email', { length: 180 }).notNull().unique(),
  authUserId: varchar('auth_user_id', { length: 64 }).unique(),
  senhaHash: varchar('senha_hash', { length: 255 }),
  perfil: mysqlEnum('perfil', [
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
  ])
    .notNull()
    .default('MORADOR'),
  ativo: boolean('ativo').notNull().default(true),
  criadoEm: timestamp('criado_em').defaultNow()
});

export const usuarioPerfis = mysqlTable(
  'usuario_perfis',
  {
    id: int('id').autoincrement().primaryKey(),
    usuarioId: int('usuario_id').notNull().references(() => usuarios.id),
    condominioId: int('condominio_id').references(() => condominios.id),
    perfil: varchar('perfil', { length: 30 }).notNull(),
    ativo: boolean('ativo').notNull().default(true),
    criadoEm: timestamp('criado_em').defaultNow()
  },
  (table) => [
    uniqueIndex('usuario_condominio_perfil').on(table.usuarioId, table.condominioId),
    index('usuario_perfis_condominio_id').on(table.condominioId)
  ]
);

export const moradores = mysqlTable(
  'moradores',
  {
    id: int('id').autoincrement().primaryKey(),
    usuarioId: int('usuario_id')
      .notNull()
      .references(() => usuarios.id),
    unidadeId: int('unidade_id')
      .notNull()
      .references(() => unidades.id),
    tipoVinculo: mysqlEnum('tipo_vinculo', [
      'proprietario',
      'inquilino',
      'dependente'
    ])
      .notNull()
      .default('proprietario')
  },
  (table) => [
    uniqueIndex('usuario_id').on(table.usuarioId, table.unidadeId),
    index('unidade_id').on(table.unidadeId)
  ]
);

export const ocorrencias = mysqlTable(
  'ocorrencias',
  {
    id: int('id').autoincrement().primaryKey(),
    unidadeId: int('unidade_id').references(() => unidades.id),
    usuarioId: int('usuario_id')
      .notNull()
      .references(() => usuarios.id),
    titulo: varchar('titulo', { length: 150 }).notNull(),
    descricao: text('descricao').notNull(),
    status: mysqlEnum('status', [
      'aberta',
      'em_andamento',
      'resolvida',
      'cancelada'
    ])
      .notNull()
      .default('aberta'),
    criadoEm: timestamp('criado_em').defaultNow(),
    atualizadoEm: timestamp('atualizado_em').defaultNow().onUpdateNow()
  },
  (table) => [
    index('unidade_id').on(table.unidadeId),
    index('usuario_id').on(table.usuarioId)
  ]
);

export const blocos = mysqlTable('blocos', {
  id: int('id').autoincrement().primaryKey(),
  condominioId: int('condominio_id'), nome: varchar('nome', { length: 80 }), descricao: text('descricao'),
  createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const andares = mysqlTable('andares', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), blocoId: int('bloco_id'), numero: int('numero'), descricao: varchar('descricao', { length: 100 }),
  createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const setores = mysqlTable('setores', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), nome: varchar('nome', { length: 100 }), descricao: text('descricao'),
  createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const gestores = mysqlTable('gestores', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), pessoaId: int('pessoa_id'), tipoGestor: varchar('tipo_gestor', { length: 50 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const mandatos = mysqlTable('mandatos', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), gestorId: int('gestor_id'), inicioEm: date('inicio_em'), fimEm: date('fim_em'), status: varchar('status', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const conselheiros = mysqlTable('conselheiros', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), mandatoId: int('mandato_id'), pessoaId: int('pessoa_id'), cargo: varchar('cargo', { length: 80 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const administradoras = mysqlTable('administradoras', {
  id: int('id').autoincrement().primaryKey(), nome: varchar('nome', { length: 150 }), cnpj: varchar('cnpj', { length: 18 }), email: varchar('email', { length: 190 }), telefone: varchar('telefone', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const contratosAdministracao = mysqlTable('contratos_administracao', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), administradoraId: int('administradora_id'), inicioEm: date('inicio_em'), fimEm: date('fim_em'), valorMensal: decimal('valor_mensal', { precision: 12, scale: 2 }), status: varchar('status', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const condominioAdministradoras = mysqlTable('condominio_administradoras', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), administradoraId: int('administradora_id'), inicioEm: date('inicio_em'), fimEm: date('fim_em'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const vagasGaragem = mysqlTable('vagas_garagem', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), unidadeId: int('unidade_id'), identificacao: varchar('identificacao', { length: 30 }), tipo: varchar('tipo', { length: 30 }), status: varchar('status', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const vinculosVagas = mysqlTable('vinculos_vagas', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), vagaId: int('vaga_id'), unidadeId: int('unidade_id'), inicioEm: date('inicio_em'), fimEm: date('fim_em'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const veiculos = mysqlTable('veiculos', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), pessoaId: int('pessoa_id'), unidadeId: int('unidade_id'), placa: varchar('placa', { length: 10 }), modelo: varchar('modelo', { length: 100 }), cor: varchar('cor', { length: 50 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const enderecos = mysqlTable('enderecos', {
  id: int('id').autoincrement().primaryKey(), logradouro: varchar('logradouro', { length: 150 }), numero: varchar('numero', { length: 20 }), complemento: varchar('complemento', { length: 100 }), bairro: varchar('bairro', { length: 100 }), cidade: varchar('cidade', { length: 100 }), uf: varchar('uf', { length: 2 }), cep: varchar('cep', { length: 9 })
});
export const enderecosUnidades = mysqlTable('enderecos_unidades', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), unidadeId: int('unidade_id'), enderecoId: int('endereco_id'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const enderecosComplementos = mysqlTable('enderecos_complementos', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), enderecoId: int('endereco_id'), tipo: varchar('tipo', { length: 50 }), valor: varchar('valor', { length: 150 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});

export const visitantes = mysqlTable('visitantes', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), nome: varchar('nome', { length: 150 }), documento: varchar('documento', { length: 30 }), telefone: varchar('telefone', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const autorizacoesVisita = mysqlTable('autorizacoes_visita', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), unidadeId: int('unidade_id'), visitanteId: int('visitante_id'), autorizadoPorUsuarioId: int('autorizado_por_usuario_id'), inicioPrevisto: datetime('inicio_previsto'), fimPrevisto: datetime('fim_previsto'), status: varchar('status', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const visitas = mysqlTable('visitas', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), autorizacaoId: int('autorizacao_id'), entradaEm: datetime('entrada_em'), saidaEm: datetime('saida_em'), registradoPorUsuarioId: int('registrado_por_usuario_id'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const funcionariosPortaria = mysqlTable('funcionarios_portaria', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), pessoaId: int('pessoa_id'), matricula: varchar('matricula', { length: 40 }), status: varchar('status', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const turnosPortaria = mysqlTable('turnos_portaria', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), funcionarioPortariaId: int('funcionario_portaria_id'), inicioEm: datetime('inicio_em'), fimEm: datetime('fim_em'), postoId: int('posto_id'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const postosPortaria = mysqlTable('postos_portaria', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), nome: varchar('nome', { length: 80 }), localizacao: varchar('localizacao', { length: 150 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const encomendas = mysqlTable('encomendas', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), unidadeId: int('unidade_id'), transportadoraId: int('transportadora_id'), recebidoPorUsuarioId: int('recebido_por_usuario_id'), codigoRastreio: varchar('codigo_rastreio', { length: 100 }), recebidaEm: datetime('recebida_em'), status: varchar('status', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const transportadoras = mysqlTable('transportadoras', {
  id: int('id').autoincrement().primaryKey(), nome: varchar('nome', { length: 120 }), documento: varchar('documento', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const retiradasEncomendas = mysqlTable('retiradas_encomendas', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), encomendaId: int('encomenda_id'), retiradoPorPessoaId: int('retirado_por_pessoa_id'), entreguePorUsuarioId: int('entregue_por_usuario_id'), retiradaEm: datetime('retirada_em'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const prestadores = mysqlTable('prestadores', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), pessoaId: int('pessoa_id'), empresaId: int('empresa_id'), especialidade: varchar('especialidade', { length: 100 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const empresasPrestadoras = mysqlTable('empresas_prestadoras', {
  id: int('id').autoincrement().primaryKey(), nome: varchar('nome', { length: 150 }), cnpj: varchar('cnpj', { length: 18 }), telefone: varchar('telefone', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const acessosPrestadores = mysqlTable('acessos_prestadores', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), prestadorId: int('prestador_id'), unidadeId: int('unidade_id'), entradaEm: datetime('entrada_em'), saidaEm: datetime('saida_em'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const credenciaisAcesso = mysqlTable('credenciais_acesso', {
  id: int('id').autoincrement().primaryKey(), pessoaId: int('pessoa_id'), condominioId: int('condominio_id'), tipo: varchar('tipo', { length: 40 }), codigoHash: varchar('codigo_hash', { length: 255 }), status: varchar('status', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const registrosAcesso = mysqlTable('registros_acesso', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), credencialId: int('credencial_id'), dispositivoId: int('dispositivo_id'), evento: varchar('evento', { length: 30 }), ocorridoEm: datetime('ocorrido_em'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const dispositivosAcesso = mysqlTable('dispositivos_acesso', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), nome: varchar('nome', { length: 100 }), tipo: varchar('tipo', { length: 50 }), localizacao: varchar('localizacao', { length: 150 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const chaves = mysqlTable('chaves', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), identificacao: varchar('identificacao', { length: 80 }), localizacao: varchar('localizacao', { length: 150 }), status: varchar('status', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const retiradasChaves = mysqlTable('retiradas_chaves', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), chaveId: int('chave_id'), usuarioId: int('usuario_id'), retiradaEm: datetime('retirada_em'), devolucaoPrevistaEm: datetime('devolucao_prevista_em'), devolvidaEm: datetime('devolvida_em'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const historicoChaves = mysqlTable('historico_chaves', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), chaveId: int('chave_id'), usuarioId: int('usuario_id'), evento: varchar('evento', { length: 80 }), registradoEm: datetime('registrado_em'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const ocorrenciasSeguranca = mysqlTable('ocorrencias_seguranca', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), unidadeId: int('unidade_id'), registradaPorUsuarioId: int('registrada_por_usuario_id'), titulo: varchar('titulo', { length: 150 }), descricao: text('descricao'), gravidade: varchar('gravidade', { length: 30 }), ocorridaEm: datetime('ocorrida_em'), status: varchar('status', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const envolvidosOcorrencias = mysqlTable('envolvidos_ocorrencias', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), ocorrenciaId: int('ocorrencia_id'), pessoaId: int('pessoa_id'), papel: varchar('papel', { length: 50 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const evidenciasOcorrencias = mysqlTable('evidencias_ocorrencias', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), ocorrenciaId: int('ocorrencia_id'), arquivoUrl: varchar('arquivo_url', { length: 500 }), tipo: varchar('tipo', { length: 50 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const cameras = mysqlTable('cameras', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), nome: varchar('nome', { length: 100 }), localizacao: varchar('localizacao', { length: 150 }), status: varchar('status', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const incidentes = mysqlTable('incidentes', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), cameraId: int('camera_id'), ocorrenciaId: int('ocorrencia_id'), descricao: text('descricao'), ocorridoEm: datetime('ocorrido_em'), status: varchar('status', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const registrosMonitoramento = mysqlTable('registros_monitoramento', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), cameraId: int('camera_id'), incidenteId: int('incidente_id'), referenciaGravacao: varchar('referencia_gravacao', { length: 500 }), registradoEm: datetime('registrado_em'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const comunicados = mysqlTable('comunicados', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), autorUsuarioId: int('autor_usuario_id'), titulo: varchar('titulo', { length: 180 }), conteudo: text('conteudo'), publicadoEm: datetime('publicado_em'), status: varchar('status', { length: 30 }), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const destinatariosComunicados = mysqlTable('destinatarios_comunicados', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), comunicadoId: int('comunicado_id'), usuarioId: int('usuario_id'), lido: boolean('lido'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const leiturasComunicados = mysqlTable('leituras_comunicados', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), comunicadoId: int('comunicado_id'), usuarioId: int('usuario_id'), lidoEm: datetime('lido_em'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const notificacoes = mysqlTable('notificacoes', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), usuarioId: int('usuario_id'), titulo: varchar('titulo', { length: 150 }), mensagem: text('mensagem'), canal: varchar('canal', { length: 30 }), lidaEm: datetime('lida_em'), criadaEm: datetime('criada_em'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const preferenciasNotificacao = mysqlTable('preferencias_notificacao', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), usuarioId: int('usuario_id'), canal: varchar('canal', { length: 30 }), habilitada: boolean('habilitada'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});
export const historicoNotificacoes = mysqlTable('historico_notificacoes', {
  id: int('id').autoincrement().primaryKey(), condominioId: int('condominio_id'), notificacaoId: int('notificacao_id'), status: varchar('status', { length: 30 }), detalhes: text('detalhes'), registradoEm: datetime('registrado_em'), createdAt: datetime('created_at'), updatedAt: datetime('updated_at')
});

export const condominiosRelations = relations(condominios, ({ many }) => ({
  unidades: many(unidades)
}));

export const unidadesRelations = relations(unidades, ({ one, many }) => ({
  condominio: one(condominios, {
    fields: [unidades.condominioId],
    references: [condominios.id]
  }),
  moradores: many(moradores),
  ocorrencias: many(ocorrencias)
}));

export const usuariosRelations = relations(usuarios, ({ many }) => ({
  moradores: many(moradores),
  ocorrencias: many(ocorrencias),
  perfisRbac: many(usuarioPerfis)
}));

export const usuarioPerfisRelations = relations(usuarioPerfis, ({ one }) => ({
  usuario: one(usuarios, { fields: [usuarioPerfis.usuarioId], references: [usuarios.id] }),
  condominio: one(condominios, { fields: [usuarioPerfis.condominioId], references: [condominios.id] })
}));

export const moradoresRelations = relations(moradores, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [moradores.usuarioId],
    references: [usuarios.id]
  }),
  unidade: one(unidades, {
    fields: [moradores.unidadeId],
    references: [unidades.id]
  })
}));

export const ocorrenciasRelations = relations(ocorrencias, ({ one }) => ({
  unidade: one(unidades, {
    fields: [ocorrencias.unidadeId],
    references: [unidades.id]
  }),
  usuario: one(usuarios, {
    fields: [ocorrencias.usuarioId],
    references: [usuarios.id]
  })
}));
