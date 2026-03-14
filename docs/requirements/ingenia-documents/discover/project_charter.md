# Project Charter

## 1. Overview

A proposta do projeto é criar uma plataforma digital de ensino introdutório de programação voltada para estudantes do 8º e 9º ano do ensino fundamental, com uso tanto em escolas públicas e privadas quanto de forma individual em casa. A plataforma será estruturada como um ambiente de aprendizagem progressivo, no qual o aluno percorre uma trilha organizada de conteúdos, consumindo materiais didáticos, praticando exercícios e recebendo feedback automático sobre suas respostas.

O principal problema que o projeto busca resolver é a dificuldade de oferecer uma introdução prática, guiada e acessível à programação para alunos sem experiência prévia. Para isso, a solução combina videoaulas, material escrito, editor de código embutido, exercícios práticos com correção automática e visualização de progresso. Além de apoiar o aluno, a plataforma também atende professores, com recursos de acompanhamento de turmas e desempenho, e administradores, com ferramentas de gestão de conteúdo, exercícios e usuários.

## 2. Objectives

- **Objetivo principal:** oferecer uma plataforma estruturada e intuitiva para o ensino introdutório de programação a alunos do 8º e 9º ano, com foco em aprendizagem ativa por meio de conteúdo guiado, prática e feedback imediato.
- **Objetivos secundários:**
  - Organizar o ensino em módulos progressivos sobre conceitos básicos de programação, como variáveis, estruturas condicionais, loops e funções.
  - Permitir que o aluno assista a videoaulas, consulte material escrito e resolva exercícios em um único ambiente.
  - Disponibilizar um mecanismo de correção automática que execute testes internos e informe se a solução do aluno atende aos resultados esperados.
  - Oferecer ao professor um painel para acompanhar progresso, módulos concluídos e quantidade de exercícios resolvidos por aluno.
  - Permitir a gestão de turmas para acompanhamento coletivo do desempenho.
  - Disponibilizar ao administrador controle sobre módulos, aulas, exercícios e usuários.
  - Garantir autenticação, controle de permissões e proteção básica de dados e acessos.
  - Adotar linguagem simples e guiada, adequada a alunos iniciantes e à faixa etária proposta.
- **Critérios de sucesso:**
  - O aluno consegue percorrer uma trilha visual de aprendizagem e identificar seu progresso ao longo dos módulos.
  - O aluno consegue submeter código diretamente na plataforma e receber retorno automático sobre o resultado.
  - O professor consegue visualizar o andamento dos estudantes e o desempenho por turma.
  - O administrador consegue cadastrar e organizar conteúdos, exercícios e usuários sem depender de processos externos.
  - A plataforma atende alunos sem experiência prévia com programação com navegação simples e interface adequada ao público jovem.
  - O acesso principal funciona em ambiente desktop, conforme definido para a primeira versão.

## 3. Scope

### In Scope

- Plataforma web de ensino introdutório de programação para alunos do 8º e 9º ano.
- Estrutura de aprendizagem baseada em módulos temáticos.
- Aulas compostas por:
  - videoaula;
  - material escrito com explicações, exemplos de código e observações.
- Trilha de aprendizagem visual com indicação de progresso do aluno.
- Exercícios práticos de programação vinculados aos conteúdos estudados.
- Editor de código integrado à plataforma.
- Submissão de código pelo aluno para avaliação.
- Correção automática com execução em ambiente controlado e testes internos predefinidos.
- Feedback automático indicando sucesso ou falha nos testes, com mensagens de apoio para identificação de erros.
- Área do aluno para acompanhamento da própria evolução.
- Painel do professor para:
  - visualizar quais alunos iniciaram a trilha;
  - acompanhar módulos concluídos;
  - verificar quantos exercícios cada aluno resolveu.
- Gestão de turmas para organização de alunos em grupos e acompanhamento coletivo.
- Perfil de administrador com acesso completo para:
  - criar e organizar módulos;
  - cadastrar aulas;
  - inserir exercícios;
  - gerenciar usuários.
- Mecanismos de autenticação e controle de permissões por perfil.
- Medidas de segurança para proteção de dados pessoais e mitigação de vulnerabilidades comuns em aplicações web.
- Interface simples, intuitiva, guiada e adequada a alunos iniciantes.
- Uso em escolas públicas, escolas privadas e também em ambiente doméstico.

### Out of Scope

- Gamificação avançada.
- Chat em tempo real.
- Integração com sistemas escolares.
- Aplicativo mobile nativo.
- Certificação.
- Aulas ao vivo.
- Suporte a várias linguagens de programação.

## 4. Stakeholders

| Role | Responsibility |
|------|---------------|
| Alunos do 8º e 9º ano | Consumir o conteúdo, realizar exercícios, acompanhar a própria evolução e aprender conceitos introdutórios de programação |
| Professores | Acompanhar o progresso dos estudantes, organizar turmas, identificar dificuldades e intervir pedagogicamente quando necessário |
| Administrador da plataforma | Gerenciar módulos, aulas, exercícios, usuários e o funcionamento geral da plataforma |
| Escolas públicas e privadas | Contexto institucional de adoção da plataforma em ambiente escolar |
| Usuários em uso individual em casa | Utilizar a plataforma fora do ambiente escolar, de forma autônoma |
| Cliente | To be defined with the client |

## 5. Timeline & Milestones

- **Fase 1: Descoberta (atual)**
  - Levantamento da visão do produto
  - Definição do público-alvo
  - Delimitação inicial do escopo e do que ficará fora da primeira versão

- **Fase 2: Design**
  - Definição da experiência do aluno, professor e administrador
  - Estruturação da trilha de aprendizagem
  - Desenho dos fluxos principais, incluindo consumo de conteúdo, resolução de exercícios e acompanhamento de progresso

- **Fase 3: Implementação**
  - Desenvolvimento da plataforma web com foco em desktop
  - Implementação dos perfis de acesso
  - Construção do módulo de conteúdo, editor de código, correção automática, painel do professor, gestão de turmas e área administrativa

- **Marcos**
  - Escopo inicial validado
  - Estrutura pedagógica dos módulos definida
  - Protótipo da experiência principal concluído
  - MVP funcional com aluno, professor e administrador
  - Validação inicial em contexto escolar e/ou uso doméstico

> Prazos e datas específicas: To be defined with the client.

## 6. Constraints & Assumptions

- **Restrições técnicas**
  - A primeira versão terá foco principal em acesso por desktop.
  - Não haverá aplicativo mobile nativo no MVP.
  - Não haverá suporte a várias linguagens de programação na primeira versão.
  - A correção automática dependerá de execução de código em ambiente controlado, exigindo atenção especial à segurança.

- **Restrições de negócio**
  - O produto deve atender tanto escolas públicas quanto privadas, além de uso individual em casa.
  - O conteúdo e a navegação devem ser apropriados para alunos do 8º e 9º ano.
  - A solução deve ser adequada a estudantes sem experiência prévia com programação.

- **Principais premissas**
  - Os alunos aprenderão melhor com uma combinação de conteúdo explicativo, prática guiada e feedback imediato.
  - Professores utilizarão o painel para acompanhar evolução e apoiar a turma pedagogicamente.
  - Administradores serão responsáveis por manter conteúdos, exercícios e usuários atualizados.
  - Uma linguagem simples e guiada aumentará a acessibilidade do produto para iniciantes.
  - A trilha visual de progresso ajudará a manter motivação e clareza sobre a evolução do aluno.

## 7. Major Risks

- **Complexidade e segurança da execução de código**
  - **Risco:** a correção automática exige execução de código enviado pelo aluno, o que pode gerar vulnerabilidades e instabilidade.
  - **Mitigação:** usar ambiente controlado e isolado, limitar recursos de execução, aplicar testes internos predefinidos e adotar práticas de segurança para aplicações web.

- **Dificuldade de adoção por alunos iniciantes**
  - **Risco:** alunos sem experiência prévia podem ter dificuldade para compreender a lógica da plataforma ou dos exercícios.
  - **Mitigação:** adotar linguagem simples e guiada, interface intuitiva, progressão gradual de conteúdo e feedback claro após cada submissão.

- **Sobrecarga pedagógica ou baixa utilização pelo professor**
  - **Risco:** o painel de acompanhamento pode não gerar valor se não for simples de usar ou se não apresentar informações relevantes.
  - **Mitigação:** priorizar indicadores objetivos, como progresso por módulo e exercícios resolvidos, com visualização clara e direta.

- **Escopo crescer além do MVP**
  - **Risco:** solicitações como gamificação, app mobile, integrações, aulas ao vivo ou múltiplas linguagens podem comprometer prazo e foco.
  - **Mitigação:** manter explícitos os itens fora do escopo e validar novas demandas apenas para fases futuras.

- **Proteção de dados pessoais**
  - **Risco:** o sistema lida com informações de estudantes e professores, exigindo cuidado com acesso indevido e armazenamento inseguro.
  - **Mitigação:** implementar autenticação, controle de permissões por perfil e medidas de proteção contra vulnerabilidades comuns.

- **Lacunas de definição ainda não detalhadas**
  - **Risco:** ausência de definições mais específicas sobre cronograma, métricas quantitativas de sucesso, responsáveis nomeados e operação inicial pode dificultar planejamento.
  - **Mitigação:** alinhar esses pontos em uma próxima etapa com o cliente antes do detalhamento técnico e do planejamento executivo.