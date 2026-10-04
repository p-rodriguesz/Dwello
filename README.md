# API Condomínio

API REST em Fastify, TypeScript, MySQL e Drizzle para o banco `dwello`.

## Configuração

```bash
npm install
cp .env.example .env
npm run dev
```

Defina `DATABASE_URL` com a conexão MySQL, por exemplo `mysql://usuario:senha@localhost:3306/dwello`.

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
