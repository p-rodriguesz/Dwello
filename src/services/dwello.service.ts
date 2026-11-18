import { and, eq, getTableColumns, inArray, max } from 'drizzle-orm';
import { requireDb } from '../db/index.js';
import { requirePool } from '../db/index.js';
import { AppError } from '../errors/app-error.js';
import {
  administradoras, andares, blocos, conselheiros, condominioAdministradoras,
  contratosAdministracao, enderecos, enderecosComplementos, enderecosUnidades,
  gestores, mandatos, setores, vagasGaragem, veiculos, vinculosVagas,
  visitantes, autorizacoesVisita, visitas, funcionariosPortaria, turnosPortaria,
  postosPortaria, encomendas, transportadoras, retiradasEncomendas, prestadores,
  empresasPrestadoras, acessosPrestadores, credenciaisAcesso, registrosAcesso,
  dispositivosAcesso, chaves, retiradasChaves, historicoChaves,
  ocorrenciasSeguranca, envolvidosOcorrencias, evidenciasOcorrencias, cameras,
  incidentes, registrosMonitoramento, comunicados, destinatariosComunicados,
  leiturasComunicados, notificacoes, preferenciasNotificacao, historicoNotificacoes,
  evidenciasManutencao
} from '../db/schema.js';
import * as generatedSchema from '../db/dwello-schema.js';

export const NEW_DWELLO_RESOURCES = [
  'solicitacoes', 'categorias_solicitacao', 'historico_solicitacoes',
  'manifestacoes', 'respostas_manifestacoes', 'anexos_manifestacoes',
  'assembleias', 'participantes_assembleia', 'pautas_assembleia', 'votacoes', 'opcoes_votacao', 'votos',
  'documentos', 'categorias_documento', 'permissoes_documento',
  'taxas_condominiais', 'composicoes_taxa', 'lancamentos_unidades',
  'contas_pagar', 'parcelas_pagar', 'pagamentos_fornecedores',
  'contas_receber', 'parcelas_receber', 'recebimentos', 'debitos_condominiais', 'acordos_divida', 'historico_cobrancas',
  'contas_bancarias', 'movimentacoes_financeiras', 'transferencias', 'orcamentos', 'itens_orcamento', 'revisoes_orcamento',
  'fundos', 'movimentacoes_fundos', 'destinacoes_fundos', 'extratos_bancarios', 'itens_extrato', 'conciliacoes',
  'plano_contas', 'lancamentos_contabeis', 'periodos_contabeis',
  'planos_manutencao', 'tarefas_preventivas', 'agendamentos_manutencao', 'ordens_servico', 'problemas_reportados', 'historico_ordens_servico',
  'ativos', 'categorias_ativos', 'historico_ativos', 'produtos_estoque', 'movimentacoes_estoque', 'inventarios',
  'fornecedores', 'contratos_fornecedores', 'aditivos_contratuais',
  'areas_limpeza', 'rotinas_limpeza', 'execucoes_limpeza', 'medidores', 'leituras_medidores', 'consumos_mensais',
  'areas_comuns', 'reservas', 'regras_reserva', 'equipamentos_lazer', 'inscricoes_atividades', 'registros_utilizacao'
  , 'solicitacoes_mudanca', 'autorizacoes_obra', 'vistorias_unidades',
  'animais_estimacao', 'tipos_animais', 'registros_animais',
  'logs_auditoria', 'historico_alteracoes', 'sessoes_usuario',
  'consentimentos', 'solicitacoes_privacidade', 'politicas_retencao',
  'relatorios_salvos', 'execucoes_relatorios', 'indicadores_condominio',
  'integracoes', 'credenciais_integracao', 'logs_integracao',
  'regras_automacao', 'tarefas_agendadas', 'execucoes_automacao'
] as const;
export type NewDwelloResource = typeof NEW_DWELLO_RESOURCES[number];

export type DwelloResource =
  | 'blocos' | 'andares' | 'setores' | 'gestores' | 'mandatos' | 'conselheiros'
  | 'administradoras' | 'contratos_administracao' | 'condominio_administradoras'
  | 'vagas_garagem' | 'vinculos_vagas' | 'veiculos' | 'enderecos'
  | 'enderecos_unidades' | 'enderecos_complementos'
  | 'visitantes' | 'autorizacoes_visita' | 'visitas' | 'funcionarios_portaria'
  | 'turnos_portaria' | 'postos_portaria' | 'encomendas' | 'transportadoras'
  | 'retiradas_encomendas' | 'prestadores' | 'empresas_prestadoras'
  | 'acessos_prestadores' | 'credenciais_acesso' | 'registros_acesso'
  | 'dispositivos_acesso' | 'chaves' | 'retiradas_chaves' | 'historico_chaves'
  | 'ocorrencias_seguranca' | 'envolvidos_ocorrencias' | 'evidencias_ocorrencias'
  | 'cameras' | 'incidentes' | 'registros_monitoramento' | 'comunicados'
  | 'destinatarios_comunicados' | 'leituras_comunicados' | 'notificacoes'
  | 'preferencias_notificacao' | 'historico_notificacoes' | 'evidencias_manutencao' | NewDwelloResource;

type Table = any;
type Definition = { table: Table; scoped: boolean };

export const dwelloDefinitions = {
  blocos: { table: blocos, scoped: true },
  andares: { table: andares, scoped: true },
  setores: { table: setores, scoped: true },
  gestores: { table: gestores, scoped: true },
  mandatos: { table: mandatos, scoped: true },
  conselheiros: { table: conselheiros, scoped: true },
  administradoras: { table: administradoras, scoped: false },
  contratos_administracao: { table: contratosAdministracao, scoped: true },
  condominio_administradoras: { table: condominioAdministradoras, scoped: true },
  vagas_garagem: { table: vagasGaragem, scoped: true },
  vinculos_vagas: { table: vinculosVagas, scoped: true },
  veiculos: { table: veiculos, scoped: true },
  enderecos: { table: enderecos, scoped: false },
  enderecos_unidades: { table: enderecosUnidades, scoped: true },
  enderecos_complementos: { table: enderecosComplementos, scoped: true },
  visitantes: { table: visitantes, scoped: true }, autorizacoes_visita: { table: autorizacoesVisita, scoped: true }, visitas: { table: visitas, scoped: true },
  funcionarios_portaria: { table: funcionariosPortaria, scoped: true }, turnos_portaria: { table: turnosPortaria, scoped: true }, postos_portaria: { table: postosPortaria, scoped: true },
  encomendas: { table: encomendas, scoped: true }, transportadoras: { table: transportadoras, scoped: false }, retiradas_encomendas: { table: retiradasEncomendas, scoped: true },
  prestadores: { table: prestadores, scoped: true }, empresas_prestadoras: { table: empresasPrestadoras, scoped: false }, acessos_prestadores: { table: acessosPrestadores, scoped: true },
  credenciais_acesso: { table: credenciaisAcesso, scoped: true }, registros_acesso: { table: registrosAcesso, scoped: true }, dispositivos_acesso: { table: dispositivosAcesso, scoped: true },
  chaves: { table: chaves, scoped: true }, retiradas_chaves: { table: retiradasChaves, scoped: true }, historico_chaves: { table: historicoChaves, scoped: true },
  ocorrencias_seguranca: { table: ocorrenciasSeguranca, scoped: true }, envolvidos_ocorrencias: { table: envolvidosOcorrencias, scoped: true }, evidencias_ocorrencias: { table: evidenciasOcorrencias, scoped: true },
  cameras: { table: cameras, scoped: true }, incidentes: { table: incidentes, scoped: true }, registros_monitoramento: { table: registrosMonitoramento, scoped: true },
  comunicados: { table: comunicados, scoped: true }, destinatarios_comunicados: { table: destinatariosComunicados, scoped: true }, leituras_comunicados: { table: leiturasComunicados, scoped: true },
  notificacoes: { table: notificacoes, scoped: true }, preferencias_notificacao: { table: preferenciasNotificacao, scoped: true }, historico_notificacoes: { table: historicoNotificacoes, scoped: true },
  evidencias_manutencao: { table: evidenciasManutencao, scoped: true },
  ...Object.fromEntries(NEW_DWELLO_RESOURCES.map((resource) => {
    const exportName = resource.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    const table = (generatedSchema as unknown as Record<string, Table>)[exportName];
    const columns = getTableColumns(table);
    return [resource, { table, scoped: Boolean(columns.condominioId) }];
  }))
} as Record<DwelloResource, Definition>;

export function dwelloColumns(resource: DwelloResource) {
  return getTableColumns(dwelloDefinitions[resource].table) as Record<string, { name: string; dataType?: string }>;
}

const camelCase = (value: string) => value.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

export async function validateDwelloRelationships(resource: DwelloResource, values: Record<string, unknown>) {
  const condominioId = Number(values.condominioId ?? values.condominio_id);
  if (!Number.isSafeInteger(condominioId) || condominioId <= 0) return;
  const pool = requirePool();
  const tableName = dwelloDefinitions[resource].table[Symbol.for('drizzle:Name') as never] as string;
  const [relations] = await pool.query(
    `SELECT column_name AS columnName, referenced_table_name AS referencedTableName, referenced_column_name AS referencedColumnName
     FROM information_schema.KEY_COLUMN_USAGE
     WHERE table_schema = DATABASE() AND table_name = ? AND referenced_table_name IS NOT NULL`, [tableName]
  ) as unknown as [{ columnName: string; referencedTableName: string; referencedColumnName: string }[], unknown];
  for (const relation of relations) {
    const value = values[camelCase(relation.columnName)] ?? values[relation.columnName];
    if (value === undefined || value === null) continue;
    const [columns] = await pool.query(
      `SELECT column_name AS columnName FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = 'condominio_id'`, [relation.referencedTableName]
    ) as unknown as [{ columnName: string }[], unknown];
    if (!columns.length) continue;
    const [rows] = await pool.query(
      `SELECT condominio_id AS condominioId FROM \`${relation.referencedTableName}\` WHERE \`${relation.referencedColumnName}\` = ? LIMIT 1`, [value]
    ) as unknown as [{ condominioId: number | null }[], unknown];
    if (rows.length && rows[0].condominioId !== null && Number(rows[0].condominioId) !== condominioId) {
      throw new AppError(422, 'Relacionamento pertence a outro condomínio.', 'CROSS_CONDOMINIUM_RELATION');
    }
  }
}

function whereScope(definition: Definition, id: number, condominiumIds: number[]) {
  const table = definition.table;
  const conditions = [eq(table.id, id)];
  if (definition.scoped) conditions.push(inArray(table.condominioId, condominiumIds));
  return and(...conditions);
}

export async function listDwello(
  resource: DwelloResource,
  condominiumIds: number[],
  global = false,
  pagination: { q?: string; page?: number; pageSize?: number } = {}
) {
  const db = requireDb();
  const definition = dwelloDefinitions[resource];
  const table = definition.table;
  if (!global && definition.scoped && !condominiumIds.length) {
    return { rows: [], total: 0, page: pagination.page ?? 1, pageSize: pagination.pageSize ?? 100 };
  }
  const condition = !global && definition.scoped ? inArray(table.condominioId, condominiumIds) : undefined;
  const allRows = await db.select().from(table).where(condition).orderBy(table.id);
  const query = pagination.q?.trim().toLowerCase();
  const filtered = query
    ? allRows.filter((row) => Object.values(row as Record<string, unknown>).some((value) => String(value ?? '').toLowerCase().includes(query)))
    : allRows;
  const page = pagination.page ?? 1;
  const pageSize = pagination.pageSize ?? 100;
  const start = (page - 1) * pageSize;
  return { rows: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize };
}

export async function getDwello(resource: DwelloResource, id: number, condominiumIds: number[], global = false) {
  const db = requireDb();
  const definition = dwelloDefinitions[resource];
  const condition = global || !definition.scoped
    ? eq(definition.table.id, id)
    : whereScope(definition, id, condominiumIds);
  const [row] = await db.select().from(definition.table).where(condition).limit(1);
  return row;
}

export async function createDwello(resource: DwelloResource, values: Record<string, unknown>) {
  const db = requireDb();
  const table = dwelloDefinitions[resource].table;
  const [last] = await db.select({ id: max(table.id) }).from(table);
  const nextId = Number(last?.id ?? 0) + 1;
  const columns = getTableColumns(table) as Record<string, unknown>;
  const now = new Date();
  const timestamps = { ...(columns.createdAt ? { createdAt: now } : {}), ...(columns.updatedAt ? { updatedAt: now } : {}) };
  const result = await db.insert(table).values({ id: nextId, ...timestamps, ...values });
  return getDwello(resource, Number(result[0].insertId || nextId), [], true);
}

export async function updateDwello(resource: DwelloResource, id: number, values: Record<string, unknown>, condominiumIds: number[], global = false) {
  const db = requireDb();
  const definition = dwelloDefinitions[resource];
  const condition = global || !definition.scoped ? eq(definition.table.id, id) : whereScope(definition, id, condominiumIds);
  const columns = getTableColumns(definition.table) as Record<string, unknown>;
  const result = await db.update(definition.table).set({ ...(columns.updatedAt ? { updatedAt: new Date() } : {}), ...values }).where(condition);
  if (!result[0].affectedRows) return undefined;
  return getDwello(resource, id, condominiumIds, global);
}

export async function removeDwello(resource: DwelloResource, id: number, condominiumIds: number[], global = false) {
  const db = requireDb();
  const definition = dwelloDefinitions[resource];
  const condition = global || !definition.scoped ? eq(definition.table.id, id) : whereScope(definition, id, condominiumIds);
  const result = await db.delete(definition.table).where(condition);
  return result[0].affectedRows > 0;
}
