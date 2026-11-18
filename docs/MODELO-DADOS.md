# Modelo de dados

O arquivo editável principal é `database/dwello.sql`. Ele contém criação de tabelas, índices e relacionamentos. A configuração do Drizzle é baseada em `src/db/dwello-schema.ts`. O diagrama editável está em `docs/modelo-dados.mmd` e sua versão imprimível em `docs/modelo-dados.pdf`.

```mermaid
erDiagram
    CONDOMINIOS ||--o{ UNIDADES : possui
    CONDOMINIOS ||--o{ BLOCOS : possui
    BLOCOS ||--o{ ANDARES : possui
    BLOCOS ||--o{ UNIDADES : contem
    UNIDADES ||--o{ MORADORES : abriga
    USUARIOS ||--o{ USUARIO_PERFIS : possui
    CONDOMINIOS ||--o{ USUARIO_PERFIS : limita
    USUARIOS ||--o{ MORADORES : vincula
    UNIDADES ||--o{ OCORRENCIAS : recebe
    CONDOMINIOS ||--o{ DOCUMENTOS : arquiva
    DOCUMENTOS ||--o{ ANEXOS_MANIFESTACOES : relaciona
    CONDOMINIOS ||--o{ SOLICITACOES : recebe
    CONDOMINIOS ||--o{ ASSEMBLEIAS : promove
    ASSEMBLEIAS ||--o{ PAUTAS_ASSEMBLEIA : possui
    PAUTAS_ASSEMBLEIA ||--o{ VOTACOES : gera
    VOTACOES ||--o{ VOTOS : registra
```

## Relacionamentos principais

- Condomínio contém blocos, unidades, pessoas e registros operacionais.
- Unidade pertence a um condomínio e pode estar associada a moradores.
- Usuário possui um ou vários vínculos de perfil por condomínio.
- Ocorrências pertencem a unidades e podem possuir evidências.
- Solicitações e manifestações são relacionadas ao condomínio e aos usuários envolvidos.
- Assembleias contêm pautas, votações e votos.
- Documentos são associados ao condomínio e podem usar arquivos armazenados fora do banco.
