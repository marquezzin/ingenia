# Spec

# Plataforma Digital de Ensino Introdutório de Programação — Technical Specification

## 1. Project Overview

Esta especificação técnica consolida o estado atual do projeto e funciona como documento âncora para orientar visão, escopo, arquitetura, decisões técnicas iniciais e próximos artefatos. A plataforma tem como objetivo oferecer um ambiente estruturado para ensino introdutório de programação a estudantes do 8º e 9º ano do ensino fundamental, com uso em escolas públicas, privadas e também de forma individual em casa.

O produto combina três pilares centrais:
- conteúdo didático progressivo;
- prática guiada por exercícios;
- feedback automático após submissão de código.

A proposta é atender principalmente alunos sem experiência prévia com programação, por meio de linguagem simples, experiência guiada e trilha visual de progresso, com foco de acesso por desktop. Além do aluno, a solução também contempla:
- professores, com acompanhamento de progresso e gestão de turmas;
- administradores, com gestão de conteúdo, exercícios e usuários.

### Documentos de referência principais
- [Project Charter](./PROJECT_CHARTER.md) — visão do produto, objetivos e contexto do problema.
- [Scope](./SCOPE.md) — funcionalidades incluídas no MVP e itens explicitamente fora do escopo.
- [Stakeholders and Roles](./STAKEHOLDERS_AND_ROLES.md) — perfis de usuários, objetivos e dores.
- [Assumptions & Risks](./ASSUMPTIONS.md) — premissas operacionais e riscos conhecidos.

## 2. Foundational Documents

### 2.1 Charter
- [./PROJECT_CHARTER.md](./PROJECT_CHARTER.md)

Síntese: o Charter define a plataforma como um ambiente de aprendizagem progressivo para programação introdutória, estruturado em módulos com videoaulas, material escrito, exercícios práticos, editor de código integrado e correção automática. Também estabelece os três perfis centrais do sistema: aluno, professor e administrador.

### 2.2 Scope
- [./SCOPE.md](./SCOPE.md)

Síntese: o Scope confirma como MVP os recursos de autenticação, perfis e permissões, trilhas por módulos, aulas com vídeo e texto, exercícios práticos, editor de código no navegador, correção automática, feedback ao aluno, visualização de progresso, painel do professor, gestão de turmas e administração de conteúdo e usuários. Também registra como fora do escopo da primeira versão:
- gamificação avançada;
- chat em tempo real;
- integração com sistemas escolares;
- app mobile nativo;
- certificação;
- aulas ao vivo;
- suporte a várias linguagens de programação.

### 2.3 Stakeholders and Roles
- [./STAKEHOLDERS_AND_ROLES.md](./STAKEHOLDERS_AND_ROLES.md)

Síntese: o documento identifica três personas centrais:
- estudante iniciante do 8º e 9º ano;
- professor do ensino fundamental;
- administrador da plataforma.

Esses perfis orientam a separação de permissões, a linguagem pedagógica e os fluxos principais da solução.

### 2.4 Assumptions & Risks
- [./ASSUMPTIONS.md](./ASSUMPTIONS.md)

Síntese: as premissas registradas indicam que o público será iniciante, o acesso principal ocorrerá por desktop, a linguagem da interface deve ser simples e guiada, e a correção automática dependerá da execução controlada do código com testes predefinidos. Esses pontos têm impacto direto nas decisões de UX, segurança e arquitetura da execução de código.

## 3. Technology Stack

As tecnologias específicas ainda não foram definidas no transcript. Portanto, esta seção registra apenas o que já está estabelecido e explicita as lacunas abertas.

### Backend
- **Language/Framework:** Não definido no transcript.
- **Database:** Não definida no transcript.
- **API Style:** Não definido no transcript.

### Frontend
- **Framework:** Não definido no transcript.
- **UI Library:** Não definida no transcript.
- **State Management:** Não definido no transcript.

### Infrastructure
- **Hosting:** Não definido no transcript.
- **CI/CD:** Não definido no transcript.
- **Monitoring:** Não definido no transcript.

### Diretrizes técnicas já inferidas do contexto
Mesmo sem stack definida, o produto exigirá capacidades técnicas compatíveis com:
- autenticação e controle de acesso por perfil;
- editor de código no navegador com foco em desktop;
- execução controlada de código submetido pelo aluno;
- armazenamento seguro de dados pessoais de estudantes e professores;
- registro de progresso por aluno, aula, módulo e exercício;
- painel de acompanhamento para professores;
- ferramentas administrativas de gestão de conteúdo e usuários.

## 4. Architecture Overview

A arquitetura funcional prevista é centrada em uma aplicação web com múltiplos perfis de acesso e um componente especializado para avaliação automática de exercícios de programação.

### Visão de alto nível
A solução deve ser organizada, no mínimo, pelos seguintes blocos lógicos:
1. **Camada de apresentação**  
   Interface web para alunos, professores e administradores, com navegação simples e guiada, priorizando desktop.

2. **Camada de aplicação**  
   Responsável por autenticação, autorização, gestão de usuários, módulos, aulas, exercícios, turmas, progresso e submissões.

3. **Camada de conteúdo educacional**  
   Gerencia módulos, aulas, videoaulas, materiais escritos e associação entre aulas e exercícios.

4. **Camada de avaliação automática**  
   Recebe a submissão de código do aluno, executa o código em ambiente controlado, roda testes predefinidos e devolve resultado de aprovação ou falha com feedback.

5. **Camada de persistência**  
   Armazena usuários, perfis, turmas, conteúdo, exercícios, testes, submissões e progresso acadêmico.

### Decisões arquiteturais já suportadas pelo transcript
- A solução será **web**, não um app mobile nativo na primeira versão.
- O uso principal será por **desktop**.
- O sistema terá **três perfis principais** com permissões distintas: aluno, professor e administrador.
- A plataforma exigirá **isolamento e controle na execução de código** por razões de segurança.
- A experiência deve ser **simples, intuitiva e guiada**, adequada a alunos iniciantes.

### Lacunas ainda abertas
Não há definição no transcript sobre:
- arquitetura monolítica ou microsserviços;
- uso de serviços de fila;
- estratégia de armazenamento de vídeos;
- tecnologia do editor de código;
- linguagem de programação suportada na primeira versão;
- estratégia de sandbox para execução segura;
- modelo de deploy e observabilidade.

## 5. Data Model

Os detalhes completos do modelo de domínio ainda não foram formalizados em artefato específico, mas as entidades centrais já podem ser identificadas a partir da descoberta.

### Entidades principais
- **Usuário**
  - representa qualquer conta da plataforma;
  - deve conter ao menos identidade, credenciais e perfil de acesso.

- **Perfil**
  - define o tipo de usuário: aluno, professor ou administrador.

- **Aluno**
  - usuário com trilha de aprendizagem, progresso e histórico de submissões.

- **Professor**
  - usuário com acesso a turmas e acompanhamento de estudantes.

- **Administrador**
  - usuário com acesso à gestão global do sistema.

- **Turma**
  - agrupamento de alunos acompanhado por um professor.

- **Módulo**
  - unidade temática da trilha de aprendizagem, como variáveis, condicionais, loops e funções.

- **Aula**
  - item pertencente a um módulo, combinando videoaula e material escrito.

- **Conteúdo escrito**
  - material textual de apoio vinculado a uma aula.

- **Vídeo**
  - recurso audiovisual vinculado a uma aula.

- **Exercício**
  - problema prático relacionado a uma aula ou módulo.

- **Teste de correção**
  - conjunto de verificações internas usadas para validar a submissão do aluno.

- **Submissão**
  - código enviado pelo aluno para avaliação.

- **Resultado de avaliação**
  - status da submissão, incluindo aprovação ou falha e mensagens de feedback.

- **Progresso**
  - registro da evolução do aluno em módulos, aulas e exercícios.

### Relacionamentos principais
- um **usuário** possui um **perfil**;
- um **professor** acompanha uma ou mais **turmas**;
- uma **turma** contém vários **alunos**;
- um **módulo** contém várias **aulas**;
- uma **aula** pode conter **vídeo**, **material escrito** e um ou mais **exercícios**;
- um **exercício** possui um conjunto de **testes de correção**;
- um **aluno** realiza várias **submissões**;
- cada **submissão** gera um **resultado de avaliação**;
- o **progresso** do aluno é derivado do consumo de aulas e do desempenho em exercícios.

## 6. API Design

O transcript não define contratos de API formais, mas permite identificar as capacidades funcionais mínimas que deverão ser expostas pela camada de aplicação.

### Domínios funcionais esperados

#### Autenticação e acesso
- login de usuário;
- controle de sessão ou token;
- recuperação e validação do perfil do usuário autenticado.

#### Gestão de usuários
- cadastro e manutenção de usuários;
- associação de usuários a perfis;
- gerenciamento de acesso por administrador.

#### Conteúdo educacional
- listagem de módulos;
- consulta de aulas por módulo;
- recuperação de vídeo e material escrito;
- criação e edição de módulos, aulas e exercícios por administrador.

#### Exercícios e submissões
- consulta de exercícios por aula ou módulo;
- envio de código pelo aluno;
- acionamento da correção automática;
- retorno do resultado da avaliação;
- consulta ao histórico de submissões.

#### Progresso acadêmico
- consulta do progresso individual do aluno;
- visualização da trilha de aprendizagem;
- marcação de módulos e atividades concluídos.

#### Professores e turmas
- criação e organização de turmas;
- associação de alunos a turmas;
- visualização de progresso por aluno e por turma.

### Observação de escopo
Os endpoints, formatos de payload, versionamento, códigos de resposta e políticas de erro permanecem **Pending — Phase 3**, por ausência de detalhamento no transcript.

## 7. Authentication & Authorization

### Método de autenticação
O transcript define a necessidade de mecanismos de autenticação, mas não especifica a tecnologia exata. Portanto:
- **Auth method:** Não definido no transcript.
- A solução deve implementar autenticação segura para acesso de alunos, professores e administradores.

### Modelo de autorização
O modelo de autorização já está claramente indicado como baseado em perfis.

#### Papéis previstos
- **Aluno**
  - acessar trilha de aprendizagem;
  - assistir videoaulas;
  - consultar material escrito;
  - resolver exercícios;
  - submeter código;
  - visualizar o próprio progresso.

- **Professor**
  - visualizar progresso dos estudantes;
  - acompanhar módulos concluídos e exercícios resolvidos;
  - gerenciar turmas;
  - monitorar desempenho coletivo.

- **Administrador**
  - criar e organizar módulos;
  - cadastrar aulas;
  - inserir exercícios;
  - gerenciar usuários;
  - monitorar o funcionamento geral da plataforma.

### Diretriz de segurança de acesso
A autorização deve impedir que:
- alunos acessem áreas administrativas;
- professores alterem funções exclusivas do administrador, caso isso não seja explicitamente permitido no futuro;
- usuários acessem dados pessoais ou acadêmicos sem relação com seu perfil e contexto de uso.

## 8. Non-Functional Requirements

Os números-alvo não foram definidos no transcript. Para manter aderência ao material de origem, os requisitos abaixo são descritos qualitativamente, com lacunas explicitadas.

| Requisito | Meta atual | Medição |
|---|---|---|
| Usabilidade | Interface simples, intuitiva e guiada para público iniciante | Avaliação qualitativa em testes com usuários |
| Acessibilidade pedagógica | Linguagem apropriada para alunos sem experiência prévia | Revisão de conteúdo e testes de compreensão |
| Segurança de dados | Armazenamento seguro e acesso apenas por usuários autorizados | Auditoria de controles de acesso e práticas de proteção |
| Segurança de execução | Código do aluno executado em ambiente controlado | Validação técnica da sandbox e isolamento |
| Compatibilidade de uso | Foco principal em desktop | Testes funcionais em navegadores-alvo |
| Rastreabilidade de progresso | Registro confiável de módulos concluídos e exercícios resolvidos | Validação por logs e consistência de dados |
| Disponibilidade | Não definida no transcript | Gap em aberto |
| Performance | Não definida no transcript | Gap em aberto |
| Escalabilidade | Não definida no transcript | Gap em aberto |
| Observabilidade | Não definida no transcript | Gap em aberto |

## 9. Security Considerations

A segurança é um requisito central do projeto, especialmente porque a plataforma lida com dados pessoais de estudantes e professores e com execução de código submetido por usuários.

### Proteção de dados
- dados pessoais devem ser armazenados de forma segura;
- acesso a dados deve ocorrer apenas para usuários autorizados;
- informações de alunos e professores devem respeitar segregação por perfil e contexto de uso.

### Segurança em trânsito e em repouso
- **Criptografia em trânsito:** necessária, embora a tecnologia específica não tenha sido definida no transcript;
- **Criptografia em repouso:** necessária para proteger dados armazenados, embora a estratégia específica não tenha sido definida.

### Controle de acesso
- implementação de autenticação segura;
- autorização baseada em perfil;
- proteção de áreas administrativas;
- restrição de acesso ao progresso e dados de estudantes conforme papel do usuário.

### Validação de entrada
- entradas de formulário e submissões devem ser validadas;
- conteúdo submetido pelo usuário deve ser tratado para reduzir risco de vulnerabilidades comuns em aplicações web.

### Execução segura de código
Este é o ponto mais sensível da solução.
- o código do aluno não deve ser executado sem isolamento;
- a execução deve ocorrer em ambiente controlado;
- os testes de correção devem ser predefinidos pelo sistema;
- o mecanismo deve limitar riscos operacionais e de segurança.

### Rate limiting
- necessário especialmente em rotas de autenticação e submissão de código;
- parâmetros concretos não foram definidos no transcript.

## 10. Design & Architecture Artifacts

### Domain Model
**Pending — Phase 2**  
O transcript já permite identificar entidades centrais como usuário, perfil, turma, módulo, aula, exercício, submissão e progresso, mas o modelo conceitual formal, com atributos, cardinalidades e regras de negócio detalhadas, ainda não foi produzido.

### Journeys
**Pending — Phase 2**  
As jornadas principais identificadas são:
- aluno percorre trilha, consome aula, resolve exercício e recebe feedback;
- professor acompanha progresso individual e coletivo;
- administrador gerencia conteúdo, exercícios e usuários.  
Os fluxos completos, exceções e estados intermediários ainda precisam ser detalhados.

### Authorization
**Pending — Phase 2**  
A separação por papéis já está definida em alto nível, mas a matriz formal de permissões por recurso e ação ainda não foi documentada.

### UX Flows
**Pending — Phase 2**  
Há diretrizes claras de UX — linguagem simples, navegação intuitiva, trilha visual de progresso e foco em desktop — porém os fluxos de tela, navegação e estados de interface ainda não foram modelados.

## 11. Contracts & Testing

### API Contracts
**Pending — Phase 3**  
Os contratos de API ainda não foram definidos. Será necessário formalizar recursos, métodos, payloads, respostas, erros, autenticação e versionamento.

### UI Contracts
**Pending — Phase 3**  
Os contratos de interface ainda não foram definidos. Será necessário especificar componentes, estados, mensagens, validações e comportamento por perfil.

### Acceptance Criteria
**Pending — Phase 3**  
Os critérios de aceite ainda não foram escritos por funcionalidade. O transcript oferece base para derivá-los, especialmente para autenticação, trilha de aprendizagem, submissão de código, feedback automático, progresso, painel do professor e gestão administrativa.

### Testing Strategy
**Pending — Phase 3**  
A estratégia de testes ainda não foi formalizada. Pelo contexto do produto, deverá cobrir ao menos:
- testes de autenticação e autorização;
- testes funcionais da trilha e do progresso;
- testes da correção automática;
- testes de segurança da execução de código;
- testes de usabilidade com público iniciante;
- testes das visões de professor e administrador.

## 12. Traceability & Release

### Traceability
**Pending — Phase 5**  
A matriz de rastreabilidade entre objetivos, funcionalidades, requisitos, contratos, testes e entregas ainda não foi produzida.

### Release Notes
**Pending — Phase 5**  
As notas de versão ainda não existem, pois o produto está em fase de definição inicial.

### Change Requests
**Pending — Phase 5**  
Ainda não há solicitações formais de mudança registradas. Mudanças futuras deverão ser relacionadas ao escopo, às premissas e às decisões arquiteturais documentadas neste SPEC.

## 13. Key Architecture Decision Records (ADRs)

### ADR-001 — Plataforma web com foco inicial em desktop
- **Status:** Aceito
- **Contexto:** O produto será usado em escolas e em casa, mas o transcript define foco principal de acesso por desktop.
- **Decisão:** A primeira versão será orientada a aplicação web com experiência priorizada para desktop.
- **Consequências:**  
  - simplifica o desenho inicial da interface;
  - reduz a necessidade de tratar complexidades de app mobile nativo no MVP;
  - exige atenção a compatibilidade entre navegadores desktop;
  - pode limitar a experiência em dispositivos móveis, o que permanece como risco se o comportamento real divergir da premissa.

### ADR-002 — Fluxo pedagógico baseado em conteúdo + prática + feedback automático
- **Status:** Aceito
- **Contexto:** O núcleo do produto é combinar videoaula, material escrito, exercício prático e correção automática.
- **Decisão:** O fluxo principal da aprendizagem será estruturado como consumo de conteúdo seguido de prática com avaliação automática.
- **Consequências:**  
  - a arquitetura deve integrar conteúdo educacional e mecanismo de submissão;
  - o progresso do aluno dependerá tanto do consumo de aulas quanto da resolução de exercícios;
  - a qualidade pedagógica do feedback automático torna-se elemento central do produto.

### ADR-003 — Controle de acesso baseado em três perfis principais
- **Status:** Aceito
- **Contexto:** O transcript identifica claramente aluno, professor e administrador como perfis centrais.
- **Decisão:** O sistema será estruturado inicialmente com RBAC baseado nesses três papéis.
- **Consequências:**  
  - facilita segregação funcional do sistema;
  - orienta a modelagem de permissões e navegação;
  - simplifica o MVP;
  - pode exigir refinamento futuro caso surjam subpapéis ou regras mais granulares.

### ADR-004 — Execução de código em ambiente controlado
- **Status:** Aceito
- **Contexto:** O sistema corrige automaticamente exercícios executando código submetido por alunos.
- **Decisão:** Toda submissão deverá ser processada em ambiente controlado e isolado, com testes predefinidos.
- **Consequências:**  
  - segurança passa a ser requisito arquitetural crítico;
  - a correção automática depende de mecanismo de sandbox ou equivalente;
  - haverá impacto em complexidade operacional, monitoramento e tratamento de falhas.

### ADR-005 — Linguagem e experiência guiadas para público iniciante
- **Status:** Aceito
- **Contexto:** O público-alvo inclui alunos sem experiência prévia com programação.
- **Decisão:** A interface, os textos e os fluxos devem priorizar simplicidade, clareza e orientação progressiva.
- **Consequências:**  
  - decisões de UX devem minimizar complexidade cognitiva;
  - feedbacks de erro precisam ser compreensíveis;
  - o desenho funcional deve evitar excesso de opções e navegação confusa.

## 14. Gaps Conhecidos

Os seguintes pontos não estão definidos no transcript e precisam de aprofundamento futuro:
- stack tecnológica de frontend, backend e banco de dados;
- linguagem de programação suportada nos exercícios;
- contratos de API e UI;
- metas quantitativas de performance, disponibilidade e escala;
- arquitetura de sandbox para execução de código;
- estratégia de monitoramento e observabilidade;
- política de backup, retenção e auditoria;
- detalhamento completo de permissões por ação;
- critérios de aceite por funcionalidade.

## 15. Estado Atual do Projeto

Com base nos documentos já gerados e no transcript, o projeto está em fase de definição funcional e conceitual, com visão de produto, perfis de usuários, escopo inicial, premissas e decisões estruturais básicas já identificados. Este SPEC consolida essas informações e estabelece a base para as próximas fases:
- **Phase 2:** modelagem de domínio, jornadas, autorização detalhada e fluxos de UX;
- **Phase 3:** contratos e estratégia de testes;
- **Phase 5:** rastreabilidade, release e gestão formal de mudanças.

Este documento deve ser lido em conjunto com:
- [./PROJECT_CHARTER.md](./PROJECT_CHARTER.md)
- [./SCOPE.md](./SCOPE.md)
- [./STAKEHOLDERS_AND_ROLES.md](./STAKEHOLDERS_AND_ROLES.md)
- [./ASSUMPTIONS.md](./ASSUMPTIONS.md)