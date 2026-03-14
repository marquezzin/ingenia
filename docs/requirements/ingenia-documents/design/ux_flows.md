# Ux Flows

# Plataforma de Ensino Introdutório de Programação — UX Flows

## 1. Sitemap

```text
/                                      → Redirecionamento por perfil ou entrada principal
├── /login                             → Login
├── /register                          → Cadastro
├── /forgot-password                   → Recuperar senha
├── /unauthorized                      → Acesso negado
├── /not-found                         → Página não encontrada
│
├── /student                           → Área do aluno / visão geral da trilha
│   ├── /student/modules               → Lista de módulos
│   ├── /student/modules/:moduleId     → Detalhe do módulo
│   │   └── /lessons/:lessonId         → Aula
│   │       └── /exercises/:exerciseId → Exercício
│   ├── /student/progress              → Meu progresso
│   └── /student/submissions           → Histórico de submissões
│
├── /teacher                           → Painel do professor
│   ├── /teacher/classes               → Lista de turmas
│   ├── /teacher/classes/new           → Nova turma
│   ├── /teacher/classes/:classId      → Detalhe da turma
│   │   ├── /students/:studentId       → Progresso individual do aluno
│   │   └── /edit                      → Editar turma
│   └── /teacher/students              → Lista consolidada de alunos acompanhados
│
└── /admin                             → Painel administrativo
    ├── /admin/modules                 → Lista de módulos
    ├── /admin/modules/new             → Novo módulo
    ├── /admin/modules/:moduleId       → Detalhe do módulo
    │   ├── /edit                      → Editar módulo
    │   ├── /lessons/new               → Nova aula
    │   └── /lessons/:lessonId         → Detalhe da aula
    │       ├── /edit                  → Editar aula
    │       ├── /exercises/new         → Novo exercício
    │       └── /exercises/:exerciseId → Detalhe do exercício
    │           └── /edit              → Editar exercício
    ├── /admin/users                   → Lista de usuários
    ├── /admin/users/new               → Novo usuário
    ├── /admin/users/:userId           → Detalhe do usuário
    │   └── /edit                      → Editar usuário
    └── /admin/classes                 → Visão administrativa de turmas
```

### Estrutura de acesso por perfil

| Área | Perfil com acesso | Observações |
|---|---|---|
| `/login`, `/register`, `/forgot-password` | Público | Cadastro e recuperação são assumidos como disponíveis por haver telas de autenticação exigidas, mas dependem de validação do cliente sobre auto-cadastro |
| `/student/*` | Aluno | Professor e administrador não usam esta área como fluxo principal |
| `/teacher/*` | Professor | Acesso negado para aluno; administrador não substitui automaticamente o professor nesta UX por falta de herança formal de papéis |
| `/admin/*` | Administrador | Acesso exclusivo |
| `/unauthorized`, `/not-found` | Todos | Telas de sistema |

### Gaps e assunções do sitemap
- **Assunção:** existe auto-cadastro ao menos para uso individual em casa, pois o template exige telas de registro e o contexto prevê uso doméstico.
- **Gap:** não está definido se professores e administradores também se cadastram sozinhos ou apenas são criados por administrador.
- **Gap:** a política exata de recuperação de senha não foi detalhada nos documentos de descoberta.
- **Assunção:** a rota `/` redireciona usuários autenticados conforme `User.role` e exibe entrada principal para não autenticados.

---

## 2. Screen Inventory

## Telas públicas e de autenticação

### Screen: Login
**URL:** `/login`  
**Access:** Público

**Purpose**  
Permitir que aluno, professor ou administrador autentique sua conta e seja direcionado para sua área correta.

#### Components
- Logo e nome da plataforma
- Formulário de login
  - campo **E-mail**
  - campo **Senha**
- Botão primário **Entrar**
- Link **Esqueci minha senha**
- Link **Criar conta**
- Mensagem de erro inline ou banner
- Indicador de carregamento no botão

#### States
| State | Description |
|---|---|
| Loading | Botão **Entrar** bloqueado com indicador de envio |
| Empty | Campos vazios prontos para preenchimento |
| Error | Credenciais inválidas, conta inativa ou falha de autenticação |
| Success | Sessão criada e redirecionamento por perfil |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Entrar | Clique em **Entrar** | Sistema valida credenciais e redireciona conforme papel |
| Ir para cadastro | Clique em **Criar conta** | Navega para `/register` |
| Recuperar senha | Clique em **Esqueci minha senha** | Navega para `/forgot-password` |
| Validar campos | Blur ou envio com campos vazios | Exibe mensagens de obrigatoriedade |

#### Data
- `User.email`
- Senha informada pelo usuário
- `User.role` usado para redirecionamento
- `User.account_status` para permitir ou negar acesso

---

### Screen: Cadastro
**URL:** `/register`  
**Access:** Público

**Purpose**  
Permitir criação de conta para entrada inicial na plataforma, principalmente no cenário de uso individual em casa.

#### Components
- Cabeçalho simples com identidade da plataforma
- Formulário de cadastro
  - **Nome completo**
  - **E-mail**
  - **Senha**
  - **Confirmar senha**
- Campo ou texto explicativo de perfil padrão
- Botão primário **Criar conta**
- Link **Já tenho conta**
- Mensagens de validação

#### States
| State | Description |
|---|---|
| Loading | Envio do formulário em andamento |
| Empty | Formulário pronto para preenchimento |
| Error | E-mail já cadastrado, senha inválida ou falha no cadastro |
| Success | Conta criada; usuário segue para login ou é autenticado automaticamente |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Criar conta | Clique em **Criar conta** | Cria `User` e perfil inicial compatível |
| Voltar ao login | Clique em **Já tenho conta** | Navega para `/login` |
| Validar senha | Digitação/submit | Exibe regras mínimas e inconsistência entre senha e confirmação |

#### Data
- `User.full_name`
- `User.email`
- Senha para geração de `User.password_hash`
- `User.role` inicial, assumido como **Aluno**
- `User.account_status`

#### Gap / Assunção
- **Assunção:** cadastro público cria conta de **Aluno**.
- **Gap:** não está definido se conta precisa de aprovação prévia ou vínculo com turma para uso escolar.

---

### Screen: Recuperar senha
**URL:** `/forgot-password`  
**Access:** Público

**Purpose**  
Permitir que o usuário solicite a recuperação de acesso à conta por e-mail.

#### Components
- Título e texto explicativo
- Formulário com campo **E-mail**
- Botão **Enviar instruções**
- Link de retorno ao login
- Mensagem de confirmação

#### States
| State | Description |
|---|---|
| Loading | Solicitação sendo processada |
| Empty | Campo vazio aguardando e-mail |
| Error | E-mail inválido, conta inexistente ou falha de envio |
| Success | Mensagem informando que as instruções foram enviadas, sem expor se o e-mail existe |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Solicitar recuperação | Clique em **Enviar instruções** | Dispara fluxo de recuperação |
| Voltar ao login | Clique em link de retorno | Navega para `/login` |

#### Data
- `User.email`

#### Gap
- O fluxo completo de redefinição por token não foi detalhado nos documentos; esta tela cobre apenas a solicitação inicial.

---

### Screen: Acesso negado
**URL:** `/unauthorized`  
**Access:** Todos

**Purpose**  
Informar que o usuário não possui permissão para acessar a área ou ação solicitada.

#### Components
- Mensagem de acesso negado
- Texto explicativo simples
- Botão **Voltar**
- Botão **Ir para minha área**

#### States
| State | Description |
|---|---|
| Default | Mensagem com ação de retorno |
| Contextual | Exibe referência à área permitida para o perfil autenticado |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Voltar | Clique em **Voltar** | Retorna à tela anterior |
| Ir para minha área | Clique no CTA | Redireciona ao dashboard do perfil |

#### Data
- Papel atual do usuário
- Rota solicitada

---

### Screen: Página não encontrada
**URL:** `/not-found`  
**Access:** Todos

**Purpose**  
Informar que a rota acessada não existe ou foi removida.

#### Components
- Mensagem 404
- Texto orientativo
- Botão **Voltar ao início**
- Campo opcional de navegação rápida por perfil

#### States
| State | Description |
|---|---|
| Default | Mensagem de erro com CTA |
| Authenticated | CTA leva à área principal do perfil |
| Public | CTA leva para `/login` |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Voltar ao início | Clique no CTA | Redireciona para rota base adequada |

#### Data
- Nenhum dado de domínio principal; apenas contexto de rota

---

## Telas do aluno

### Screen: Área do aluno / visão geral da trilha
**URL:** `/student`  
**Access:** Aluno

**Purpose**  
Apresentar a trilha de aprendizagem, o progresso geral e o próximo passo recomendado ao aluno.

#### Components
- Cabeçalho com nome do aluno
- Navegação lateral ou superior da área do aluno
- Card de progresso geral
- Lista visual de módulos da trilha
- Destaque de **continuar de onde parei**
- Resumo de exercícios resolvidos
- CTA para acessar o próximo módulo/aula
- Indicadores simples de status dos módulos

#### States
| State | Description |
|---|---|
| Loading | Skeleton da trilha e dos cards de progresso |
| Empty | Nenhum módulo disponível ainda |
| Error | Falha ao carregar trilha ou progresso |
| Success | Trilha exibida com módulos e indicadores de evolução |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Abrir módulo | Clique em um módulo | Navega para detalhe do módulo |
| Continuar estudo | Clique em **Continuar** | Vai para última aula incompleta ou próxima aula |
| Ver progresso completo | Clique em resumo de progresso | Navega para `/student/progress` |
| Ver histórico de envios | Clique em histórico | Navega para `/student/submissions` |

#### Data
- `StudentProfile`
- `Progress` por módulo e aula
- `Module` listados na trilha
- Quantidade de exercícios resolvidos
- Próxima aula sugerida

---

### Screen: Lista de módulos
**URL:** `/student/modules`  
**Access:** Aluno

**Purpose**  
Exibir todos os módulos disponíveis na trilha de aprendizagem com status de progresso.

#### Components
- Lista ou grade de módulos
- Barra de busca simples por nome do módulo
- Filtros por status: não iniciado, em andamento, concluído
- Indicador visual de progresso por módulo
- CTA para abrir módulo

#### States
| State | Description |
|---|---|
| Loading | Cards de módulos em skeleton |
| Empty | Nenhum módulo cadastrado/disponível |
| Error | Falha ao carregar módulos |
| Success | Lista de módulos com progresso individual |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Filtrar módulos | Seleção de filtro | Atualiza lista |
| Buscar módulo | Digitação no campo de busca | Refina resultados |
| Abrir módulo | Clique no card | Navega para `/student/modules/:moduleId` |

#### Data
- `Module`
- `Progress` por módulo
- Status derivado: não iniciado / em andamento / concluído

---

### Screen: Detalhe do módulo
**URL:** `/student/modules/:moduleId`  
**Access:** Aluno

**Purpose**  
Exibir as aulas de um módulo, seu progresso e a sequência recomendada de estudo.

#### Components
- Título e descrição do módulo
- Barra de progresso do módulo
- Lista sequencial de aulas
- Status por aula
- CTA **Iniciar módulo** ou **Continuar módulo**
- Resumo de exercícios associados
- Navegação para aula anterior/próxima quando aplicável

#### States
| State | Description |
|---|---|
| Loading | Dados do módulo e aulas sendo carregados |
| Empty | Módulo sem aulas publicadas |
| Error | Falha ao carregar o módulo |
| Success | Lista de aulas e progresso exibidos |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Abrir aula | Clique em item da lista | Navega para aula |
| Continuar módulo | Clique no CTA principal | Leva à próxima aula pendente |
| Voltar à trilha | Clique em navegação | Retorna à lista de módulos |

#### Data
- `Module`
- `Lesson` do módulo
- `Progress` do aluno por aula e módulo
- Contagem de `Exercise` relacionados

---

### Screen: Aula
**URL:** `/student/modules/:moduleId/lessons/:lessonId`  
**Access:** Aluno

**Purpose**  
Permitir consumo da aula por videoaula e material escrito antes da prática.

#### Components
- Título da aula
- Breadcrumb da trilha
- Player de vídeo ou área de videoaula
- Bloco de material escrito
- Exemplos de código em destaque
- Observações/importantes
- Lista de exercícios da aula
- Botão **Ir para exercício**
- Botões **Aula anterior** e **Próxima aula**
- Indicador de conclusão/consumo

#### States
| State | Description |
|---|---|
| Loading | Player e conteúdo textual com placeholders |
| Empty | Aula sem vídeo e/ou sem material suficiente |
| Error | Falha no carregamento do vídeo ou conteúdo |
| Success | Conteúdo completo disponível para estudo |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Assistir vídeo | Play no player | Inicia consumo da videoaula |
| Ler material | Scroll na página | Consumo do conteúdo escrito |
| Abrir exercício | Clique em **Ir para exercício** | Navega para exercício selecionado |
| Navegar entre aulas | Clique em aula anterior/próxima | Abre a aula correspondente |

#### Data
- `Lesson`
- `Video`
- `WrittenContent`
- `Exercise` vinculados
- `Progress` de consumo da aula

---

### Screen: Exercício
**URL:** `/student/modules/:moduleId/lessons/:lessonId/exercises/:exerciseId`  
**Access:** Aluno

**Purpose**  
Permitir que o aluno escreva código, envie a solução e receba correção automática com feedback.

#### Components
- Título e enunciado do exercício
- Informações de contexto ligadas à aula/módulo
- Editor de código embutido
- Área de instruções e exemplos
- Botão **Submeter código**
- Botão **Limpar editor**
- Painel de resultado da avaliação
- Histórico resumido de tentativas recentes
- Navegação de volta para aula

#### States
| State | Description |
|---|---|
| Loading | Editor, enunciado e histórico em carregamento |
| Empty | Editor inicial sem código submetido |
| Error | Falha ao carregar exercício ou falha na submissão |
| Success | Exercício pronto para edição e submissão |
| Running | Código em avaliação no ambiente controlado |
| Passed | Resultado aprovado nos testes |
| Failed | Resultado com falha em um ou mais testes e mensagem de apoio |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Editar código | Digitação no editor | Atualiza conteúdo local da solução |
| Submeter código | Clique em **Submeter código** | Cria `Submission` e inicia correção |
| Limpar editor | Clique em **Limpar editor** | Remove código não salvo mediante confirmação |
| Ver feedback | Após avaliação | Exibe `EvaluationResult` |
| Voltar para aula | Clique em navegação | Retorna à tela da aula |
| Tentar novamente | Nova edição e submissão | Gera nova `Submission` |

#### Data
- `Exercise`
- Conteúdo da solução enviada
- `Submission`
- `EvaluationResult`
- Histórico de submissões do aluno para o exercício
- Mensagens de feedback automático

#### Observação de UX
- O feedback deve orientar sem revelar a resposta completa, em linha com as premissas pedagógicas.

---

### Screen: Meu progresso
**URL:** `/student/progress`  
**Access:** Aluno

**Purpose**  
Mostrar a evolução consolidada do aluno na trilha, com módulos concluídos, aulas acessadas e exercícios resolvidos.

#### Components
- Resumo geral de progresso
- Cards com métricas principais
- Lista de módulos com percentual concluído
- Linha do tempo ou visão sequencial da trilha
- Indicadores de exercícios resolvidos
- CTA para continuar estudando

#### States
| State | Description |
|---|---|
| Loading | Indicadores e módulos em skeleton |
| Empty | Sem progresso ainda registrado |
| Error | Falha ao carregar progresso |
| Success | Progresso consolidado visível |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Abrir módulo a partir do progresso | Clique em módulo | Navega para detalhe do módulo |
| Continuar estudo | Clique no CTA | Redireciona para próxima atividade recomendada |

#### Data
- `Progress`
- `Module`
- `Lesson`
- Quantidade de `Submission` aprovadas
- Status geral de `StudentProfile.learning_status`

---

### Screen: Histórico de submissões
**URL:** `/student/submissions`  
**Access:** Aluno

**Purpose**  
Permitir que o aluno revise suas submissões anteriores e os resultados das avaliações.

#### Components
- Tabela ou lista de submissões
- Filtros por módulo, aula, exercício e status
- Colunas: exercício, data/hora, resultado, tentativa
- Painel de detalhe do feedback
- Link para reabrir exercício

#### States
| State | Description |
|---|---|
| Loading | Lista em carregamento |
| Empty | Nenhuma submissão realizada ainda |
| Error | Falha ao carregar histórico |
| Success | Histórico populado com filtros |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Filtrar histórico | Seleção de filtros | Atualiza listagem |
| Abrir exercício | Clique em item | Navega para tela do exercício |
| Ver feedback detalhado | Clique em submissão | Exibe resultado da avaliação |

#### Data
- `Submission`
- `EvaluationResult`
- `Exercise`
- `Lesson`
- `Module`

---

## Telas do professor

### Screen: Painel do professor
**URL:** `/teacher`  
**Access:** Professor

**Purpose**  
Apresentar visão consolidada das turmas e do progresso dos alunos acompanhados pelo professor.

#### Components
- Cabeçalho com identificação do professor
- Cards-resumo:
  - turmas cadastradas
  - alunos acompanhados
  - alunos que iniciaram a trilha
  - exercícios resolvidos
- Lista resumida de turmas
- Atalhos para criar turma e ver alunos
- Bloco de alunos que precisam de atenção, se houver regra futura

#### States
| State | Description |
|---|---|
| Loading | Cards e listas em skeleton |
| Empty | Professor sem turmas cadastradas |
| Error | Falha ao carregar painel |
| Success | Indicadores e turmas exibidos |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Criar turma | Clique em **Nova turma** | Navega para `/teacher/classes/new` |
| Abrir turma | Clique em uma turma | Navega para detalhe da turma |
| Ver todos os alunos | Clique em atalho | Navega para `/teacher/students` |

#### Data
- `TeacherProfile`
- `Class`
- `ClassMembership`
- `StudentProfile`
- Indicadores agregados de `Progress` e exercícios resolvidos

---

### Screen: Lista de turmas
**URL:** `/teacher/classes`  
**Access:** Professor

**Purpose**  
Permitir visualizar e localizar as turmas sob responsabilidade do professor.

#### Components
- Lista/tabela de turmas
- Campo de busca por nome da turma
- Botão **Nova turma**
- Colunas: nome da turma, quantidade de alunos, progresso agregado
- Ações por linha: ver detalhe, editar

#### States
| State | Description |
|---|---|
| Loading | Tabela com skeleton |
| Empty | Nenhuma turma criada |
| Error | Falha ao carregar turmas |
| Success | Turmas listadas com indicadores básicos |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Criar turma | Clique em **Nova turma** | Navega para formulário |
| Abrir detalhe | Clique na linha ou CTA | Navega para `/teacher/classes/:classId` |
| Editar turma | Clique em **Editar** | Navega para edição |

#### Data
- `Class`
- Quantidade de `ClassMembership`
- Indicadores resumidos de `Progress`

---

### Screen: Nova turma
**URL:** `/teacher/classes/new`  
**Access:** Professor

**Purpose**  
Permitir criar uma turma para organizar e acompanhar alunos em grupo.

#### Components
- Formulário de turma
  - **Nome da turma**
  - área de associação de alunos
- Busca de alunos cadastrados
- Lista de alunos selecionados
- Botão **Salvar turma**
- Botão **Cancelar**

#### States
| State | Description |
|---|---|
| Loading | Formulário e busca de alunos carregando |
| Empty | Formulário pronto sem alunos selecionados |
| Error | Validação inválida ou falha ao salvar |
| Success | Turma criada e professor redirecionado ao detalhe |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Preencher nome | Digitação | Atualiza formulário |
| Adicionar aluno | Seleção em busca/lista | Cria associação na composição da turma |
| Remover aluno | Clique em remover | Retira aluno da seleção |
| Salvar turma | Clique em **Salvar turma** | Cria `Class` e memberships |
| Cancelar | Clique em **Cancelar** | Volta sem salvar |

#### Data
- `Class`
- `StudentProfile` elegíveis
- `ClassMembership`

#### Gap
- Importação em lote não foi confirmada; o fluxo considera cadastro manual simples.

---

### Screen: Detalhe da turma
**URL:** `/teacher/classes/:classId`  
**Access:** Professor

**Purpose**  
Exibir visão coletiva da turma, seus alunos e o desempenho geral.

#### Components
- Nome da turma
- Resumo da turma
- Tabela/lista de alunos
- Indicadores por aluno:
  - iniciou trilha
  - módulos concluídos
  - exercícios resolvidos
- Busca por aluno
- Botão **Editar turma**
- Link para progresso individual

#### States
| State | Description |
|---|---|
| Loading | Resumo e lista em carregamento |
| Empty | Turma sem alunos vinculados |
| Error | Falha ao carregar turma |
| Success | Dados coletivos e alunos exibidos |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Abrir aluno | Clique em aluno | Navega para detalhe individual |
| Editar turma | Clique em **Editar turma** | Navega para edição |
| Buscar aluno | Digitação no filtro | Refina a lista |

#### Data
- `Class`
- `ClassMembership`
- `StudentProfile`
- `Progress` por aluno
- Quantidade de exercícios resolvidos por aluno

---

### Screen: Editar turma
**URL:** `/teacher/classes/:classId/edit`  
**Access:** Professor

**Purpose**  
Permitir atualizar nome da turma e composição de alunos.

#### Components
- Formulário preenchido com dados atuais
- Campo **Nome da turma**
- Lista de alunos vinculados
- Busca para adicionar novos alunos
- Botões **Salvar alterações** e **Cancelar**
- Modal de confirmação para remoção de aluno, se necessário

#### States
| State | Description |
|---|---|
| Loading | Dados existentes sendo carregados |
| Empty | Formulário disponível |
| Error | Erro de validação ou salvamento |
| Success | Turma atualizada com confirmação |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Alterar nome | Edição do campo | Marca formulário como alterado |
| Adicionar/remover aluno | Interação na lista | Atualiza composição |
| Salvar alterações | Clique no CTA | Atualiza `Class` e `ClassMembership` |

#### Data
- `Class`
- `ClassMembership`
- `StudentProfile`

---

### Screen: Lista consolidada de alunos
**URL:** `/teacher/students`  
**Access:** Professor

**Purpose**  
Permitir visão transversal de todos os alunos ligados às turmas do professor.

#### Components
- Tabela de alunos
- Filtros por turma e status de progresso
- Colunas:
  - nome
  - turma
  - iniciou trilha
  - módulos concluídos
  - exercícios resolvidos
- Link para detalhe do aluno

#### States
| State | Description |
|---|---|
| Loading | Tabela em skeleton |
| Empty | Nenhum aluno vinculado |
| Error | Falha ao carregar alunos |
| Success | Lista preenchida com filtros funcionais |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Filtrar por turma | Seleção em filtro | Atualiza a tabela |
| Filtrar por progresso | Seleção em filtro | Refina a lista |
| Abrir aluno | Clique na linha | Navega para detalhe do aluno dentro da turma/contexto |

#### Data
- `StudentProfile`
- `Class`
- `Progress`
- Quantidade de exercícios resolvidos

---

### Screen: Progresso individual do aluno
**URL:** `/teacher/classes/:classId/students/:studentId`  
**Access:** Professor

**Purpose**  
Exibir ao professor a evolução detalhada de um aluno específico dentro do contexto da turma.

#### Components
- Cabeçalho com nome do aluno e turma
- Resumo de progresso
- Lista de módulos com status
- Quantidade de exercícios resolvidos
- Indicador de início da trilha
- Histórico resumido de desempenho
- Navegação de volta para a turma

#### States
| State | Description |
|---|---|
| Loading | Dados do aluno carregando |
| Empty | Aluno sem progresso registrado |
| Error | Falha ao carregar progresso individual |
| Success | Indicadores e módulos exibidos |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Voltar para turma | Clique em voltar | Navega para detalhe da turma |
| Abrir módulo de referência | Clique em módulo | Exibe referência do progresso naquele módulo |

#### Data
- `StudentProfile`
- `Progress`
- `Module`
- Quantidade de `Submission` aprovadas/falhas
- Contexto de `Class`

#### Restrição de autorização
- Professor vê apenas alunos associados às suas turmas.

---

## Telas do administrador

### Screen: Painel administrativo
**URL:** `/admin`  
**Access:** Administrador

**Purpose**  
Oferecer visão central de gestão do sistema com atalhos para conteúdo, usuários e turmas.

#### Components
- Navegação administrativa
- Cards-resumo:
  - total de usuários
  - total de módulos
  - total de aulas
  - total de exercícios
- Atalhos para criar módulo e criar usuário
- Listas resumidas recentes

#### States
| State | Description |
|---|---|
| Loading | Cards e atalhos em carregamento |
| Empty | Sem conteúdo inicial cadastrado |
| Error | Falha ao carregar painel |
| Success | Visão geral administrativa disponível |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Criar módulo | Clique no atalho | Navega para `/admin/modules/new` |
| Gerenciar usuários | Clique no atalho | Navega para `/admin/users` |
| Ver módulos | Clique no card/lista | Navega para `/admin/modules` |
| Ver turmas | Clique no card/lista | Navega para `/admin/classes` |

#### Data
- Contagem de `User`
- `Module`
- `Lesson`
- `Exercise`
- `Class`

---

### Screen: Lista de módulos
**URL:** `/admin/modules`  
**Access:** Administrador

**Purpose**  
Permitir gerenciar todos os módulos pedagógicos cadastrados na plataforma.

#### Components
- Tabela/lista de módulos
- Busca por nome
- Botão **Novo módulo**
- Colunas: nome, quantidade de aulas, atualizado em
- Ações: ver detalhe, editar

#### States
| State | Description |
|---|---|
| Loading | Lista em skeleton |
| Empty | Nenhum módulo cadastrado |
| Error | Falha ao carregar módulos |
| Success | Módulos listados |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Criar módulo | Clique em **Novo módulo** | Navega para formulário |
| Abrir módulo | Clique na linha | Navega para detalhe |
| Editar módulo | Clique em **Editar** | Navega para edição |
| Buscar módulo | Digitação | Filtra resultados |

#### Data
- `Module`
- Quantidade de `Lesson`

---

### Screen: Novo módulo
**URL:** `/admin/modules/new`  
**Access:** Administrador

**Purpose**  
Permitir cadastrar um novo módulo da trilha de aprendizagem.

#### Components
- Formulário de módulo
  - **Título do módulo**
  - **Descrição**
  - campo de ordem/organização da trilha, se exposto na UI
- Botões **Salvar módulo** e **Cancelar**

#### States
| State | Description |
|---|---|
| Loading | Formulário inicializando |
| Empty | Formulário vazio |
| Error | Validação falha ou erro ao salvar |
| Success | Módulo criado com redirecionamento ao detalhe |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Salvar módulo | Clique no CTA | Cria `Module` |
| Cancelar | Clique em cancelar | Volta para lista |

#### Data
- `Module` atributos principais

---

### Screen: Detalhe do módulo
**URL:** `/admin/modules/:moduleId`  
**Access:** Administrador

**Purpose**  
Exibir um módulo com suas aulas e permitir organizar o conteúdo interno.

#### Components
- Cabeçalho com nome e descrição do módulo
- Lista de aulas do módulo
- Botão **Nova aula**
- Botão **Editar módulo**
- Resumo de quantidade de exercícios vinculados
- Navegação estrutural para aulas

#### States
| State | Description |
|---|---|
| Loading | Dados do módulo e aulas em carregamento |
| Empty | Módulo sem aulas |
| Error | Falha ao carregar conteúdo |
| Success | Estrutura do módulo visível |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Criar aula | Clique em **Nova aula** | Navega para criação de aula |
| Abrir aula | Clique em item da lista | Navega para detalhe da aula |
| Editar módulo | Clique em **Editar módulo** | Navega para edição |

#### Data
- `Module`
- `Lesson`
- Contagem de `Exercise`

---

### Screen: Editar módulo
**URL:** `/admin/modules/:moduleId/edit`  
**Access:** Administrador

**Purpose**  
Permitir atualizar informações do módulo.

#### Components
- Formulário preenchido com dados do módulo
- Campos editáveis de nome/descrição/ordem
- Botões **Salvar alterações** e **Cancelar**

#### States
| State | Description |
|---|---|
| Loading | Dados existentes sendo carregados |
| Empty | Formulário pronto |
| Error | Falha de validação ou atualização |
| Success | Módulo atualizado |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Editar campos | Digitação | Atualiza estado do formulário |
| Salvar alterações | Clique no CTA | Atualiza `Module` |

#### Data
- `Module`

---

### Screen: Nova aula
**URL:** `/admin/modules/:moduleId/lessons/new`  
**Access:** Administrador

**Purpose**  
Permitir cadastrar uma nova aula dentro de um módulo.

#### Components
- Formulário de aula
  - **Título da aula**
  - **Conteúdo escrito**
  - área para referência de videoaula
- Botões **Salvar aula** e **Cancelar**

#### States
| State | Description |
|---|---|
| Loading | Formulário carregando |
| Empty | Formulário vazio |
| Error | Erro de validação/salvamento |
| Success | Aula criada e redirecionada ao detalhe |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Salvar aula | Clique no CTA | Cria `Lesson`, `WrittenContent` e associação com `Video` quando houver |
| Cancelar | Clique em cancelar | Volta ao módulo |

#### Data
- `Lesson`
- `WrittenContent`
- `Video`

#### Gap
- Não está definido se o vídeo é upload, link externo ou integração com serviço de mídia.

---

### Screen: Detalhe da aula
**URL:** `/admin/modules/:moduleId/lessons/:lessonId`  
**Access:** Administrador

**Purpose**  
Exibir os dados da aula e os exercícios associados para manutenção editorial.

#### Components
- Cabeçalho da aula
- Prévia do vídeo
- Prévia do conteúdo escrito
- Lista de exercícios
- Botão **Editar aula**
- Botão **Novo exercício**

#### States
| State | Description |
|---|---|
| Loading | Aula e exercícios carregando |
| Empty | Aula sem exercícios vinculados |
| Error | Falha ao carregar a aula |
| Success | Aula e exercícios exibidos |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Editar aula | Clique em **Editar aula** | Navega para edição |
| Criar exercício | Clique em **Novo exercício** | Navega para criação |
| Abrir exercício | Clique em exercício | Navega para detalhe do exercício |

#### Data
- `Lesson`
- `WrittenContent`
- `Video`
- `Exercise`

---

### Screen: Editar aula
**URL:** `/admin/modules/:moduleId/lessons/:lessonId/edit`  
**Access:** Administrador

**Purpose**  
Permitir atualizar vídeo, conteúdo escrito e metadados da aula.

#### Components
- Formulário preenchido
- Campo **Título**
- Editor/textarea de material escrito
- Campo/referência de vídeo
- Botões **Salvar alterações** e **Cancelar**

#### States
| State | Description |
|---|---|
| Loading | Dados da aula carregando |
| Empty | Formulário disponível |
| Error | Falha de validação ou atualização |
| Success | Aula atualizada |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Editar aula | Alteração nos campos | Marca mudanças pendentes |
| Salvar alterações | Clique no CTA | Atualiza `Lesson`, `WrittenContent` e `Video` |

#### Data
- `Lesson`
- `WrittenContent`
- `Video`

---

### Screen: Novo exercício
**URL:** `/admin/modules/:moduleId/lessons/:lessonId/exercises/new`  
**Access:** Administrador

**Purpose**  
Permitir cadastrar um exercício prático vinculado a uma aula.

#### Components
- Formulário de exercício
  - **Título**
  - **Enunciado**
  - área para instruções
  - seção de testes de correção
  - seção de mensagens de feedback
- Botões **Salvar exercício** e **Cancelar**

#### States
| State | Description |
|---|---|
| Loading | Formulário inicializando |
| Empty | Formulário vazio |
| Error | Falha de validação ou cadastro |
| Success | Exercício criado e redirecionado ao detalhe |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Preencher dados | Edição do formulário | Atualiza estado local |
| Adicionar teste | Ação na seção de testes | Inclui `CorrectionTest` na configuração |
| Salvar exercício | Clique no CTA | Cria `Exercise` e `CorrectionTest` |
| Cancelar | Clique em cancelar | Retorna para detalhe da aula |

#### Data
- `Exercise`
- `CorrectionTest`
- Configurações de feedback associadas ao exercício

#### Gap
- O formato exato dos testes e mensagens pedagógicas ainda não foi definido com o cliente.

---

### Screen: Detalhe do exercício
**URL:** `/admin/modules/:moduleId/lessons/:lessonId/exercises/:exerciseId`  
**Access:** Administrador

**Purpose**  
Exibir a definição do exercício e seus testes para manutenção.

#### Components
- Cabeçalho do exercício
- Enunciado completo
- Lista de testes configurados
- Resumo de feedbacks
- Botão **Editar exercício**

#### States
| State | Description |
|---|---|
| Loading | Dados do exercício em carregamento |
| Empty | Exercício sem testes configurados |
| Error | Falha ao carregar exercício |
| Success | Exercício e testes exibidos |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Editar exercício | Clique em **Editar exercício** | Navega para edição |
| Voltar para aula | Clique em navegação | Retorna ao detalhe da aula |

#### Data
- `Exercise`
- `CorrectionTest`

---

### Screen: Editar exercício
**URL:** `/admin/modules/:moduleId/lessons/:lessonId/exercises/:exerciseId/edit`  
**Access:** Administrador

**Purpose**  
Permitir atualizar o enunciado, os testes e o feedback do exercício.

#### Components
- Formulário preenchido
- Campos de enunciado e instruções
- Lista editável de testes
- Área de mensagens de feedback
- Botões **Salvar alterações** e **Cancelar**

#### States
| State | Description |
|---|---|
| Loading | Configuração do exercício sendo carregada |
| Empty | Formulário disponível |
| Error | Erro de validação ou atualização |
| Success | Exercício atualizado |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Alterar enunciado/testes | Edição dos campos | Atualiza estado do formulário |
| Salvar alterações | Clique no CTA | Atualiza `Exercise` e `CorrectionTest` |

#### Data
- `Exercise`
- `CorrectionTest`

---

### Screen: Lista de usuários
**URL:** `/admin/users`  
**Access:** Administrador

**Purpose**  
Permitir gerenciamento centralizado de usuários da plataforma.

#### Components
- Tabela de usuários
- Busca por nome ou e-mail
- Filtros por papel e status da conta
- Colunas:
  - nome
  - e-mail
  - papel
  - status
  - último login
- Botão **Novo usuário**
- Ações: ver detalhe, editar

#### States
| State | Description |
|---|---|
| Loading | Tabela carregando |
| Empty | Nenhum usuário cadastrado |
| Error | Falha ao carregar usuários |
| Success | Usuários listados |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Criar usuário | Clique em **Novo usuário** | Navega para formulário |
| Buscar usuário | Digitação | Filtra lista |
| Filtrar por papel/status | Seleção de filtros | Refina resultados |
| Abrir detalhe | Clique na linha | Navega para detalhe |
| Editar usuário | Clique em ação | Navega para edição |

#### Data
- `User`
- `StudentProfile`, `TeacherProfile` ou `AdminProfile` conforme papel
- `User.account_status`
- `User.last_login_at`

---

### Screen: Novo usuário
**URL:** `/admin/users/new`  
**Access:** Administrador

**Purpose**  
Permitir criação de contas de aluno, professor ou administrador.

#### Components
- Formulário de usuário
  - **Nome completo**
  - **E-mail**
  - **Papel**
  - **Status da conta**
  - **Senha inicial**
- Botões **Salvar usuário** e **Cancelar**

#### States
| State | Description |
|---|---|
| Loading | Formulário inicializando |
| Empty | Formulário pronto |
| Error | E-mail duplicado ou validação inválida |
| Success | Usuário criado com perfil correspondente |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Selecionar papel | Mudança no campo | Define perfil a ser criado |
| Salvar usuário | Clique no CTA | Cria `User` e profile correspondente |
| Cancelar | Clique em cancelar | Volta à lista |

#### Data
- `User.full_name`
- `User.email`
- `User.role`
- `User.account_status`
- Senha inicial
- `StudentProfile` / `TeacherProfile` / `AdminProfile` conforme necessário

---

### Screen: Detalhe do usuário
**URL:** `/admin/users/:userId`  
**Access:** Administrador

**Purpose**  
Exibir dados da conta e contexto de perfil do usuário.

#### Components
- Cabeçalho com nome e papel
- Dados principais da conta
- Status atual
- Último login
- Informações de perfil relacionado
- Botão **Editar usuário**

#### States
| State | Description |
|---|---|
| Loading | Dados do usuário em carregamento |
| Empty | Usuário sem perfil complementar carregado |
| Error | Falha ao carregar usuário |
| Success | Conta exibida com detalhes |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Editar usuário | Clique em **Editar usuário** | Navega para edição |
| Voltar à lista | Clique em navegação | Retorna para listagem |

#### Data
- `User`
- `StudentProfile` / `TeacherProfile` / `AdminProfile`

---

### Screen: Editar usuário
**URL:** `/admin/users/:userId/edit`  
**Access:** Administrador

**Purpose**  
Permitir atualização de dados, papel e estado da conta do usuário.

#### Components
- Formulário preenchido
- Campos de nome, e-mail, papel e status
- Ação opcional de redefinir senha
- Botões **Salvar alterações** e **Cancelar**

#### States
| State | Description |
|---|---|
| Loading | Dados do usuário carregando |
| Empty | Formulário pronto |
| Error | Falha na validação/atualização |
| Success | Usuário atualizado |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Alterar dados | Edição dos campos | Atualiza formulário |
| Alterar papel/status | Seleção | Ajusta perfil e acesso do usuário |
| Salvar alterações | Clique no CTA | Atualiza `User` e perfil relacionado |

#### Data
- `User`
- Perfis relacionados conforme papel

---

### Screen: Visão administrativa de turmas
**URL:** `/admin/classes`  
**Access:** Administrador

**Purpose**  
Permitir visão global das turmas existentes para acompanhamento administrativo.

#### Components
- Tabela/lista de turmas
- Busca por nome
- Colunas:
  - nome da turma
  - professor responsável
  - quantidade de alunos
- Link para visualizar contexto da turma

#### States
| State | Description |
|---|---|
| Loading | Lista em carregamento |
| Empty | Nenhuma turma cadastrada |
| Error | Falha ao carregar turmas |
| Success | Turmas exibidas |

#### Actions
| Action | Trigger | Result |
|---|---|---|
| Buscar turma | Digitação | Filtra listagem |
| Abrir contexto da turma | Clique na linha | Exibe informações administrativas ou navega para detalhe, se implementado |

#### Data
- `Class`
- `TeacherProfile`
- `ClassMembership`

#### Gap
- Os documentos falam em monitoramento geral pelo administrador, mas não detalham ações administrativas completas sobre turmas além da visão global.

---

## 3. Navigation Flows

### Flow: J-001 — Fazer login e acessar a área correta conforme o perfil
1. Usuário acessa `/login`
2. Preenche **E-mail** e **Senha**
3. Clica em **Entrar**
4. Sistema valida credenciais e status da conta
5. Sistema redireciona conforme perfil:
   - aluno → `/student`
   - professor → `/teacher`
   - administrador → `/admin`

**Triggers**
- Clique em **Entrar**
- Sessão autenticada válida ao acessar `/`

---

### Flow: Cadastro inicial de aluno
1. Usuário acessa `/register`
2. Preenche nome, e-mail, senha e confirmação
3. Clica em **Criar conta**
4. Sistema cria conta
5. Usuário é redirecionado para `/login` ou autenticado automaticamente
6. Ao entrar, segue para `/student`

**Triggers**
- Clique em **Criar conta**
- Link vindo de `/login`

**Gap**
- Necessidade de validação com cliente sobre auto-cadastro em contexto escolar.

---

### Flow: Recuperar acesso
1. Usuário acessa `/forgot-password`
2. Informa e-mail
3. Clica em **Enviar instruções**
4. Sistema confirma solicitação sem expor existência da conta
5. Usuário segue instruções recebidas externamente

**Triggers**
- Link **Esqueci minha senha** na tela de login

---

### Flow: J-002 — Aluno percorre a trilha e acessa uma aula
1. Aluno entra em `/student`
2. Visualiza trilha e progresso
3. Clica em um módulo ou em **Continuar**
4. Navega para `/student/modules/:moduleId`
5. Seleciona uma aula
6. Navega para `/student/modules/:moduleId/lessons/:lessonId`

**Triggers**
- Clique em card de módulo
- CTA **Continuar estudo**
- Link de progresso

---

### Flow: J-003 — Aluno consome conteúdo da aula e resolve exercício com correção automática
1. Aluno acessa a tela da aula
2. Assiste à videoaula e lê o material escrito
3. Clica em **Ir para exercício**
4. Navega para `/student/modules/:moduleId/lessons/:lessonId/exercises/:exerciseId`
5. Escreve solução no editor
6. Clica em **Submeter código**
7. Sistema cria `Submission` e executa correção automática
8. Tela entra em estado **Running**
9. Resultado retorna como **Passed** ou **Failed**
10. Aluno lê feedback e tenta novamente, se necessário

**Triggers**
- Clique em **Ir para exercício**
- Clique em **Submeter código**

---

### Flow: J-004 — Aluno acompanha o próprio progresso
1. Aluno acessa `/student` ou `/student/progress`
2. Visualiza percentuais, módulos concluídos e exercícios resolvidos
3. Clica em um módulo específico
4. Navega para detalhe do módulo ou volta ao ponto de continuidade

**Triggers**
- Clique em **Meu progresso**
- Clique em card/módulo da trilha

---

### Flow: Consulta de histórico de submissões
1. Aluno acessa `/student/submissions`
2. Filtra por módulo, aula, exercício ou status
3. Seleciona uma submissão
4. Visualiza feedback
5. Pode reabrir o exercício correspondente

**Triggers**
- Link no menu do aluno
- Link após submissão concluída

---

### Flow: J-005 — Professor cria/organiza uma turma e acompanha desempenho coletivo
1. Professor acessa `/teacher`
2. Clica em **Nova turma**
3. Vai para `/teacher/classes/new`
4. Informa nome da turma e seleciona alunos
5. Salva a turma
6. É redirecionado para `/teacher/classes/:classId`
7. Visualiza a lista de alunos e os indicadores coletivos

**Triggers**
- CTA **Nova turma**
- Atalho no painel do professor

---

### Flow: J-006 — Professor consulta progresso individual de um aluno
1. Professor acessa `/teacher/classes`
2. Abre uma turma em `/teacher/classes/:classId`
3. Seleciona um aluno
4. Navega para `/teacher/classes/:classId/students/:studentId`
5. Visualiza início da trilha, módulos concluídos e exercícios resolvidos

**Triggers**
- Clique no nome do aluno na turma
- Clique em aluno na lista consolidada

---

### Flow: J-007 — Administrador cria e organiza um módulo com aula e exercício
1. Administrador acessa `/admin`
2. Vai para `/admin/modules`
3. Clica em **Novo módulo**
4. Cria o módulo
5. No detalhe do módulo, clica em **Nova aula**
6. Cria a aula com vídeo e material escrito
7. No detalhe da aula, clica em **Novo exercício**
8. Cadastra enunciado, testes e feedback
9. Visualiza a estrutura pronta no módulo

**Triggers**
- Atalhos do painel administrativo
- Botões **Novo módulo**, **Nova aula**, **Novo exercício**

---

### Flow: J-008 — Administrador gerencia usuários da plataforma
1. Administrador acessa `/admin/users`
2. Busca ou filtra usuários existentes, ou clica em **Novo usuário**
3. Cria ou abre um usuário específico
4. Em caso de edição, acessa `/admin/users/:userId/edit`
5. Atualiza papel, status ou dados cadastrais
6. Salva e retorna ao detalhe ou à lista

**Triggers**
- Menu administrativo
- Botão **Novo usuário**
- Ação **Editar**

---

### Flow: Controle de autorização por rota
1. Usuário tenta acessar uma rota protegida
2. Sistema verifica autenticação
3. Se não autenticado, redireciona para `/login`
4. Se autenticado sem permissão, redireciona para `/unauthorized`
5. Se autorizado, carrega a tela normalmente

**Triggers**
- Deep link
- Digitação manual da URL
- Clique em link salvo/favorito

---

## 4. Responsive Behavior

### Princípio geral
A primeira versão tem foco principal em **desktop**, mas deve manter responsividade básica para uso ocasional em telas menores, conforme risco e questão aberta registrados na descoberta.

### Desktop
- Navegação lateral ou superior completa por perfil
- Trilhas, tabelas e formulários exibidos com múltiplas colunas
- Tela de exercício com editor de código ocupando área ampla
- Painéis de professor e administrador com tabelas completas e filtros visíveis
- Aula com vídeo e material escrito podendo coexistir em áreas bem distribuídas

### Tablet
- Layout em coluna principal com blocos empilhados quando necessário
- Navegação recolhível
- Tabelas com menos colunas visíveis e possibilidade de scroll horizontal
- Editor de código com altura reduzida, mas ainda utilizável
- Cards de progresso reorganizados em duas colunas quando couber

### Mobile
- Não é foco do MVP, mas deve haver adaptação mínima
- Menu em formato hambúrguer
- Conteúdo em coluna única
- Cards empilhados verticalmente
- Tabelas convertidas para listas/cartões sempre que possível
- Editor de código acessível, porém com usabilidade limitada frente ao desktop
- Player de vídeo com largura total
- Botões primários sempre visíveis e com área de toque adequada

### Regras específicas por tipo de tela

| Tipo de tela | Desktop | Tablet | Mobile |
|---|---|---|---|
| Login/Cadastro | Card central | Card central adaptado | Largura total com margens |
| Trilha do aluno | Grade de módulos + painel lateral | Grade reduzida | Lista vertical |
| Aula | Vídeo + conteúdo em layout amplo | Seções empilhadas parciais | Tudo em coluna única |
| Exercício | Editor amplo + feedback lateral/abaixo | Editor central + feedback abaixo | Editor em tela vertical com feedback abaixo |
| Tabelas de professor/admin | Tabela completa | Tabela compacta | Lista de cards |

### Observação
- Como o foco principal é desktop, a experiência de submissão de código deve ser otimizada prioritariamente para teclado físico e tela ampla.

---

## 5. Error States

## Padrões globais de tratamento de erro

### 401 — Não autenticado
- Quando usuário tenta acessar área protegida sem sessão ativa
- Comportamento:
  - redirecionar para `/login`
  - preservar rota de origem quando apropriado
  - exibir mensagem curta: **Faça login para continuar**

### 403 — Acesso negado
- Quando usuário autenticado tenta acessar rota ou ação sem permissão
- Comportamento:
  - exibir tela `/unauthorized`
  - ocultar ou desabilitar ações não permitidas também na UI
  - nunca exibir controles administrativos para aluno
  - nunca exibir gestão de conteúdo para professor

### 404 — Página não encontrada
- Quando rota não existe ou recurso informado por ID não é encontrado
- Comportamento:
  - exibir `/not-found`
  - oferecer CTA para voltar à área inicial

### 409 — Conflito de dados
- Casos típicos:
  - e-mail já cadastrado
  - turma com nome duplicado, se regra existir
- Comportamento:
  - mensagem específica no campo ou banner
  - manter formulário preenchido para correção

### 422 — Validação
- Campos obrigatórios ausentes
- Senha e confirmação diferentes
- Formulário de módulo/aula/exercício incompleto
- Comportamento:
  - destacar campos com erro
  - mensagens objetivas e em linguagem simples

### 429 — Limite de tentativas
- Especialmente em login e submissões, conforme necessidade de segurança
- Comportamento:
  - informar que houve muitas tentativas
  - sugerir aguardar antes de tentar novamente

### 500 / erro inesperado
- Falha interna do sistema
- Comportamento:
  - banner ou tela de erro com mensagem amigável
  - ação **Tentar novamente**
  - não expor detalhes técnicos ao usuário final

### Erros específicos do fluxo de submissão de código
- Falha de comunicação com serviço de correção
- Tempo limite excedido
- Erro de processamento da submissão
- Resultado indisponível temporariamente

**Padrão de UX**
- Mensagem simples, sem linguagem técnica excessiva
- Botão **Tentar novamente**
- Manter código digitado no editor sempre que possível para evitar perda de trabalho

### Erros de carregamento de conteúdo
- Vídeo indisponível
- Material escrito não carregado
- Aula sem exercícios publicados

**Comportamento**
- Exibir estado parcial quando possível
- Se vídeo falhar mas texto carregar, manter aula acessível
- Se exercício não estiver disponível, informar claramente que a prática ainda não está publicada

### Erros de permissões dentro da interface
Além das rotas protegidas, a UI deve refletir permissões:
- **Aluno**
  - não vê botões de criar, editar, excluir ou gerenciar usuários/turmas
- **Professor**
  - não vê ações administrativas de módulos, aulas, exercícios e usuários
  - só vê alunos vinculados às suas turmas
- **Administrador**
  - vê gestão completa conforme matriz de autorização disponível

### Mensagens de erro recomendadas
- Login inválido: **E-mail ou senha incorretos.**
- Conta inativa: **Sua conta não está disponível para acesso no momento.**
- Falha ao carregar trilha: **Não foi possível carregar sua trilha agora. Tente novamente.**
- Submissão com erro técnico: **Não conseguimos avaliar seu código agora. Tente novamente em instantes.**
- Falha ao salvar turma: **Não foi possível salvar a turma. Revise os dados e tente novamente.**
- Falha ao salvar conteúdo: **Não foi possível salvar este conteúdo agora.**
- Acesso negado: **Você não tem permissão para acessar esta área.**

---

## Observações finais e coerência com descoberta

- Todas as jornadas críticas documentadas em **JOURNEYS** possuem fluxos e telas correspondentes.
- As entidades principais do **DOMAIN_MODEL** foram cobertas com telas de listagem e detalhe onde aplicável:
  - `Module`: lista e detalhe
  - `Lesson`: detalhe e manutenção administrativa
  - `Exercise`: detalhe e manutenção administrativa
  - `User`: lista e detalhe
  - `Class`: lista e detalhe
  - `Submission`: histórico/lista e detalhe contextual
- Para entidades de suporte como `Video`, `WrittenContent`, `CorrectionTest` e `EvaluationResult`, a UX as trata como partes de telas compostas, o que é mais apropriado ao uso real.
- A matriz de autorização foi respeitada em nível de navegação e visibilidade de ações.
- Pontos não definidos nos documentos foram mantidos explicitamente como **gap** ou **assunção**, sem inventar regras fechadas além do necessário para estruturar a UX.