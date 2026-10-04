-- Execute este arquivo em MySQL 8+ para criar o banco e os dados de exemplo.
CREATE DATABASE IF NOT EXISTS dwello CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dwello;

CREATE TABLE IF NOT EXISTS condominios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  endereco VARCHAR(255) NULL,
  criado_em TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  perfil ENUM('morador','sindico','porteiro','prestador','admin') NOT NULL DEFAULT 'morador',
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS unidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  condominio_id INT NOT NULL,
  bloco VARCHAR(50) NOT NULL,
  numero VARCHAR(20) NOT NULL,
  CONSTRAINT fk_unidade_condominio FOREIGN KEY (condominio_id) REFERENCES condominios(id),
  UNIQUE KEY condominio_id (condominio_id, bloco, numero)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS moradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  unidade_id INT NOT NULL,
  tipo_vinculo ENUM('proprietario','inquilino','dependente') NOT NULL DEFAULT 'proprietario',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (unidade_id) REFERENCES unidades(id),
  UNIQUE KEY usuario_id (usuario_id, unidade_id),
  KEY unidade_id (unidade_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ocorrencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  unidade_id INT NULL,
  usuario_id INT NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT NOT NULL,
  status ENUM('aberta','em_andamento','resolvida','cancelada') NOT NULL DEFAULT 'aberta',
  criado_em TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (unidade_id) REFERENCES unidades(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  KEY unidade_id (unidade_id),
  KEY usuario_id (usuario_id)
) ENGINE=InnoDB;

INSERT INTO condominios (nome, endereco)
SELECT 'Residencial Jardim das Flores', 'Rua das Flores, 120 - Centro'
WHERE NOT EXISTS (SELECT 1 FROM condominios WHERE nome = 'Residencial Jardim das Flores');
INSERT INTO condominios (nome, endereco)
SELECT 'Condomínio Horizonte Azul', 'Avenida do Sol, 850 - Jardim América'
WHERE NOT EXISTS (SELECT 1 FROM condominios WHERE nome = 'Condomínio Horizonte Azul');

INSERT INTO usuarios (nome, email, senha_hash, perfil, ativo) VALUES
  ('Ana Souza','ana.souza@dwello.local',SHA2('dwello123',256),'morador',1),
  ('Carlos Mendes','carlos.mendes@dwello.local',SHA2('dwello123',256),'sindico',1),
  ('Beatriz Lima','beatriz.lima@dwello.local',SHA2('dwello123',256),'porteiro',1),
  ('Diego Alves','diego.alves@dwello.local',SHA2('dwello123',256),'prestador',1),
  ('Marina Costa','marina.costa@dwello.local',SHA2('dwello123',256),'admin',1)
ON DUPLICATE KEY UPDATE nome=VALUES(nome), perfil=VALUES(perfil), ativo=VALUES(ativo);

SET @jardim = (SELECT id FROM condominios WHERE nome = 'Residencial Jardim das Flores' LIMIT 1);
SET @horizonte = (SELECT id FROM condominios WHERE nome = 'Condomínio Horizonte Azul' LIMIT 1);
INSERT IGNORE INTO unidades (condominio_id, bloco, numero) VALUES
  (@jardim,'A','101'), (@jardim,'A','202'), (@horizonte,'B','305'), (@horizonte,'C','401');

SET @ana = (SELECT id FROM usuarios WHERE email = 'ana.souza@dwello.local');
SET @carlos = (SELECT id FROM usuarios WHERE email = 'carlos.mendes@dwello.local');
SET @beatriz = (SELECT id FROM usuarios WHERE email = 'beatriz.lima@dwello.local');
SET @diego = (SELECT id FROM usuarios WHERE email = 'diego.alves@dwello.local');
SET @marina = (SELECT id FROM usuarios WHERE email = 'marina.costa@dwello.local');
SET @a101 = (SELECT id FROM unidades WHERE condominio_id=@jardim AND bloco='A' AND numero='101');
SET @a202 = (SELECT id FROM unidades WHERE condominio_id=@jardim AND bloco='A' AND numero='202');
SET @b305 = (SELECT id FROM unidades WHERE condominio_id=@horizonte AND bloco='B' AND numero='305');
SET @c401 = (SELECT id FROM unidades WHERE condominio_id=@horizonte AND bloco='C' AND numero='401');
INSERT INTO moradores (usuario_id, unidade_id, tipo_vinculo) VALUES
  (@ana,@a101,'proprietario'), (@carlos,@a202,'proprietario'), (@beatriz,@b305,'inquilino'), (@diego,@c401,'dependente'), (@marina,@a101,'dependente')
ON DUPLICATE KEY UPDATE tipo_vinculo=VALUES(tipo_vinculo);

INSERT INTO ocorrencias (unidade_id, usuario_id, titulo, descricao, status)
SELECT @a101,@ana,'Lâmpada queimada no corredor','A iluminação do corredor do primeiro andar precisa ser substituída.','aberta'
WHERE NOT EXISTS (SELECT 1 FROM ocorrencias WHERE unidade_id=@a101 AND titulo='Lâmpada queimada no corredor');
INSERT INTO ocorrencias (unidade_id, usuario_id, titulo, descricao, status)
SELECT @a202,@carlos,'Vazamento na garagem','Há um pequeno vazamento próximo à vaga 22.','em_andamento'
WHERE NOT EXISTS (SELECT 1 FROM ocorrencias WHERE unidade_id=@a202 AND titulo='Vazamento na garagem');
INSERT INTO ocorrencias (unidade_id, usuario_id, titulo, descricao, status)
SELECT @b305,@beatriz,'Portão com ruído','O portão da garagem apresenta ruído ao fechar.','resolvida'
WHERE NOT EXISTS (SELECT 1 FROM ocorrencias WHERE unidade_id=@b305 AND titulo='Portão com ruído');
INSERT INTO ocorrencias (unidade_id, usuario_id, titulo, descricao, status)
SELECT @c401,@diego,'Limpeza do hall','O hall do bloco C precisa de limpeza adicional.','cancelada'
WHERE NOT EXISTS (SELECT 1 FROM ocorrencias WHERE unidade_id=@c401 AND titulo='Limpeza do hall');
