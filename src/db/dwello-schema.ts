// Gerado a partir de database/dwello.sql. Não editar manualmente.
import { boolean, char, date, datetime, decimal, int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const user = mysqlTable("user", {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    emailVerified: boolean('emailVerified').notNull(),
    image: text('image'),
    createdAt: datetime('createdAt').notNull(),
    updatedAt: datetime('updatedAt').notNull()
});

export const session = mysqlTable("session", {
    id: varchar('id', { length: 36 }).primaryKey(),
    expiresAt: datetime('expiresAt').notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    createdAt: datetime('createdAt').notNull(),
    updatedAt: datetime('updatedAt').notNull(),
    ipAddress: varchar('ipAddress', { length: 45 }),
    userAgent: text('userAgent'),
    userId: varchar('userId', { length: 36 }).notNull()
});

export const account = mysqlTable("account", {
    id: varchar('id', { length: 36 }).primaryKey(),
    accountId: varchar('accountId', { length: 255 }).notNull(),
    providerId: varchar('providerId', { length: 255 }).notNull(),
    userId: varchar('userId', { length: 36 }).notNull(),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: datetime('accessTokenExpiresAt'),
    refreshTokenExpiresAt: datetime('refreshTokenExpiresAt'),
    scope: text('scope'),
    password: text('password'),
    createdAt: datetime('createdAt').notNull(),
    updatedAt: datetime('updatedAt').notNull()
});

export const verification = mysqlTable("verification", {
    id: varchar('id', { length: 36 }).primaryKey(),
    identifier: varchar('identifier', { length: 255 }).notNull(),
    value: varchar('value', { length: 255 }).notNull(),
    expiresAt: datetime('expiresAt').notNull(),
    createdAt: datetime('createdAt'),
    updatedAt: datetime('updatedAt')
});

export const condominios = mysqlTable("condominios", {
    id: int('id').primaryKey(),
    nome: varchar('nome', { length: 150 }),
    cnpj: varchar('cnpj', { length: 18 }).unique(),
    tipoCondominioId: int('tipo_condominio_id'),
    enderecoId: int('endereco_id'),
    endereco: varchar('endereco', { length: 255 }),
    status: varchar('status', { length: 30 }),
    criadoEm: datetime('criado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const tiposCondominio = mysqlTable("tipos_condominio", {
    id: int('id').primaryKey(),
    nome: varchar('nome', { length: 80 }),
    descricao: text('descricao')
});

export const configuracoesCondominio = mysqlTable("configuracoes_condominio", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    chave: varchar('chave', { length: 100 }),
    valor: text('valor'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const blocos = mysqlTable("blocos", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    nome: varchar('nome', { length: 80 }),
    descricao: text('descricao'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const andares = mysqlTable("andares", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    blocoId: int('bloco_id'),
    numero: int('numero'),
    descricao: varchar('descricao', { length: 100 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const setores = mysqlTable("setores", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    nome: varchar('nome', { length: 100 }),
    descricao: text('descricao'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const unidades = mysqlTable("unidades", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    blocoId: int('bloco_id'),
    tipoUnidadeId: int('tipo_unidade_id'),
    bloco: varchar('bloco', { length: 50 }),
    numero: varchar('numero', { length: 20 }),
    identificacao: varchar('identificacao', { length: 30 }),
    areaM2: decimal('area_m2', { precision: 10, scale: 2 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const tiposUnidade = mysqlTable("tipos_unidade", {
    id: int('id').primaryKey(),
    nome: varchar('nome', { length: 80 }),
    descricao: text('descricao')
});

export const historicoUnidades = mysqlTable("historico_unidades", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    usuarioId: int('usuario_id'),
    evento: varchar('evento', { length: 100 }),
    detalhes: text('detalhes'),
    registradoEm: datetime('registrado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const usuarios = mysqlTable("usuarios", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    pessoaId: int('pessoa_id'),
    authUserId: varchar('auth_user_id', { length: 64 }).unique(),
    nome: varchar('nome', { length: 150 }),
    email: varchar('email', { length: 190 }).unique(),
    senhaHash: varchar('senha_hash', { length: 255 }),
    perfil: varchar('perfil', { length: 30 }),
    ativo: boolean('ativo').notNull(),
    status: varchar('status', { length: 30 }),
    ultimoAcessoEm: datetime('ultimo_acesso_em'),
    criadoEm: datetime('criado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const pessoas = mysqlTable("pessoas", {
    id: int('id').primaryKey(),
    nome: varchar('nome', { length: 150 }),
    documento: varchar('documento', { length: 30 }),
    dataNascimento: date('data_nascimento'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const contatos = mysqlTable("contatos", {
    id: int('id').primaryKey(),
    pessoaId: int('pessoa_id'),
    tipo: varchar('tipo', { length: 30 }),
    valor: varchar('valor', { length: 190 }),
    principal: boolean('principal'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const proprietarios = mysqlTable("proprietarios", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    pessoaId: int('pessoa_id'),
    observacoes: text('observacoes'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const moradores = mysqlTable("moradores", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    pessoaId: int('pessoa_id'),
    usuarioId: int('usuario_id'),
    unidadeId: int('unidade_id'),
    tipoVinculo: varchar('tipo_vinculo', { length: 30 }),
    dataInicio: date('data_inicio'),
    dataFim: date('data_fim'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const vinculosUnidades = mysqlTable("vinculos_unidades", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    pessoaId: int('pessoa_id'),
    tipoVinculo: varchar('tipo_vinculo', { length: 30 }),
    inicioEm: date('inicio_em'),
    fimEm: date('fim_em'),
    principal: boolean('principal'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const perfis = mysqlTable("perfis", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    nome: varchar('nome', { length: 80 }),
    descricao: text('descricao'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const permissoes = mysqlTable("permissoes", {
    id: int('id').primaryKey(),
    codigo: varchar('codigo', { length: 100 }).unique(),
    descricao: text('descricao')
});

export const perfilPermissoes = mysqlTable("perfil_permissoes", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    perfilId: int('perfil_id'),
    permissaoId: int('permissao_id'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const usuarioPerfis = mysqlTable("usuario_perfis", {
    id: int('id').primaryKey(),
    usuarioId: int('usuario_id'),
    perfilId: int('perfil_id'),
    condominioId: int('condominio_id'),
    perfil: varchar('perfil', { length: 30 }),
    ativo: boolean('ativo').notNull(),
    criadoEm: datetime('criado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const gestores = mysqlTable("gestores", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    pessoaId: int('pessoa_id'),
    tipoGestor: varchar('tipo_gestor', { length: 50 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const mandatos = mysqlTable("mandatos", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    gestorId: int('gestor_id'),
    inicioEm: date('inicio_em'),
    fimEm: date('fim_em'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const conselheiros = mysqlTable("conselheiros", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    mandatoId: int('mandato_id'),
    pessoaId: int('pessoa_id'),
    cargo: varchar('cargo', { length: 80 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const administradoras = mysqlTable("administradoras", {
    id: int('id').primaryKey(),
    nome: varchar('nome', { length: 150 }),
    cnpj: varchar('cnpj', { length: 18 }).unique(),
    email: varchar('email', { length: 190 }).unique(),
    telefone: varchar('telefone', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const contratosAdministracao = mysqlTable("contratos_administracao", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    administradoraId: int('administradora_id'),
    inicioEm: date('inicio_em'),
    fimEm: date('fim_em'),
    valorMensal: decimal('valor_mensal', { precision: 12, scale: 2 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const condominioAdministradoras = mysqlTable("condominio_administradoras", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    administradoraId: int('administradora_id'),
    inicioEm: date('inicio_em'),
    fimEm: date('fim_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const vagasGaragem = mysqlTable("vagas_garagem", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    identificacao: varchar('identificacao', { length: 30 }),
    tipo: varchar('tipo', { length: 30 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const vinculosVagas = mysqlTable("vinculos_vagas", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    vagaId: int('vaga_id'),
    unidadeId: int('unidade_id'),
    inicioEm: date('inicio_em'),
    fimEm: date('fim_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const veiculos = mysqlTable("veiculos", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    pessoaId: int('pessoa_id'),
    unidadeId: int('unidade_id'),
    placa: varchar('placa', { length: 10 }),
    modelo: varchar('modelo', { length: 100 }),
    cor: varchar('cor', { length: 50 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const enderecos = mysqlTable("enderecos", {
    id: int('id').primaryKey(),
    logradouro: varchar('logradouro', { length: 150 }),
    numero: varchar('numero', { length: 20 }),
    complemento: varchar('complemento', { length: 100 }),
    bairro: varchar('bairro', { length: 100 }),
    cidade: varchar('cidade', { length: 100 }),
    uf: char('uf', { length: 2 }),
    cep: varchar('cep', { length: 9 })
});

export const enderecosUnidades = mysqlTable("enderecos_unidades", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    enderecoId: int('endereco_id'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const enderecosComplementos = mysqlTable("enderecos_complementos", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    enderecoId: int('endereco_id'),
    tipo: varchar('tipo', { length: 50 }),
    valor: varchar('valor', { length: 150 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const visitantes = mysqlTable("visitantes", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    nome: varchar('nome', { length: 150 }),
    documento: varchar('documento', { length: 30 }),
    telefone: varchar('telefone', { length: 30 }),
    fotoUrl: varchar('foto_url', { length: 255 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const autorizacoesVisita = mysqlTable("autorizacoes_visita", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    visitanteId: int('visitante_id'),
    autorizadoPorUsuarioId: int('autorizado_por_usuario_id'),
    inicioPrevisto: datetime('inicio_previsto'),
    fimPrevisto: datetime('fim_previsto'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const visitas = mysqlTable("visitas", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    autorizacaoId: int('autorizacao_id'),
    entradaEm: datetime('entrada_em'),
    saidaEm: datetime('saida_em'),
    registradoPorUsuarioId: int('registrado_por_usuario_id'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const funcionariosPortaria = mysqlTable("funcionarios_portaria", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    pessoaId: int('pessoa_id'),
    matricula: varchar('matricula', { length: 40 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const turnosPortaria = mysqlTable("turnos_portaria", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    funcionarioPortariaId: int('funcionario_portaria_id'),
    inicioEm: datetime('inicio_em'),
    fimEm: datetime('fim_em'),
    postoId: int('posto_id'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const postosPortaria = mysqlTable("postos_portaria", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    nome: varchar('nome', { length: 80 }),
    localizacao: varchar('localizacao', { length: 150 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const encomendas = mysqlTable("encomendas", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    transportadoraId: int('transportadora_id'),
    recebidoPorUsuarioId: int('recebido_por_usuario_id'),
    codigoRastreio: varchar('codigo_rastreio', { length: 100 }),
    recebidaEm: datetime('recebida_em'),
    status: varchar('status', { length: 30 }),
    fotoUrl: varchar('foto_url', { length: 255 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const transportadoras = mysqlTable("transportadoras", {
    id: int('id').primaryKey(),
    nome: varchar('nome', { length: 120 }),
    documento: varchar('documento', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const retiradasEncomendas = mysqlTable("retiradas_encomendas", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    encomendaId: int('encomenda_id'),
    retiradoPorPessoaId: int('retirado_por_pessoa_id'),
    entreguePorUsuarioId: int('entregue_por_usuario_id'),
    retiradaEm: datetime('retirada_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const prestadores = mysqlTable("prestadores", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    pessoaId: int('pessoa_id'),
    empresaId: int('empresa_id'),
    especialidade: varchar('especialidade', { length: 100 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const empresasPrestadoras = mysqlTable("empresas_prestadoras", {
    id: int('id').primaryKey(),
    nome: varchar('nome', { length: 150 }),
    cnpj: varchar('cnpj', { length: 18 }).unique(),
    telefone: varchar('telefone', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const acessosPrestadores = mysqlTable("acessos_prestadores", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    prestadorId: int('prestador_id'),
    unidadeId: int('unidade_id'),
    entradaEm: datetime('entrada_em'),
    saidaEm: datetime('saida_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const credenciaisAcesso = mysqlTable("credenciais_acesso", {
    id: int('id').primaryKey(),
    pessoaId: int('pessoa_id'),
    condominioId: int('condominio_id'),
    tipo: varchar('tipo', { length: 40 }),
    codigoHash: varchar('codigo_hash', { length: 255 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const registrosAcesso = mysqlTable("registros_acesso", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    credencialId: int('credencial_id'),
    dispositivoId: int('dispositivo_id'),
    evento: varchar('evento', { length: 30 }),
    ocorridoEm: datetime('ocorrido_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const dispositivosAcesso = mysqlTable("dispositivos_acesso", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    nome: varchar('nome', { length: 100 }),
    tipo: varchar('tipo', { length: 50 }),
    localizacao: varchar('localizacao', { length: 150 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const chaves = mysqlTable("chaves", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    identificacao: varchar('identificacao', { length: 80 }),
    localizacao: varchar('localizacao', { length: 150 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const retiradasChaves = mysqlTable("retiradas_chaves", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    chaveId: int('chave_id'),
    usuarioId: int('usuario_id'),
    retiradaEm: datetime('retirada_em'),
    devolucaoPrevistaEm: datetime('devolucao_prevista_em'),
    devolvidaEm: datetime('devolvida_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const historicoChaves = mysqlTable("historico_chaves", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    chaveId: int('chave_id'),
    usuarioId: int('usuario_id'),
    evento: varchar('evento', { length: 80 }),
    registradoEm: datetime('registrado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const ocorrenciasSeguranca = mysqlTable("ocorrencias_seguranca", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    registradaPorUsuarioId: int('registrada_por_usuario_id'),
    titulo: varchar('titulo', { length: 150 }),
    descricao: text('descricao'),
    gravidade: varchar('gravidade', { length: 30 }),
    ocorridaEm: datetime('ocorrida_em'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const envolvidosOcorrencias = mysqlTable("envolvidos_ocorrencias", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    ocorrenciaId: int('ocorrencia_id'),
    pessoaId: int('pessoa_id'),
    papel: varchar('papel', { length: 50 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const evidenciasOcorrencias = mysqlTable("evidencias_ocorrencias", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    ocorrenciaId: int('ocorrencia_id'),
    arquivoUrl: varchar('arquivo_url', { length: 500 }),
    tipo: varchar('tipo', { length: 50 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const cameras = mysqlTable("cameras", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    nome: varchar('nome', { length: 100 }),
    localizacao: varchar('localizacao', { length: 150 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const incidentes = mysqlTable("incidentes", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    cameraId: int('camera_id'),
    ocorrenciaId: int('ocorrencia_id'),
    descricao: text('descricao'),
    ocorridoEm: datetime('ocorrido_em'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const registrosMonitoramento = mysqlTable("registros_monitoramento", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    cameraId: int('camera_id'),
    incidenteId: int('incidente_id'),
    referenciaGravacao: varchar('referencia_gravacao', { length: 500 }),
    registradoEm: datetime('registrado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const comunicados = mysqlTable("comunicados", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    autorUsuarioId: int('autor_usuario_id'),
    titulo: varchar('titulo', { length: 180 }),
    conteudo: text('conteudo'),
    publicadoEm: datetime('publicado_em'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const destinatariosComunicados = mysqlTable("destinatarios_comunicados", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    comunicadoId: int('comunicado_id'),
    usuarioId: int('usuario_id'),
    lido: boolean('lido'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const leiturasComunicados = mysqlTable("leituras_comunicados", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    comunicadoId: int('comunicado_id'),
    usuarioId: int('usuario_id'),
    lidoEm: datetime('lido_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const notificacoes = mysqlTable("notificacoes", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    usuarioId: int('usuario_id'),
    titulo: varchar('titulo', { length: 150 }),
    mensagem: text('mensagem'),
    canal: varchar('canal', { length: 30 }),
    lidaEm: datetime('lida_em'),
    criadaEm: datetime('criada_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const preferenciasNotificacao = mysqlTable("preferencias_notificacao", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    usuarioId: int('usuario_id'),
    canal: varchar('canal', { length: 30 }),
    habilitada: boolean('habilitada'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const historicoNotificacoes = mysqlTable("historico_notificacoes", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    notificacaoId: int('notificacao_id'),
    status: varchar('status', { length: 30 }),
    detalhes: text('detalhes'),
    registradoEm: datetime('registrado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const solicitacoes = mysqlTable("solicitacoes", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    solicitanteUsuarioId: int('solicitante_usuario_id'),
    categoriaId: int('categoria_id'),
    titulo: varchar('titulo', { length: 150 }),
    descricao: text('descricao'),
    status: varchar('status', { length: 30 }),
    criadaEm: datetime('criada_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const categoriasSolicitacao = mysqlTable("categorias_solicitacao", {
    id: int('id').primaryKey(),
    nome: varchar('nome', { length: 100 }),
    descricao: text('descricao')
});

export const historicoSolicitacoes = mysqlTable("historico_solicitacoes", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    solicitacaoId: int('solicitacao_id'),
    usuarioId: int('usuario_id'),
    statusAnterior: varchar('status_anterior', { length: 30 }),
    statusNovo: varchar('status_novo', { length: 30 }),
    comentario: text('comentario'),
    registradoEm: datetime('registrado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const manifestacoes = mysqlTable("manifestacoes", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    usuarioId: int('usuario_id'),
    tipo: varchar('tipo', { length: 30 }),
    assunto: varchar('assunto', { length: 150 }),
    descricao: text('descricao'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const respostasManifestacoes = mysqlTable("respostas_manifestacoes", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    manifestacaoId: int('manifestacao_id'),
    usuarioId: int('usuario_id'),
    resposta: text('resposta'),
    respondidaEm: datetime('respondida_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const anexosManifestacoes = mysqlTable("anexos_manifestacoes", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    manifestacaoId: int('manifestacao_id'),
    arquivoUrl: varchar('arquivo_url', { length: 500 }),
    nomeArquivo: varchar('nome_arquivo', { length: 180 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const assembleias = mysqlTable("assembleias", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    titulo: varchar('titulo', { length: 150 }),
    tipo: varchar('tipo', { length: 40 }),
    dataHora: datetime('data_hora'),
    local: varchar('local', { length: 180 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const participantesAssembleia = mysqlTable("participantes_assembleia", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    assembleiaId: int('assembleia_id'),
    pessoaId: int('pessoa_id'),
    unidadeId: int('unidade_id'),
    presenca: boolean('presenca'),
    procuracaoUrl: varchar('procuracao_url', { length: 500 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const pautasAssembleia = mysqlTable("pautas_assembleia", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    assembleiaId: int('assembleia_id'),
    titulo: varchar('titulo', { length: 150 }),
    descricao: text('descricao'),
    ordem: int('ordem'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const votacoes = mysqlTable("votacoes", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    assembleiaId: int('assembleia_id'),
    pautaId: int('pauta_id'),
    titulo: varchar('titulo', { length: 150 }),
    inicioEm: datetime('inicio_em'),
    fimEm: datetime('fim_em'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const opcoesVotacao = mysqlTable("opcoes_votacao", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    votacaoId: int('votacao_id'),
    descricao: varchar('descricao', { length: 150 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const votos = mysqlTable("votos", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    votacaoId: int('votacao_id'),
    opcaoId: int('opcao_id'),
    pessoaId: int('pessoa_id'),
    unidadeId: int('unidade_id'),
    votadoEm: datetime('votado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const documentos = mysqlTable("documentos", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    categoriaId: int('categoria_id'),
    enviadoPorUsuarioId: int('enviado_por_usuario_id'),
    titulo: varchar('titulo', { length: 180 }),
    arquivoUrl: varchar('arquivo_url', { length: 500 }),
    visibilidade: varchar('visibilidade', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const categoriasDocumento = mysqlTable("categorias_documento", {
    id: int('id').primaryKey(),
    nome: varchar('nome', { length: 100 }),
    descricao: text('descricao')
});

export const permissoesDocumento = mysqlTable("permissoes_documento", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    documentoId: int('documento_id'),
    perfilId: int('perfil_id'),
    podeVisualizar: boolean('pode_visualizar'),
    podeEditar: boolean('pode_editar'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const taxasCondominiais = mysqlTable("taxas_condominiais", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    nome: varchar('nome', { length: 120 }),
    periodicidade: varchar('periodicidade', { length: 30 }),
    valorBase: decimal('valor_base', { precision: 12, scale: 2 }),
    ativa: boolean('ativa'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const composicoesTaxa = mysqlTable("composicoes_taxa", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    taxaId: int('taxa_id'),
    descricao: varchar('descricao', { length: 150 }),
    valor: decimal('valor', { precision: 12, scale: 2 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const lancamentosUnidades = mysqlTable("lancamentos_unidades", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    taxaId: int('taxa_id'),
    competencia: date('competencia'),
    valor: decimal('valor', { precision: 12, scale: 2 }),
    vencimentoEm: date('vencimento_em'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const contasPagar = mysqlTable("contas_pagar", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    fornecedorId: int('fornecedor_id'),
    descricao: varchar('descricao', { length: 180 }),
    valorTotal: decimal('valor_total', { precision: 12, scale: 2 }),
    emissaoEm: date('emissao_em'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const parcelasPagar = mysqlTable("parcelas_pagar", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    contaPagarId: int('conta_pagar_id'),
    numeroParcela: int('numero_parcela'),
    valor: decimal('valor', { precision: 12, scale: 2 }),
    vencimentoEm: date('vencimento_em'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const pagamentosFornecedores = mysqlTable("pagamentos_fornecedores", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    parcelaPagarId: int('parcela_pagar_id'),
    contaBancariaId: int('conta_bancaria_id'),
    valorPago: decimal('valor_pago', { precision: 12, scale: 2 }),
    pagoEm: datetime('pago_em'),
    referencia: varchar('referencia', { length: 150 }),
    comprovanteUrl: varchar('comprovante_url', { length: 255 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const contasReceber = mysqlTable("contas_receber", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    descricao: varchar('descricao', { length: 180 }),
    valorTotal: decimal('valor_total', { precision: 12, scale: 2 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const parcelasReceber = mysqlTable("parcelas_receber", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    contaReceberId: int('conta_receber_id'),
    numeroParcela: int('numero_parcela'),
    valor: decimal('valor', { precision: 12, scale: 2 }),
    vencimentoEm: date('vencimento_em'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const recebimentos = mysqlTable("recebimentos", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    parcelaReceberId: int('parcela_receber_id'),
    valorRecebido: decimal('valor_recebido', { precision: 12, scale: 2 }),
    recebidoEm: datetime('recebido_em'),
    metodo: varchar('metodo', { length: 40 }),
    referencia: varchar('referencia', { length: 150 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const debitosCondominiais = mysqlTable("debitos_condominiais", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    lancamentoUnidadeId: int('lancamento_unidade_id'),
    valorOriginal: decimal('valor_original', { precision: 12, scale: 2 }),
    saldoAtual: decimal('saldo_atual', { precision: 12, scale: 2 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const acordosDivida = mysqlTable("acordos_divida", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    pessoaId: int('pessoa_id'),
    valorNegociado: decimal('valor_negociado', { precision: 12, scale: 2 }),
    quantidadeParcelas: int('quantidade_parcelas'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const historicoCobrancas = mysqlTable("historico_cobrancas", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    debitoId: int('debito_id'),
    usuarioId: int('usuario_id'),
    acao: varchar('acao', { length: 80 }),
    detalhes: text('detalhes'),
    registradoEm: datetime('registrado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const contasBancarias = mysqlTable("contas_bancarias", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    banco: varchar('banco', { length: 100 }),
    agencia: varchar('agencia', { length: 20 }),
    numeroConta: varchar('numero_conta', { length: 30 }),
    tipo: varchar('tipo', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const movimentacoesFinanceiras = mysqlTable("movimentacoes_financeiras", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    contaBancariaId: int('conta_bancaria_id'),
    tipo: varchar('tipo', { length: 30 }),
    descricao: varchar('descricao', { length: 180 }),
    valor: decimal('valor', { precision: 12, scale: 2 }),
    ocorridoEm: datetime('ocorrido_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const transferencias = mysqlTable("transferencias", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    contaOrigemId: int('conta_origem_id'),
    contaDestinoId: int('conta_destino_id'),
    valor: decimal('valor', { precision: 12, scale: 2 }),
    transferidaEm: datetime('transferida_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const orcamentos = mysqlTable("orcamentos", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    ano: int('ano'),
    descricao: varchar('descricao', { length: 180 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const itensOrcamento = mysqlTable("itens_orcamento", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    orcamentoId: int('orcamento_id'),
    planoContaId: int('plano_conta_id'),
    descricao: varchar('descricao', { length: 180 }),
    valorPrevisto: decimal('valor_previsto', { precision: 12, scale: 2 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const revisoesOrcamento = mysqlTable("revisoes_orcamento", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    orcamentoId: int('orcamento_id'),
    usuarioId: int('usuario_id'),
    motivo: text('motivo'),
    revisadoEm: datetime('revisado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const fundos = mysqlTable("fundos", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    nome: varchar('nome', { length: 100 }),
    saldoInicial: decimal('saldo_inicial', { precision: 12, scale: 2 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const movimentacoesFundos = mysqlTable("movimentacoes_fundos", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    fundoId: int('fundo_id'),
    tipo: varchar('tipo', { length: 30 }),
    valor: decimal('valor', { precision: 12, scale: 2 }),
    descricao: varchar('descricao', { length: 180 }),
    ocorridoEm: datetime('ocorrido_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const destinacoesFundos = mysqlTable("destinacoes_fundos", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    fundoId: int('fundo_id'),
    movimentacaoId: int('movimentacao_id'),
    destino: varchar('destino', { length: 180 }),
    valor: decimal('valor', { precision: 12, scale: 2 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const extratosBancarios = mysqlTable("extratos_bancarios", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    contaBancariaId: int('conta_bancaria_id'),
    periodoInicio: date('periodo_inicio'),
    periodoFim: date('periodo_fim'),
    arquivoUrl: varchar('arquivo_url', { length: 500 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const itensExtrato = mysqlTable("itens_extrato", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    extratoId: int('extrato_id'),
    dataMovimento: date('data_movimento'),
    descricao: varchar('descricao', { length: 180 }),
    valor: decimal('valor', { precision: 12, scale: 2 }),
    tipo: varchar('tipo', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const conciliacoes = mysqlTable("conciliacoes", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    itemExtratoId: int('item_extrato_id'),
    movimentacaoId: int('movimentacao_id'),
    status: varchar('status', { length: 30 }),
    conciliadoEm: datetime('conciliado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const planoContas = mysqlTable("plano_contas", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    codigo: varchar('codigo', { length: 30 }).unique(),
    nome: varchar('nome', { length: 150 }),
    tipo: varchar('tipo', { length: 30 }),
    contaPaiId: int('conta_pai_id'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const lancamentosContabeis = mysqlTable("lancamentos_contabeis", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    periodoId: int('periodo_id'),
    planoContaId: int('plano_conta_id'),
    descricao: varchar('descricao', { length: 180 }),
    debito: decimal('debito', { precision: 12, scale: 2 }),
    credito: decimal('credito', { precision: 12, scale: 2 }),
    lancadoEm: datetime('lancado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const periodosContabeis = mysqlTable("periodos_contabeis", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    ano: int('ano'),
    mes: int('mes'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const planosManutencao = mysqlTable("planos_manutencao", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    ativoId: int('ativo_id'),
    nome: varchar('nome', { length: 150 }),
    frequenciaDias: int('frequencia_dias'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const tarefasPreventivas = mysqlTable("tarefas_preventivas", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    planoId: int('plano_id'),
    titulo: varchar('titulo', { length: 150 }),
    descricao: text('descricao'),
    responsavelUsuarioId: int('responsavel_usuario_id'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const agendamentosManutencao = mysqlTable("agendamentos_manutencao", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    tarefaId: int('tarefa_id'),
    previstoEm: datetime('previsto_em'),
    concluidoEm: datetime('concluido_em'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const ordensServico = mysqlTable("ordens_servico", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    ativoId: int('ativo_id'),
    solicitacaoId: int('solicitacao_id'),
    fornecedorId: int('fornecedor_id'),
    titulo: varchar('titulo', { length: 150 }),
    descricao: text('descricao'),
    prioridade: varchar('prioridade', { length: 30 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const problemasReportados = mysqlTable("problemas_reportados", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    ordemServicoId: int('ordem_servico_id'),
    usuarioId: int('usuario_id'),
    descricao: text('descricao'),
    reportadoEm: datetime('reportado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const historicoOrdensServico = mysqlTable("historico_ordens_servico", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    ordemServicoId: int('ordem_servico_id'),
    usuarioId: int('usuario_id'),
    statusAnterior: varchar('status_anterior', { length: 30 }),
    statusNovo: varchar('status_novo', { length: 30 }),
    comentario: text('comentario'),
    registradoEm: datetime('registrado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const evidenciasManutencao = mysqlTable("evidencias_manutencao", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    ordemServicoId: int('ordem_servico_id'),
    arquivoUrl: varchar('arquivo_url', { length: 500 }),
    nomeArquivo: varchar('nome_arquivo', { length: 255 }),
    tipo: varchar('tipo', { length: 50 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const ativos = mysqlTable("ativos", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    categoriaId: int('categoria_id'),
    nome: varchar('nome', { length: 150 }),
    numeroPatrimonio: varchar('numero_patrimonio', { length: 80 }).unique(),
    adquiridoEm: date('adquirido_em'),
    valorAquisicao: decimal('valor_aquisicao', { precision: 12, scale: 2 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const categoriasAtivos = mysqlTable("categorias_ativos", {
    id: int('id').primaryKey(),
    nome: varchar('nome', { length: 100 }),
    descricao: text('descricao')
});

export const historicoAtivos = mysqlTable("historico_ativos", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    ativoId: int('ativo_id'),
    usuarioId: int('usuario_id'),
    evento: varchar('evento', { length: 100 }),
    detalhes: text('detalhes'),
    registradoEm: datetime('registrado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const produtosEstoque = mysqlTable("produtos_estoque", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    nome: varchar('nome', { length: 150 }),
    sku: varchar('sku', { length: 80 }).unique(),
    unidadeMedida: varchar('unidade_medida', { length: 30 }),
    quantidadeAtual: decimal('quantidade_atual', { precision: 12, scale: 3 }),
    estoqueMinimo: decimal('estoque_minimo', { precision: 12, scale: 3 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const movimentacoesEstoque = mysqlTable("movimentacoes_estoque", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    produtoId: int('produto_id'),
    usuarioId: int('usuario_id'),
    tipo: varchar('tipo', { length: 30 }),
    quantidade: decimal('quantidade', { precision: 12, scale: 3 }),
    ocorridoEm: datetime('ocorrido_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const inventarios = mysqlTable("inventarios", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    responsavelUsuarioId: int('responsavel_usuario_id'),
    realizadoEm: datetime('realizado_em'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const fornecedores = mysqlTable("fornecedores", {
    id: int('id').primaryKey(),
    nome: varchar('nome', { length: 150 }),
    cnpj: varchar('cnpj', { length: 18 }).unique(),
    email: varchar('email', { length: 190 }).unique(),
    telefone: varchar('telefone', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const contratosFornecedores = mysqlTable("contratos_fornecedores", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    fornecedorId: int('fornecedor_id'),
    numeroContrato: varchar('numero_contrato', { length: 80 }),
    inicioEm: date('inicio_em'),
    fimEm: date('fim_em'),
    valor: decimal('valor', { precision: 12, scale: 2 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const aditivosContratuais = mysqlTable("aditivos_contratuais", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    contratoFornecedorId: int('contrato_fornecedor_id'),
    descricao: text('descricao'),
    valorAdicional: decimal('valor_adicional', { precision: 12, scale: 2 }),
    vigenteDesde: date('vigente_desde'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const areasLimpeza = mysqlTable("areas_limpeza", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    nome: varchar('nome', { length: 120 }),
    localizacao: varchar('localizacao', { length: 150 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const rotinasLimpeza = mysqlTable("rotinas_limpeza", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    areaId: int('area_id'),
    nome: varchar('nome', { length: 120 }),
    frequencia: varchar('frequencia', { length: 40 }),
    responsavelUsuarioId: int('responsavel_usuario_id'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const execucoesLimpeza = mysqlTable("execucoes_limpeza", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    rotinaId: int('rotina_id'),
    executadaPorUsuarioId: int('executada_por_usuario_id'),
    executadaEm: datetime('executada_em'),
    observacoes: text('observacoes'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const medidores = mysqlTable("medidores", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    tipo: varchar('tipo', { length: 30 }),
    numeroSerie: varchar('numero_serie', { length: 100 }),
    instaladoEm: date('instalado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const leiturasMedidores = mysqlTable("leituras_medidores", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    medidorId: int('medidor_id'),
    leitura: decimal('leitura', { precision: 14, scale: 3 }),
    lidaEm: datetime('lida_em'),
    usuarioId: int('usuario_id'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const consumosMensais = mysqlTable("consumos_mensais", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    medidorId: int('medidor_id'),
    competencia: date('competencia'),
    consumo: decimal('consumo', { precision: 14, scale: 3 }),
    valorEstimado: decimal('valor_estimado', { precision: 12, scale: 2 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const areasComuns = mysqlTable("areas_comuns", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    nome: varchar('nome', { length: 120 }),
    capacidade: int('capacidade'),
    requerReserva: boolean('requer_reserva'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const reservas = mysqlTable("reservas", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    areaComumId: int('area_comum_id'),
    unidadeId: int('unidade_id'),
    usuarioId: int('usuario_id'),
    inicioEm: datetime('inicio_em'),
    fimEm: datetime('fim_em'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const regrasReserva = mysqlTable("regras_reserva", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    areaComumId: int('area_comum_id'),
    antecedenciaMaxDias: int('antecedencia_max_dias'),
    duracaoMaxHoras: int('duracao_max_horas'),
    taxaReserva: decimal('taxa_reserva', { precision: 12, scale: 2 }),
    regras: text('regras'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const equipamentosLazer = mysqlTable("equipamentos_lazer", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    areaComumId: int('area_comum_id'),
    nome: varchar('nome', { length: 120 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const inscricoesAtividades = mysqlTable("inscricoes_atividades", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    equipamentoLazerId: int('equipamento_lazer_id'),
    pessoaId: int('pessoa_id'),
    atividade: varchar('atividade', { length: 120 }),
    inicioEm: datetime('inicio_em'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const registrosUtilizacao = mysqlTable("registros_utilizacao", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    equipamentoLazerId: int('equipamento_lazer_id'),
    pessoaId: int('pessoa_id'),
    utilizadoEm: datetime('utilizado_em'),
    observacoes: text('observacoes'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const solicitacoesMudanca = mysqlTable("solicitacoes_mudanca", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    usuarioId: int('usuario_id'),
    dataPrevista: datetime('data_prevista'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const autorizacoesObra = mysqlTable("autorizacoes_obra", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    solicitanteUsuarioId: int('solicitante_usuario_id'),
    descricao: text('descricao'),
    inicioPrevisto: date('inicio_previsto'),
    fimPrevisto: date('fim_previsto'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const vistoriasUnidades = mysqlTable("vistorias_unidades", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    usuarioId: int('usuario_id'),
    tipo: varchar('tipo', { length: 40 }),
    realizadaEm: datetime('realizada_em'),
    relatorioUrl: varchar('relatorio_url', { length: 500 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const animaisEstimacao = mysqlTable("animais_estimacao", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    unidadeId: int('unidade_id'),
    responsavelPessoaId: int('responsavel_pessoa_id'),
    tipoAnimalId: int('tipo_animal_id'),
    nome: varchar('nome', { length: 100 }),
    porte: varchar('porte', { length: 30 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const tiposAnimais = mysqlTable("tipos_animais", {
    id: int('id').primaryKey(),
    nome: varchar('nome', { length: 80 }),
    descricao: text('descricao')
});

export const registrosAnimais = mysqlTable("registros_animais", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    animalId: int('animal_id'),
    usuarioId: int('usuario_id'),
    evento: varchar('evento', { length: 100 }),
    detalhes: text('detalhes'),
    registradoEm: datetime('registrado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const logsAuditoria = mysqlTable("logs_auditoria", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    usuarioId: int('usuario_id'),
    acao: varchar('acao', { length: 80 }),
    entidade: varchar('entidade', { length: 100 }),
    entidadeId: int('entidade_id'),
    ip: varchar('ip', { length: 45 }),
    registradoEm: datetime('registrado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const historicoAlteracoes = mysqlTable("historico_alteracoes", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    usuarioId: int('usuario_id'),
    tabelaAfetada: varchar('tabela_afetada', { length: 100 }),
    registroId: int('registro_id'),
    valorAnterior: text('valor_anterior'),
    valorNovo: text('valor_novo'),
    alteradoEm: datetime('alterado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const sessoesUsuario = mysqlTable("sessoes_usuario", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    usuarioId: int('usuario_id'),
    tokenHash: varchar('token_hash', { length: 255 }),
    ip: varchar('ip', { length: 45 }),
    criadaEm: datetime('criada_em'),
    expiraEm: datetime('expira_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const consentimentos = mysqlTable("consentimentos", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    pessoaId: int('pessoa_id'),
    finalidade: varchar('finalidade', { length: 150 }),
    consentido: boolean('consentido'),
    registradoEm: datetime('registrado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const solicitacoesPrivacidade = mysqlTable("solicitacoes_privacidade", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    pessoaId: int('pessoa_id'),
    tipoSolicitacao: varchar('tipo_solicitacao', { length: 50 }),
    descricao: text('descricao'),
    status: varchar('status', { length: 30 }),
    criadaEm: datetime('criada_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const politicasRetencao = mysqlTable("politicas_retencao", {
    id: int('id').primaryKey(),
    nome: varchar('nome', { length: 150 }),
    entidade: varchar('entidade', { length: 100 }),
    prazoDias: int('prazo_dias'),
    acaoFinal: varchar('acao_final', { length: 50 })
});

export const relatoriosSalvos = mysqlTable("relatorios_salvos", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    usuarioId: int('usuario_id'),
    nome: varchar('nome', { length: 150 }),
    definicao: text('definicao'),
    visibilidade: varchar('visibilidade', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const execucoesRelatorios = mysqlTable("execucoes_relatorios", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    relatorioId: int('relatorio_id'),
    executadoPorUsuarioId: int('executado_por_usuario_id'),
    executadoEm: datetime('executado_em'),
    status: varchar('status', { length: 30 }),
    arquivoUrl: varchar('arquivo_url', { length: 500 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const indicadoresCondominio = mysqlTable("indicadores_condominio", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    codigo: varchar('codigo', { length: 100 }).unique(),
    valor: decimal('valor', { precision: 14, scale: 3 }),
    competencia: date('competencia'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const integracoes = mysqlTable("integracoes", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    nome: varchar('nome', { length: 120 }),
    provedor: varchar('provedor', { length: 120 }),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const credenciaisIntegracao = mysqlTable("credenciais_integracao", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    integracaoId: int('integracao_id'),
    tipo: varchar('tipo', { length: 50 }),
    segredoReferencia: varchar('segredo_referencia', { length: 255 }),
    rotacionadaEm: datetime('rotacionada_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const logsIntegracao = mysqlTable("logs_integracao", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    integracaoId: int('integracao_id'),
    evento: varchar('evento', { length: 100 }),
    status: varchar('status', { length: 30 }),
    mensagem: text('mensagem'),
    registradoEm: datetime('registrado_em'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const regrasAutomacao = mysqlTable("regras_automacao", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    nome: varchar('nome', { length: 150 }),
    gatilho: varchar('gatilho', { length: 100 }),
    condicoes: text('condicoes'),
    acoes: text('acoes'),
    ativa: boolean('ativa'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const tarefasAgendadas = mysqlTable("tarefas_agendadas", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    regraAutomacaoId: int('regra_automacao_id'),
    nome: varchar('nome', { length: 150 }),
    executarEm: datetime('executar_em'),
    status: varchar('status', { length: 30 }),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const execucoesAutomacao = mysqlTable("execucoes_automacao", {
    id: int('id').primaryKey(),
    condominioId: int('condominio_id'),
    tarefaAgendadaId: int('tarefa_agendada_id'),
    inicioEm: datetime('inicio_em'),
    fimEm: datetime('fim_em'),
    status: varchar('status', { length: 30 }),
    resultado: text('resultado'),
    createdAt: datetime('created_at'),
    updatedAt: datetime('updated_at')
});

export const ocorrencias = mysqlTable("ocorrencias", {
    id: int('id').primaryKey(),
    unidadeId: int('unidade_id'),
    usuarioId: int('usuario_id').notNull(),
    titulo: varchar('titulo', { length: 150 }).notNull(),
    descricao: text('descricao').notNull(),
    status: mysqlEnum('status', ["aberta", "em_andamento", "resolvida", "cancelada"]).notNull(),
    criadoEm: timestamp('criado_em'),
    atualizadoEm: timestamp('atualizado_em')
});
