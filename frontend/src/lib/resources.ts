// Catálogo de módulos do sistema, agrupados para o menu.
// Cada item é um recurso da API; o menu só mostra o que o cargo do usuário pode ler (vindo do banco).

export type ResourceGroup = { id: string; label: string; icon: string; resources: string[] };

// Recursos com tela própria (o resto usa a tela genérica /modulos/<recurso>).
export const CUSTOM_PAGES: Record<string, string> = {
  condominios: '/condominios',
  unidades: '/unidades',
  ocorrencias: '/ocorrencias',
  usuarios: '/usuarios'
};

export const RESOURCE_GROUPS: ResourceGroup[] = [
  { id: 'estrutura', label: 'Estrutura', icon: '▦', resources: ['condominios', 'unidades', 'moradores', 'blocos', 'andares', 'setores', 'enderecos', 'enderecos_unidades', 'enderecos_complementos', 'vagas_garagem', 'vinculos_vagas', 'veiculos'] },
  { id: 'portaria', label: 'Portaria', icon: '⛨', resources: ['visitantes', 'autorizacoes_visita', 'visitas', 'encomendas', 'retiradas_encomendas', 'transportadoras', 'prestadores', 'empresas_prestadoras', 'acessos_prestadores', 'chaves', 'retiradas_chaves', 'historico_chaves', 'funcionarios_portaria', 'turnos_portaria', 'postos_portaria', 'credenciais_acesso', 'registros_acesso', 'dispositivos_acesso'] },
  { id: 'seguranca', label: 'Ocorrências e segurança', icon: '!', resources: ['ocorrencias', 'ocorrencias_seguranca', 'envolvidos_ocorrencias', 'evidencias_ocorrencias', 'cameras', 'incidentes', 'registros_monitoramento'] },
  { id: 'comunicacao', label: 'Comunicação', icon: '✉', resources: ['comunicados', 'destinatarios_comunicados', 'leituras_comunicados', 'notificacoes', 'preferencias_notificacao', 'historico_notificacoes', 'solicitacoes', 'categorias_solicitacao', 'historico_solicitacoes', 'manifestacoes', 'respostas_manifestacoes', 'anexos_manifestacoes'] },
  { id: 'governanca', label: 'Governança', icon: '⚖', resources: ['gestores', 'mandatos', 'conselheiros', 'administradoras', 'contratos_administracao', 'condominio_administradoras', 'assembleias', 'participantes_assembleia', 'pautas_assembleia', 'votacoes', 'opcoes_votacao', 'votos', 'documentos', 'categorias_documento', 'permissoes_documento'] },
  { id: 'financeiro', label: 'Financeiro', icon: '$', resources: ['taxas_condominiais', 'composicoes_taxa', 'lancamentos_unidades', 'contas_pagar', 'parcelas_pagar', 'pagamentos_fornecedores', 'contas_receber', 'parcelas_receber', 'recebimentos', 'debitos_condominiais', 'acordos_divida', 'historico_cobrancas', 'contas_bancarias', 'movimentacoes_financeiras', 'transferencias', 'orcamentos', 'itens_orcamento', 'revisoes_orcamento', 'fundos', 'movimentacoes_fundos', 'destinacoes_fundos', 'extratos_bancarios', 'itens_extrato', 'conciliacoes', 'plano_contas', 'lancamentos_contabeis', 'periodos_contabeis'] },
  { id: 'manutencao', label: 'Manutenção', icon: '⚒', resources: ['ordens_servico', 'problemas_reportados', 'historico_ordens_servico', 'planos_manutencao', 'tarefas_preventivas', 'agendamentos_manutencao', 'ativos', 'categorias_ativos', 'historico_ativos', 'produtos_estoque', 'movimentacoes_estoque', 'inventarios', 'fornecedores', 'contratos_fornecedores', 'aditivos_contratuais', 'areas_limpeza', 'rotinas_limpeza', 'execucoes_limpeza', 'medidores', 'leituras_medidores', 'consumos_mensais'] },
  { id: 'convivencia', label: 'Convivência', icon: '☺', resources: ['areas_comuns', 'reservas', 'regras_reserva', 'equipamentos_lazer', 'inscricoes_atividades', 'registros_utilizacao', 'solicitacoes_mudanca', 'autorizacoes_obra', 'vistorias_unidades', 'animais_estimacao', 'tipos_animais', 'registros_animais'] },
  { id: 'sistema', label: 'Sistema', icon: '⚙', resources: ['logs_auditoria', 'historico_alteracoes', 'sessoes_usuario', 'consentimentos', 'solicitacoes_privacidade', 'politicas_retencao', 'relatorios_salvos', 'execucoes_relatorios', 'indicadores_condominio', 'integracoes', 'credenciais_integracao', 'logs_integracao', 'regras_automacao', 'tarefas_agendadas', 'execucoes_automacao'] }
];

const WORDS: Record<string, string> = {
  acoes: 'ações', acordos: 'acordos', administracao: 'administração', alteracoes: 'alterações', analise: 'análise', anexos: 'anexos',
  areas: 'áreas', autorizacoes: 'autorizações', bancarias: 'bancárias', cameras: 'câmeras', chaves: 'chaves', cobrancas: 'cobranças',
  composicoes: 'composições', condominiais: 'condominiais', condominio: 'condomínio', condominios: 'condomínios', conciliacoes: 'conciliações',
  contabeis: 'contábeis', debitos: 'débitos', destinacoes: 'destinações', destinatarios: 'destinatários', divida: 'dívida',
  endereco: 'endereço', enderecos: 'endereços', estimacao: 'estimação', evidencias: 'evidências', execucoes: 'execuções',
  funcionarios: 'funcionários', historico: 'histórico', inscricoes: 'inscrições', integracao: 'integração', integracoes: 'integrações',
  inventarios: 'inventários', lancamentos: 'lançamentos', manifestacoes: 'manifestações', manutencao: 'manutenção', movimentacoes: 'movimentações',
  mudanca: 'mudança', notificacao: 'notificação', notificacoes: 'notificações', ocorrencias: 'ocorrências', opcoes: 'opções',
  orcamento: 'orçamento', orcamentos: 'orçamentos', periodos: 'períodos', permissoes: 'permissões', politicas: 'políticas',
  preferencias: 'preferências', relatorios: 'relatórios', retencao: 'retenção', revisoes: 'revisões', seguranca: 'segurança',
  servico: 'serviço', sessoes: 'sessões', solicitacao: 'solicitação', solicitacoes: 'solicitações', transferencias: 'transferências',
  usuario: 'usuário', usuarios: 'usuários', utilizacao: 'utilização', veiculos: 'veículos', vinculos: 'vínculos', votacoes: 'votações',
  automacao: 'automação', unidades: 'unidades'
};

export function resourceLabel(resource: string) {
  const text = resource.split('_').map((word) => WORDS[word] ?? word).join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function resourceHref(resource: string) {
  return CUSTOM_PAGES[resource] ?? `/modulos/${resource}`;
}

export function resourceEndpoint(resource: string) {
  return `/${resource.replaceAll('_', '-')}`;
}
