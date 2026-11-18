# Documentação por domínio

Cada domínio abaixo descreve o que o sistema entrega, quem usa, quais dados persiste, quais regras aplica e como é acessado pela API e pelo frontend.

## 1. Estrutura condominial

### Descrição e objetivo
Administra a hierarquia física e administrativa dos condomínios. O objetivo é permitir que unidades, blocos e setores pertençam a um condomínio correto e sejam usados pelos demais módulos.

### Atores envolvidos
Super admin, administradora, síndico, subsíndico e usuários autorizados a consultar ou cadastrar estrutura.

### Entidades e relacionamentos
- `condominios`: cadastro principal.
- `blocos` pertence a um condomínio.
- `andares` pertence a um bloco e a um condomínio.
- `setores` pertence a um condomínio.
- `unidades` pertence a um condomínio e pode estar associada a um bloco.
- `moradores` relaciona usuários a unidades.

### Regras de negócio
- Um usuário só opera registros dos condomínios vinculados em `usuario_perfis`.
- Unidade, bloco, andar e setor devem permanecer no mesmo condomínio nas operações relacionadas.
- O condomínio global não é definido pelo formulário: o vínculo autorizado vem da sessão.

### Operações
CRUD completo para condomínios, blocos, andares, setores e unidades, sujeito às permissões do papel.

### Endpoints REST
`GET/POST/PUT/DELETE /condominios`, `/blocos`, `/andares`, `/setores` e `/unidades`.

### Telas e fluxo de navegação
Dashboard -> Condomínios -> Unidades. Os módulos genéricos exibem cadastro, busca, paginação, edição e exclusão conforme ações permitidas.

### Validações e controle de permissões
IDs positivos, campos obrigatórios e relações entre entidades são validados. A API usa `read`, `create`, `update` e `delete` com isolamento por condomínio.

### Integração com outros domínios
Estrutura fornece unidades e blocos para moradores, ocorrências, portaria, finanças, reservas e manutenção.

### Funcionalidade verificável
Criar condomínio e unidade; cadastrar bloco; impedir unidade ligada a condomínio diferente; listar somente o escopo autorizado.

## 2. Identidade, usuários e RBAC

### Descrição e objetivo
Garante autenticação da pessoa e autorização por papel e condomínio.

### Atores envolvidos
Usuário autenticado, super admin, administradoras, síndico e demais papéis definidos pela matriz.

### Entidades e relacionamentos
- `usuarios` representa o usuário sincronizado pelo Better Auth.
- `usuario_perfis` liga usuário, condomínio e papel.
- `perfis`, `permissoes` e `perfil_permissoes` armazenam ações permitidas.
- Better Auth mantém `user`, `session`, `account` e `verification`.

### Regras de negócio
- Cada usuário pode possuir papéis diferentes em condomínios diferentes.
- Um papel não global exige um condomínio selecionado.
- Super admin sem condomínio atua globalmente.
- A pessoa não pode alterar seu próprio cargo na tela administrativa.
- Cadastro não concede automaticamente acesso condominial.

### Operações
Sign-up, login, logout e consulta de sessão; consulta de perfil, papéis, vínculos e permissões; alteração de papel por condomínio.

### Endpoints REST
`POST /api/auth/sign-up/email`, `POST /api/auth/sign-in/email`, `GET /api/auth/get-session`, `POST /api/auth/sign-out`, `GET /me`, `GET /me/permissoes`, `GET /usuarios/papeis` e `PUT /usuarios/:id/papel`.

### Telas e fluxo de navegação
Cadastro/Login -> Dashboard -> Usuários e cargos. A tela exige condomínio antes de vincular um papel não global.

### Validações e controle de permissões
Senha gerenciada pelo Better Auth, sessão obrigatória e papel válido. A alteração de cargos exige super admin global. Toda decisão efetiva é validada no backend.

### Integração com outros domínios
Todas as operações consultam a identidade e os vínculos para permitir ação no condomínio correto.

### Funcionalidade verificável
Login cria sessão; usuário sem vínculo recebe 403; vínculo MORADOR em um condomínio não libera dados de outro; logout encerra a sessão.

## 3. Portaria e visitantes

### Descrição e objetivo
Controla credenciamento de visitantes, autorizações de entrada, registros de visita e turnos da portaria.

### Atores envolvidos
Porteiro, zelador, síndico, funcionário, morador e visitante.

### Entidades e relacionamentos
`visitantes` -> `autorizacoes_visita` -> `visitas`; `postos_portaria` e `funcionarios_portaria` -> `turnos_portaria`.

### Regras de negócio
- Visitante, unidade e autorização devem pertencer ao mesmo condomínio.
- Entrada só é registrada para uma autorização válida.
- Foto é opcional e não substitui identificação/documento.

### Operações
CRUD de visitantes, autorizações, visitas, funcionários, turnos e postos; operação de entrada/saída e foto.

### Endpoints REST
`/visitantes`, `/autorizacoes-visita`, `/visitas`, `/postos-portaria`, `/funcionarios-portaria`, `/turnos-portaria` e `POST /uploads/visitantes/:visitanteId/foto`.

### Telas e fluxo de navegação
Módulo Portaria/Visitantes -> cadastrar visitante -> selecionar unidade -> autorizar visita -> registrar entrada/saída.

### Validações e controle de permissões
IDs válidos, unidade autorizada, condomínio coerente e permissões de criar/editar visitantes e visitas.

### Integração com outros domínios
Utiliza unidades, moradores, usuários e o domínio de segurança para registrar ocorrências relacionadas.

### Funcionalidade verificável
Cadastrar visitante, autorizar unidade, registrar entrada/saída e impedir autorização em condomínio cruzado.

## 4. Encomendas e prestadores

### Descrição e objetivo
Rastreia recebimento e retirada de encomendas e controla acesso de prestadores e transportadoras.

### Atores envolvidos
Porteiro, funcionário, morador, transportadora e prestador de serviço.

### Entidades e relacionamentos
`encomendas` pertence ao condomínio e à unidade; `transportadoras` fornece dados de transporte; `retiradas_encomendas` registra retirada; `prestadores` pertence a pessoa/empresa e possui `acessos_prestadores`.

### Regras de negócio
- Encomenda pertence à unidade e ao condomínio.
- Retirada exige encomenda existente e identifica quem entregou/retirou.
- Foto da encomenda pode ser substituída e deve respeitar tipo e tamanho.
- Prestador só acessa os registros autorizados pelo seu papel.

### Operações
CRUD de encomendas, transportadoras, retiradas, prestadores, empresas e acessos.

### Endpoints REST
`/encomendas`, `/transportadoras`, `/retiradas-encomendas`, `/prestadores`, `/empresas-prestadoras`, `/acessos-prestadores` e `POST /uploads/encomendas/:encomendaId/foto`.

### Telas e fluxo de navegação
Módulo Encomendas -> recepção -> identificação da unidade -> foto -> retirada. Módulo Prestadores -> cadastro -> entrada/saída.

### Validações e controle de permissões
Validação de IDs e relações; permissões para porteiro/funcionário; rejeição de unidade de outro condomínio.

### Integração com outros domínios
Relaciona-se à estrutura por unidade e à identidade por usuários que recebem ou entregam encomendas.

### Funcionalidade verificável
Receber pacote, anexar foto, registrar retirada e impedir acesso externo.

## 5. Segurança e ocorrências

### Descrição e objetivo
Registra ocorrências, envolvidos, evidências, câmeras e monitoramento.

### Atores envolvidos
Zelador, porteiro, síndico, funcionário, morador e responsáveis pela segurança.

### Entidades e relacionamentos
`ocorrencias_seguranca` pertence ao condomínio e pode pertencer à unidade; `envolvidos_ocorrencias` e `evidencias_ocorrencias` dependem da ocorrência; câmeras geram incidentes e registros de monitoramento.

### Regras de negócio
- Unidade, ocorrência e evidências devem compartilhar o condomínio.
- Evidências podem ser JPG, JPEG, PNG, WEBP ou PDF até 10 MB.
- Ocorrência possui gravidade e status controlados pelos cargos autorizados.

### Operações
CRUD de ocorrências, envolvidos, evidências, câmeras, incidentes e registros de monitoramento.

### Endpoints REST
`/ocorrencias-seguranca`, `/envolvidos-ocorrencias`, `/evidencias-ocorrencias`, `/cameras`, `/incidentes`, `/registros-monitoramento` e `POST /uploads/ocorrencias-seguranca/:ocorrenciaId/evidencias`.

### Telas e fluxo de navegação
Ocorrências -> criar/abrir registro -> adicionar envolvidos -> anexar evidências -> acompanhar status.

### Validações e controle de permissões
Validação de relação cruzada, tipo MIME/extensão e permissão específica de ocorrência/evidência.

### Integração com outros domínios
Integra unidades, usuários, portaria e arquivos privados.

### Funcionalidade verificável
Criar ocorrência, anexar evidência válida, negar arquivo inválido e impedir evidência de outro condomínio.

## 6. Comunicação e notificações

### Descrição e objetivo
Distribui comunicados e notificações aos usuários e registra leitura.

### Atores envolvidos
Síndico, administradora, funcionário e moradores.

### Entidades e relacionamentos
`comunicados` -> `destinatarios_comunicados` -> `leituras_comunicados`; `notificacoes` -> `historico_notificacoes`; preferências são por usuário e condomínio.

### Regras de negócio
- Comunicado e destinatário devem estar no mesmo condomínio.
- Um usuário só consulta comunicação permitida pelo seu vínculo.
- Preferências e leitura não podem ser criadas para usuário externo.

### Operações
CRUD de comunicados, destinatários, notificações e preferências; criação de leituras e consulta de histórico.

### Endpoints REST
`/comunicados`, `/destinatarios-comunicados`, `/leituras-comunicados`, `/notificacoes`, `/preferencias-notificacao` e `/historico-notificacoes`.

### Telas e fluxo de navegação
Módulo Comunicação -> novo comunicado -> destinatários -> publicar; usuário consulta notificações e registra leitura.

### Validações e controle de permissões
Autenticação, RBAC por ação e filtro pelo condomínio autorizado.

### Integração com outros domínios
Usa usuários, perfis, condomínios e solicitações que podem gerar notificações.

### Funcionalidade verificável
Publicar comunicado, consultar como destinatário permitido e impedir leitura externa.

## 7. Solicitações, manifestações e assembleias

### Descrição e objetivo
Atende pedidos dos moradores, manifestações com resposta/anexo e processos deliberativos de assembleias.

### Atores envolvidos
Morador, proprietário, síndico, subsíndico, conselheiro e administradora.

### Entidades e relacionamentos
`solicitacoes` e `manifestacoes` pertencem ao condomínio; manifestações possuem respostas e anexos; `assembleias` possuem participantes, pautas, votações, opções e votos.

### Regras de negócio
- Solicitante e condomínio devem ser compatíveis.
- Histórico registra mudanças realizadas.
- Manifestação pode receber arquivo privado.
- Voto pertence a participante/pauta/votação permitida e não pode ser duplicado pela regra aplicada.

### Operações
CRUD dos registros permitidos, criação de respostas, anexos, participantes, pautas, opções e votos.

### Endpoints REST
`/solicitacoes`, `/historico-solicitacoes`, `/manifestacoes`, `/respostas-manifestacoes`, `/assembleias`, `/participantes-assembleia`, `/pautas-assembleia`, `/votacoes`, `/opcoes-votacao`, `/votos` e `POST /uploads/manifestacoes/:manifestacaoId/anexos`.

### Telas e fluxo de navegação
Módulo Solicitações -> criar/acompanhar; Manifestação -> enviar resposta/anexo; Assembleia -> pauta -> votação -> resultado.

### Validações e controle de permissões
Campos obrigatórios, relações do mesmo condomínio, ações por cargo e controle de anexos privados.

### Integração com outros domínios
Relaciona-se a usuários, unidades, comunicações e documentos.

### Funcionalidade verificável
Criar solicitação, anexar manifesto, responder, cadastrar pauta e impedir voto fora do escopo.

## 8. Documentos e finanças

### Descrição e objetivo
Gerencia documentos internos, taxas, contas, parcelas, pagamentos, recebimentos e comprovantes.

### Atores envolvidos
Síndico, administradora, funcionário, morador, proprietário e fornecedor.

### Entidades e relacionamentos
`documentos` pertencem ao condomínio; taxas originam composições e lançamentos de unidades; contas pagas possuem parcelas e pagamentos; contas a receber possuem parcelas e recebimentos.

### Regras de negócio
- Documento, conta e parcela devem pertencer ao mesmo condomínio.
- Pagamento/recebimento deve referenciar parcela existente.
- Comprovante aceita formatos permitidos e tamanho máximo.
- O documento privado só é exibido a quem tem permissão.

### Operações
CRUD de documentos, categorias, taxas, composições, contas, parcelas, pagamentos e recebimentos.

### Endpoints REST
`/documentos`, `/categorias-documento`, `/permissoes-documento`, `/taxas-condominiais`, `/composicoes-taxa`, `/lancamentos-unidades`, `/contas-pagar`, `/parcelas-pagar`, `/pagamentos-fornecedores`, `/contas-receber`, `/parcelas-receber`, `/recebimentos`, `POST /uploads/documentos/:documentoId` e `POST /uploads/pagamentos-fornecedores/:pagamentoId/comprovante`.

### Telas e fluxo de navegação
Módulo Documentos -> anexar/consultar; Finanças -> criar taxa/conta -> parcela -> pagamento/recebimento -> comprovante.

### Validações e controle de permissões
Valores numéricos, datas, relações existentes, mesmo condomínio e permissões de leitura/edição de documentos e finanças.

### Integração com outros domínios
Usa unidades, moradores, fornecedores, contas bancárias e comunicação.

### Funcionalidade verificável
Emitir documento, registrar parcela e pagamento, anexar comprovante válido e impedir relação com unidade externa.

## 9. Manutenção, patrimônio e áreas comuns

### Descrição e objetivo
Planeja manutenção preventiva, ordens de serviço, ativos, estoques e uso de áreas e equipamentos comuns.

### Atores envolvidos
Zelador, síndico, subsíndico, funcionário, prestador e morador.

### Entidades e relacionamentos
`planos_manutencao` possuem `tarefas_preventivas` e `agendamentos_manutencao`; ordens possuem problemas e histórico; ativos possuem histórico e estoque possui produtos/movimentos/inventários; áreas comuns possuem reservas, equipamentos e utilização.

### Regras de negócio
- Recursos de manutenção, patrimônio e áreas pertencem ao condomínio.
- Reserva deve respeitar regras da área e não pode conflitar com outra reserva válida.
- Ordem de serviço pode ser criada por problema reportado e atualizada por usuário autorizado.
- Movimentação de estoque exige produto e quantidade coerente.

### Operações
CRUD dos módulos de manutenção, ordens, ativos, estoque, inventários, áreas comuns, reservas e equipamentos.

### Endpoints REST
`/planos-manutencao`, `/tarefas-preventivas`, `/agendamentos-manutencao`, `/ordens-servico`, `/problemas-reportados`, `/historico-ordens-servico`, `/ativos`, `/produtos-estoque`, `/movimentacoes-estoque`, `/inventarios`, `/areas-comuns`, `/reservas`, `/regras-reserva`, `/equipamentos-lazer`, `/inscricoes-atividades` e `/registros-utilizacao`.

### Telas e fluxo de navegação
Manutenção -> plano/tarefa/ordem -> execução/histórico. Patrimônio -> ativo/estoque. Áreas comuns -> consultar disponibilidade -> reservar -> registrar uso.

### Validações e controle de permissões
Datas válidas, relação no mesmo condomínio, conflito de reserva e permissão de criar/editar registros.

### Integração com outros domínios
Relaciona-se a unidades, prestadores, moradores, comunicação e finanças em ordens/ativos.

### Funcionalidade verificável
Criar ordem de serviço, atualizar manutenção, registrar movimentação, reservar área livre e negar reserva conflitante.
