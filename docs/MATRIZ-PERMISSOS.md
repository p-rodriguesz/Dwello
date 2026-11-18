# Matriz resumida de permissões

A matriz completa e executável está em `src/auth/rbac.ts`. Permissões efetivas também podem ser armazenadas nas tabelas `perfis`, `permissoes` e `perfil_permissoes`.

| Perfil | Escopo típico |
| --- | --- |
| SUPER_ADMIN | Todas as operações e todos os condomínios |
| ADMINISTRADORA | Gestão ampla nos condomínios administrados |
| SINDICO | Gestão administrativa e operacional no condomínio |
| SUBSINDICO | Operações delegadas e consultas ampliadas |
| CONSELHEIRO | Consultas de governança e operação |
| PORTEIRO | Portaria, visitantes, encomendas e acessos |
| ZELADOR | Ocorrências, chaves, segurança e manutenção |
| FUNCIONARIO | Operações operacionais autorizadas |
| PROPRIETARIO | Dados da unidade e solicitações próprias |
| MORADOR | Dados da comunidade e solicitações próprias |
| VISITANTE | Sem privilégios administrativos |
| PRESTADOR | Operações restritas e ocorrências autorizadas |

## Operações

- `read`: consultar registros.
- `create`: criar registros.
- `update`: alterar registros.
- `delete`: excluir registros permitidos.

O frontend usa a resposta de permissões apenas para montar a navegação. Toda decisão de acesso é validada novamente pelas rotas no backend.
