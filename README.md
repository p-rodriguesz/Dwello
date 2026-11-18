# Dwello

Sistema de gestão condominial com API Fastify, TypeScript, Drizzle ORM, MySQL, Better Auth e frontend Next.js.

## Requisitos

- Node.js 22 ou superior
- npm
- MySQL 8+ ou Docker Desktop

## Execução com Docker

Copie o arquivo de ambiente e defina um segredo local:

```bash
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Edite `BETTER_AUTH_SECRET` no `.env` com pelo menos 32 caracteres. Depois inicie todos os serviços:

```bash
npm run docker:up
```

Se as portas padrão já estiverem em uso, ajuste `MYSQL_PORT`, `API_PORT` e `FRONTEND_PORT`
no `.env` antes de iniciar. Exemplo: `MYSQL_PORT=3308`, `API_PORT=3002` e `FRONTEND_PORT=3003`.

Endereços:

- API: http://localhost:3000
- Frontend: http://localhost:3001
- Health check: http://localhost:3000/

O MySQL executa `database/dwello.sql` e `database/seed.sql` na primeira criação do volume. Para recriar o ambiente do zero:

```bash
npm run docker:reset
npm run docker:up
```

Os volumes removidos são `mysql_data` e `uploads_data`.

## Execução local

Configure um MySQL e preencha `.env`:

```env
PORT=3000
DATABASE_URL=mysql://dwello:dwello@127.0.0.1:3306/dwello
BETTER_AUTH_SECRET=gere-um-segredo-local-com-pelo-menos-32-caracteres
BETTER_AUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
UPLOAD_DIR=storage/uploads
```

Instale e prepare o banco:

```bash
npm install
npm run setup:db
npm run seed
```

Para iniciar API e frontend juntos em modo de desenvolvimento:

```bash
npm run dev:all
```

Inicie a API:

```bash
npm run dev
```

Em outro terminal, inicie o frontend:

```bash
cd frontend
npm install
npm run dev
```

O frontend usa o proxy `/backend` do Next.js e encaminha as requisições para `API_URL`.
Se o frontend for iniciado sozinho, a API também precisa estar executando em `http://localhost:3000`; caso contrário,
o proxy exibirá `ECONNREFUSED`.

Para publicar o frontend no Vercel, configure `frontend` como **Root Directory**, mantenha
**Output Directory** vazio ou como `.next`, e consulte
[docs/DEPLOY-VERCEL.md](docs/DEPLOY-VERCEL.md). A API Fastify deve ser hospedada separadamente
com acesso ao MySQL e armazenamento persistente para uploads.

O CI/CD está em [.github/workflows](.github/workflows): o CI valida backend, MySQL, migrations,
seed e frontend; o CD publica o frontend no Vercel quando os secrets do projeto estiverem
configurados.

## Banco, schema e migrations

- Schema completo de referência: [database/dwello.sql](database/dwello.sql).
- Seed idempotente de desenvolvimento: [database/seed.sql](database/seed.sql).
- Schema usado pelo Drizzle: [src/db/dwello-schema.ts](src/db/dwello-schema.ts).
- Migration gerada pelo Drizzle: [drizzle/0000_early_vivisector.sql](drizzle/0000_early_vivisector.sql).

Com `DATABASE_URL` configurada, os comandos são:

```bash
npm run db:migrate
npm run seed
```

`npm run setup:db` continua sendo o comando recomendado para um banco vazio porque aplica o SQL completo de referência de forma incremental e preserva tabelas existentes. O `db:migrate` aplica a migration gerada pelo Drizzle em ambientes controlados.

## Autenticação

As credenciais são gerenciadas exclusivamente pelo Better Auth.

Endpoints principais:

```text
POST /api/auth/sign-up/email
POST /api/auth/sign-in/email
GET  /api/auth/get-session
POST /api/auth/sign-out
GET  /me
```

O cadastro cria o usuário Better Auth e sincroniza seu perfil em `usuarios`. Os vínculos condominiais ficam em `usuario_perfis`.
O comando `npm run setup:db` também cria as tabelas internas `user`, `session`, `account` e `verification` exigidas pelo Better Auth.

## RBAC e isolamento

A matriz central está em [src/auth/rbac.ts](src/auth/rbac.ts). Os papéis suportados são:

| Papel | Escopo geral |
| --- | --- |
| `SUPER_ADMIN` | Acesso global administrativo |
| `ADMINISTRADORA` | Gestão ampla dos condomínios administrados |
| `SINDICO` | Gestão operacional e administrativa do condomínio |
| `SUBSINDICO` | Operação condominial com permissões delegadas |
| `CONSELHEIRO` | Consulta de estrutura, governança e operação |
| `PORTEIRO` | Portaria, visitantes, encomendas e acessos |
| `ZELADOR` | Ocorrências, manutenção, chaves e operação predial |
| `FUNCIONARIO` | Operação de visitantes, pacotes, comunicação e ocorrências |
| `PROPRIETARIO` | Consulta e solicitações relacionadas à unidade |
| `MORADOR` | Consulta e solicitações permitidas para sua comunidade |
| `VISITANTE` | Sem permissões administrativas por padrão |
| `PRESTADOR` | Acesso restrito a ocorrências autorizadas |

As permissões são verificadas no backend. O frontend apenas oculta ou exibe itens de navegação; não é fonte de autorização. Um usuário pode ter vários vínculos em condomínios diferentes. O condomínio recebido do cliente nunca substitui o vínculo persistido no banco.

Respostas esperadas:

- `401`: sessão ausente ou expirada.
- `403`: papel sem permissão ou outro condomínio.
- `404`: registro ou arquivo inexistente.
- `409`: conflito de relacionamento no banco.
- `422`: relacionamento entre condomínios inválido.

## Domínios implementados

As tabelas do SQL são expostas por rotas genéricas com validação, RBAC e escopo condominial. Os domínios são agrupados assim:

1. Cadastro e identidade: usuários, perfis, pessoas e vínculos.
2. Condomínios e estrutura: condomínios, blocos, andares, setores e unidades.
3. Governança: gestores, mandatos, conselheiros e administradoras.
4. Endereços, vagas e veículos.
5. Visitantes e autorizações de visita.
6. Portaria, turnos e postos.
7. Encomendas e transportadoras.
8. Prestadores, empresas e acessos.
9. Credenciais, dispositivos, registros e chaves.
10. Segurança, câmeras, incidentes e monitoramento.
11. Comunicação e notificações.
12. Solicitações, manifestações e respostas.
13. Assembleias, pautas, votações e votos.
14. Documentos, categorias, permissões e anexos.
15. Taxas, contas a pagar, contas a receber e cobranças.
16. Bancos, movimentações, transferências e contabilidade.
17. Orçamentos e fundos.
18. Manutenção, ordens de serviço e problemas reportados.
19. Ativos, estoque e fornecedores.
20. Limpeza, medidores e consumo.
21. Áreas comuns, reservas e lazer.
22. Mudanças, obras e vistorias.
23. Animais e registros de animais.
24. Auditoria, histórico, consentimentos e privacidade.
25. Relatórios, indicadores, integrações e automações.

Regras compartilhadas:

- IDs relacionados precisam existir.
- Relações entre condomínios diferentes são rejeitadas.
- Registros de auditoria e execução são append-only.
- Arquivos não são armazenados como binário no banco.
- Exclusões que violam foreign keys retornam conflito.

## Uploads

Arquivos são armazenados em `UPLOAD_DIR`, organizados por condomínio, entidade, ano e mês. Os metadados ficam nas tabelas `documentos`, `anexos_manifestacoes` e `evidencias_ocorrencias`.

Extensões e MIME types aceitos: PDF, JPG, JPEG, PNG e WEBP. O limite padrão é 10 MB.

Rotas:

```text
POST /uploads/documentos/:documentoId
POST /uploads/manifestacoes/:manifestacaoId/anexos
POST /uploads/ocorrencias-seguranca/:ocorrenciaId/evidencias
GET  /uploads/documentos/:id
GET  /uploads/anexos-manifestacoes/:id
GET  /uploads/evidencias-ocorrencias/:id
```

## Postman

Importe [postman/dwello-api.postman_collection.json](postman/dwello-api.postman_collection.json). A coleção usa Better Auth, cookies de sessão e os endpoints atuais da API.

O cadastro e login validam a autenticação, mas não concedem automaticamente um vínculo
condominial. Para executar as pastas de CRUD, unidades, ocorrências e uploads, use uma
conta previamente vinculada em `usuario_perfis` com um papel permitido pela matriz RBAC
(por exemplo, `SUPER_ADMIN`). Isso preserva o princípio de menor privilégio e evita que
o cadastro público crie acesso administrativo.

Execute as pastas na ordem:

1. Health e autenticação.
2. Perfil e sessão.
3. Condomínios e unidades.
4. Ocorrências.
5. Uploads.
6. Encerramento da sessão.

Configure `baseUrl` como `http://localhost:3000`. O Postman deve manter cookies habilitados.

## Testes e validação

Backend:

```bash
npm run build
npm test
```

Frontend:

```bash
cd frontend
npm run build
npm run lint
```

Os testes verificam autenticação, sessões, RBAC, isolamento, persistência no MySQL, CRUD, relacionamentos, uploads, MIME, limite de arquivo e validações.

## Fundamentação técnica

- **TypeScript:** tipagem estática e contratos mais seguros entre camadas.
- **Fastify:** servidor HTTP leve, extensível e adequado a APIs REST.
- **Drizzle ORM:** acesso tipado ao MySQL sem ocultar o modelo relacional.
- **MySQL:** persistência relacional para vínculos, integridade referencial e isolamento.
- **Better Auth:** autenticação, hash de senhas e sessões sem implementar credenciais manualmente.
- **Next.js:** frontend com App Router, layout administrativo e proxy para a API.
- **Axios:** cliente HTTP centralizado, cookies, interceptors e tratamento de erros.
- **Docker Compose:** ambiente reproduzível com API, frontend, MySQL e volumes persistentes.

## Entrega

Não inclua `node_modules`, `dist`, `.env`, arquivos de upload ou outros artefatos locais. O `.gitignore` já exclui esses diretórios e credenciais.

Guia adicional para operar o site: [docs/GUIA-USO-SITE.md](docs/GUIA-USO-SITE.md).

## Documentos acadêmicos

- [Requisitos e personas](docs/REQUISITOS.md)
- [Matriz resumida de permissões](docs/MATRIZ-PERMISSOS.md)
- [Mapa do modelo de dados](docs/MODELO-DADOS.md)
- [Modelo SQL editável](database/dwello.sql)
- [Modelo Drizzle](src/db/dwello-schema.ts)
