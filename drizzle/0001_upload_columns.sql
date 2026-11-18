SET @visitantes_foto_sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE `visitantes` ADD COLUMN `foto_url` varchar(255)',
    'SELECT 1'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'visitantes' AND COLUMN_NAME = 'foto_url'
);
PREPARE visitantes_foto_stmt FROM @visitantes_foto_sql;
EXECUTE visitantes_foto_stmt;
DEALLOCATE PREPARE visitantes_foto_stmt;
--> statement-breakpoint
SET @encomendas_foto_sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE `encomendas` ADD COLUMN `foto_url` varchar(255)',
    'SELECT 1'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'encomendas' AND COLUMN_NAME = 'foto_url'
);
PREPARE encomendas_foto_stmt FROM @encomendas_foto_sql;
EXECUTE encomendas_foto_stmt;
DEALLOCATE PREPARE encomendas_foto_stmt;
--> statement-breakpoint
SET @pagamentos_comprovante_sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE `pagamentos_fornecedores` ADD COLUMN `comprovante_url` varchar(255)',
    'SELECT 1'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pagamentos_fornecedores' AND COLUMN_NAME = 'comprovante_url'
);
PREPARE pagamentos_comprovante_stmt FROM @pagamentos_comprovante_sql;
EXECUTE pagamentos_comprovante_stmt;
DEALLOCATE PREPARE pagamentos_comprovante_stmt;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ocorrencias` (
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

CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(36) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `emailVerified` boolean NOT NULL DEFAULT false,
  `image` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `session` (
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
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `account` (
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
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `verification` (
  `id` varchar(36) PRIMARY KEY,
  `identifier` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `createdAt` datetime,
  `updatedAt` datetime
);
