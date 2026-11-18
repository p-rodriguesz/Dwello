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

## Escopo funcional

O sistema cobre cadastro, estrutura física, pessoas e vínculos, portaria, segurança, comunicação, solicitações, assembleias, documentos, finanças, manutenção, estoque, limpeza, áreas comuns, mudanças, animais, auditoria, privacidade, relatórios e integrações.
