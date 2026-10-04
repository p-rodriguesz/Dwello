# API Condomínio

API REST em Fastify, TypeScript, MySQL e Drizzle para o banco `dwello`.

## Configuração

```bash
copy .env.example .env
npm install
npm run dev
```

Após configurar `DATABASE_URL` no `.env`, o `npm install` executa automaticamente o arquivo [database/dwello.sql](database/dwello.sql): ele cria o banco, as cinco tabelas e os dados de demonstração. Para executar novamente, use `npm run setup:db`. O script não duplica os dados de exemplo.

Também é possível abrir e executar o SQL integralmente em qualquer cliente MySQL (MySQL Workbench, DBeaver ou DB Client).

## Postman

Com a API em execução (`npm run dev`), importe o arquivo [postman/dwello-api.postman_collection.json](postman/dwello-api.postman_collection.json) no Postman. A variável `baseUrl` já está configurada como `http://localhost:3000`.

Execute as requisições na ordem numérica. A coleção armazena os IDs gerados automaticamente, pesquisa usuários, atualiza uma ocorrência e remove os registros de teste nas cinco últimas requisições.

## Recursos e rotas

Todos os recursos possuem CRUDL: `GET /recurso`, `GET /recurso/:id`, `POST /recurso`, `PUT /recurso/:id` e `DELETE /recurso/:id`.

| Recurso | Rota | Campos para criação/atualização |
| --- | --- | --- |
| Condomínios | `/condominios` | `nome`, `endereco` opcional |
| Unidades | `/unidades` | `condominio_id`, `bloco`, `numero` |
| Usuários | `/usuarios` | `nome`, `email`, `senha`, `perfil` opcional, `ativo` opcional |
| Moradores | `/moradores` | `usuario_id`, `unidade_id`, `tipo_vinculo` opcional |
| Ocorrências | `/ocorrencias` | `unidade_id` opcional, `usuario_id`, `titulo`, `descricao`, `status` opcional |

`GET /usuarios?q=ana` pesquisa por nome ou e-mail. A rota consulta os usuários persistidos no MySQL, nunca uma lista em memória. A senha é recebida na criação/alteração, armazenada como hash e não é retornada.

Valores aceitos: `perfil` = `morador`, `sindico`, `porteiro`, `prestador`, `admin`; `tipo_vinculo` = `proprietario`, `inquilino`, `dependente`; `status` = `aberta`, `em_andamento`, `resolvida`, `cancelada`.

## Exemplo

```bash
curl -X POST http://localhost:3000/condominios -H "Content-Type: application/json" -d '{"nome":"Residencial Aurora"}'
curl -X POST http://localhost:3000/usuarios -H "Content-Type: application/json" -d '{"nome":"Ana Silva","email":"ana@example.com","senha":"senha-segura"}'
curl -X POST http://localhost:3000/unidades -H "Content-Type: application/json" -d '{"condominio_id":1,"bloco":"A","numero":"101"}'
curl -X POST http://localhost:3000/moradores -H "Content-Type: application/json" -d '{"usuario_id":1,"unidade_id":1}'
curl "http://localhost:3000/usuarios?q=ana"
```

Os IDs relacionados devem existir antes da criação. Exclusões que quebrariam relacionamentos retornam `409`.
