# API Condomínio

API acadêmica para gerenciamento inicial de usuários de um condomínio. Os dados
atuais são armazenados somente em memória e são perdidos quando a aplicação é
reiniciada.

## Tecnologias

- TypeScript
- Fastify
- Node.js

## Estrutura

```text
src/
├── controllers/
│   └── usuarios.controller.ts
├── routes/
│   ├── usuarios.routes.ts
│   └── ocorrencias.routes.ts
├── models/
│   ├── usuario.ts
│   └── ocorrencia.ts
├── app.ts
└── server.ts
tests/
├── .gitkeep
.env.example
package.json
tsconfig.json
README.md
```

## Requisitos

- Node.js 20+
- npm

## Instalação

```bash
npm install
```

## Desenvolvimento

Para executar com recarregamento automático:

```bash
npm run dev
```

A API será iniciada na porta definida por `PORT`, ou na porta `3000` quando a
variável não estiver definida.

## Build

Para gerar os arquivos JavaScript compilados:

```bash
npm run build
```

## Produção

Após gerar o build, inicie a aplicação com:

```bash
npm start
```

O servidor escuta em `0.0.0.0`.

## Rotas disponíveis

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/usuarios` | Lista os usuários |
| `GET` | `/usuarios/:id` | Busca um usuário pelo ID |
| `POST` | `/usuarios` | Cria um usuário |
| `PUT` | `/usuarios/:id` | Atualiza um usuário |
| `DELETE` | `/usuarios/:id` | Exclui um usuário |

As rotas de ocorrências ainda não possuem endpoints implementados.

## Exemplos de requisições

### Criar usuário

```bash
curl -X POST http://localhost:3000/usuarios \
	-H "Content-Type: application/json" \
	-d '{
		"nome": "Ana Silva",
		"email": "ana@example.com",
		"senha": "senha123",
		"apartamento": "101",
		"bloco": "A"
	}'
```

### Listar usuários

```bash
curl http://localhost:3000/usuarios
```

### Buscar usuário por ID

```bash
curl http://localhost:3000/usuarios/1
```

### Atualizar usuário

```bash
curl -X PUT http://localhost:3000/usuarios/1 \
	-H "Content-Type: application/json" \
	-d '{
		"apartamento": "202"
	}'
```

### Excluir usuário

```bash
curl -X DELETE http://localhost:3000/usuarios/1
```

As variáveis de ambiente disponíveis estão em `.env.example`.
