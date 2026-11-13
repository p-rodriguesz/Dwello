CREATE TABLE `acessos_prestadores` (
	`id` int NOT NULL,
	`condominio_id` int,
	`prestador_id` int,
	`unidade_id` int,
	`entrada_em` datetime,
	`saida_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `acessos_prestadores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `acordos_divida` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`pessoa_id` int,
	`valor_negociado` decimal(12,2),
	`quantidade_parcelas` int,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `acordos_divida_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `aditivos_contratuais` (
	`id` int NOT NULL,
	`condominio_id` int,
	`contrato_fornecedor_id` int,
	`descricao` text,
	`valor_adicional` decimal(12,2),
	`vigente_desde` date,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `aditivos_contratuais_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `administradoras` (
	`id` int NOT NULL,
	`nome` varchar(150),
	`cnpj` varchar(18),
	`email` varchar(190),
	`telefone` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `administradoras_id` PRIMARY KEY(`id`),
	CONSTRAINT `administradoras_cnpj_unique` UNIQUE(`cnpj`),
	CONSTRAINT `administradoras_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `agendamentos_manutencao` (
	`id` int NOT NULL,
	`condominio_id` int,
	`tarefa_id` int,
	`previsto_em` datetime,
	`concluido_em` datetime,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `agendamentos_manutencao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `andares` (
	`id` int NOT NULL,
	`condominio_id` int,
	`bloco_id` int,
	`numero` int,
	`descricao` varchar(100),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `andares_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `anexos_manifestacoes` (
	`id` int NOT NULL,
	`condominio_id` int,
	`manifestacao_id` int,
	`arquivo_url` varchar(500),
	`nome_arquivo` varchar(180),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `anexos_manifestacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `animais_estimacao` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`responsavel_pessoa_id` int,
	`tipo_animal_id` int,
	`nome` varchar(100),
	`porte` varchar(30),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `animais_estimacao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `areas_comuns` (
	`id` int NOT NULL,
	`condominio_id` int,
	`nome` varchar(120),
	`capacidade` int,
	`requer_reserva` boolean,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `areas_comuns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `areas_limpeza` (
	`id` int NOT NULL,
	`condominio_id` int,
	`nome` varchar(120),
	`localizacao` varchar(150),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `areas_limpeza_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assembleias` (
	`id` int NOT NULL,
	`condominio_id` int,
	`titulo` varchar(150),
	`tipo` varchar(40),
	`data_hora` datetime,
	`local` varchar(180),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `assembleias_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ativos` (
	`id` int NOT NULL,
	`condominio_id` int,
	`categoria_id` int,
	`nome` varchar(150),
	`numero_patrimonio` varchar(80),
	`adquirido_em` date,
	`valor_aquisicao` decimal(12,2),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `ativos_id` PRIMARY KEY(`id`),
	CONSTRAINT `ativos_numero_patrimonio_unique` UNIQUE(`numero_patrimonio`)
);
--> statement-breakpoint
CREATE TABLE `autorizacoes_obra` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`solicitante_usuario_id` int,
	`descricao` text,
	`inicio_previsto` date,
	`fim_previsto` date,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `autorizacoes_obra_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `autorizacoes_visita` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`visitante_id` int,
	`autorizado_por_usuario_id` int,
	`inicio_previsto` datetime,
	`fim_previsto` datetime,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `autorizacoes_visita_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blocos` (
	`id` int NOT NULL,
	`condominio_id` int,
	`nome` varchar(80),
	`descricao` text,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `blocos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cameras` (
	`id` int NOT NULL,
	`condominio_id` int,
	`nome` varchar(100),
	`localizacao` varchar(150),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `cameras_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categorias_ativos` (
	`id` int NOT NULL,
	`nome` varchar(100),
	`descricao` text,
	CONSTRAINT `categorias_ativos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categorias_documento` (
	`id` int NOT NULL,
	`nome` varchar(100),
	`descricao` text,
	CONSTRAINT `categorias_documento_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categorias_solicitacao` (
	`id` int NOT NULL,
	`nome` varchar(100),
	`descricao` text,
	CONSTRAINT `categorias_solicitacao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chaves` (
	`id` int NOT NULL,
	`condominio_id` int,
	`identificacao` varchar(80),
	`localizacao` varchar(150),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `chaves_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `composicoes_taxa` (
	`id` int NOT NULL,
	`condominio_id` int,
	`taxa_id` int,
	`descricao` varchar(150),
	`valor` decimal(12,2),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `composicoes_taxa_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comunicados` (
	`id` int NOT NULL,
	`condominio_id` int,
	`autor_usuario_id` int,
	`titulo` varchar(180),
	`conteudo` text,
	`publicado_em` datetime,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `comunicados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conciliacoes` (
	`id` int NOT NULL,
	`condominio_id` int,
	`item_extrato_id` int,
	`movimentacao_id` int,
	`status` varchar(30),
	`conciliado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `conciliacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `condominio_administradoras` (
	`id` int NOT NULL,
	`condominio_id` int,
	`administradora_id` int,
	`inicio_em` date,
	`fim_em` date,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `condominio_administradoras_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `condominios` (
	`id` int NOT NULL,
	`nome` varchar(150),
	`cnpj` varchar(18),
	`tipo_condominio_id` int,
	`endereco_id` int,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `condominios_id` PRIMARY KEY(`id`),
	CONSTRAINT `condominios_cnpj_unique` UNIQUE(`cnpj`)
);
--> statement-breakpoint
CREATE TABLE `configuracoes_condominio` (
	`id` int NOT NULL,
	`condominio_id` int,
	`chave` varchar(100),
	`valor` text,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `configuracoes_condominio_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conselheiros` (
	`id` int NOT NULL,
	`condominio_id` int,
	`mandato_id` int,
	`pessoa_id` int,
	`cargo` varchar(80),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `conselheiros_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consentimentos` (
	`id` int NOT NULL,
	`condominio_id` int,
	`pessoa_id` int,
	`finalidade` varchar(150),
	`consentido` boolean,
	`registrado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `consentimentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consumos_mensais` (
	`id` int NOT NULL,
	`condominio_id` int,
	`medidor_id` int,
	`competencia` date,
	`consumo` decimal(14,3),
	`valor_estimado` decimal(12,2),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `consumos_mensais_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contas_bancarias` (
	`id` int NOT NULL,
	`condominio_id` int,
	`banco` varchar(100),
	`agencia` varchar(20),
	`numero_conta` varchar(30),
	`tipo` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `contas_bancarias_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contas_pagar` (
	`id` int NOT NULL,
	`condominio_id` int,
	`fornecedor_id` int,
	`descricao` varchar(180),
	`valor_total` decimal(12,2),
	`emissao_em` date,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `contas_pagar_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contas_receber` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`descricao` varchar(180),
	`valor_total` decimal(12,2),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `contas_receber_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contatos` (
	`id` int NOT NULL,
	`pessoa_id` int,
	`tipo` varchar(30),
	`valor` varchar(190),
	`principal` boolean,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `contatos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contratos_administracao` (
	`id` int NOT NULL,
	`condominio_id` int,
	`administradora_id` int,
	`inicio_em` date,
	`fim_em` date,
	`valor_mensal` decimal(12,2),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `contratos_administracao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contratos_fornecedores` (
	`id` int NOT NULL,
	`condominio_id` int,
	`fornecedor_id` int,
	`numero_contrato` varchar(80),
	`inicio_em` date,
	`fim_em` date,
	`valor` decimal(12,2),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `contratos_fornecedores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `credenciais_acesso` (
	`id` int NOT NULL,
	`pessoa_id` int,
	`condominio_id` int,
	`tipo` varchar(40),
	`codigo_hash` varchar(255),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `credenciais_acesso_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `credenciais_integracao` (
	`id` int NOT NULL,
	`condominio_id` int,
	`integracao_id` int,
	`tipo` varchar(50),
	`segredo_referencia` varchar(255),
	`rotacionada_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `credenciais_integracao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `debitos_condominiais` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`lancamento_unidade_id` int,
	`valor_original` decimal(12,2),
	`saldo_atual` decimal(12,2),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `debitos_condominiais_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `destinacoes_fundos` (
	`id` int NOT NULL,
	`condominio_id` int,
	`fundo_id` int,
	`movimentacao_id` int,
	`destino` varchar(180),
	`valor` decimal(12,2),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `destinacoes_fundos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `destinatarios_comunicados` (
	`id` int NOT NULL,
	`condominio_id` int,
	`comunicado_id` int,
	`usuario_id` int,
	`lido` boolean,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `destinatarios_comunicados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dispositivos_acesso` (
	`id` int NOT NULL,
	`condominio_id` int,
	`nome` varchar(100),
	`tipo` varchar(50),
	`localizacao` varchar(150),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `dispositivos_acesso_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documentos` (
	`id` int NOT NULL,
	`condominio_id` int,
	`categoria_id` int,
	`enviado_por_usuario_id` int,
	`titulo` varchar(180),
	`arquivo_url` varchar(500),
	`visibilidade` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `documentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `empresas_prestadoras` (
	`id` int NOT NULL,
	`nome` varchar(150),
	`cnpj` varchar(18),
	`telefone` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `empresas_prestadoras_id` PRIMARY KEY(`id`),
	CONSTRAINT `empresas_prestadoras_cnpj_unique` UNIQUE(`cnpj`)
);
--> statement-breakpoint
CREATE TABLE `encomendas` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`transportadora_id` int,
	`recebido_por_usuario_id` int,
	`codigo_rastreio` varchar(100),
	`recebida_em` datetime,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `encomendas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enderecos` (
	`id` int NOT NULL,
	`logradouro` varchar(150),
	`numero` varchar(20),
	`complemento` varchar(100),
	`bairro` varchar(100),
	`cidade` varchar(100),
	`uf` char(2),
	`cep` varchar(9),
	CONSTRAINT `enderecos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enderecos_complementos` (
	`id` int NOT NULL,
	`condominio_id` int,
	`endereco_id` int,
	`tipo` varchar(50),
	`valor` varchar(150),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `enderecos_complementos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enderecos_unidades` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`endereco_id` int,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `enderecos_unidades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `envolvidos_ocorrencias` (
	`id` int NOT NULL,
	`condominio_id` int,
	`ocorrencia_id` int,
	`pessoa_id` int,
	`papel` varchar(50),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `envolvidos_ocorrencias_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `equipamentos_lazer` (
	`id` int NOT NULL,
	`condominio_id` int,
	`area_comum_id` int,
	`nome` varchar(120),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `equipamentos_lazer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evidencias_ocorrencias` (
	`id` int NOT NULL,
	`condominio_id` int,
	`ocorrencia_id` int,
	`arquivo_url` varchar(500),
	`tipo` varchar(50),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `evidencias_ocorrencias_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `execucoes_automacao` (
	`id` int NOT NULL,
	`condominio_id` int,
	`tarefa_agendada_id` int,
	`inicio_em` datetime,
	`fim_em` datetime,
	`status` varchar(30),
	`resultado` text,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `execucoes_automacao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `execucoes_limpeza` (
	`id` int NOT NULL,
	`condominio_id` int,
	`rotina_id` int,
	`executada_por_usuario_id` int,
	`executada_em` datetime,
	`observacoes` text,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `execucoes_limpeza_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `execucoes_relatorios` (
	`id` int NOT NULL,
	`condominio_id` int,
	`relatorio_id` int,
	`executado_por_usuario_id` int,
	`executado_em` datetime,
	`status` varchar(30),
	`arquivo_url` varchar(500),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `execucoes_relatorios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `extratos_bancarios` (
	`id` int NOT NULL,
	`condominio_id` int,
	`conta_bancaria_id` int,
	`periodo_inicio` date,
	`periodo_fim` date,
	`arquivo_url` varchar(500),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `extratos_bancarios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fornecedores` (
	`id` int NOT NULL,
	`nome` varchar(150),
	`cnpj` varchar(18),
	`email` varchar(190),
	`telefone` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `fornecedores_id` PRIMARY KEY(`id`),
	CONSTRAINT `fornecedores_cnpj_unique` UNIQUE(`cnpj`),
	CONSTRAINT `fornecedores_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `funcionarios_portaria` (
	`id` int NOT NULL,
	`condominio_id` int,
	`pessoa_id` int,
	`matricula` varchar(40),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `funcionarios_portaria_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fundos` (
	`id` int NOT NULL,
	`condominio_id` int,
	`nome` varchar(100),
	`saldo_inicial` decimal(12,2),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `fundos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gestores` (
	`id` int NOT NULL,
	`condominio_id` int,
	`pessoa_id` int,
	`tipo_gestor` varchar(50),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `gestores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `historico_alteracoes` (
	`id` int NOT NULL,
	`condominio_id` int,
	`usuario_id` int,
	`tabela_afetada` varchar(100),
	`registro_id` int,
	`valor_anterior` text,
	`valor_novo` text,
	`alterado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `historico_alteracoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `historico_ativos` (
	`id` int NOT NULL,
	`condominio_id` int,
	`ativo_id` int,
	`usuario_id` int,
	`evento` varchar(100),
	`detalhes` text,
	`registrado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `historico_ativos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `historico_chaves` (
	`id` int NOT NULL,
	`condominio_id` int,
	`chave_id` int,
	`usuario_id` int,
	`evento` varchar(80),
	`registrado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `historico_chaves_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `historico_cobrancas` (
	`id` int NOT NULL,
	`condominio_id` int,
	`debito_id` int,
	`usuario_id` int,
	`acao` varchar(80),
	`detalhes` text,
	`registrado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `historico_cobrancas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `historico_notificacoes` (
	`id` int NOT NULL,
	`condominio_id` int,
	`notificacao_id` int,
	`status` varchar(30),
	`detalhes` text,
	`registrado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `historico_notificacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `historico_ordens_servico` (
	`id` int NOT NULL,
	`condominio_id` int,
	`ordem_servico_id` int,
	`usuario_id` int,
	`status_anterior` varchar(30),
	`status_novo` varchar(30),
	`comentario` text,
	`registrado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `historico_ordens_servico_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `historico_solicitacoes` (
	`id` int NOT NULL,
	`condominio_id` int,
	`solicitacao_id` int,
	`usuario_id` int,
	`status_anterior` varchar(30),
	`status_novo` varchar(30),
	`comentario` text,
	`registrado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `historico_solicitacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `historico_unidades` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`usuario_id` int,
	`evento` varchar(100),
	`detalhes` text,
	`registrado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `historico_unidades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `incidentes` (
	`id` int NOT NULL,
	`condominio_id` int,
	`camera_id` int,
	`ocorrencia_id` int,
	`descricao` text,
	`ocorrido_em` datetime,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `incidentes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `indicadores_condominio` (
	`id` int NOT NULL,
	`condominio_id` int,
	`codigo` varchar(100),
	`valor` decimal(14,3),
	`competencia` date,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `indicadores_condominio_id` PRIMARY KEY(`id`),
	CONSTRAINT `indicadores_condominio_codigo_unique` UNIQUE(`codigo`)
);
--> statement-breakpoint
CREATE TABLE `inscricoes_atividades` (
	`id` int NOT NULL,
	`condominio_id` int,
	`equipamento_lazer_id` int,
	`pessoa_id` int,
	`atividade` varchar(120),
	`inicio_em` datetime,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `inscricoes_atividades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `integracoes` (
	`id` int NOT NULL,
	`condominio_id` int,
	`nome` varchar(120),
	`provedor` varchar(120),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `integracoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventarios` (
	`id` int NOT NULL,
	`condominio_id` int,
	`responsavel_usuario_id` int,
	`realizado_em` datetime,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `inventarios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `itens_extrato` (
	`id` int NOT NULL,
	`condominio_id` int,
	`extrato_id` int,
	`data_movimento` date,
	`descricao` varchar(180),
	`valor` decimal(12,2),
	`tipo` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `itens_extrato_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `itens_orcamento` (
	`id` int NOT NULL,
	`condominio_id` int,
	`orcamento_id` int,
	`plano_conta_id` int,
	`descricao` varchar(180),
	`valor_previsto` decimal(12,2),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `itens_orcamento_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lancamentos_contabeis` (
	`id` int NOT NULL,
	`condominio_id` int,
	`periodo_id` int,
	`plano_conta_id` int,
	`descricao` varchar(180),
	`debito` decimal(12,2),
	`credito` decimal(12,2),
	`lancado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `lancamentos_contabeis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lancamentos_unidades` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`taxa_id` int,
	`competencia` date,
	`valor` decimal(12,2),
	`vencimento_em` date,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `lancamentos_unidades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leituras_comunicados` (
	`id` int NOT NULL,
	`condominio_id` int,
	`comunicado_id` int,
	`usuario_id` int,
	`lido_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `leituras_comunicados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leituras_medidores` (
	`id` int NOT NULL,
	`condominio_id` int,
	`medidor_id` int,
	`leitura` decimal(14,3),
	`lida_em` datetime,
	`usuario_id` int,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `leituras_medidores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `logs_auditoria` (
	`id` int NOT NULL,
	`condominio_id` int,
	`usuario_id` int,
	`acao` varchar(80),
	`entidade` varchar(100),
	`entidade_id` int,
	`ip` varchar(45),
	`registrado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `logs_auditoria_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `logs_integracao` (
	`id` int NOT NULL,
	`condominio_id` int,
	`integracao_id` int,
	`evento` varchar(100),
	`status` varchar(30),
	`mensagem` text,
	`registrado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `logs_integracao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mandatos` (
	`id` int NOT NULL,
	`condominio_id` int,
	`gestor_id` int,
	`inicio_em` date,
	`fim_em` date,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `mandatos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `manifestacoes` (
	`id` int NOT NULL,
	`condominio_id` int,
	`usuario_id` int,
	`tipo` varchar(30),
	`assunto` varchar(150),
	`descricao` text,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `manifestacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medidores` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`tipo` varchar(30),
	`numero_serie` varchar(100),
	`instalado_em` date,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `medidores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moradores` (
	`id` int NOT NULL,
	`condominio_id` int,
	`pessoa_id` int,
	`data_inicio` date,
	`data_fim` date,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `moradores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `movimentacoes_estoque` (
	`id` int NOT NULL,
	`condominio_id` int,
	`produto_id` int,
	`usuario_id` int,
	`tipo` varchar(30),
	`quantidade` decimal(12,3),
	`ocorrido_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `movimentacoes_estoque_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `movimentacoes_financeiras` (
	`id` int NOT NULL,
	`condominio_id` int,
	`conta_bancaria_id` int,
	`tipo` varchar(30),
	`descricao` varchar(180),
	`valor` decimal(12,2),
	`ocorrido_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `movimentacoes_financeiras_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `movimentacoes_fundos` (
	`id` int NOT NULL,
	`condominio_id` int,
	`fundo_id` int,
	`tipo` varchar(30),
	`valor` decimal(12,2),
	`descricao` varchar(180),
	`ocorrido_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `movimentacoes_fundos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notificacoes` (
	`id` int NOT NULL,
	`condominio_id` int,
	`usuario_id` int,
	`titulo` varchar(150),
	`mensagem` text,
	`canal` varchar(30),
	`lida_em` datetime,
	`criada_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `notificacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ocorrencias_seguranca` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`registrada_por_usuario_id` int,
	`titulo` varchar(150),
	`descricao` text,
	`gravidade` varchar(30),
	`ocorrida_em` datetime,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `ocorrencias_seguranca_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `opcoes_votacao` (
	`id` int NOT NULL,
	`condominio_id` int,
	`votacao_id` int,
	`descricao` varchar(150),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `opcoes_votacao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orcamentos` (
	`id` int NOT NULL,
	`condominio_id` int,
	`ano` int,
	`descricao` varchar(180),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `orcamentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ordens_servico` (
	`id` int NOT NULL,
	`condominio_id` int,
	`ativo_id` int,
	`solicitacao_id` int,
	`fornecedor_id` int,
	`titulo` varchar(150),
	`descricao` text,
	`prioridade` varchar(30),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `ordens_servico_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pagamentos_fornecedores` (
	`id` int NOT NULL,
	`condominio_id` int,
	`parcela_pagar_id` int,
	`conta_bancaria_id` int,
	`valor_pago` decimal(12,2),
	`pago_em` datetime,
	`referencia` varchar(150),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `pagamentos_fornecedores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `parcelas_pagar` (
	`id` int NOT NULL,
	`condominio_id` int,
	`conta_pagar_id` int,
	`numero_parcela` int,
	`valor` decimal(12,2),
	`vencimento_em` date,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `parcelas_pagar_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `parcelas_receber` (
	`id` int NOT NULL,
	`condominio_id` int,
	`conta_receber_id` int,
	`numero_parcela` int,
	`valor` decimal(12,2),
	`vencimento_em` date,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `parcelas_receber_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `participantes_assembleia` (
	`id` int NOT NULL,
	`condominio_id` int,
	`assembleia_id` int,
	`pessoa_id` int,
	`unidade_id` int,
	`presenca` boolean,
	`procuracao_url` varchar(500),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `participantes_assembleia_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pautas_assembleia` (
	`id` int NOT NULL,
	`condominio_id` int,
	`assembleia_id` int,
	`titulo` varchar(150),
	`descricao` text,
	`ordem` int,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `pautas_assembleia_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `perfil_permissoes` (
	`id` int NOT NULL,
	`condominio_id` int,
	`perfil_id` int,
	`permissao_id` int,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `perfil_permissoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `perfis` (
	`id` int NOT NULL,
	`condominio_id` int,
	`nome` varchar(80),
	`descricao` text,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `perfis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `periodos_contabeis` (
	`id` int NOT NULL,
	`condominio_id` int,
	`ano` int,
	`mes` int,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `periodos_contabeis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permissoes` (
	`id` int NOT NULL,
	`codigo` varchar(100),
	`descricao` text,
	CONSTRAINT `permissoes_id` PRIMARY KEY(`id`),
	CONSTRAINT `permissoes_codigo_unique` UNIQUE(`codigo`)
);
--> statement-breakpoint
CREATE TABLE `permissoes_documento` (
	`id` int NOT NULL,
	`condominio_id` int,
	`documento_id` int,
	`perfil_id` int,
	`pode_visualizar` boolean,
	`pode_editar` boolean,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `permissoes_documento_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pessoas` (
	`id` int NOT NULL,
	`nome` varchar(150),
	`documento` varchar(30),
	`data_nascimento` date,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `pessoas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plano_contas` (
	`id` int NOT NULL,
	`condominio_id` int,
	`codigo` varchar(30),
	`nome` varchar(150),
	`tipo` varchar(30),
	`conta_pai_id` int,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `plano_contas_id` PRIMARY KEY(`id`),
	CONSTRAINT `plano_contas_codigo_unique` UNIQUE(`codigo`)
);
--> statement-breakpoint
CREATE TABLE `planos_manutencao` (
	`id` int NOT NULL,
	`condominio_id` int,
	`ativo_id` int,
	`nome` varchar(150),
	`frequencia_dias` int,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `planos_manutencao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `politicas_retencao` (
	`id` int NOT NULL,
	`nome` varchar(150),
	`entidade` varchar(100),
	`prazo_dias` int,
	`acao_final` varchar(50),
	CONSTRAINT `politicas_retencao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `postos_portaria` (
	`id` int NOT NULL,
	`condominio_id` int,
	`nome` varchar(80),
	`localizacao` varchar(150),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `postos_portaria_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `preferencias_notificacao` (
	`id` int NOT NULL,
	`condominio_id` int,
	`usuario_id` int,
	`canal` varchar(30),
	`habilitada` boolean,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `preferencias_notificacao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prestadores` (
	`id` int NOT NULL,
	`condominio_id` int,
	`pessoa_id` int,
	`empresa_id` int,
	`especialidade` varchar(100),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `prestadores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `problemas_reportados` (
	`id` int NOT NULL,
	`condominio_id` int,
	`ordem_servico_id` int,
	`usuario_id` int,
	`descricao` text,
	`reportado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `problemas_reportados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `produtos_estoque` (
	`id` int NOT NULL,
	`condominio_id` int,
	`nome` varchar(150),
	`sku` varchar(80),
	`unidade_medida` varchar(30),
	`quantidade_atual` decimal(12,3),
	`estoque_minimo` decimal(12,3),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `produtos_estoque_id` PRIMARY KEY(`id`),
	CONSTRAINT `produtos_estoque_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `proprietarios` (
	`id` int NOT NULL,
	`condominio_id` int,
	`pessoa_id` int,
	`observacoes` text,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `proprietarios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recebimentos` (
	`id` int NOT NULL,
	`condominio_id` int,
	`parcela_receber_id` int,
	`valor_recebido` decimal(12,2),
	`recebido_em` datetime,
	`metodo` varchar(40),
	`referencia` varchar(150),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `recebimentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `registros_acesso` (
	`id` int NOT NULL,
	`condominio_id` int,
	`credencial_id` int,
	`dispositivo_id` int,
	`evento` varchar(30),
	`ocorrido_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `registros_acesso_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `registros_animais` (
	`id` int NOT NULL,
	`condominio_id` int,
	`animal_id` int,
	`usuario_id` int,
	`evento` varchar(100),
	`detalhes` text,
	`registrado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `registros_animais_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `registros_monitoramento` (
	`id` int NOT NULL,
	`condominio_id` int,
	`camera_id` int,
	`incidente_id` int,
	`referencia_gravacao` varchar(500),
	`registrado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `registros_monitoramento_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `registros_utilizacao` (
	`id` int NOT NULL,
	`condominio_id` int,
	`equipamento_lazer_id` int,
	`pessoa_id` int,
	`utilizado_em` datetime,
	`observacoes` text,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `registros_utilizacao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `regras_automacao` (
	`id` int NOT NULL,
	`condominio_id` int,
	`nome` varchar(150),
	`gatilho` varchar(100),
	`condicoes` text,
	`acoes` text,
	`ativa` boolean,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `regras_automacao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `regras_reserva` (
	`id` int NOT NULL,
	`condominio_id` int,
	`area_comum_id` int,
	`antecedencia_max_dias` int,
	`duracao_max_horas` int,
	`taxa_reserva` decimal(12,2),
	`regras` text,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `regras_reserva_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `relatorios_salvos` (
	`id` int NOT NULL,
	`condominio_id` int,
	`usuario_id` int,
	`nome` varchar(150),
	`definicao` text,
	`visibilidade` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `relatorios_salvos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reservas` (
	`id` int NOT NULL,
	`condominio_id` int,
	`area_comum_id` int,
	`unidade_id` int,
	`usuario_id` int,
	`inicio_em` datetime,
	`fim_em` datetime,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `reservas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `respostas_manifestacoes` (
	`id` int NOT NULL,
	`condominio_id` int,
	`manifestacao_id` int,
	`usuario_id` int,
	`resposta` text,
	`respondida_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `respostas_manifestacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `retiradas_chaves` (
	`id` int NOT NULL,
	`condominio_id` int,
	`chave_id` int,
	`usuario_id` int,
	`retirada_em` datetime,
	`devolucao_prevista_em` datetime,
	`devolvida_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `retiradas_chaves_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `retiradas_encomendas` (
	`id` int NOT NULL,
	`condominio_id` int,
	`encomenda_id` int,
	`retirado_por_pessoa_id` int,
	`entregue_por_usuario_id` int,
	`retirada_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `retiradas_encomendas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `revisoes_orcamento` (
	`id` int NOT NULL,
	`condominio_id` int,
	`orcamento_id` int,
	`usuario_id` int,
	`motivo` text,
	`revisado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `revisoes_orcamento_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rotinas_limpeza` (
	`id` int NOT NULL,
	`condominio_id` int,
	`area_id` int,
	`nome` varchar(120),
	`frequencia` varchar(40),
	`responsavel_usuario_id` int,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `rotinas_limpeza_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessoes_usuario` (
	`id` int NOT NULL,
	`condominio_id` int,
	`usuario_id` int,
	`token_hash` varchar(255),
	`ip` varchar(45),
	`criada_em` datetime,
	`expira_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `sessoes_usuario_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `setores` (
	`id` int NOT NULL,
	`condominio_id` int,
	`nome` varchar(100),
	`descricao` text,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `setores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `solicitacoes` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`solicitante_usuario_id` int,
	`categoria_id` int,
	`titulo` varchar(150),
	`descricao` text,
	`status` varchar(30),
	`criada_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `solicitacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `solicitacoes_mudanca` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`usuario_id` int,
	`data_prevista` datetime,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `solicitacoes_mudanca_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `solicitacoes_privacidade` (
	`id` int NOT NULL,
	`condominio_id` int,
	`pessoa_id` int,
	`tipo_solicitacao` varchar(50),
	`descricao` text,
	`status` varchar(30),
	`criada_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `solicitacoes_privacidade_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tarefas_agendadas` (
	`id` int NOT NULL,
	`condominio_id` int,
	`regra_automacao_id` int,
	`nome` varchar(150),
	`executar_em` datetime,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `tarefas_agendadas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tarefas_preventivas` (
	`id` int NOT NULL,
	`condominio_id` int,
	`plano_id` int,
	`titulo` varchar(150),
	`descricao` text,
	`responsavel_usuario_id` int,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `tarefas_preventivas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `taxas_condominiais` (
	`id` int NOT NULL,
	`condominio_id` int,
	`nome` varchar(120),
	`periodicidade` varchar(30),
	`valor_base` decimal(12,2),
	`ativa` boolean,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `taxas_condominiais_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tipos_animais` (
	`id` int NOT NULL,
	`nome` varchar(80),
	`descricao` text,
	CONSTRAINT `tipos_animais_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tipos_condominio` (
	`id` int NOT NULL,
	`nome` varchar(80),
	`descricao` text,
	CONSTRAINT `tipos_condominio_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tipos_unidade` (
	`id` int NOT NULL,
	`nome` varchar(80),
	`descricao` text,
	CONSTRAINT `tipos_unidade_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transferencias` (
	`id` int NOT NULL,
	`condominio_id` int,
	`conta_origem_id` int,
	`conta_destino_id` int,
	`valor` decimal(12,2),
	`transferida_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `transferencias_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transportadoras` (
	`id` int NOT NULL,
	`nome` varchar(120),
	`documento` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `transportadoras_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `turnos_portaria` (
	`id` int NOT NULL,
	`condominio_id` int,
	`funcionario_portaria_id` int,
	`inicio_em` datetime,
	`fim_em` datetime,
	`posto_id` int,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `turnos_portaria_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `unidades` (
	`id` int NOT NULL,
	`condominio_id` int,
	`bloco_id` int,
	`tipo_unidade_id` int,
	`identificacao` varchar(30),
	`area_m2` decimal(10,2),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `unidades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usuario_perfis` (
	`id` int NOT NULL,
	`usuario_id` int,
	`perfil_id` int,
	`condominio_id` int,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `usuario_perfis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` int NOT NULL,
	`condominio_id` int,
	`pessoa_id` int,
	`email` varchar(190),
	`senha_hash` varchar(255),
	`status` varchar(30),
	`ultimo_acesso_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `usuarios_id` PRIMARY KEY(`id`),
	CONSTRAINT `usuarios_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `vagas_garagem` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`identificacao` varchar(30),
	`tipo` varchar(30),
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `vagas_garagem_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `veiculos` (
	`id` int NOT NULL,
	`condominio_id` int,
	`pessoa_id` int,
	`unidade_id` int,
	`placa` varchar(10),
	`modelo` varchar(100),
	`cor` varchar(50),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `veiculos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vinculos_unidades` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`pessoa_id` int,
	`tipo_vinculo` varchar(30),
	`inicio_em` date,
	`fim_em` date,
	`principal` boolean,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `vinculos_unidades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vinculos_vagas` (
	`id` int NOT NULL,
	`condominio_id` int,
	`vaga_id` int,
	`unidade_id` int,
	`inicio_em` date,
	`fim_em` date,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `vinculos_vagas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visitantes` (
	`id` int NOT NULL,
	`condominio_id` int,
	`nome` varchar(150),
	`documento` varchar(30),
	`telefone` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `visitantes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visitas` (
	`id` int NOT NULL,
	`condominio_id` int,
	`autorizacao_id` int,
	`entrada_em` datetime,
	`saida_em` datetime,
	`registrado_por_usuario_id` int,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `visitas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vistorias_unidades` (
	`id` int NOT NULL,
	`condominio_id` int,
	`unidade_id` int,
	`usuario_id` int,
	`tipo` varchar(40),
	`realizada_em` datetime,
	`relatorio_url` varchar(500),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `vistorias_unidades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `votacoes` (
	`id` int NOT NULL,
	`condominio_id` int,
	`assembleia_id` int,
	`pauta_id` int,
	`titulo` varchar(150),
	`inicio_em` datetime,
	`fim_em` datetime,
	`status` varchar(30),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `votacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `votos` (
	`id` int NOT NULL,
	`condominio_id` int,
	`votacao_id` int,
	`opcao_id` int,
	`pessoa_id` int,
	`unidade_id` int,
	`votado_em` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `votos_id` PRIMARY KEY(`id`)
);
