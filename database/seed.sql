-- Dados estruturais mínimos para desenvolvimento e demonstração.
-- Não contém credenciais; usuários são criados pelo Better Auth.
USE dwello;

INSERT INTO condominios (id, nome, status, created_at, updated_at)
VALUES (1, 'Residencial Aurora', 'ATIVO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE nome = VALUES(nome), status = VALUES(status);

INSERT INTO blocos (id, condominio_id, nome, descricao, created_at, updated_at)
VALUES (1, 1, 'Bloco A', 'Bloco principal do condomínio.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE nome = VALUES(nome), descricao = VALUES(descricao);

INSERT INTO unidades (id, condominio_id, bloco_id, identificacao, status, created_at, updated_at)
VALUES (1, 1, 1, '101', 'ATIVA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE identificacao = VALUES(identificacao), status = VALUES(status);

-- Administrador com todas as permissões (SUPER_ADMIN global, sem condomínio).
-- Não contém senha: cadastre-se no app com este e-mail e o Better Auth
-- vincula a conta a este perfil. Troque o e-mail aqui se quiser usar outro.
INSERT INTO usuarios (nome, email, perfil, ativo, status, created_at, updated_at)
VALUES ('Administrador', 'admin@dwello.local', 'admin', TRUE, 'ATIVO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE perfil = 'admin', ativo = TRUE;

INSERT INTO usuario_perfis (usuario_id, condominio_id, perfil, ativo, created_at, updated_at)
SELECT u.id, NULL, 'SUPER_ADMIN', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM usuarios u
WHERE u.email = 'admin@dwello.local'
  AND NOT EXISTS (
    SELECT 1 FROM usuario_perfis up
    WHERE up.usuario_id = u.id AND up.condominio_id IS NULL AND up.perfil = 'SUPER_ADMIN'
  );
