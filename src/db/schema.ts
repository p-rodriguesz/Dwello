import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from 'drizzle-orm/mysql-core';

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
  senhaHash: varchar('senha_hash', { length: 255 }).notNull(),
  perfil: mysqlEnum('perfil', [
    'morador',
    'sindico',
    'porteiro',
    'prestador',
    'admin'
  ])
    .notNull()
    .default('morador'),
  ativo: boolean('ativo').notNull().default(true),
  criadoEm: timestamp('criado_em').defaultNow()
});

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
  ocorrencias: many(ocorrencias)
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
