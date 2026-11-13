# Deploy do frontend no Vercel

## Arquitetura

O Vercel hospeda o frontend Next.js. A API Fastify continua sendo executada em um serviço
com acesso persistente ao MySQL e ao armazenamento de uploads, como Docker em uma VM ou
um provedor de backend.

Não configure `API_URL` como `localhost` no Vercel: dentro do deploy, `localhost` aponta
para a própria infraestrutura do frontend, não para a API local.

## 1. Hospede a API primeiro

Publique a API em uma URL HTTPS, por exemplo:

```text
https://api.seu-dominio.com
```

Na configuração da API, use:

```env
PORT=3000
DATABASE_URL=mysql://usuario:senha@host-do-mysql:3306/dwello
BETTER_AUTH_SECRET=um-segredo-aleatorio-com-pelo-menos-32-caracteres
BETTER_AUTH_URL=https://api.seu-dominio.com
FRONTEND_URL=https://seu-projeto.vercel.app
UPLOAD_DIR=/var/lib/dwello/uploads
```

O banco e o diretório de uploads precisam estar disponíveis para a API. O filesystem
efêmero do Vercel não deve ser usado para armazenar esses arquivos.

Valide a API antes de configurar o frontend:

```text
https://api.seu-dominio.com/
```

Ela deve retornar `api: online` e `database: connected`.

## 2. Importe o projeto no Vercel

1. No Vercel, crie um novo projeto a partir do repositório.
2. Em **Root Directory**, selecione `frontend` e confirme a opção para incluir os arquivos
   dessa pasta no deploy.
3. Selecione o framework **Next.js**. O arquivo `frontend/vercel.json` já define `npm ci` e
   `npm run build`.
4. Em **Build and Output Settings**, deixe **Output Directory** vazio ou use apenas `.next`.
   Não use `frontend/.next`, pois o Root Directory já é `frontend`.
5. Não selecione a raiz do repositório como Root Directory para este projeto frontend: o
   `package.json` da raiz é da API Fastify e não possui a dependência `next`.

Se o projeto já foi criado com a raiz incorreta, abra **Settings > General > Root Directory**,
altere para `frontend`, salve e faça um novo deploy. O erro `NEXT_NO_VERSION` desaparece quando
o Vercel passa a ler `frontend/package.json`.

Se aparecer `frontend/frontend/.next`, corrija **Output Directory** para `.next` ou remova o
valor personalizado e faça um novo deploy sem usar o cache anterior.

Para validar o deploy automaticamente, o workflow de CD usa `working-directory: frontend`.
Cadastre no GitHub os secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` e a
repository variable `VERCEL_ENABLED=true`. O workflow é executado em pushes para `main` ou
manualmente em **Actions > CD - Vercel > Run workflow**. Sem essa variable, o CD fica pulado
sem bloquear o CI.

## 3. Configure as variáveis do Vercel

Em **Settings > Environment Variables**, adicione para Production, Preview e Development
conforme necessário:

```env
API_URL=https://api.seu-dominio.com
```

`API_URL` é usada pelo rewrite do Next.js em `frontend/next.config.ts`. O navegador chama
`/backend/...` no mesmo domínio do Vercel, e o servidor Next encaminha a chamada para a API.

Depois de alterar `API_URL`, faça um novo deploy, pois ela é lida durante a configuração/build
do Next.js.

## 4. Domínio próprio

Se o frontend usar um domínio próprio, atualize na API:

```env
FRONTEND_URL=https://app.seu-dominio.com
```

Mantenha `BETTER_AUTH_URL` apontando para a URL pública da API. O `BETTER_AUTH_SECRET` deve
ser o mesmo entre os deploys da API e nunca deve ser commitado.

## 5. Teste após o deploy

1. Abra a URL do Vercel.
2. Acesse `/cadastro` e crie uma conta de teste.
3. Confirme o login e a sessão no dashboard.
4. Teste `/login` e logout.
5. Verifique `GET https://api.seu-dominio.com/`.
6. Para CRUD, use uma conta com vínculo em `usuario_perfis` e papel permitido.
7. Teste upload somente após confirmar que `UPLOAD_DIR` é persistente na hospedagem da API.

## Problemas comuns

### `ECONNREFUSED` no Vercel

`API_URL` ainda está apontando para `localhost` ou a API pública está parada.

### Erro de autenticação ou cookie

Confira `BETTER_AUTH_URL`, `FRONTEND_URL`, HTTPS e o domínio usado no navegador. Gere um
novo deploy depois de alterar variáveis do Vercel.

### API responde 503

A API iniciou, mas não conseguiu acessar o MySQL. Verifique `DATABASE_URL`, firewall, usuário,
senha e migrations do banco.

### Upload não persiste

O armazenamento da API não é persistente. Configure volume ou storage externo no provedor
que hospeda o backend.

## CI/CD do projeto

O workflow [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) valida, em pull requests e
pushes para `main`:

- MySQL 8.4 de serviço;
- preparação incremental do schema;
- seed;
- build e testes do backend;
- typecheck e build do frontend.

O workflow [`.github/workflows/cd.yml`](../.github/workflows/cd.yml) publica somente o frontend
no Vercel. A API não é publicada automaticamente porque precisa de MySQL e armazenamento
persistente; ela deve ser implantada no serviço de backend escolhido.
