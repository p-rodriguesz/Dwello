import type { FastifyRequest } from 'fastify';
import type { RowDataPacket } from 'mysql2';
import { requirePool } from '../db/index.js';
import { AppError } from '../errors/app-error.js';
import { NEW_DWELLO_RESOURCES } from '../services/dwello.service.js';
import type { NewDwelloResource } from '../services/dwello.service.js';
import { loadPermissionMap, matrixToMap } from './permissions-store.js';
import type { PermissionMap } from './permissions-store.js';

export const RBAC_ROLES = [
  'SUPER_ADMIN', 'ADMINISTRADORA', 'SINDICO', 'SUBSINDICO', 'CONSELHEIRO',
  'PORTEIRO', 'ZELADOR', 'FUNCIONARIO', 'PROPRIETARIO', 'MORADOR',
  'VISITANTE', 'PRESTADOR'
] as const;
export type RbacRole = typeof RBAC_ROLES[number];
export type RbacAction = 'read' | 'create' | 'update' | 'delete';
export type RbacResource =
  | 'condominios' | 'unidades' | 'moradores' | 'ocorrencias' | 'usuarios'
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
  | 'preferencias_notificacao' | 'historico_notificacoes'
  | 'evidencias_manutencao'
  | 'solicitacoes' | 'categorias_solicitacao' | 'historico_solicitacoes'
  | 'manifestacoes' | 'respostas_manifestacoes' | 'anexos_manifestacoes'
  | 'assembleias' | 'participantes_assembleia' | 'pautas_assembleia' | 'votacoes' | 'opcoes_votacao' | 'votos'
  | 'documentos' | 'categorias_documento' | 'permissoes_documento'
  | 'taxas_condominiais' | 'composicoes_taxa' | 'lancamentos_unidades' | 'contas_pagar' | 'parcelas_pagar' | 'pagamentos_fornecedores'
  | 'contas_receber' | 'parcelas_receber' | 'recebimentos' | 'debitos_condominiais' | 'acordos_divida' | 'historico_cobrancas'
  | 'contas_bancarias' | 'movimentacoes_financeiras' | 'transferencias' | 'orcamentos' | 'itens_orcamento' | 'revisoes_orcamento'
  | 'fundos' | 'movimentacoes_fundos' | 'destinacoes_fundos' | 'extratos_bancarios' | 'itens_extrato' | 'conciliacoes'
  | 'plano_contas' | 'lancamentos_contabeis' | 'periodos_contabeis'
  | 'planos_manutencao' | 'tarefas_preventivas' | 'agendamentos_manutencao' | 'ordens_servico' | 'problemas_reportados' | 'historico_ordens_servico'
  | 'ativos' | 'categorias_ativos' | 'historico_ativos' | 'produtos_estoque' | 'movimentacoes_estoque' | 'inventarios'
  | 'fornecedores' | 'contratos_fornecedores' | 'aditivos_contratuais'
  | 'areas_limpeza' | 'rotinas_limpeza' | 'execucoes_limpeza' | 'medidores' | 'leituras_medidores' | 'consumos_mensais'
  | 'areas_comuns' | 'reservas' | 'regras_reserva' | 'equipamentos_lazer' | 'inscricoes_atividades' | 'registros_utilizacao'
  | NewDwelloResource;

const all = ['read', 'create', 'update', 'delete'] as const;
const structure = { blocos: all, andares: all, setores: all };
const structureRead = { blocos: ['read'] as const, andares: ['read'] as const, setores: ['read'] as const };
const governance = { gestores: all, mandatos: all, conselheiros: all };
const administration = { administradoras: ['read', 'create', 'update'] as const, contratos_administracao: all, condominio_administradoras: all };
const parking = { vagas_garagem: all, vinculos_vagas: all, veiculos: all };
const addresses = { enderecos_unidades: all, enderecos_complementos: all };
const visitors = { visitantes: all, autorizacoes_visita: all, visitas: all };
const portaria = { funcionarios_portaria: all, turnos_portaria: all, postos_portaria: all };
const packages = { encomendas: all, transportadoras: ['read', 'create', 'update'] as const, retiradas_encomendas: all };
const providers = { prestadores: all, empresas_prestadoras: ['read', 'create', 'update'] as const, acessos_prestadores: all };
const access = { credenciais_acesso: all, registros_acesso: ['read', 'create'] as const, dispositivos_acesso: all };
const keys = { chaves: all, retiradas_chaves: all, historico_chaves: ['read', 'create'] as const };
const security = { ocorrencias_seguranca: all, envolvidos_ocorrencias: all, evidencias_ocorrencias: all };
const fileAttachments = { anexos_manifestacoes: ['read', 'create'] as const, evidencias_ocorrencias: ['read', 'create'] as const };
const monitoring = { cameras: all, incidentes: all, registros_monitoramento: ['read', 'create'] as const };
const maintenanceEvidence = { evidencias_manutencao: all };
const communications = { comunicados: all, destinatarios_comunicados: all, leituras_comunicados: ['read', 'create'] as const };
const notifications = { notificacoes: ['read', 'create', 'update'] as const, preferencias_notificacao: all, historico_notificacoes: ['read', 'create'] as const };
const allNew = { ...visitors, ...portaria, ...packages, ...providers, ...access, ...keys, ...security, ...monitoring, ...communications, ...notifications };
const operationalRead = Object.fromEntries(Object.keys(allNew).map((resource) => [resource, ['read'] as const]));
const batch56Resources = [
  'solicitacoes', 'categorias_solicitacao', 'historico_solicitacoes', 'manifestacoes', 'respostas_manifestacoes', 'anexos_manifestacoes',
  'assembleias', 'participantes_assembleia', 'pautas_assembleia', 'votacoes', 'opcoes_votacao', 'votos', 'documentos', 'categorias_documento', 'permissoes_documento',
  'taxas_condominiais', 'composicoes_taxa', 'lancamentos_unidades', 'contas_pagar', 'parcelas_pagar', 'pagamentos_fornecedores', 'contas_receber', 'parcelas_receber', 'recebimentos', 'debitos_condominiais', 'acordos_divida', 'historico_cobrancas',
  'contas_bancarias', 'movimentacoes_financeiras', 'transferencias', 'orcamentos', 'itens_orcamento', 'revisoes_orcamento', 'fundos', 'movimentacoes_fundos', 'destinacoes_fundos', 'extratos_bancarios', 'itens_extrato', 'conciliacoes', 'plano_contas', 'lancamentos_contabeis', 'periodos_contabeis',
  'planos_manutencao', 'tarefas_preventivas', 'agendamentos_manutencao', 'ordens_servico', 'problemas_reportados', 'historico_ordens_servico', 'ativos', 'categorias_ativos', 'historico_ativos', 'produtos_estoque', 'movimentacoes_estoque', 'inventarios', 'fornecedores', 'contratos_fornecedores', 'aditivos_contratuais', 'areas_limpeza', 'rotinas_limpeza', 'execucoes_limpeza', 'medidores', 'leituras_medidores', 'consumos_mensais', 'areas_comuns', 'reservas', 'regras_reserva', 'equipamentos_lazer', 'inscricoes_atividades', 'registros_utilizacao'
] as const;
const batch56All = Object.fromEntries(batch56Resources.map((resource) => [resource, all]));
const batch56Read = Object.fromEntries(batch56Resources.map((resource) => [resource, ['read'] as const]));
const batch78Resources = NEW_DWELLO_RESOURCES.filter((resource) => !batch56Resources.includes(resource as typeof batch56Resources[number]));
const batch78All = Object.fromEntries(batch78Resources.map((resource) => [resource, all]));
const batch78Read = Object.fromEntries(batch78Resources.map((resource) => [resource, ['read'] as const]));
const appendOnly = {
  logs_auditoria: ['read', 'create'] as const,
  historico_alteracoes: ['read', 'create'] as const,
  sessoes_usuario: ['read', 'create'] as const,
  logs_integracao: ['read', 'create'] as const,
  execucoes_automacao: ['read', 'create'] as const
};
const governanceFinal = {
  consentimentos: ['read', 'create', 'update'] as const,
  solicitacoes_privacidade: ['read', 'create', 'update'] as const,
  relatorios_salvos: ['read', 'create', 'update', 'delete'] as const,
  execucoes_relatorios: ['read', 'create'] as const,
  indicadores_condominio: ['read', 'create', 'update'] as const,
  integracoes: all,
  credenciais_integracao: all,
  regras_automacao: all,
  tarefas_agendadas: all
};
// Matriz PADRÃO. A fonte de verdade em execução são as tabelas perfis/permissoes/perfil_permissoes,
// preenchidas a partir desta matriz (npm run seed:permissoes). Edite o banco para ajustar um cargo.
const matrix: Record<RbacRole, Partial<Record<RbacResource, readonly RbacAction[]>>> = {
  SUPER_ADMIN: Object.fromEntries(['condominios', 'unidades', 'moradores', 'ocorrencias', 'usuarios', ...Object.keys(structure), ...Object.keys(governance), ...Object.keys(administration), ...Object.keys(parking), ...Object.keys(addresses), 'enderecos', 'evidencias_manutencao', ...Object.keys(allNew), ...batch56Resources, ...batch78Resources].map((r) => [r, all])) ,
  ADMINISTRADORA: { unidades: all, moradores: all, ocorrencias: all, ...structure, ...governance, ...administration, ...parking, ...addresses, ...maintenanceEvidence, ...allNew, ...batch56All, ...batch78All, ...governanceFinal, ...appendOnly },
  SINDICO: { unidades: all, moradores: all, ocorrencias: all, ...structure, ...governance, contratos_administracao: ['read', 'create', 'update'], condominio_administradoras: ['read', 'create', 'update'], ...parking, ...addresses, ...maintenanceEvidence, ...allNew, ...batch56All, ...batch78All, ...governanceFinal, ...appendOnly },
  SUBSINDICO: { condominios: ['read'], unidades: ['read', 'create', 'update'], moradores: ['read', 'create', 'update'], ocorrencias: ['read', 'create', 'update'], ...structure, ...parking, ...addresses, ...visitors, ...packages, ...security, ...fileAttachments, ...communications, ...notifications, ...batch56Read, ...batch78Read, solicitacoes: ['read', 'create', 'update'], manifestacoes: ['read', 'create', 'update'], solicitacoes_mudanca: ['read', 'create', 'update'], autorizacoes_obra: ['read', 'create', 'update'] },
  CONSELHEIRO: { condominios: ['read'], unidades: ['read'], moradores: ['read'], ocorrencias: ['read'], blocos: ['read'], andares: ['read'], setores: ['read'], ...governance, administradoras: ['read'], contratos_administracao: ['read'], condominio_administradoras: ['read'], ...parking, ...addresses, ...operationalRead, ...batch56Read, ...batch78Read },
  PORTEIRO: { condominios: ['read'], unidades: ['read'], moradores: ['read'], ocorrencias: ['read'], ...parking, ...addresses, ...visitors, ...portaria, ...packages, ...access, ...keys, ...security, ...monitoring, ...batch56Read, ...batch78Read },
  ZELADOR: { condominios: ['read'], unidades: ['read'], ocorrencias: ['read', 'create', 'update'], blocos: ['read'], andares: ['read'], setores: ['read'], vagas_garagem: ['read'], veiculos: ['read'], ...keys, ...security, ...monitoring, ...maintenanceEvidence, ...batch56Read, ...batch78Read, ordens_servico: all, problemas_reportados: ['read', 'create', 'update'], tarefas_preventivas: ['read', 'create', 'update'], solicitacoes_mudanca: ['read', 'create', 'update'], autorizacoes_obra: ['read', 'create', 'update'], vistorias_unidades: ['read', 'create', 'update'] },
  FUNCIONARIO: { ocorrencias: ['read', 'create', 'update'], blocos: ['read'], andares: ['read'], setores: ['read'], ...visitors, ...packages, ...providers, ...security, ...fileAttachments, ...communications, ...notifications, ...batch56Read, ...batch78Read, solicitacoes: ['read', 'create', 'update'], manifestacoes: ['read', 'create', 'update'], solicitacoes_mudanca: ['read', 'create', 'update'] },
  PROPRIETARIO: { condominios: ['read'], unidades: ['read'], moradores: ['read'], ocorrencias: ['read', 'create', 'update'], ...structureRead, ...parking, ...addresses, ...visitors, ...packages, ...security, ...fileAttachments, ...communications, ...notifications, ...batch56Read, ...batch78Read, solicitacoes: ['read', 'create', 'update'], manifestacoes: ['read', 'create', 'update'], reservas: ['read', 'create', 'update'], assembleias: ['read'], documentos: ['read'], solicitacoes_mudanca: ['read', 'create', 'update'], animais_estimacao: ['read', 'create', 'update'], registros_animais: ['read', 'create', 'update'], solicitacoes_privacidade: ['read', 'create', 'update'] },
  MORADOR: { condominios: ['read'], unidades: ['read'], moradores: ['read'], ocorrencias: ['read', 'create', 'update'], ...structureRead, veiculos: ['read', 'create', 'update'], ...addresses, ...visitors, ...packages, ...security, ...fileAttachments, ...communications, ...notifications, ...batch56Read, ...batch78Read, solicitacoes: ['read', 'create', 'update'], manifestacoes: ['read', 'create', 'update'], reservas: ['read', 'create', 'update'], assembleias: ['read'], documentos: ['read'], solicitacoes_mudanca: ['read', 'create', 'update'], animais_estimacao: ['read', 'create', 'update'], registros_animais: ['read', 'create', 'update'], solicitacoes_privacidade: ['read', 'create', 'update'] },
  VISITANTE: {},
  PRESTADOR: { ocorrencias: ['read', 'update'] }
};

export const RBAC_MATRIX = matrix;
const defaultPermissionMap = matrixToMap(matrix);
const currentPermissions = () => loadPermissionMap(defaultPermissionMap);

type Membership = RowDataPacket & { condominio_id: number | null; perfil: string };
type AuthorizationContext = { usuarioId: number; authUserId: string; memberships: Membership[] };

export async function getAuthorizationContext(request: FastifyRequest): Promise<AuthorizationContext> {
  const session = (request as FastifyRequest & { authSession?: { user: { id: string } } }).authSession;
  if (!session) throw new AppError(401, 'Autenticação obrigatória.', 'UNAUTHENTICATED');
  const pool = requirePool();
  const [rows] = await pool.query<Membership[]>(
    `SELECT u.id AS usuario_id, up.condominio_id, up.perfil
     FROM usuarios u LEFT JOIN usuario_perfis up ON up.usuario_id = u.id AND up.ativo = 1
     WHERE u.auth_user_id = ? AND u.ativo = 1`, [session.user.id]
  );
  if (!rows.length) throw new AppError(403, 'Usuário sem perfil ativo.', 'FORBIDDEN');
  return { usuarioId: Number(rows[0].usuario_id), authUserId: session.user.id, memberships: rows };
}

function roleAllows(permissions: PermissionMap, role: string, resource: RbacResource, action: RbacAction) {
  return permissions.get(role)?.get(resource)?.has(action) ?? false;
}

function allowedCondominios(context: AuthorizationContext) {
  return context.memberships.filter((m) => RBAC_ROLES.includes(m.perfil as RbacRole)).map((m) => m.condominio_id).filter((id): id is number => id !== null);
}

function isGlobalSuperAdmin(context: AuthorizationContext) {
  return context.memberships.some((m) => m.perfil === 'SUPER_ADMIN' && m.condominio_id === null);
}

export async function authorizeResource(request: FastifyRequest, resource: RbacResource, action: RbacAction, condominioId?: number) {
  const context = await getAuthorizationContext(request);
  if (isGlobalSuperAdmin(context)) return { context, condominioIds: [] as number[] };
  const permissions = await currentPermissions();
  if (condominioId === undefined) {
    if (!context.memberships.some((m) => roleAllows(permissions, m.perfil, resource, action))) {
      throw new AppError(403, 'Acesso negado para este papel.', 'FORBIDDEN');
    }
    return { context, condominioIds: allowedCondominios(context) };
  }
  const memberships = context.memberships.filter((m) => m.condominio_id === condominioId);
  if (!memberships.some((m) => roleAllows(permissions, m.perfil, resource, action))) {
    throw new AppError(403, 'Acesso negado para este papel e condomínio.', 'FORBIDDEN');
  }
  return { context, condominioIds: allowedCondominios(context) };
}

export function resourceScope(resource: Exclude<RbacResource, 'usuarios'>, ids: number[]) {
  if (!ids.length) return { sql: '1 = 0', params: [] as number[] };
  const marks = ids.map(() => '?').join(', ');
  const expressions: Record<string, string> = {
    condominios: `id IN (${marks})`,
    unidades: `condominio_id IN (${marks})`,
    moradores: `unidade_id IN (SELECT id FROM unidades WHERE condominio_id IN (${marks}))`,
    ocorrencias: `unidade_id IN (SELECT id FROM unidades WHERE condominio_id IN (${marks}))`
  };
  return { sql: expressions[resource], params: ids };
}

export function assertAllowedRole(role: unknown): role is RbacRole {
  return typeof role === 'string' && RBAC_ROLES.includes(role as RbacRole);
}

export async function requireUserPermission(request: FastifyRequest) {
  const action: RbacAction = request.method === 'GET' ? 'read' : request.method === 'POST' ? 'create' : request.method === 'PUT' ? 'update' : 'delete';
  await authorizeResource(request, 'usuarios', action);
}

/** Tudo o que o usuário logado pode fazer, somando os cargos dele. Usado pelo frontend para montar o menu. */
export async function getUserPermissions(request: FastifyRequest) {
  const context = await getAuthorizationContext(request);
  const roles = [...new Set(context.memberships.map((m) => m.perfil).filter(Boolean))];
  if (isGlobalSuperAdmin(context)) return { superAdmin: true, roles, permissions: {} as Record<string, RbacAction[]> };
  const permissions = await currentPermissions();
  const merged: Record<string, Set<RbacAction>> = {};
  for (const role of roles) {
    for (const [resource, actions] of permissions.get(role) ?? []) {
      merged[resource] ??= new Set();
      for (const action of actions) merged[resource].add(action);
    }
  }
  return { superAdmin: false, roles, permissions: Object.fromEntries(Object.entries(merged).map(([r, a]) => [r, [...a]])) };
}
