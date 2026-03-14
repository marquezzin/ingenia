# Domain Model

# Plataforma de Ensino Introdutório de Programação — Domain Model

## 1. Entities

### Entity: User
> Representa uma conta autenticável da plataforma, usada por aluno, professor ou administrador. Centraliza identidade, credenciais e vínculo com o perfil de acesso.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| full_name | String | Yes | Nome completo do usuário |
| email | String | Yes | E-mail utilizado para login e comunicação |
| password_hash | String | Yes | Hash seguro da senha do usuário |
| role | UserRole | Yes | Perfil principal do usuário na plataforma |
| account_status | AccountStatus | Yes | Estado atual da conta para controle de acesso |
| last_login_at | DateTime | No | Data e hora do último login bem-sucedido |

**Unique constraints and indexes**
- Unique: `email`
- Index: `role`
- Index: `account_status`

---

### Entity: StudentProfile
> Representa os dados acadêmicos e operacionais de um usuário com papel de aluno. Permite relacionar o aluno à trilha de aprendizagem, turmas e progresso.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| user_id | UUID | Yes | Referência ao usuário da conta do aluno |
| learning_status | LearningStatus | Yes | Situação geral do aluno na trilha de aprendizagem |
| first_started_at | DateTime | No | Momento em que o aluno iniciou a trilha pela primeira vez |

**Unique constraints and indexes**
- Unique: `user_id`
- Index: `learning_status`

---

### Entity: TeacherProfile
> Representa os dados de um usuário com papel de professor. É o ponto de vínculo para turmas e acompanhamento pedagógico.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| user_id | UUID | Yes | Referência ao usuário da conta do professor |

**Unique constraints and indexes**
- Unique: `user_id`

---

### Entity: AdminProfile
> Representa os dados de um usuário com papel de administrador. É usado para gestão global da plataforma, conteúdo e usuários.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| user_id | UUID | Yes | Referência ao usuário da conta do administrador |

**Unique constraints and indexes**
- Unique: `user_id`

---

### Entity: ClassGroup
> Representa uma turma organizada por professor para acompanhamento coletivo de estudantes. É a unidade principal de agrupamento pedagógico no contexto escolar.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| teacher_profile_id | UUID | Yes | Professor responsável pela turma |
| name | String | Yes | Nome identificador da turma |
| description | Text | No | Descrição opcional da turma para contexto pedagógico |
| class_status | ClassStatus | Yes | Situação da turma para uso e acompanhamento |

**Unique constraints and indexes**
- Index: `teacher_profile_id`
- Index: `class_status`
- Unique: `(teacher_profile_id, name)`

---

### Entity: ClassEnrollment
> Representa o vínculo entre aluno e turma. Permite organizar estudantes em grupos sem duplicar dados do aluno.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| class_group_id | UUID | Yes | Referência à turma |
| student_profile_id | UUID | Yes | Referência ao aluno vinculado |
| enrolled_at | DateTime | Yes | Data e hora de entrada do aluno na turma |
| enrollment_status | EnrollmentStatus | Yes | Estado do vínculo do aluno com a turma |

**Unique constraints and indexes**
- Unique: `(class_group_id, student_profile_id)`
- Index: `student_profile_id`
- Index: `enrollment_status`

---

### Entity: Module
> Representa uma unidade temática da trilha de aprendizagem, organizada de forma progressiva. Exemplos citados no discovery incluem variáveis, condicionais, loops e funções.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| title | String | Yes | Título do módulo |
| description | Text | Yes | Descrição pedagógica do conteúdo do módulo |
| sequence_order | Integer | Yes | Ordem de exibição e progressão na trilha |
| publication_status | ContentStatus | Yes | Estado de publicação do módulo |

**Unique constraints and indexes**
- Unique: `sequence_order`
- Index: `publication_status`

---

### Entity: Lesson
> Representa uma aula pertencente a um módulo. Cada aula combina videoaula e material escrito de apoio dentro da sequência pedagógica.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| module_id | UUID | Yes | Módulo ao qual a aula pertence |
| title | String | Yes | Título da aula |
| written_content | Text | Yes | Conteúdo textual de apoio da aula |
| sequence_order | Integer | Yes | Ordem da aula dentro do módulo |
| publication_status | ContentStatus | Yes | Estado de publicação da aula |

**Unique constraints and indexes**
- Unique: `(module_id, sequence_order)`
- Index: `module_id`
- Index: `publication_status`

---

### Entity: VideoLesson
> Representa o recurso de videoaula associado a uma aula. Modela o conteúdo audiovisual de forma separada do material escrito.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| lesson_id | UUID | Yes | Aula à qual o vídeo pertence |
| title | String | Yes | Título da videoaula |
| video_url | String | Yes | URL ou referência do vídeo hospedado |
| duration_seconds | Integer | No | Duração do vídeo em segundos |

**Unique constraints and indexes**
- Unique: `lesson_id`
- Index: `lesson_id`

---

### Entity: Exercise
> Representa um exercício prático de programação vinculado ao conteúdo estudado. É resolvido pelo aluno no editor integrado e avaliado automaticamente.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| lesson_id | UUID | Yes | Aula à qual o exercício está associado |
| title | String | Yes | Título do exercício |
| statement | Text | Yes | Enunciado do problema proposto ao aluno |
| support_message | Text | No | Mensagem inicial de apoio ou orientação pedagógica |
| sequence_order | Integer | Yes | Ordem do exercício dentro da aula |
| publication_status | ContentStatus | Yes | Estado de publicação do exercício |

**Unique constraints and indexes**
- Unique: `(lesson_id, sequence_order)`
- Index: `lesson_id`
- Index: `publication_status`

---

### Entity: ExerciseTestCase
> Representa um teste interno predefinido para validar automaticamente a solução de um exercício. É usado pelo mecanismo de correção automática em ambiente controlado.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| exercise_id | UUID | Yes | Exercício ao qual o teste pertence |
| name | String | Yes | Nome identificador do teste |
| input_data | Text | No | Entrada fornecida ao código do aluno, quando aplicável |
| expected_output | Text | Yes | Saída esperada para aprovação do teste |
| sequence_order | Integer | Yes | Ordem de execução do teste |
| is_hidden | Boolean | Yes | Indica se o teste é oculto ao aluno |

**Unique constraints and indexes**
- Unique: `(exercise_id, sequence_order)`
- Index: `exercise_id`

---

### Entity: Submission
> Representa uma submissão de código feita pelo aluno para um exercício. Armazena o código enviado e o resultado consolidado da avaliação automática.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| exercise_id | UUID | Yes | Exercício respondido |
| student_profile_id | UUID | Yes | Aluno que realizou a submissão |
| source_code | Text | Yes | Código enviado pelo aluno |
| evaluation_status | SubmissionStatus | Yes | Situação da avaliação da submissão |
| score_percentage | Decimal(5,2) | No | Percentual de testes aprovados na submissão |
| submitted_at | DateTime | Yes | Momento do envio para correção |

**Unique constraints and indexes**
- Index: `exercise_id`
- Index: `student_profile_id`
- Index: `(student_profile_id, exercise_id, submitted_at)`
- Index: `evaluation_status`

---

### Entity: SubmissionResult
> Representa o resultado detalhado da avaliação de uma submissão. Guarda o retorno pedagógico consolidado entregue ao aluno.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| submission_id | UUID | Yes | Submissão avaliada |
| passed_tests_count | Integer | Yes | Quantidade de testes aprovados |
| failed_tests_count | Integer | Yes | Quantidade de testes reprovados |
| feedback_message | Text | Yes | Mensagem automática de apoio exibida ao aluno |
| result_status | ResultStatus | Yes | Resultado consolidado da avaliação |

**Unique constraints and indexes**
- Unique: `submission_id`
- Index: `result_status`

---

### Entity: StudentModuleProgress
> Representa o progresso do aluno em um módulo da trilha. Suporta visualização de módulos iniciados e concluídos.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| student_profile_id | UUID | Yes | Aluno acompanhado |
| module_id | UUID | Yes | Módulo da trilha |
| progress_status | ProgressStatus | Yes | Situação do módulo para o aluno |
| started_at | DateTime | No | Momento em que o módulo foi iniciado |
| completed_at | DateTime | No | Momento em que o módulo foi concluído |

**Unique constraints and indexes**
- Unique: `(student_profile_id, module_id)`
- Index: `module_id`
- Index: `progress_status`

---

### Entity: StudentLessonProgress
> Representa o progresso do aluno em uma aula específica. Permite registrar consumo da aula dentro do módulo.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| student_profile_id | UUID | Yes | Aluno acompanhado |
| lesson_id | UUID | Yes | Aula acompanhada |
| progress_status | ProgressStatus | Yes | Situação da aula para o aluno |
| started_at | DateTime | No | Momento em que a aula foi iniciada |
| completed_at | DateTime | No | Momento em que a aula foi concluída |

**Unique constraints and indexes**
- Unique: `(student_profile_id, lesson_id)`
- Index: `lesson_id`
- Index: `progress_status`

---

### Entity: StudentExerciseProgress
> Representa o progresso do aluno em um exercício específico. Permite contar exercícios resolvidos e identificar conclusão por atividade prática.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| created_at | DateTime | Yes | Record creation timestamp |
| updated_at | DateTime | Yes | Last modification timestamp |
| student_profile_id | UUID | Yes | Aluno acompanhado |
| exercise_id | UUID | Yes | Exercício acompanhado |
| progress_status | ProgressStatus | Yes | Situação do exercício para o aluno |
| attempts_count | Integer | Yes | Quantidade de submissões realizadas para o exercício |
| first_attempt_at | DateTime | No | Momento da primeira submissão |
| completed_at | DateTime | No | Momento em que o exercício foi concluído com sucesso |

**Unique constraints and indexes**
- Unique: `(student_profile_id, exercise_id)`
- Index: `exercise_id`
- Index: `progress_status`

## 2. Relationships

| Source | Target | Cardinality | Description |
|--------|--------|-------------|-------------|
| User | StudentProfile | 1:0..1 | Um usuário pode possuir um perfil de aluno quando seu papel for Aluno. |
| User | TeacherProfile | 1:0..1 | Um usuário pode possuir um perfil de professor quando seu papel for Professor. |
| User | AdminProfile | 1:0..1 | Um usuário pode possuir um perfil de administrador quando seu papel for Administrador. |
| TeacherProfile | ClassGroup | 1:N | Um professor pode gerenciar várias turmas. |
| ClassGroup | ClassEnrollment | 1:N | Uma turma possui vários vínculos de matrícula de alunos. |
| StudentProfile | ClassEnrollment | 1:N | Um aluno pode participar de uma ou mais turmas por meio de matrículas. |
| Module | Lesson | 1:N | Um módulo contém várias aulas em ordem pedagógica. |
| Lesson | VideoLesson | 1:1 | Cada aula possui uma videoaula associada. |
| Lesson | Exercise | 1:N | Uma aula possui um ou mais exercícios práticos. |
| Exercise | ExerciseTestCase | 1:N | Um exercício possui vários testes internos para correção automática. |
| StudentProfile | Submission | 1:N | Um aluno pode realizar várias submissões ao longo da trilha. |
| Exercise | Submission | 1:N | Um exercício recebe várias submissões de diferentes alunos ou tentativas do mesmo aluno. |
| Submission | SubmissionResult | 1:1 | Cada submissão gera um resultado consolidado de avaliação. |
| StudentProfile | StudentModuleProgress | 1:N | Um aluno possui registros de progresso por módulo. |
| Module | StudentModuleProgress | 1:N | Um módulo possui progresso registrado para vários alunos. |
| StudentProfile | StudentLessonProgress | 1:N | Um aluno possui registros de progresso por aula. |
| Lesson | StudentLessonProgress | 1:N | Uma aula possui progresso registrado para vários alunos. |
| StudentProfile | StudentExerciseProgress | 1:N | Um aluno possui registros de progresso por exercício. |
| Exercise | StudentExerciseProgress | 1:N | Um exercício possui progresso registrado para vários alunos. |

## 3. Business Rules

| ID | Rule | Entities | Enforcement |
|----|------|----------|-------------|
| BR-001 | Todo usuário deve possuir exatamente um papel principal entre aluno, professor e administrador. | User | Constraint + validação |
| BR-002 | Um perfil especializado deve existir apenas para usuários com papel correspondente; por exemplo, StudentProfile somente para usuários com role = STUDENT. | User, StudentProfile, TeacherProfile, AdminProfile | Constraint + validação |
| BR-003 | O e-mail do usuário deve ser único em toda a plataforma. | User | Constraint |
| BR-004 | Apenas professores podem ser responsáveis por turmas. | TeacherProfile, ClassGroup | Constraint + validação |
| BR-005 | Um aluno não pode ter mais de uma matrícula ativa na mesma turma. | ClassEnrollment | Constraint |
| BR-006 | A trilha pedagógica deve respeitar ordenação única de módulos por `sequence_order`. | Module | Constraint |
| BR-007 | A ordem das aulas deve ser única dentro de cada módulo. | Lesson | Constraint |
| BR-008 | Cada aula deve possuir simultaneamente material escrito e uma videoaula associada, refletindo o fluxo pedagógico definido. | Lesson, VideoLesson | Validation |
| BR-009 | Todo exercício deve estar vinculado a uma aula e não pode existir solto na plataforma. | Exercise, Lesson | Constraint |
| BR-010 | Todo exercício deve possuir ao menos um teste interno de correção antes de ser publicado. | Exercise, ExerciseTestCase | Validation |
| BR-011 | A submissão só pode ser realizada por aluno autenticado para exercício publicado. | Submission, StudentProfile, Exercise | Validation |
| BR-012 | Cada submissão deve gerar exatamente um resultado consolidado de avaliação. | Submission, SubmissionResult | Constraint + trigger/processamento transacional |
| BR-013 | O feedback automático deve orientar o aluno sem expor resposta completa do exercício. | SubmissionResult, Exercise | Validation de conteúdo/processo editorial |
| BR-014 | O progresso de exercício deve ser marcado como concluído apenas quando houver submissão aprovada. | StudentExerciseProgress, SubmissionResult | Trigger/processamento de domínio |
| BR-015 | O progresso de módulo concluído depende da conclusão das aulas e exercícios vinculados ao módulo. | StudentModuleProgress, StudentLessonProgress, StudentExerciseProgress, Module | Processamento de domínio |
| BR-016 | Professores devem visualizar apenas dados de alunos vinculados às suas turmas. | TeacherProfile, ClassGroup, ClassEnrollment, StudentProfile | Authorization + validation |
| BR-017 | Alunos devem visualizar apenas o próprio progresso, submissões e resultados. | StudentProfile, Submission, SubmissionResult, StudentModuleProgress, StudentLessonProgress, StudentExerciseProgress | Authorization |
| BR-018 | Administradores podem gerenciar usuários, módulos, aulas e exercícios independentemente de vínculo com turma. | AdminProfile, User, Module, Lesson, Exercise | Authorization |
| BR-019 | Conteúdos não publicados não devem aparecer para alunos na trilha de aprendizagem. | Module, Lesson, Exercise | Validation + consulta filtrada |
| BR-020 | A quantidade de tentativas em StudentExerciseProgress deve refletir o número de submissões do aluno para o exercício. | StudentExerciseProgress, Submission | Trigger/processamento de domínio |

## 4. Enums

### UserRole
| Value | Description |
|-------|-------------|
| STUDENT | Usuário com acesso à trilha de aprendizagem, exercícios e progresso próprio |
| TEACHER | Usuário com acesso ao painel pedagógico e gestão de turmas |
| ADMIN | Usuário com acesso completo à gestão da plataforma |

### AccountStatus
| Value | Description |
|-------|-------------|
| ACTIVE | Conta ativa e apta para autenticação |
| INACTIVE | Conta temporariamente inativa |
| SUSPENDED | Conta bloqueada por decisão administrativa |

### LearningStatus
| Value | Description |
|-------|-------------|
| NOT_STARTED | Aluno ainda não iniciou a trilha |
| IN_PROGRESS | Aluno iniciou a trilha e está em andamento |
| COMPLETED | Aluno concluiu a trilha disponível |

### ClassStatus
| Value | Description |
|-------|-------------|
| ACTIVE | Turma em uso para acompanhamento |
| ARCHIVED | Turma encerrada e mantida apenas para histórico |

### EnrollmentStatus
| Value | Description |
|-------|-------------|
| ACTIVE | Matrícula ativa do aluno na turma |
| REMOVED | Vínculo removido da turma |

### ContentStatus
| Value | Description |
|-------|-------------|
| DRAFT | Conteúdo ainda em edição e não visível para alunos |
| PUBLISHED | Conteúdo liberado para uso na plataforma |
| ARCHIVED | Conteúdo retirado de circulação, preservado para histórico |

### SubmissionStatus
| Value | Description |
|-------|-------------|
| PENDING | Submissão recebida e aguardando avaliação |
| RUNNING | Submissão em processamento no ambiente controlado |
| EVALUATED | Submissão já avaliada com resultado final |
| FAILED | Submissão com falha técnica de execução ou processamento |

### ResultStatus
| Value | Description |
|-------|-------------|
| PASSED | Submissão aprovada nos critérios da correção |
| FAILED | Submissão não atingiu os critérios esperados |
| ERROR | Submissão não pôde ser avaliada corretamente por erro técnico |

### ProgressStatus
| Value | Description |
|-------|-------------|
| NOT_STARTED | Item ainda não iniciado pelo aluno |
| IN_PROGRESS | Item iniciado, mas ainda não concluído |
| COMPLETED | Item concluído pelo aluno |

## 5. Invariants

- Todo registro do sistema deve possuir `id`, `created_at` e `updated_at`.
- Todo `User` deve ter exatamente um `role` válido em `UserRole`.
- Para cada `User`, no máximo um perfil especializado pode existir, e ele deve ser compatível com o papel informado.
- Todo `StudentProfile`, `TeacherProfile` e `AdminProfile` deve referenciar exatamente um `User` existente.
- Toda `ClassGroup` deve possuir exatamente um `TeacherProfile` responsável.
- Toda relação entre aluno e turma deve passar por `ClassEnrollment`; não deve haver vínculo direto redundante.
- Todo `Lesson` deve pertencer a um único `Module`.
- Toda `VideoLesson` deve pertencer a uma única `Lesson`, e cada `Lesson` deve possuir no máximo uma `VideoLesson`.
- Todo `Exercise` deve pertencer a uma única `Lesson`.
- Todo `ExerciseTestCase` deve pertencer a um único `Exercise`.
- Toda `Submission` deve referenciar exatamente um `StudentProfile` e um `Exercise`.
- Toda `SubmissionResult` deve referenciar exatamente uma `Submission`.
- Um `StudentModuleProgress` não pode existir sem o par válido `StudentProfile` + `Module`.
- Um `StudentLessonProgress` não pode existir sem o par válido `StudentProfile` + `Lesson`.
- Um `StudentExerciseProgress` não pode existir sem o par válido `StudentProfile` + `Exercise`.
- Se `completed_at` estiver preenchido em qualquer entidade de progresso, `progress_status` deve ser `COMPLETED`.
- Se `progress_status` for `NOT_STARTED`, os campos `started_at` e `completed_at` devem estar vazios.
- `attempts_count` em `StudentExerciseProgress` deve ser maior ou igual a zero.
- `score_percentage` em `Submission` deve estar entre 0 e 100 quando informado.
- Conteúdos em estado diferente de `PUBLISHED` não devem ser disponibilizados aos alunos nas consultas da trilha.
- O modelo assume uma única linguagem de programação na primeira versão, mas esse atributo não foi incluído nas entidades porque a linguagem específica ainda não foi definida nos documentos de discovery.
- Gap explícito: os documentos não definem dados cadastrais adicionais de alunos e professores, como escola, série, telefone ou data de nascimento; portanto, esses atributos não foram incluídos no modelo.
- Gap explícito: os documentos não definem política formal de auditoria, retenção, consentimento ou responsável legal; essas necessidades podem exigir entidades adicionais em fases futuras.