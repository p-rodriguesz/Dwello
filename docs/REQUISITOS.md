# Documento de requisitos

## Objetivo

O Dwello centraliza a operação de condomínios residenciais, comerciais e mistos. O sistema integra autenticação, RBAC, cadastro condominial, gestão operacional, comunicação, finanças, manutenção, segurança e auditoria.

## Pessoas

- **Super Admin:** administra o sistema e pode atuar em todos os condomínios.
- **Administradora:** administra condomínios sob sua responsabilidade.
- **Síndico:** coordena gestão administrativa e operacional.
- **Subsíndico:** executa operações delegadas pelo síndico.
- **Conselheiro:** consulta governança e operação.
- **Porteiro:** controla visitantes, encomendas, acessos e portaria.
- **Zelador:** acompanha ocorrências, manutenção e operação predial.
- **Funcionário:** executa operações operacionais autorizadas.
- **Proprietário:** consulta unidades e solicitações próprias.
- **Morador/Inquilino:** consulta dados da unidade e realiza solicitações permitidas.
- **Visitante:** acesso externo restrito, sem administração.
- **Prestador de serviço:** acesso restrito às operações autorizadas.

## Regras essenciais

- Cada usuário pode possuir papéis diferentes em condomínios diferentes.
- APIs validam autenticação, papel, ação e condomínio antes de acessar dados.
- O condomínio usado nas operações deve pertencer ao escopo autorizado.
- Entidades relacionadas devem existir e pertencer ao mesmo condomínio.
- Senhas são gerenciadas pelo Better Auth.
- Arquivos têm tipo, tamanho e diretório de armazenamento validados.
- Consultas de listagem devem aplicar filtros, busca e paginação quando suportadas.

## Fundamentação tecnológica

### Node.js

Node.js é o runtime da API e dos scripts operacionais. O projeto exige Node.js 22 ou superior no backend. Em `src/app.ts` ele hospeda o servidor HTTP Fastify; em `scripts/` executa instalação do banco, seeds e reset; no ambiente Docker ele também executa os health checks dos serviços. Node.js não é usado como substituto do banco nem como frontend.

### TypeScript

TypeScript fornece tipos para rotas, controladores, serviços, modelos Drizzle e componentes React. No backend ele torna explícitos os contratos de requisições e respostas e impede alguns erros de integração em tempo de desenvolvimento. No frontend ele tipa estados, respostas da API e propriedades dos componentes. O código é compilado pelo `tsc` ou pelo pipeline do Next.js antes da execução.

### Fastify

Fastify é o framework HTTP do backend. Ele registra os plugins de autenticação, usuários, recursos genéricos, metadados e uploads em `src/app.ts`; trata validações e erros em um handler central; mantém cookies/sessões entregues pelo Better Auth; e aplica hooks em `src/middleware/require-session.ts` e nos módulos de RBAC. Também limita e processa arquivos multipart de até 10 MB.

### Drizzle ORM

Drizzle é a camada de acesso relacional usada pelos serviços. Os schemas tipados em `src/db/dwello-schema.ts` e `src/db/schema.ts` representam tabelas e colunas; os serviços montam consultas selecionando, filtrando e ordenando registros. `drizzle-kit` gera e aplica migrations. O SQL completo de referência em `database/dwello.sql` continua sendo a forma editável de inicialização do banco.

### Better Auth

Better Auth centraliza cadastro, login, sessão, hash de credenciais e recuperação da identidade autenticada. As rotas em `src/routes/auth.routes.ts` expõem os endpoints `/api/auth/*`. Depois da sessão ser criada, o Dwello sincroniza a identidade com a tabela `usuarios` e carrega vínculos de `usuario_perfis`. A aplicação não usa bcrypt diretamente.

### RBAC

O RBAC liga identidade, papel, ação e recurso. `src/auth/rbac.ts` define 12 papéis e ações `read`, `create`, `update` e `delete`; `usuario_perfis` permite que um usuário tenha papéis diferentes em condomínios diferentes. Os hooks autorizam a operação antes do serviço acessar dados, e os recursos podem ser filtrados pelo conjunto de condomínios permitido. O frontend consulta permissões apenas para montar menus e botões; o backend é a autoridade real.

### Banco escolhido: MySQL 8

MySQL 8 é o banco relacional principal. Ele preserva os dados de condomínios, unidades, moradores, pessoas, portaria, finanças, documentos e auditoria em tabelas com chaves primárias e estrangeiras. O Docker usa MySQL 8.4 e inicializa `database/dwello.sql` e `database/seed.sql`. A biblioteca `mysql2` fornece o pool de conexões usado tanto pelo Drizzle quanto pelas consultas SQL do RBAC e das validações.

### React

React 19 implementa os estados interativos das telas: formulários, tabelas, filtros, paginação, sessão, feedback de erro e navegação condicionada por permissão. Os componentes em `frontend/src/components/` compartilham shell administrativo, proteção de página e o renderer genérico de recursos. React não realiza autorização sozinho.

### Next.js

Next.js 16 fornece o App Router do frontend, renderização, layouts e roteamento de páginas. Ele recebe as chamadas do navegador em `/backend` e as encaminha para a API por meio de `next.config.ts`, mantendo o cookie de sessão no fluxo. No Docker, a variável `API_URL` liga o frontend ao serviço `api`.

### Axios

Axios é o cliente HTTP centralizado em `frontend/src/lib/api.ts`. Ele usa `baseURL: '/backend'`, envia cookies com `withCredentials` e intercepta respostas 401 para redirecionar ou atualizar a sessão. Todas as telas usam essa instância para CRUD, busca, paginação e uploads, com mensagens padronizadas extraídas das respostas da API.

### Docker e Docker Compose

Docker empacota API, frontend e banco em imagens reproduzíveis. `compose.yaml` define três serviços: `db` com MySQL, `api` com Fastify e `frontend` com Next.js. Volumes persistem dados do MySQL e os arquivos enviados. Dependências e health checks garantem que o frontend só fique disponível depois da API e o banco estejam prontos.

### Bibliotecas adicionais relevantes

- **`@fastify/multipart`:** recebe arquivos enviados em `multipart/form-data`, valida quantidade, tamanho e forma do upload e disponibiliza o stream no controlador.
- **`dotenv`:** carrega configuração local de porta, banco, URLs de autenticação e diretório de arquivos.
- **`mysql2`:** cria o pool TCP usado pelo banco relacional e pelas consultas de isolamento por condomínio.
- **`tsx`:** executa diretamente TypeScript no desenvolvimento e nos scripts de seed/migrations.
- **`drizzle-kit`:** gera e aplica migrations a partir da configuração do Drizzle.
- **React DOM:** conecta os componentes React à árvore do navegador.
- **Tipos `@types/node`, `@types/react` e `@types/react-dom`:** fornecem tipos das APIs do Node e JSX durante a compilação.

## Escopo funcional

O sistema cobre cadastro, estrutura física, pessoas e vínculos, portaria, segurança, comunicação, solicitações, assembleias, documentos, finanças, manutenção, estoque, limpeza, áreas comuns, mudanças, animais, auditoria, privacidade, relatórios e integrações.
