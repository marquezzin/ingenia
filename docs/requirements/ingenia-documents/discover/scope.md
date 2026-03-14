# Scope

# Plataforma Digital de Ensino Introdutório de Programação — Scope Document

## 1. Feature Inventory

### Must-Have (MVP)

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 1 | Autenticação de usuários | Login seguro para alunos, professores e administradores, com controle de acesso por perfil. | Critical |
| 2 | Gestão de perfis e permissões | Separação clara entre funcionalidades de aluno, professor e administrador. | Critical |
| 3 | Trilhas de aprendizagem por módulos | Organização do conteúdo em módulos progressivos de programação introdutória, como variáveis, condicionais, loops e funções. | Critical |
| 4 | Aulas com videoaula e material escrito | Cada aula deve combinar vídeo explicativo e conteúdo textual de apoio com exemplos e observações importantes. | Critical |
| 5 | Exercícios práticos de programação | Disponibilização de problemas para resolução após o consumo do conteúdo da aula. | Critical |
| 6 | Editor de código no navegador | Ambiente de edição para o aluno escrever e submeter sua solução diretamente na plataforma, com foco em uso por desktop. | Critical |
| 7 | Correção automática com testes | Execução controlada do código submetido e validação por testes internos predefinidos para cada exercício. | Critical |
| 8 | Feedback automático ao aluno | Exibição do resultado da submissão, indicando sucesso ou falha, com mensagens de apoio para orientar a correção. | Critical |
| 9 | Visualização de progresso do aluno | Exibição clara da evolução do estudante ao longo dos módulos e aulas da trilha. | Critical |
| 10 | Interface simples e guiada | Experiência adequada para alunos sem experiência prévia com programação, com linguagem simples e navegação intuitiva. | Critical |
| 11 | Painel do professor | Visualização do progresso dos estudantes, incluindo início da trilha, módulos concluídos e quantidade de exercícios resolvidos. | Critical |
| 12 | Gestão de turmas | Recurso para o professor organizar alunos em grupos/turmas e acompanhar o desempenho coletivo. | Critical |
| 13 | Painel administrativo de conteúdo | Cadastro e organização de módulos, aulas e exercícios pelo administrador. | Critical |
| 14 | Gestão de usuários pelo administrador | Criação, atualização e administração de usuários da plataforma. | Critical |
| 15 | Medidas básicas de segurança | Armazenamento seguro de dados, autenticação, autorização e proteção contra vulnerabilidades comuns em aplicações web. | Critical |

### Nice-to-Have (Post-MVP)

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 1 | Gamificação avançada | Sistemas de pontos, medalhas, rankings ou recompensas para aumentar engajamento. | Low |
| 2 | Chat em tempo real | Comunicação instantânea entre alunos e professores dentro da plataforma. | Low |
| 3 | Integração com sistemas escolares | Sincronização com plataformas acadêmicas externas, diários eletrônicos ou ERPs escolares. | Low |
| 4 | Aplicativo mobile nativo | Versão nativa para Android e iOS. | Low |
| 5 | Certificação | Emissão de certificados de conclusão de módulos ou trilhas. | Low |
| 6 | Aulas ao vivo | Funcionalidade para transmissão síncrona de aulas dentro da plataforma. | Low |
| 7 | Suporte a várias linguagens de programação | Expansão para além da linguagem inicial a ser definida com o cliente. | Low |

## 2. Boundaries

### Explicitly In Scope

#### Módulo: Experiência do Aluno
- Acesso à plataforma por alunos do 8º e 9º ano do ensino fundamental.
- Uso em contexto escolar e também em uso individual em casa.
- Navegação simples, intuitiva e guiada para estudantes sem experiência prévia com programação.
- Trilhas visuais de aprendizagem mostrando progresso ao longo dos módulos.
- Consumo de aulas em dois formatos: videoaula e material escrito de apoio.
- Resolução de exercícios de programação dentro da própria plataforma.
- Submissão de código para avaliação automática.
- Recebimento de feedback imediato após a correção.

#### Módulo: Conteúdo e Estrutura Pedagógica
- Organização do ensino em módulos temáticos progressivos.
- Estruturação de aulas dentro de cada módulo.
- Cadastro de conteúdos introdutórios como variáveis, estruturas condicionais, loops e funções.
- Associação entre aulas e exercícios práticos correspondentes.

#### Módulo: Correção Automática
- Execução do código do aluno em ambiente controlado.
- Validação da solução com testes internos previamente definidos.
- Retorno automático informando se a solução passou ou não nos testes.
- Mensagens de apoio para ajudar o aluno a identificar possíveis erros.

#### Módulo: Professor
- Painel de acompanhamento do progresso dos estudantes.
- Visualização de alunos que iniciaram a trilha.
- Visualização de módulos concluídos por aluno.
- Visualização da quantidade de exercícios resolvidos.
- Gestão de turmas para agrupamento e acompanhamento coletivo.

#### Módulo: Administração
- Gestão completa de usuários.
- Criação e organização de módulos.
- Cadastro de aulas.
- Inserção e manutenção de exercícios.
- Monitoramento geral do funcionamento da plataforma, no nível administrativo descrito no levantamento.

#### Módulo: Segurança e Acesso
- Autenticação de usuários.
- Controle de permissões por perfil.
- Proteção de dados pessoais de alunos e professores.
- Adoção de medidas de segurança para reduzir vulnerabilidades comuns em aplicações web.

#### Módulo: Plataforma e Acesso
- Foco principal de uso em desktop.
- Atendimento a escolas públicas e privadas.
- Disponibilização do sistema para uso em ambiente escolar e doméstico.

### Explicitly Out of Scope

- Gamificação avançada, como rankings, moedas, missões ou medalhas complexas.
- Chat em tempo real entre usuários.
- Integração com sistemas escolares externos.
- Aplicativo mobile nativo.
- Certificação de conclusão.
- Aulas ao vivo.
- Suporte a várias linguagens de programação.
- Recursos de rede social/comunidade: To be defined with the client. Não houve confirmação explícita no transcript para inclusão no MVP.

## 3. Dependencies

- Infraestrutura web compatível com acesso por desktop.
- Serviço ou arquitetura de autenticação para login e controle de sessão.
- Banco de dados para armazenamento de usuários, turmas, conteúdos, progresso e exercícios.
- Ambiente controlado para execução de código submetido pelos alunos.
- Mecanismo de testes automatizados para validar respostas dos exercícios.
- Armazenamento e entrega de videoaulas.
- Camada de autorização para separar acessos de aluno, professor e administrador.
- Medidas de segurança de aplicação e proteção de dados.
- Linguagem de programação inicial do ambiente de exercícios: To be defined with the client.

## 4. Scope Boundaries and Triggers

- Se a implementação do ambiente controlado de execução de código exigir complexidade técnica ou esforço incompatível com a entrega do MVP, a profundidade do feedback automático poderá ser reduzida, mantendo-se obrigatoriamente a correção por testes.
- Se o suporte a mais de uma linguagem de programação for solicitado durante o MVP, essa solicitação deverá ser movida para pós-MVP, pois foi explicitamente definida como fora de escopo.
- Se surgir demanda por uso mobile prioritário ou app nativo, essa frente será considerada mudança de escopo, já que o foco atual é acesso por desktop.
- Se forem solicitadas integrações com sistemas escolares externos, elas deverão entrar em fase futura e não devem bloquear a entrega do núcleo da plataforma.
- Se funcionalidades síncronas de comunicação, como chat ou aulas ao vivo, forem requisitadas, devem ser tratadas como expansão de escopo e planejadas para fase posterior.
- Se forem necessárias regras avançadas de gamificação para aumentar engajamento, elas não devem entrar no MVP, salvo redefinição formal de prioridades.
- Se forem identificadas exigências regulatórias, institucionais ou de segurança além das medidas básicas já previstas, será necessária revisão formal de escopo, prazo e arquitetura.
- Se houver necessidade de acessibilidade, suporte a tablet/celular ou operação com internet limitada, isso deverá ser definido com o cliente antes de inclusão, pois não foi detalhado no transcript.
- Se o volume de conteúdos iniciais, módulos ou exercícios crescer além da estrutura introdutória prevista para programação básica, a expansão deverá ser replanejada como nova fase.