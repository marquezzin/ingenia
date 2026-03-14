# Stakeholders And Roles

## Plataforma de Ensino Introdutório de Programação — Stakeholders & Roles

## 1. User Personas

### Persona: Estudante do 8º e 9º ano iniciante em programação
- **Role:** Aluno que utiliza a plataforma para aprender programação de forma introdutória, tanto no contexto escolar quanto em casa.
- **Goals:** Aprender conceitos básicos de programação de forma progressiva; acompanhar sua trilha de aprendizagem; assistir aulas, estudar materiais escritos, resolver exercícios e receber feedback imediato para evoluir.
- **Pain Points:** Não possui experiência prévia com programação; pode ter dificuldade em compreender conceitos abstratos; precisa de explicações simples e guiadas; pode se desmotivar se não conseguir perceber sua evolução ou se o erro não for explicado de forma clara.
- **Tech Savviness:** Baixa a média

### Persona: Professor do ensino fundamental
- **Role:** Docente responsável por acompanhar estudantes e turmas dentro da plataforma.
- **Goals:** Monitorar o progresso dos alunos; identificar quais estudantes iniciaram a trilha, quais módulos concluíram e quantos exercícios resolveram; acompanhar o desempenho da turma como um todo; intervir quando necessário.
- **Pain Points:** Dificuldade em acompanhar individualmente a evolução de todos os alunos sem um painel centralizado; necessidade de identificar rapidamente alunos com dificuldades; necessidade de organizar estudantes em turmas e visualizar desempenho coletivo.
- **Tech Savviness:** Média

### Persona: Administrador da plataforma
- **Role:** Responsável pela gestão global do sistema, conteúdo e usuários.
- **Goals:** Criar e organizar módulos de conteúdo; cadastrar aulas; inserir exercícios; gerenciar usuários; monitorar o funcionamento geral da plataforma; garantir organização educacional e técnica do ambiente.
- **Pain Points:** Necessidade de controle completo e centralizado da plataforma; necessidade de manter conteúdo e estrutura sempre atualizados; responsabilidade sobre acesso seguro e correto às funcionalidades do sistema.
- **Tech Savviness:** Alta

## 2. System Roles & Permissions

| Role | Permissions | Description |
|------|-------------|-------------|
| Administrador | Acesso completo ao sistema; criar, editar e organizar módulos; cadastrar aulas; inserir e manter exercícios; gerenciar usuários; monitorar o funcionamento geral da plataforma | Perfil com controle total sobre a operação, estrutura pedagógica e gestão técnica da plataforma |
| Professor | Visualizar progresso dos estudantes; acompanhar módulos concluídos; consultar quantidade de exercícios resolvidos; gerenciar turmas; acompanhar desempenho coletivo e individual | Perfil voltado ao acompanhamento pedagógico e à organização de alunos em grupos/turmas |
| Aluno | Acessar trilha de aprendizagem; assistir videoaulas; ler materiais escritos; usar editor de código; submeter exercícios; receber correção automática e feedback; visualizar o próprio progresso | Perfil principal da experiência de aprendizagem, com foco em estudo, prática e evolução guiada |

### Observações sobre autorização
- O sistema deve possuir mecanismos de autenticação e controle de permissões.
- O acesso aos dados deve ocorrer apenas por usuários autorizados.
- Como a plataforma lida com dados pessoais de estudantes e professores, deve haver proteção adequada de armazenamento e acesso.
- Regras detalhadas de permissão por ação específica não foram totalmente definidas no transcript e devem ser refinadas com o cliente durante a etapa de modelagem de autorização.

## 3. External Stakeholders

- **Escolas públicas e privadas:** Instituições que poderão adotar a plataforma no contexto escolar para apoiar o ensino introdutório de programação.
- **Responsáveis pelos estudantes:** Interessados indiretos no uso seguro e eficaz da plataforma, especialmente por se tratar de um público jovem. A participação exata desse grupo no sistema não foi definida no transcript.
- **Corpo pedagógico/especialistas em conteúdo:** Interessados na qualidade da trilha de aprendizagem, dos módulos, das aulas e dos exercícios. Nomeações específicas não foram informadas no transcript.
- **Responsáveis por segurança e proteção de dados:** Parte interessada na garantia de autenticação, controle de permissões e proteção contra vulnerabilidades comuns em aplicações web.
- **Serviço de execução controlada de código:** Componente externo ou de infraestrutura necessário para rodar o código submetido pelos alunos em ambiente controlado e realizar os testes automáticos. A tecnologia específica não foi definida no transcript.

## 4. Project Stakeholders

### Patrocinador
- **To be defined with the client**
- **Relação com o projeto:** A pessoa ou área patrocinadora não foi identificada no transcript.

### Business Owner
- **To be defined with the client**
- **Relação com o projeto:** O responsável direto pelo produto, priorização de negócio e validação final não foi identificado no transcript.

### Subject Matter Experts (SMEs)
- **Professor do ensino fundamental**
  - **Relação com o projeto:** Especialista no acompanhamento pedagógico, no uso da plataforma em contexto escolar e na análise do progresso dos estudantes.
- **Especialista em ensino introdutório de programação**
  - **Relação com o projeto:** Interessado na construção da trilha de aprendizagem, definição dos módulos e adequação do conteúdo para alunos sem experiência prévia.
  - **Observação:** Nome específico não informado no transcript.
- **Especialista em segurança e proteção de dados**
  - **Relação com o projeto:** Necessário para orientar autenticação, permissões e proteção de dados pessoais de estudantes e professores.
  - **Observação:** Nome específico não informado no transcript.
- **Administrador da plataforma**
  - **Relação com o projeto:** Especialista operacional no gerenciamento de conteúdo, exercícios, aulas e usuários dentro do sistema.

## 5. Gaps identificados no transcript

- Não foram informados nomes reais, cargos formais ou áreas responsáveis pelos stakeholders do projeto.
- Não foi definido se haverá participação explícita de coordenadores pedagógicos, diretores escolares ou responsáveis legais no uso ou acompanhamento da plataforma.
- Não foram detalhadas permissões mais granulares, como edição de turmas pelo professor, redefinição de senha, publicação de conteúdo ou acesso a relatórios avançados.
- Não foi especificado se haverá distinção entre administrador técnico e administrador de conteúdo.
- Não foram definidos serviços terceiros específicos para autenticação, armazenamento, execução de código ou monitoramento.