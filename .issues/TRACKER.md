# Issue Tracker — ingenia

> Acompanhamento centralizado de todas as issues do projeto.
> **Responsabilidade**: atualizar este tracker sempre que uma issue for criada, modificada ou concluída.

## Legenda de Status

| Emoji | Status       |
|-------|-------------|
| 🟡    | Pendente     |
| 🔵    | Em andamento |
| 🟢    | Concluída    |
| 🔴    | Bloqueada    |
| ⚪    | Cancelada    |

## Legenda de Tamanho

| Sigla | Significado |
|-------|-------------|
| **P** | Pequena (≤5 tarefas, 1-2 arquivos) |
| **M** | Média (5-8 tarefas) |
| **G** | Grande (>8 tarefas ou complexidade alta) |
| **GG** | Muito Grande (múltiplos domínios, muitos endpoints/telas) |

---

## Fase 0 — Fundação (Camada 1-2)

| ID | Título | Tipo | Tam. | Status | Depende de |
|---|--------|------|------|--------|------------|
| ISSUE-001 | App `accounts` — Estender User + Profiles | feature | P | 🟢 | — |
| ISSUE-003 | App `curriculum` — Módulos, Aulas, Vídeos, Exercícios | feature | M | 🟢 | — |
| ISSUE-002 | App `classes` — Turmas e Matrículas | feature | P | 🟢 | 001 |
| ISSUE-004 | App `submissions` — Submissão e Resultado | feature | P | 🟢 | 001, 003 |
| ISSUE-005 | App `progress` — Progresso do Aluno | feature | P | 🟢 | 001, 003 |
| ISSUE-006 | Admin Django + Seed Básico | feature | M | 🟢 | 001-005 |

---

## Fase 1 — Autenticação & Autorização (Camada 2-3)

### ISSUE-007 — Backend Auth (G)

| ID | Título | Tipo | Status | Depende de |
|---|--------|------|--------|------------|
| ISSUE-007-A | JWT custom — role no payload + `/me/` + bloquear inativo | feature | 🟢 | 001 |
| ISSUE-007-B | Endpoint de registro público (User + StudentProfile) | feature | 🟢 | 001 |
| ISSUE-007-C | Permissions customizadas (IsStudent, IsTeacher, IsAdmin, IsActiveAccount) | feature | 🟢 | 001, 007-A |
| ISSUE-007-D | Recuperação de senha (forgot + reset) | feature | 🟢 | 001, 007-A |
| ISSUE-007-E | Testes unitários de auth | chore | 🟢 | 007-A, 007-B, 007-C, 007-D |

### ISSUE-008 — Frontend Auth (G)

| ID | Título | Tipo | Status | Depende de |
|---|--------|------|--------|------------|
| ISSUE-008-A | Tela de Login + redirecionamento por role | feature | 🟢 | 007-A, 007-C |
| ISSUE-008-B | Tela de Registro + Forgot Password | feature | 🟢 | 007-B, 007-D |
| ISSUE-008-C | Telas de erro (Unauthorized + Not Found) | feature | 🟢 | — |
| ISSUE-008-D | Guards de rota (ProtectedRoute, StudentRoute, etc.) | feature | 🟢 | 007-A, 007-C, 008-A |
| ISSUE-008-E | Layout base com navegação por perfil | feature | 🟢 | 007-A, 008-A, 008-D |
| ISSUE-008-F | Testes E2E de login e registro | chore | 🟢 | 007-E, 008-A, 008-B, 008-D, 008-E |

---

## Fase 2 — Administração de Conteúdo (Camada 3-4)

### ISSUE-009 — Backend Admin CRUD (GG)

| ID | Título | Tipo | Status | Depende de |
|---|--------|------|--------|------------|
| ISSUE-009-A | CRUD de Module (serializer, service, view, URLs) | feature | 🟢 | 003, 007-C |
| ISSUE-009-B | CRUD de Lesson + VideoLesson (nested sob Module) | feature | 🟢 | 003, 007-C, 009-A |
| ISSUE-009-C | CRUD de Exercise + ExerciseTestCase (nested sob Lesson) | feature | 🟢 | 003, 007-C, 009-B |
| ISSUE-009-D | CRUD de User admin (criação com profile por role) | feature | 🟢 | 001, 007-C |
| ISSUE-009-E | Regras BR-008 e BR-010 (validações de publicação) | feature | 🟢 | 009-B, 009-C |
| ISSUE-009-F | Testes unitários de admin CRUD | chore | 🟢 | 009-A a 009-E |
| ISSUE-009-G | Endpoint de Estatísticas do Dashboard Admin | feature | 🟢 | 009-A a 009-D |

### ISSUE-010 — Frontend Admin (GG)

| ID | Título | Tipo | Status | Depende de |
|---|--------|------|--------|------------|
| ISSUE-010-A | Layout admin (sidebar, header, breadcrumb) + Dashboard | feature | 🟢 | 008-D, 008-E |
| ISSUE-010-B | CRUD Módulos (list, create, edit, detail) | feature | 🟢 | 009-A, 010-A |
| ISSUE-010-C | CRUD Aulas + Exercícios (nested, com test cases) | feature | 🟢 | 009-B, 009-C, 010-B |
| ISSUE-010-D | CRUD Usuários (list, create, edit, detail por role) | feature | 🟢 | 009-D, 010-A |
| ISSUE-010-E | Visão de turmas (read-only) | feature | 🟢 | 002, 010-A |
| ISSUE-010-F | Testes E2E (J-007, J-008) | chore | 🟢 | 009-F, 010-B, 010-C, 010-D |

---

## Fase 3 — Experiência do Aluno (Camada 4-5)

### ISSUE-011 — Backend Aluno (GG)

| ID | Título | Tipo | Status | Depende de |
|---|--------|------|--------|------------|
| ISSUE-011-A | Endpoints de leitura (módulos, aulas, exercícios publicados) | feature | 🟢 | 003, 007-C |
| ISSUE-011-B | Service de submissão de código + endpoint (recebe resultado do Skulpt) | feature | 🟢 | 003, 004, 007-C |
| ISSUE-011-C | Service de progresso automático (lesson, exercise, module) | feature | 🟢 | 003, 004, 005, 011-B |
| ISSUE-011-D | Endpoints de histórico + progresso consolidado | feature | 🟢 | 004, 005, 007-C, 011-B, 011-C |
| ISSUE-011-F | Progresso de aula por acesso (trigger de visualização) | feature | 🟢 | 011-A, 011-C |
| ISSUE-011-E | Testes unitários (progress + submission) | chore | 🟢 | 011-A a 011-D, 011-F |

### ISSUE-012 — Motor de Correção Skulpt — Client-Side (M)

| ID | Título | Tipo | Status | Depende de |
|---|--------|------|--------|------------|
| ISSUE-012-A | Endpoint síncrono de submissão (recebe resultado avaliado + persiste) | feature | 🟢 | 004 |
| ISSUE-012-B | ~~Executor de sandbox~~ | feature | ⚪ | — (cancelada — Skulpt substitui) |
| ISSUE-012-C | Avaliação no frontend: hook/service Skulpt por test case | feature | 🟢 | 003 |
| ISSUE-012-D | Resultado no frontend: score, feedback + envio ao backend | feature | 🟢 | 004, 012-A, 012-C |
| ISSUE-012-E | Tratamento de erros e timeout no frontend (Skulpt) | feature | 🟢 | 012-C |
| ISSUE-012-F | Testes: vitest (avaliação Skulpt) + pytest (persistência) | chore | 🟢 | 012-A, 012-C, 012-D, 012-E |

### ISSUE-013 — Frontend Aluno (GG)

| ID | Título | Tipo | Status | Depende de |
|---|--------|------|--------|------------|
| ISSUE-013-A | Layout aluno + Dashboard/Trilha | feature | 🟢 | 008-D, 008-E, 011-A |
| ISSUE-013-B | Lista de módulos + Detalhe do módulo | feature | 🟢 | 011-A, 011-D, 013-A |
| ISSUE-013-C | Tela de aula (vídeo + conteúdo + exercícios) | feature | 🟢 | 011-A, 011-F, 013-B |
| ISSUE-013-D | Tela de exercício com Editor de Código (Monaco) + Motor Skulpt + submissão | feature | 🟢 | 011-B, 012-C, 012-D, 012-E, 013-C |
| ISSUE-013-E | Painel de resultado + histórico de tentativas | feature | 🟢 | 011-D, 012-D, 013-D |
| ISSUE-013-F | Tela de progresso + Tela de histórico de submissões | feature | 🟢 | 011-D, 013-A |
| ISSUE-013-G | Testes E2E (J-002, J-003, J-004) | chore | 🟢 | 011-E, 012-F, 013-A a 013-F |

---

## Fase 4 — Experiência do Professor (Camada 5-6)

### ISSUE-014 — Backend Professor (G)

| ID | Título | Tipo | Status | Depende de |
|---|--------|------|--------|------------|
| ISSUE-014-A | CRUD ClassGroup (professor cria/edita turmas) | feature | 🟢 | 002, 007-C |
| ISSUE-014-B | CRUD ClassEnrollment (associar/remover alunos) | feature | 🟢 | 001, 002, 014-A |
| ISSUE-014-C | Progresso coletivo + individual do aluno na turma | feature | 🟢 | 005, 011-C, 014-A, 014-B |
| ISSUE-014-D | Testes unitários de autorização (BR-016, BR-004, BR-005) | chore | 🟢 | 014-A, 014-B, 014-C |

### ISSUE-015 — Frontend Professor (G)

| ID | Título | Tipo | Status | Depende de |
|---|--------|------|--------|------------|
| ISSUE-015-A | Layout professor + Dashboard | feature | 🟢 | 008-D, 008-E |
| ISSUE-015-B | CRUD de turmas (list, new, detail, edit) | feature | 🟢 | 014-A, 014-B, 015-A |
| ISSUE-015-C | Lista de alunos + progresso individual | feature | 🟡 | 014-C, 015-B |
| ISSUE-015-D | Testes E2E (J-005, J-006) | chore | 🟡 | 014-D, 015-A, 015-B, 015-C |

---

## Fase 5 — Segurança, Polish & Validação (Camada 6-7)

### ISSUE-016 — Segurança (G)

| ID | Título | Tipo | Status | Depende de |
|---|--------|------|--------|------------|
| ISSUE-016-A | Rate limiting (login + submissões) | feature | 🟡 | 007-A, 011-B |
| ISSUE-016-B | Validação de entrada (revisão de serializers) | feature | 🟡 | 009-*, 011-* |
| ISSUE-016-C | ~~Hardening do sandbox~~ | feature | ⚪ | — (cancelada — Skulpt roda no browser) |
| ISSUE-016-D | Auditoria de ações admin + CORS/CSRF/headers | feature | 🟡 | 009-* |

### ISSUE-017 — UX & Responsividade (M) — Não quebrada

| ID | Título | Tipo | Status | Depende de |
|---|--------|------|--------|------------|
| ISSUE-017 | UX & Responsividade — Feedback Visual, Erros e Acessibilidade | feature | 🟡 | 008, 010, 013, 015 |

### ISSUE-018 — Validação Final (G)

| ID | Título | Tipo | Status | Depende de |
|---|--------|------|--------|------------|
| ISSUE-018-A | Suite E2E completa (J-001 a J-008) | chore | 🟡 | 008-F, 010-F, 013-G, 015-D |
| ISSUE-018-B | ~~Testes de segurança do sandbox~~ | chore | ⚪ | — (cancelada — sem sandbox server-side) |
| ISSUE-018-C | Testes de performance do motor Skulpt no browser | chore | 🟡 | 012-F |
| ISSUE-018-D | Revisão da matriz de autorização | chore | 🟡 | 007-C, 009-F, 011-E, 014-D |

---

## Resumo

| Métrica | Valor |
|---------|-------|
| Issues pai | 18 |
| Sub-issues | 58 |
| Issues que não foram quebradas | 7 (001, 002, 003, 004, 005, 006, 017) |
| Total de itens rastreáveis | 65 |
| Concluídas | 51 |
| Em andamento | 0 |
| Pendentes | 11 |
| Canceladas | 3 (012-B, 016-C, 018-B) |

<!-- Ao criar uma nova issue, adicione uma linha na tabela acima e crie o arquivo correspondente em .issues/ISSUE-XXX.md -->
