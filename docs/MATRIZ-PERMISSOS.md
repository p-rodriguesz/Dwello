# Perfis e permissões

Este documento descreve pessoas, responsabilidades e operações do Dwello. A matriz padrão executável está em `src/auth/rbac.ts`. Quando carregadas pelo seed, as permissões efetivas ficam nas tabelas `perfis`, `permissoes` e `perfil_permissoes`.

## Autenticação e autorização

O Better Auth autentica a conta por e-mail e senha e cria uma sessão associada ao navegador. Depois da autenticação, o backend consulta `usuarios.auth_user_id`, o vínculo ativo em `usuario_perfis` e os papéis da conta.

- `401`: sessão ausente ou expirada.
- `403`: conta sem vínculo ativo, sem ação permitida ou tentando acessar outro condomínio.
- O frontend usa `/me/permissoes` apenas para montar menu e ações visíveis.
- Toda rota válida consulta `authorizeResource(...)` no backend antes de listar, criar, alterar, excluir ou baixar arquivos.
- O usuário só recebe registros dentro dos condomínios presentes em seus vínculos ativos.

## Perfis e responsabilidades

### SUPER_ADMIN

- Responsabilidade: administração global e suporte ao sistema.
- Funcionalidades: gerencia usuários e pode atuar em todos os condomínios.
- Operações: `read`, `create`, `update` e `delete` nos recursos da matriz.
- Escopo: global quando possui vínculo com `condominio_id = NULL`; não é limitado por município ou condomínio.

### ADMINISTRADORA

- Responsabilidade: gestão operacional e administrativa dos condomínios sob sua responsabilidade.
- Funcionalidades: unidades, moradores, estrutura, governança, finanças, manutenção, segurança, comunicação e novos módulos operacionais.
- Operações: ampla leitura, criação, alteração e exclusão nos recursos autorizados; possui permissões ampliadas em integração, automação e auditoria.
- Escopo: condomínios vinculados à conta.

### SINDICO

- Responsabilidade: coordenação administrativa e operacional do condomínio.
- Funcionalidades: unidades, moradores, ocorrências, estrutura, governança, finanças, manutenção, comunicação, portaria, segurança e reservas.
- Operações: CRUD amplo nos recursos autorizados; administradoras e contratos têm criação/alteração limitada conforme a matriz.
- Escopo: somente os condomínios vinculados.

### SUBSINDICO

- Responsabilidade: executar operações delegadas pelo síndico.
- Funcionalidades: consulta de condomínio, cadastro de unidades e moradores, ocorrências, estrutura, portaria, encomendas, segurança, comunicações e solicitações.
- Operações: principalmente leitura, criação e alteração; não recebe automaticamente exclusão ampla.
- Escopo: condomínios vinculados.

### CONSELHEIRO

- Responsabilidade: acompanhamento consultivo de governança e operação.
- Funcionalidades: consulta condominios, unidades, moradores, ocorrências, estrutura, governança, administradoras, contratos e módulos operacionais.
- Operações: predominantemente `read`.
- Escopo: condomínios vinculados.

### PORTEIRO

- Responsabilidade: operação diária da portaria.
- Funcionalidades: visitantes, autorizações e visitas, funcionários e turnos de portaria, encomendas, veículos, acessos, chaves e segurança.
- Operações: leitura de condomínio, unidade e morador; operações ampliadas nos recursos de portaria, visita, pacote, acesso e segurança conforme matriz.
- Escopo: condomínios vinculados.

### ZELADOR

- Responsabilidade: operação predial, manutenção e segurança.
- Funcionalidades: ocorrências, chaves, câmeras, monitoramento, ordens de serviço, problemas, tarefas preventivas, mudanças e vistorias.
- Operações: leitura geral de estrutura; criação/alteração de ocorrências e manutenção; CRUD em ordens de serviço permitidas.
- Escopo: condomínios vinculados.

### FUNCIONARIO

- Responsabilidade: execução de serviços operacionais autorizados.
- Funcionalidades: ocorrências, visitantes, encomendas, prestadores, segurança, comunicados, notificações e solicitações.
- Operações: leitura ampliada em muitos módulos; criação e alteração de ocorrências e solicitações permitidas.
- Escopo: condomínios vinculados.

### PROPRIETARIO

- Responsabilidade: acompanhar sua unidade e solicitar ou consultar serviços.
- Funcionalidades: consulta de condomínio, unidade e moradores; ocorrências próprias, solicitações, manifestações, reservas, assembleias, documentos e informações de animais.
- Operações: criação/alteração de ocorrências e solicitações próprias; consultas em documentos e assembleias; demais ações conforme matriz.
- Escopo: somente os dados do condomínio e relações da unidade vinculados ao perfil.

### MORADOR

- Responsabilidade: participar das operações permitidas para sua comunidade.
- Funcionalidades: consulta de unidade e estrutura, ocorrências, visitantes, encomendas, comunicados, solicitações, manifestações, reservas, assembleias e documentos.
- Operações: criação/alteração de ocorrências e solicitações; reserva; registro de veículo em recursos permitidos; consultas em demais módulos.
- Escopo: condomínio e unidade associados ao seu vínculo.

### VISITANTE

- Responsabilidade: pessoa externa sem privilégios administrativos.
- Funcionalidades: não possui recursos de administração na matriz padrão.
- Operações: nenhuma ação padrão da matriz; acesso futuro deve ser concedido explicitamente por vínculo e recurso.
- Escopo: somente registros que recebam uma autorização específica e estejam vinculados ao condomínio.

### PRESTADOR

- Responsabilidade: atendimento operacional externo autorizado.
- Funcionalidades: consulta e alteração de ocorrências conforme matriz.
- Operações: `read` e `update` em ocorrências; nenhum CRUD administrativo amplo.
- Escopo: somente condomínio autorizado pelo vínculo e pela ocorrência.

## Matriz resumida por domínio

| Perfil | Condomínios/unidades | Ocorrências | Portaria/visitantes | Encomendas/acessos | Comunicação | Solicitações/reservas | Manutenção/finanças/documentos |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SUPER_ADMIN | CRUD global | CRUD global | CRUD global | CRUD global | CRUD global | CRUD global | CRUD global |
| ADMINISTRADORA | CRUD amplo | CRUD | Amplos | Amplos | Amplos | Amplos | Amplos |
| SINDICO | CRUD amplo | CRUD | Amplos | Amplos | Amplos | Amplos | CRUD amplo autorizado |
| SUBSINDICO | Leitura/ampliação limitada | RCU | R/C/U | R/C/U | R/C/U | R/C/U | Principalmente leitura |
| CONSELHEIRO | Leitura | Leitura | Leitura operacional | Leitura | Leitura | Leitura | Leitura |
| PORTEIRO | Leitura unidade/condomínio | Leitura | CRUD operacional | CRUD operacional | Leitura limitada | Leitura | Leitura limitada |
| ZELADOR | Estrutura leitura | R/C/U | Segurança/chaves | Leitura limitada | Leitura limitada | R/C/U manutenção | Manutenção ampla |
| FUNCIONARIO | Estrutura leitura | R/C/U | R/C/U | R/C/U | R/C/U | R/C/U | Principalmente leitura |
| PROPRIETARIO | Unidade própria leitura | R/C/U | Consulta relacionada | Consulta relacionada | R/C/U | R/C/U | Documentos leitura |
| MORADOR | Unidade própria leitura | R/C/U | Consulta relacionada | Consulta relacionada | R/C/U | R/C/U/reserva | Documentos leitura |
| VISITANTE | Nenhum por padrão | Nenhum por padrão | Nenhum por padrão | Nenhum por padrão | Nenhum por padrão | Nenhum por padrão | Nenhum por padrão |
| PRESTADOR | Nenhum amplo | R/U | Nenhum amplo | Nenhum amplo | Nenhum amplo | Nenhum amplo | Nenhum amplo |

Legenda: `R` = read, `C` = create, `U` = update, `D` = delete.

## Operações permitidas por perfil

- `read`: consultar registros.
- `create`: criar registros.
- `update`: alterar registros.
- `delete`: excluir registros permitidos.
- Rotas genéricas aplicam a matriz ao recurso solicitado. Por exemplo, `/unidades` usa `unidades/read`; `/ocorrencias-seguranca` usa `ocorrencias_seguranca/create/update/delete`.
- Operações de auditoria são somente leitura/criação conforme o grupo `appendOnly` e não devem ser alteradas.
- A matriz completa, incluindo recursos específicos de lote 3 e lote 4, é a referência em `src/auth/rbac.ts`.

## Multi-condomínio e isolamento

Um usuário pode ter vários registros em `usuario_perfis`, por exemplo `MORADOR` no condomínio 1 e `PORTEIRO` no condomínio 2. Para cada requisição:

1. A sessão Better Auth fornece a identidade.
2. `getAuthorizationContext` obtém todos os vínculos ativos da pessoa.
3. `authorizeResource` soma permissões dos papéis e verifica o condomínio específico.
4. `condominioIds` limita listagens e registros consultados.
5. Validações de relacionamento impedem ligar unidade, ocorrência ou arquivo a outro condomínio.
6. O Super Admin global recebe escopo especial sem lista de condomínios.

Em um CRUD genérico, o frontend não envia o próprio perfil como prova de autorização. O backend verifica a sessão, o papel efetivo, a ação e o condomínio antes de executar o serviço.

## Validação no backend

As decisões não ficam apenas no React/Next.js:

- `src/middleware/require-session.ts` exige sessão.
- `src/auth/rbac.ts` resolve contexto, papel, ação e condomínio.
- `src/controllers/dwello.controller.ts` autoriza cada operação CRUD.
- `src/controllers/recursos.controller.ts` aplica ação e filtro por condomínio em recursos tradicionais.
- `src/routes/usuarios.routes.ts` exige permissão em gerenciamento de usuários.
- `src/controllers/papeis.controller.ts` exige Super Admin global para alterar cargos.
- `src/services/upload.service.ts` autoriza o condomínio associado antes de enviar ou baixar um arquivo.

Ocultar um botão no frontend é apenas experiência de usuário. A API continua protegida caso a chamada seja enviada diretamente pelo Postman, navegador ou outro cliente.
