-- Execute este arquivo em MySQL 8+ para criar o banco e os dados de exemplo.
CREATE DATABASE IF NOT EXISTS dwello CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dwello;

CREATE TABLE `user` (
  `id` varchar(36) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `emailVerified` boolean NOT NULL DEFAULT false,
  `image` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
);

CREATE TABLE `session` (
  `id` varchar(36) PRIMARY KEY,
  `expiresAt` datetime NOT NULL,
  `token` varchar(255) NOT NULL UNIQUE,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ipAddress` varchar(45),
  `userAgent` text,
  `userId` varchar(36) NOT NULL,
  CONSTRAINT `session_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

CREATE TABLE `account` (
  `id` varchar(36) PRIMARY KEY,
  `accountId` varchar(255) NOT NULL,
  `providerId` varchar(255) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `accessToken` text,
  `refreshToken` text,
  `idToken` text,
  `accessTokenExpiresAt` datetime,
  `refreshTokenExpiresAt` datetime,
  `scope` text,
  `password` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  UNIQUE KEY `account_provider_account_unique` (`providerId`, `accountId`),
  CONSTRAINT `account_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

CREATE TABLE `verification` (
  `id` varchar(36) PRIMARY KEY,
  `identifier` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `createdAt` datetime,
  `updatedAt` datetime
);

CREATE TABLE `condominios` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(150),
  `cnpj` varchar(18) UNIQUE,
  `tipo_condominio_id` int,
  `endereco_id` int,
  `endereco` varchar(255),
  `status` varchar(30),
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `tipos_condominio` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(80),
  `descricao` text
);

CREATE TABLE `configuracoes_condominio` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `chave` varchar(100),
  `valor` text,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `blocos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `nome` varchar(80),
  `descricao` text,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `andares` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `bloco_id` int,
  `numero` int,
  `descricao` varchar(100),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `setores` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `nome` varchar(100),
  `descricao` text,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `unidades` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `bloco_id` int,
  `tipo_unidade_id` int,
  `bloco` varchar(50),
  `numero` varchar(20),
  `identificacao` varchar(30),
  `area_m2` decimal(10,2),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `tipos_unidade` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(80),
  `descricao` text
);

CREATE TABLE `historico_unidades` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `usuario_id` int,
  `evento` varchar(100),
  `detalhes` text,
  `registrado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `usuarios` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `pessoa_id` int,
  `auth_user_id` varchar(64) UNIQUE,
  `nome` varchar(150),
  `email` varchar(190) UNIQUE,
  `senha_hash` varchar(255),
  `perfil` varchar(30) DEFAULT 'MORADOR',
  `ativo` boolean NOT NULL DEFAULT true,
  `status` varchar(30),
  `ultimo_acesso_em` datetime,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `pessoas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(150),
  `documento` varchar(30),
  `data_nascimento` date,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `contatos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `pessoa_id` int,
  `tipo` varchar(30),
  `valor` varchar(190),
  `principal` boolean,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `proprietarios` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `pessoa_id` int,
  `observacoes` text,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `moradores` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `pessoa_id` int,
  `usuario_id` int,
  `unidade_id` int,
  `tipo_vinculo` varchar(30) DEFAULT 'proprietario',
  `data_inicio` date,
  `data_fim` date,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `vinculos_unidades` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `pessoa_id` int,
  `tipo_vinculo` varchar(30),
  `inicio_em` date,
  `fim_em` date,
  `principal` boolean,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `perfis` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `nome` varchar(80),
  `descricao` text,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `permissoes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `codigo` varchar(100) UNIQUE,
  `descricao` text
);

CREATE TABLE `perfil_permissoes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `perfil_id` int,
  `permissao_id` int,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `usuario_perfis` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `usuario_id` int,
  `perfil_id` int,
  `condominio_id` int,
  `perfil` varchar(30),
  `ativo` boolean NOT NULL DEFAULT true,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime,
  `updated_at` datetime,
  UNIQUE KEY `usuario_condominio_perfil` (`usuario_id`, `condominio_id`),
  KEY `usuario_perfis_condominio_id` (`condominio_id`)
);

CREATE TABLE `gestores` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `pessoa_id` int,
  `tipo_gestor` varchar(50),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `mandatos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `gestor_id` int,
  `inicio_em` date,
  `fim_em` date,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `conselheiros` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `mandato_id` int,
  `pessoa_id` int,
  `cargo` varchar(80),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `administradoras` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(150),
  `cnpj` varchar(18) UNIQUE,
  `email` varchar(190) UNIQUE,
  `telefone` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `contratos_administracao` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `administradora_id` int,
  `inicio_em` date,
  `fim_em` date,
  `valor_mensal` decimal(12,2),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `condominio_administradoras` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `administradora_id` int,
  `inicio_em` date,
  `fim_em` date,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `vagas_garagem` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `identificacao` varchar(30),
  `tipo` varchar(30),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `vinculos_vagas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `vaga_id` int,
  `unidade_id` int,
  `inicio_em` date,
  `fim_em` date,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `veiculos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `pessoa_id` int,
  `unidade_id` int,
  `placa` varchar(10),
  `modelo` varchar(100),
  `cor` varchar(50),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `enderecos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `logradouro` varchar(150),
  `numero` varchar(20),
  `complemento` varchar(100),
  `bairro` varchar(100),
  `cidade` varchar(100),
  `uf` char(2),
  `cep` varchar(9)
);

CREATE TABLE `enderecos_unidades` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `endereco_id` int,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `enderecos_complementos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `endereco_id` int,
  `tipo` varchar(50),
  `valor` varchar(150),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `visitantes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `nome` varchar(150),
  `documento` varchar(30),
  `telefone` varchar(30),
  `foto_url` varchar(255),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `autorizacoes_visita` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `visitante_id` int,
  `autorizado_por_usuario_id` int,
  `inicio_previsto` datetime,
  `fim_previsto` datetime,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `visitas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `autorizacao_id` int,
  `entrada_em` datetime,
  `saida_em` datetime,
  `registrado_por_usuario_id` int,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `funcionarios_portaria` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `pessoa_id` int,
  `matricula` varchar(40),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `turnos_portaria` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `funcionario_portaria_id` int,
  `inicio_em` datetime,
  `fim_em` datetime,
  `posto_id` int,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `postos_portaria` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `nome` varchar(80),
  `localizacao` varchar(150),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `encomendas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `transportadora_id` int,
  `recebido_por_usuario_id` int,
  `codigo_rastreio` varchar(100),
  `recebida_em` datetime,
  `status` varchar(30),
  `foto_url` varchar(255),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `transportadoras` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(120),
  `documento` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `retiradas_encomendas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `encomenda_id` int,
  `retirado_por_pessoa_id` int,
  `entregue_por_usuario_id` int,
  `retirada_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `prestadores` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `pessoa_id` int,
  `empresa_id` int,
  `especialidade` varchar(100),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `empresas_prestadoras` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(150),
  `cnpj` varchar(18) UNIQUE,
  `telefone` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `acessos_prestadores` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `prestador_id` int,
  `unidade_id` int,
  `entrada_em` datetime,
  `saida_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `credenciais_acesso` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `pessoa_id` int,
  `condominio_id` int,
  `tipo` varchar(40),
  `codigo_hash` varchar(255),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `registros_acesso` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `credencial_id` int,
  `dispositivo_id` int,
  `evento` varchar(30),
  `ocorrido_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `dispositivos_acesso` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `nome` varchar(100),
  `tipo` varchar(50),
  `localizacao` varchar(150),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `chaves` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `identificacao` varchar(80),
  `localizacao` varchar(150),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `retiradas_chaves` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `chave_id` int,
  `usuario_id` int,
  `retirada_em` datetime,
  `devolucao_prevista_em` datetime,
  `devolvida_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `historico_chaves` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `chave_id` int,
  `usuario_id` int,
  `evento` varchar(80),
  `registrado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `ocorrencias_seguranca` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `registrada_por_usuario_id` int,
  `titulo` varchar(150),
  `descricao` text,
  `gravidade` varchar(30),
  `ocorrida_em` datetime,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `envolvidos_ocorrencias` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `ocorrencia_id` int,
  `pessoa_id` int,
  `papel` varchar(50),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `evidencias_ocorrencias` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `ocorrencia_id` int,
  `arquivo_url` varchar(500),
  `tipo` varchar(50),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `cameras` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `nome` varchar(100),
  `localizacao` varchar(150),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `incidentes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `camera_id` int,
  `ocorrencia_id` int,
  `descricao` text,
  `ocorrido_em` datetime,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `registros_monitoramento` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `camera_id` int,
  `incidente_id` int,
  `referencia_gravacao` varchar(500),
  `registrado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `comunicados` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `autor_usuario_id` int,
  `titulo` varchar(180),
  `conteudo` text,
  `publicado_em` datetime,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `destinatarios_comunicados` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `comunicado_id` int,
  `usuario_id` int,
  `lido` boolean,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `leituras_comunicados` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `comunicado_id` int,
  `usuario_id` int,
  `lido_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `notificacoes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `usuario_id` int,
  `titulo` varchar(150),
  `mensagem` text,
  `canal` varchar(30),
  `lida_em` datetime,
  `criada_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `preferencias_notificacao` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `usuario_id` int,
  `canal` varchar(30),
  `habilitada` boolean,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `historico_notificacoes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `notificacao_id` int,
  `status` varchar(30),
  `detalhes` text,
  `registrado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `solicitacoes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `solicitante_usuario_id` int,
  `categoria_id` int,
  `titulo` varchar(150),
  `descricao` text,
  `status` varchar(30),
  `criada_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `categorias_solicitacao` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(100),
  `descricao` text
);

CREATE TABLE `historico_solicitacoes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `solicitacao_id` int,
  `usuario_id` int,
  `status_anterior` varchar(30),
  `status_novo` varchar(30),
  `comentario` text,
  `registrado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `manifestacoes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `usuario_id` int,
  `tipo` varchar(30),
  `assunto` varchar(150),
  `descricao` text,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `respostas_manifestacoes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `manifestacao_id` int,
  `usuario_id` int,
  `resposta` text,
  `respondida_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `anexos_manifestacoes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `manifestacao_id` int,
  `arquivo_url` varchar(500),
  `nome_arquivo` varchar(180),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `assembleias` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `titulo` varchar(150),
  `tipo` varchar(40),
  `data_hora` datetime,
  `local` varchar(180),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `participantes_assembleia` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `assembleia_id` int,
  `pessoa_id` int,
  `unidade_id` int,
  `presenca` boolean,
  `procuracao_url` varchar(500),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `pautas_assembleia` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `assembleia_id` int,
  `titulo` varchar(150),
  `descricao` text,
  `ordem` int,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `votacoes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `assembleia_id` int,
  `pauta_id` int,
  `titulo` varchar(150),
  `inicio_em` datetime,
  `fim_em` datetime,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `opcoes_votacao` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `votacao_id` int,
  `descricao` varchar(150),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `votos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `votacao_id` int,
  `opcao_id` int,
  `pessoa_id` int,
  `unidade_id` int,
  `votado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `documentos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `categoria_id` int,
  `enviado_por_usuario_id` int,
  `titulo` varchar(180),
  `arquivo_url` varchar(500),
  `visibilidade` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `categorias_documento` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(100),
  `descricao` text
);

CREATE TABLE `permissoes_documento` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `documento_id` int,
  `perfil_id` int,
  `pode_visualizar` boolean,
  `pode_editar` boolean,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `taxas_condominiais` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `nome` varchar(120),
  `periodicidade` varchar(30),
  `valor_base` decimal(12,2),
  `ativa` boolean,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `composicoes_taxa` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `taxa_id` int,
  `descricao` varchar(150),
  `valor` decimal(12,2),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `lancamentos_unidades` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `taxa_id` int,
  `competencia` date,
  `valor` decimal(12,2),
  `vencimento_em` date,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `contas_pagar` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `fornecedor_id` int,
  `descricao` varchar(180),
  `valor_total` decimal(12,2),
  `emissao_em` date,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `parcelas_pagar` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `conta_pagar_id` int,
  `numero_parcela` int,
  `valor` decimal(12,2),
  `vencimento_em` date,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `pagamentos_fornecedores` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `parcela_pagar_id` int,
  `conta_bancaria_id` int,
  `valor_pago` decimal(12,2),
  `pago_em` datetime,
  `referencia` varchar(150),
  `comprovante_url` varchar(255),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `contas_receber` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `descricao` varchar(180),
  `valor_total` decimal(12,2),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `parcelas_receber` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `conta_receber_id` int,
  `numero_parcela` int,
  `valor` decimal(12,2),
  `vencimento_em` date,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `recebimentos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `parcela_receber_id` int,
  `valor_recebido` decimal(12,2),
  `recebido_em` datetime,
  `metodo` varchar(40),
  `referencia` varchar(150),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `debitos_condominiais` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `lancamento_unidade_id` int,
  `valor_original` decimal(12,2),
  `saldo_atual` decimal(12,2),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `acordos_divida` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `pessoa_id` int,
  `valor_negociado` decimal(12,2),
  `quantidade_parcelas` int,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `historico_cobrancas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `debito_id` int,
  `usuario_id` int,
  `acao` varchar(80),
  `detalhes` text,
  `registrado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `contas_bancarias` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `banco` varchar(100),
  `agencia` varchar(20),
  `numero_conta` varchar(30),
  `tipo` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `movimentacoes_financeiras` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `conta_bancaria_id` int,
  `tipo` varchar(30),
  `descricao` varchar(180),
  `valor` decimal(12,2),
  `ocorrido_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `transferencias` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `conta_origem_id` int,
  `conta_destino_id` int,
  `valor` decimal(12,2),
  `transferida_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `orcamentos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `ano` int,
  `descricao` varchar(180),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `itens_orcamento` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `orcamento_id` int,
  `plano_conta_id` int,
  `descricao` varchar(180),
  `valor_previsto` decimal(12,2),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `revisoes_orcamento` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `orcamento_id` int,
  `usuario_id` int,
  `motivo` text,
  `revisado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `fundos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `nome` varchar(100),
  `saldo_inicial` decimal(12,2),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `movimentacoes_fundos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `fundo_id` int,
  `tipo` varchar(30),
  `valor` decimal(12,2),
  `descricao` varchar(180),
  `ocorrido_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `destinacoes_fundos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `fundo_id` int,
  `movimentacao_id` int,
  `destino` varchar(180),
  `valor` decimal(12,2),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `extratos_bancarios` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `conta_bancaria_id` int,
  `periodo_inicio` date,
  `periodo_fim` date,
  `arquivo_url` varchar(500),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `itens_extrato` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `extrato_id` int,
  `data_movimento` date,
  `descricao` varchar(180),
  `valor` decimal(12,2),
  `tipo` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `conciliacoes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `item_extrato_id` int,
  `movimentacao_id` int,
  `status` varchar(30),
  `conciliado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `plano_contas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `codigo` varchar(30) UNIQUE,
  `nome` varchar(150),
  `tipo` varchar(30),
  `conta_pai_id` int,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `lancamentos_contabeis` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `periodo_id` int,
  `plano_conta_id` int,
  `descricao` varchar(180),
  `debito` decimal(12,2),
  `credito` decimal(12,2),
  `lancado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `periodos_contabeis` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `ano` int,
  `mes` int,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `planos_manutencao` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `ativo_id` int,
  `nome` varchar(150),
  `frequencia_dias` int,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `tarefas_preventivas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `plano_id` int,
  `titulo` varchar(150),
  `descricao` text,
  `responsavel_usuario_id` int,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `agendamentos_manutencao` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `tarefa_id` int,
  `previsto_em` datetime,
  `concluido_em` datetime,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `ordens_servico` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `ativo_id` int,
  `solicitacao_id` int,
  `fornecedor_id` int,
  `titulo` varchar(150),
  `descricao` text,
  `prioridade` varchar(30),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `problemas_reportados` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `ordem_servico_id` int,
  `usuario_id` int,
  `descricao` text,
  `reportado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `historico_ordens_servico` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `ordem_servico_id` int,
  `usuario_id` int,
  `status_anterior` varchar(30),
  `status_novo` varchar(30),
  `comentario` text,
  `registrado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `evidencias_manutencao` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `ordem_servico_id` int,
  `arquivo_url` varchar(500),
  `nome_arquivo` varchar(255),
  `tipo` varchar(50),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `ativos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `categoria_id` int,
  `nome` varchar(150),
  `numero_patrimonio` varchar(80) UNIQUE,
  `adquirido_em` date,
  `valor_aquisicao` decimal(12,2),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `categorias_ativos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(100),
  `descricao` text
);

CREATE TABLE `historico_ativos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `ativo_id` int,
  `usuario_id` int,
  `evento` varchar(100),
  `detalhes` text,
  `registrado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `produtos_estoque` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `nome` varchar(150),
  `sku` varchar(80) UNIQUE,
  `unidade_medida` varchar(30),
  `quantidade_atual` decimal(12,3),
  `estoque_minimo` decimal(12,3),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `movimentacoes_estoque` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `produto_id` int,
  `usuario_id` int,
  `tipo` varchar(30),
  `quantidade` decimal(12,3),
  `ocorrido_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `inventarios` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `responsavel_usuario_id` int,
  `realizado_em` datetime,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `fornecedores` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(150),
  `cnpj` varchar(18) UNIQUE,
  `email` varchar(190) UNIQUE,
  `telefone` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `contratos_fornecedores` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `fornecedor_id` int,
  `numero_contrato` varchar(80),
  `inicio_em` date,
  `fim_em` date,
  `valor` decimal(12,2),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `aditivos_contratuais` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `contrato_fornecedor_id` int,
  `descricao` text,
  `valor_adicional` decimal(12,2),
  `vigente_desde` date,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `areas_limpeza` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `nome` varchar(120),
  `localizacao` varchar(150),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `rotinas_limpeza` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `area_id` int,
  `nome` varchar(120),
  `frequencia` varchar(40),
  `responsavel_usuario_id` int,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `execucoes_limpeza` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `rotina_id` int,
  `executada_por_usuario_id` int,
  `executada_em` datetime,
  `observacoes` text,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `medidores` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `tipo` varchar(30),
  `numero_serie` varchar(100),
  `instalado_em` date,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `leituras_medidores` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `medidor_id` int,
  `leitura` decimal(14,3),
  `lida_em` datetime,
  `usuario_id` int,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `consumos_mensais` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `medidor_id` int,
  `competencia` date,
  `consumo` decimal(14,3),
  `valor_estimado` decimal(12,2),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `areas_comuns` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `nome` varchar(120),
  `capacidade` int,
  `requer_reserva` boolean,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `reservas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `area_comum_id` int,
  `unidade_id` int,
  `usuario_id` int,
  `inicio_em` datetime,
  `fim_em` datetime,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `regras_reserva` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `area_comum_id` int,
  `antecedencia_max_dias` int,
  `duracao_max_horas` int,
  `taxa_reserva` decimal(12,2),
  `regras` text,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `equipamentos_lazer` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `area_comum_id` int,
  `nome` varchar(120),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `inscricoes_atividades` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `equipamento_lazer_id` int,
  `pessoa_id` int,
  `atividade` varchar(120),
  `inicio_em` datetime,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `registros_utilizacao` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `equipamento_lazer_id` int,
  `pessoa_id` int,
  `utilizado_em` datetime,
  `observacoes` text,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `solicitacoes_mudanca` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `usuario_id` int,
  `data_prevista` datetime,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `autorizacoes_obra` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `solicitante_usuario_id` int,
  `descricao` text,
  `inicio_previsto` date,
  `fim_previsto` date,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `vistorias_unidades` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `usuario_id` int,
  `tipo` varchar(40),
  `realizada_em` datetime,
  `relatorio_url` varchar(500),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `animais_estimacao` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `unidade_id` int,
  `responsavel_pessoa_id` int,
  `tipo_animal_id` int,
  `nome` varchar(100),
  `porte` varchar(30),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `tipos_animais` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(80),
  `descricao` text
);

CREATE TABLE `registros_animais` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `animal_id` int,
  `usuario_id` int,
  `evento` varchar(100),
  `detalhes` text,
  `registrado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `logs_auditoria` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `usuario_id` int,
  `acao` varchar(80),
  `entidade` varchar(100),
  `entidade_id` int,
  `ip` varchar(45),
  `registrado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `historico_alteracoes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `usuario_id` int,
  `tabela_afetada` varchar(100),
  `registro_id` int,
  `valor_anterior` text,
  `valor_novo` text,
  `alterado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `sessoes_usuario` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `usuario_id` int,
  `token_hash` varchar(255),
  `ip` varchar(45),
  `criada_em` datetime,
  `expira_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `consentimentos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `pessoa_id` int,
  `finalidade` varchar(150),
  `consentido` boolean,
  `registrado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `solicitacoes_privacidade` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `pessoa_id` int,
  `tipo_solicitacao` varchar(50),
  `descricao` text,
  `status` varchar(30),
  `criada_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `politicas_retencao` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(150),
  `entidade` varchar(100),
  `prazo_dias` int,
  `acao_final` varchar(50)
);

CREATE TABLE `relatorios_salvos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `usuario_id` int,
  `nome` varchar(150),
  `definicao` text,
  `visibilidade` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `execucoes_relatorios` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `relatorio_id` int,
  `executado_por_usuario_id` int,
  `executado_em` datetime,
  `status` varchar(30),
  `arquivo_url` varchar(500),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `indicadores_condominio` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `codigo` varchar(100) UNIQUE,
  `valor` decimal(14,3),
  `competencia` date,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `integracoes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `nome` varchar(120),
  `provedor` varchar(120),
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `credenciais_integracao` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `integracao_id` int,
  `tipo` varchar(50),
  `segredo_referencia` varchar(255),
  `rotacionada_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `logs_integracao` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `integracao_id` int,
  `evento` varchar(100),
  `status` varchar(30),
  `mensagem` text,
  `registrado_em` datetime,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `regras_automacao` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `nome` varchar(150),
  `gatilho` varchar(100),
  `condicoes` text,
  `acoes` text,
  `ativa` boolean,
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `tarefas_agendadas` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `regra_automacao_id` int,
  `nome` varchar(150),
  `executar_em` datetime,
  `status` varchar(30),
  `created_at` datetime,
  `updated_at` datetime
);

CREATE TABLE `execucoes_automacao` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `condominio_id` int,
  `tarefa_agendada_id` int,
  `inicio_em` datetime,
  `fim_em` datetime,
  `status` varchar(30),
  `resultado` text,
  `created_at` datetime,
  `updated_at` datetime
);

ALTER TABLE `condominios` ADD FOREIGN KEY (`tipo_condominio_id`) REFERENCES `tipos_condominio` (`id`);

ALTER TABLE `condominios` ADD FOREIGN KEY (`endereco_id`) REFERENCES `enderecos` (`id`);

ALTER TABLE `configuracoes_condominio` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `blocos` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `andares` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `andares` ADD FOREIGN KEY (`bloco_id`) REFERENCES `blocos` (`id`);

ALTER TABLE `setores` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `unidades` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `unidades` ADD FOREIGN KEY (`bloco_id`) REFERENCES `blocos` (`id`);

ALTER TABLE `unidades` ADD FOREIGN KEY (`tipo_unidade_id`) REFERENCES `tipos_unidade` (`id`);

ALTER TABLE `historico_unidades` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `historico_unidades` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `historico_unidades` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `usuarios` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `usuarios` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `contatos` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `proprietarios` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `proprietarios` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `moradores` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `moradores` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `vinculos_unidades` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `vinculos_unidades` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `vinculos_unidades` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `perfis` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `perfil_permissoes` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `perfil_permissoes` ADD FOREIGN KEY (`perfil_id`) REFERENCES `perfis` (`id`);

ALTER TABLE `perfil_permissoes` ADD FOREIGN KEY (`permissao_id`) REFERENCES `permissoes` (`id`);

ALTER TABLE `usuario_perfis` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `usuario_perfis` ADD FOREIGN KEY (`perfil_id`) REFERENCES `perfis` (`id`);

ALTER TABLE `usuario_perfis` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `gestores` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `gestores` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `mandatos` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `mandatos` ADD FOREIGN KEY (`gestor_id`) REFERENCES `gestores` (`id`);

ALTER TABLE `conselheiros` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `conselheiros` ADD FOREIGN KEY (`mandato_id`) REFERENCES `mandatos` (`id`);

ALTER TABLE `conselheiros` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `contratos_administracao` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `contratos_administracao` ADD FOREIGN KEY (`administradora_id`) REFERENCES `administradoras` (`id`);

ALTER TABLE `condominio_administradoras` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `condominio_administradoras` ADD FOREIGN KEY (`administradora_id`) REFERENCES `administradoras` (`id`);

ALTER TABLE `vagas_garagem` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `vagas_garagem` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `vinculos_vagas` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `vinculos_vagas` ADD FOREIGN KEY (`vaga_id`) REFERENCES `vagas_garagem` (`id`);

ALTER TABLE `vinculos_vagas` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `veiculos` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `veiculos` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `veiculos` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `enderecos_unidades` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `enderecos_unidades` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `enderecos_unidades` ADD FOREIGN KEY (`endereco_id`) REFERENCES `enderecos` (`id`);

ALTER TABLE `enderecos_complementos` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `enderecos_complementos` ADD FOREIGN KEY (`endereco_id`) REFERENCES `enderecos` (`id`);

ALTER TABLE `visitantes` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `autorizacoes_visita` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `autorizacoes_visita` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `autorizacoes_visita` ADD FOREIGN KEY (`visitante_id`) REFERENCES `visitantes` (`id`);

ALTER TABLE `visitas` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `visitas` ADD FOREIGN KEY (`autorizacao_id`) REFERENCES `autorizacoes_visita` (`id`);

ALTER TABLE `funcionarios_portaria` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `funcionarios_portaria` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `turnos_portaria` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `turnos_portaria` ADD FOREIGN KEY (`funcionario_portaria_id`) REFERENCES `funcionarios_portaria` (`id`);

ALTER TABLE `turnos_portaria` ADD FOREIGN KEY (`posto_id`) REFERENCES `postos_portaria` (`id`);

ALTER TABLE `postos_portaria` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `encomendas` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `encomendas` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `encomendas` ADD FOREIGN KEY (`transportadora_id`) REFERENCES `transportadoras` (`id`);

ALTER TABLE `retiradas_encomendas` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `retiradas_encomendas` ADD FOREIGN KEY (`encomenda_id`) REFERENCES `encomendas` (`id`);

ALTER TABLE `prestadores` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `prestadores` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `prestadores` ADD FOREIGN KEY (`empresa_id`) REFERENCES `empresas_prestadoras` (`id`);

ALTER TABLE `acessos_prestadores` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `acessos_prestadores` ADD FOREIGN KEY (`prestador_id`) REFERENCES `prestadores` (`id`);

ALTER TABLE `acessos_prestadores` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `credenciais_acesso` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `credenciais_acesso` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `registros_acesso` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `registros_acesso` ADD FOREIGN KEY (`credencial_id`) REFERENCES `credenciais_acesso` (`id`);

ALTER TABLE `registros_acesso` ADD FOREIGN KEY (`dispositivo_id`) REFERENCES `dispositivos_acesso` (`id`);

ALTER TABLE `dispositivos_acesso` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `chaves` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `retiradas_chaves` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `retiradas_chaves` ADD FOREIGN KEY (`chave_id`) REFERENCES `chaves` (`id`);

ALTER TABLE `retiradas_chaves` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `historico_chaves` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `historico_chaves` ADD FOREIGN KEY (`chave_id`) REFERENCES `chaves` (`id`);

ALTER TABLE `historico_chaves` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `ocorrencias_seguranca` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `ocorrencias_seguranca` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `envolvidos_ocorrencias` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `envolvidos_ocorrencias` ADD FOREIGN KEY (`ocorrencia_id`) REFERENCES `ocorrencias_seguranca` (`id`);

ALTER TABLE `envolvidos_ocorrencias` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `evidencias_ocorrencias` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `evidencias_ocorrencias` ADD FOREIGN KEY (`ocorrencia_id`) REFERENCES `ocorrencias_seguranca` (`id`);

ALTER TABLE `cameras` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `incidentes` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `incidentes` ADD FOREIGN KEY (`camera_id`) REFERENCES `cameras` (`id`);

ALTER TABLE `incidentes` ADD FOREIGN KEY (`ocorrencia_id`) REFERENCES `ocorrencias_seguranca` (`id`);

ALTER TABLE `registros_monitoramento` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `registros_monitoramento` ADD FOREIGN KEY (`camera_id`) REFERENCES `cameras` (`id`);

ALTER TABLE `registros_monitoramento` ADD FOREIGN KEY (`incidente_id`) REFERENCES `incidentes` (`id`);

ALTER TABLE `comunicados` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `destinatarios_comunicados` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `destinatarios_comunicados` ADD FOREIGN KEY (`comunicado_id`) REFERENCES `comunicados` (`id`);

ALTER TABLE `destinatarios_comunicados` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `leituras_comunicados` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `leituras_comunicados` ADD FOREIGN KEY (`comunicado_id`) REFERENCES `comunicados` (`id`);

ALTER TABLE `leituras_comunicados` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `notificacoes` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `notificacoes` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `preferencias_notificacao` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `preferencias_notificacao` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `historico_notificacoes` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `historico_notificacoes` ADD FOREIGN KEY (`notificacao_id`) REFERENCES `notificacoes` (`id`);

ALTER TABLE `solicitacoes` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `solicitacoes` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `solicitacoes` ADD FOREIGN KEY (`categoria_id`) REFERENCES `categorias_ativos` (`id`);

ALTER TABLE `historico_solicitacoes` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `historico_solicitacoes` ADD FOREIGN KEY (`solicitacao_id`) REFERENCES `solicitacoes` (`id`);

ALTER TABLE `historico_solicitacoes` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `manifestacoes` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `manifestacoes` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `respostas_manifestacoes` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `respostas_manifestacoes` ADD FOREIGN KEY (`manifestacao_id`) REFERENCES `manifestacoes` (`id`);

ALTER TABLE `respostas_manifestacoes` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `anexos_manifestacoes` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `anexos_manifestacoes` ADD FOREIGN KEY (`manifestacao_id`) REFERENCES `manifestacoes` (`id`);

ALTER TABLE `assembleias` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `participantes_assembleia` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `participantes_assembleia` ADD FOREIGN KEY (`assembleia_id`) REFERENCES `assembleias` (`id`);

ALTER TABLE `participantes_assembleia` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `participantes_assembleia` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `pautas_assembleia` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `pautas_assembleia` ADD FOREIGN KEY (`assembleia_id`) REFERENCES `assembleias` (`id`);

ALTER TABLE `votacoes` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `votacoes` ADD FOREIGN KEY (`assembleia_id`) REFERENCES `assembleias` (`id`);

ALTER TABLE `votacoes` ADD FOREIGN KEY (`pauta_id`) REFERENCES `pautas_assembleia` (`id`);

ALTER TABLE `opcoes_votacao` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `opcoes_votacao` ADD FOREIGN KEY (`votacao_id`) REFERENCES `votacoes` (`id`);

ALTER TABLE `votos` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `votos` ADD FOREIGN KEY (`votacao_id`) REFERENCES `votacoes` (`id`);

ALTER TABLE `votos` ADD FOREIGN KEY (`opcao_id`) REFERENCES `opcoes_votacao` (`id`);

ALTER TABLE `votos` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `votos` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `documentos` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `documentos` ADD FOREIGN KEY (`categoria_id`) REFERENCES `categorias_ativos` (`id`);

ALTER TABLE `permissoes_documento` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `permissoes_documento` ADD FOREIGN KEY (`documento_id`) REFERENCES `documentos` (`id`);

ALTER TABLE `permissoes_documento` ADD FOREIGN KEY (`perfil_id`) REFERENCES `perfis` (`id`);

ALTER TABLE `taxas_condominiais` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `composicoes_taxa` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `composicoes_taxa` ADD FOREIGN KEY (`taxa_id`) REFERENCES `taxas_condominiais` (`id`);

ALTER TABLE `lancamentos_unidades` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `lancamentos_unidades` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `lancamentos_unidades` ADD FOREIGN KEY (`taxa_id`) REFERENCES `taxas_condominiais` (`id`);

ALTER TABLE `contas_pagar` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `contas_pagar` ADD FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores` (`id`);

ALTER TABLE `parcelas_pagar` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `parcelas_pagar` ADD FOREIGN KEY (`conta_pagar_id`) REFERENCES `contas_pagar` (`id`);

ALTER TABLE `pagamentos_fornecedores` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `pagamentos_fornecedores` ADD FOREIGN KEY (`parcela_pagar_id`) REFERENCES `parcelas_pagar` (`id`);

ALTER TABLE `pagamentos_fornecedores` ADD FOREIGN KEY (`conta_bancaria_id`) REFERENCES `contas_bancarias` (`id`);

ALTER TABLE `contas_receber` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `contas_receber` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `parcelas_receber` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `parcelas_receber` ADD FOREIGN KEY (`conta_receber_id`) REFERENCES `contas_receber` (`id`);

ALTER TABLE `recebimentos` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `recebimentos` ADD FOREIGN KEY (`parcela_receber_id`) REFERENCES `parcelas_receber` (`id`);

ALTER TABLE `debitos_condominiais` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `debitos_condominiais` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `debitos_condominiais` ADD FOREIGN KEY (`lancamento_unidade_id`) REFERENCES `lancamentos_unidades` (`id`);

ALTER TABLE `acordos_divida` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `acordos_divida` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `acordos_divida` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `historico_cobrancas` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `historico_cobrancas` ADD FOREIGN KEY (`debito_id`) REFERENCES `debitos_condominiais` (`id`);

ALTER TABLE `historico_cobrancas` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `contas_bancarias` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `movimentacoes_financeiras` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `movimentacoes_financeiras` ADD FOREIGN KEY (`conta_bancaria_id`) REFERENCES `contas_bancarias` (`id`);

ALTER TABLE `transferencias` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `transferencias` ADD FOREIGN KEY (`conta_origem_id`) REFERENCES `contas_bancarias` (`id`);

ALTER TABLE `transferencias` ADD FOREIGN KEY (`conta_destino_id`) REFERENCES `contas_bancarias` (`id`);

ALTER TABLE `orcamentos` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `itens_orcamento` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `itens_orcamento` ADD FOREIGN KEY (`orcamento_id`) REFERENCES `orcamentos` (`id`);

ALTER TABLE `itens_orcamento` ADD FOREIGN KEY (`plano_conta_id`) REFERENCES `plano_contas` (`id`);

ALTER TABLE `revisoes_orcamento` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `revisoes_orcamento` ADD FOREIGN KEY (`orcamento_id`) REFERENCES `orcamentos` (`id`);

ALTER TABLE `revisoes_orcamento` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `fundos` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `movimentacoes_fundos` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `movimentacoes_fundos` ADD FOREIGN KEY (`fundo_id`) REFERENCES `fundos` (`id`);

ALTER TABLE `destinacoes_fundos` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `destinacoes_fundos` ADD FOREIGN KEY (`fundo_id`) REFERENCES `fundos` (`id`);

ALTER TABLE `destinacoes_fundos` ADD FOREIGN KEY (`movimentacao_id`) REFERENCES `movimentacoes_financeiras` (`id`);

ALTER TABLE `extratos_bancarios` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `extratos_bancarios` ADD FOREIGN KEY (`conta_bancaria_id`) REFERENCES `contas_bancarias` (`id`);

ALTER TABLE `itens_extrato` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `itens_extrato` ADD FOREIGN KEY (`extrato_id`) REFERENCES `extratos_bancarios` (`id`);

ALTER TABLE `conciliacoes` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `conciliacoes` ADD FOREIGN KEY (`item_extrato_id`) REFERENCES `itens_extrato` (`id`);

ALTER TABLE `conciliacoes` ADD FOREIGN KEY (`movimentacao_id`) REFERENCES `movimentacoes_financeiras` (`id`);

ALTER TABLE `plano_contas` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `lancamentos_contabeis` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `lancamentos_contabeis` ADD FOREIGN KEY (`periodo_id`) REFERENCES `periodos_contabeis` (`id`);

ALTER TABLE `lancamentos_contabeis` ADD FOREIGN KEY (`plano_conta_id`) REFERENCES `plano_contas` (`id`);

ALTER TABLE `periodos_contabeis` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `planos_manutencao` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `planos_manutencao` ADD FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`);

ALTER TABLE `tarefas_preventivas` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `tarefas_preventivas` ADD FOREIGN KEY (`plano_id`) REFERENCES `planos_manutencao` (`id`);

ALTER TABLE `agendamentos_manutencao` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `agendamentos_manutencao` ADD FOREIGN KEY (`tarefa_id`) REFERENCES `tarefas_preventivas` (`id`);

ALTER TABLE `ordens_servico` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `ordens_servico` ADD FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`);

ALTER TABLE `ordens_servico` ADD FOREIGN KEY (`solicitacao_id`) REFERENCES `solicitacoes` (`id`);

ALTER TABLE `ordens_servico` ADD FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores` (`id`);

ALTER TABLE `problemas_reportados` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `problemas_reportados` ADD FOREIGN KEY (`ordem_servico_id`) REFERENCES `ordens_servico` (`id`);

ALTER TABLE `problemas_reportados` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `historico_ordens_servico` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `historico_ordens_servico` ADD FOREIGN KEY (`ordem_servico_id`) REFERENCES `ordens_servico` (`id`);

ALTER TABLE `historico_ordens_servico` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `evidencias_manutencao` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `evidencias_manutencao` ADD FOREIGN KEY (`ordem_servico_id`) REFERENCES `ordens_servico` (`id`);

ALTER TABLE `ativos` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `ativos` ADD FOREIGN KEY (`categoria_id`) REFERENCES `categorias_ativos` (`id`);

ALTER TABLE `historico_ativos` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `historico_ativos` ADD FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`);

ALTER TABLE `historico_ativos` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `produtos_estoque` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `movimentacoes_estoque` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `movimentacoes_estoque` ADD FOREIGN KEY (`produto_id`) REFERENCES `produtos_estoque` (`id`);

ALTER TABLE `movimentacoes_estoque` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `inventarios` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `contratos_fornecedores` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `contratos_fornecedores` ADD FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores` (`id`);

ALTER TABLE `aditivos_contratuais` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `aditivos_contratuais` ADD FOREIGN KEY (`contrato_fornecedor_id`) REFERENCES `contratos_fornecedores` (`id`);

ALTER TABLE `areas_limpeza` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `rotinas_limpeza` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `rotinas_limpeza` ADD FOREIGN KEY (`area_id`) REFERENCES `areas_limpeza` (`id`);

ALTER TABLE `execucoes_limpeza` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `execucoes_limpeza` ADD FOREIGN KEY (`rotina_id`) REFERENCES `rotinas_limpeza` (`id`);

ALTER TABLE `medidores` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `medidores` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `leituras_medidores` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `leituras_medidores` ADD FOREIGN KEY (`medidor_id`) REFERENCES `medidores` (`id`);

ALTER TABLE `leituras_medidores` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `consumos_mensais` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `consumos_mensais` ADD FOREIGN KEY (`medidor_id`) REFERENCES `medidores` (`id`);

ALTER TABLE `areas_comuns` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `reservas` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `reservas` ADD FOREIGN KEY (`area_comum_id`) REFERENCES `areas_comuns` (`id`);

ALTER TABLE `reservas` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `reservas` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `regras_reserva` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `regras_reserva` ADD FOREIGN KEY (`area_comum_id`) REFERENCES `areas_comuns` (`id`);

ALTER TABLE `equipamentos_lazer` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `equipamentos_lazer` ADD FOREIGN KEY (`area_comum_id`) REFERENCES `areas_comuns` (`id`);

ALTER TABLE `inscricoes_atividades` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `inscricoes_atividades` ADD FOREIGN KEY (`equipamento_lazer_id`) REFERENCES `equipamentos_lazer` (`id`);

ALTER TABLE `inscricoes_atividades` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `registros_utilizacao` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `registros_utilizacao` ADD FOREIGN KEY (`equipamento_lazer_id`) REFERENCES `equipamentos_lazer` (`id`);

ALTER TABLE `registros_utilizacao` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `solicitacoes_mudanca` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `solicitacoes_mudanca` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `solicitacoes_mudanca` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `autorizacoes_obra` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `autorizacoes_obra` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `vistorias_unidades` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `vistorias_unidades` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `vistorias_unidades` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `animais_estimacao` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `animais_estimacao` ADD FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`);

ALTER TABLE `animais_estimacao` ADD FOREIGN KEY (`tipo_animal_id`) REFERENCES `tipos_animais` (`id`);

ALTER TABLE `registros_animais` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `registros_animais` ADD FOREIGN KEY (`animal_id`) REFERENCES `animais_estimacao` (`id`);

ALTER TABLE `registros_animais` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `logs_auditoria` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `logs_auditoria` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `historico_alteracoes` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `historico_alteracoes` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `sessoes_usuario` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `sessoes_usuario` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `consentimentos` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `consentimentos` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `solicitacoes_privacidade` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `solicitacoes_privacidade` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`);

ALTER TABLE `relatorios_salvos` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `relatorios_salvos` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `execucoes_relatorios` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `execucoes_relatorios` ADD FOREIGN KEY (`relatorio_id`) REFERENCES `relatorios_salvos` (`id`);

ALTER TABLE `indicadores_condominio` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `integracoes` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `credenciais_integracao` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `credenciais_integracao` ADD FOREIGN KEY (`integracao_id`) REFERENCES `integracoes` (`id`);

ALTER TABLE `logs_integracao` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `logs_integracao` ADD FOREIGN KEY (`integracao_id`) REFERENCES `integracoes` (`id`);

ALTER TABLE `regras_automacao` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `tarefas_agendadas` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `tarefas_agendadas` ADD FOREIGN KEY (`regra_automacao_id`) REFERENCES `regras_automacao` (`id`);

ALTER TABLE `execucoes_automacao` ADD FOREIGN KEY (`condominio_id`) REFERENCES `condominios` (`id`);

ALTER TABLE `execucoes_automacao` ADD FOREIGN KEY (`tarefa_agendada_id`) REFERENCES `tarefas_agendadas` (`id`);

-- Ocorrências gerais (rotas /ocorrencias da API).
CREATE TABLE `ocorrencias` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `unidade_id` int,
  `usuario_id` int NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descricao` text NOT NULL,
  `status` enum('aberta','em_andamento','resolvida','cancelada') NOT NULL DEFAULT 'aberta',
  `criado_em` timestamp DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `ocorrencias_unidade_id` (`unidade_id`),
  KEY `ocorrencias_usuario_id` (`usuario_id`),
  CONSTRAINT `ocorrencias_unidade_fk` FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`),
  CONSTRAINT `ocorrencias_usuario_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
);
