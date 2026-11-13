# Guia de uso do site Dwello

## 1. Iniciar o sistema

### Docker

Na raiz do projeto:

```bash
Copy-Item .env.example .env
docker compose up --build
```

Abra `http://localhost:3001`.

### Desenvolvimento local

Com MySQL configurado e `.env` preenchido:

```bash
npm install
npm run setup:db
npm run seed
npm run dev:all
```

O comando `npm run dev:all` inicia:

- API Fastify em `http://localhost:3000`;
- frontend Next.js em `http://localhost:3001`.

Também é possível iniciar separadamente:

```bash
npm run dev
cd frontend
npm install
npm run dev
```

Sempre inicie a API antes de usar o frontend. O Next.js encaminha as chamadas `/backend/*`
para a API. Se a API não estiver rodando, o navegador exibirá erro `ECONNREFUSED` na porta 3000.

## 2. Criar uma conta e entrar

1. Acesse `/cadastro`.
2. Informe nome, e-mail e senha com pelo menos 8 caracteres.
3. Após o cadastro, a sessão Better Auth é criada e mantida por cookie.
4. Para uma conta existente, use `/login`.
5. O botão de saída encerra a sessão no servidor.

O cadastro não concede automaticamente acesso a um condomínio. Isso é intencional: permissões
administrativas dependem de um vínculo persistido em `usuario_perfis`.

## 3. Primeiro acesso com permissões

Para visualizar e operar dados condominiais, a conta precisa ter um vínculo ativo com um
condomínio e um papel aceito pela matriz em `src/auth/rbac.ts`, como `SUPER_ADMIN`,
`ADMINISTRADORA`, `SINDICO` ou `MORADOR`, conforme a operação.

Sem vínculo ou sem permissão, a API retorna:

- `401` quando não existe sessão válida;
- `403` quando o papel não pode executar a operação ou o registro pertence a outro condomínio.

O frontend usa `/me` para carregar usuário, papéis e condomínios disponíveis. Os itens da
sidebar são apenas uma ajuda visual; a autorização real sempre ocorre no backend.

## 4. Navegação

- **Dashboard:** indicadores de condomínios, unidades, ocorrências e moradores autorizados.
- **Condomínios:** consulta e cadastro conforme o papel do usuário.
- **Unidades:** consulta e cadastro de unidades vinculadas a condomínios autorizados.
- **Ocorrências:** criação e acompanhamento de ocorrências permitidas pelo perfil.
- **Sidebar:** navegação responsiva e encerramento da sessão.

As telas exibem estados de carregamento, erro e lista vazia. Os dados são buscados na API real;
nenhuma lista mockada é usada como fonte definitiva.

## 5. Isolamento entre condomínios

O condomínio selecionado na interface não substitui o vínculo salvo no banco. Todas as operações
são filtradas e autorizadas no backend pelo usuário autenticado, seus papéis e seus vínculos.

Não tente enviar outro `condominio_id` para obter dados externos: a operação será rejeitada ou
retornará somente registros do escopo autorizado.

## 6. Arquivos

Uploads são feitos pelas rotas de arquivos e não pelo formulário genérico da interface. Os tipos
aceitos são PDF, JPG, JPEG, PNG e WEBP, com limite padrão de 10 MB. Arquivos privados exigem
sessão e permissão no condomínio associado.

## 7. Problemas comuns

### `ECONNREFUSED ::1:3000` ou `127.0.0.1:3000`

A API não está em execução. Na raiz, execute:

```bash
npm run dev:all
```

Ou execute `npm run dev` em um terminal e `cd frontend; npm run dev` em outro. Confirme a API
abrindo `http://localhost:3000/`; a resposta deve indicar que o banco está conectado.

### Tela volta para login

Verifique se os cookies estão habilitados e se `BETTER_AUTH_URL` e `FRONTEND_URL` correspondem
às portas usadas. Em Docker, use as variáveis do `compose.yaml`; localmente, use `3000` e `3001`.

### Login funciona, mas há `403`

A conta está autenticada, porém não possui o vínculo ou papel necessário em `usuario_perfis`.
Isso é uma regra de segurança, não uma falha de sessão.
