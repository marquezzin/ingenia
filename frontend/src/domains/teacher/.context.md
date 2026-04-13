# Domain: teacher

## Propósito
Painel do professor para gestão de turmas, acompanhamento de alunos e visualização de progresso. Permite criar/editar turmas, associar/remover alunos e monitorar o desempenho individual e coletivo.

## Backend Correspondente
- App Django: `classes` (turmas + matrículas)
- App Django: `progress` (endpoints de progresso professor)

## Páginas
- **DashboardPage** (`/teacher`): Cards-resumo (turmas, alunos, turmas ativas, média alunos/turma), lista resumida de turmas, ações rápidas
- **ClassListPage** (`/teacher/classes`): Lista de turmas com busca, filtro por status, paginação
- **ClassCreatePage** (`/teacher/classes/new`): Formulário com nome/descrição + busca e seleção de alunos
- **ClassDetailPage** (`/teacher/classes/:classId`): Resumo da turma, tabela de alunos com indicadores de progresso
- **ClassEditPage** (`/teacher/classes/:classId/edit`): Alterar nome/descrição/status + composição de alunos
- **StudentListPage** (`/teacher/students`): Lista consolidada de alunos transversal com filtros por turma, status e busca
- **StudentProgressPage** (`/teacher/classes/:classId/students/:studentId`): Progresso individual detalhado por módulo/aula/exercício

## API Contract (`api.ts`)
| Função | Método | Endpoint |
|---|---|---|
| `listTeacherClassesApi` | GET | `/api/v1/teacher/classes/` |
| `getTeacherClassApi` | GET | `/api/v1/teacher/classes/:id/` |
| `createTeacherClassApi` | POST | `/api/v1/teacher/classes/` |
| `updateTeacherClassApi` | PUT | `/api/v1/teacher/classes/:id/` |
| `listEnrollmentsApi` | GET | `/api/v1/teacher/classes/:id/enrollments/` |
| `enrollStudentApi` | POST | `/api/v1/teacher/classes/:id/enrollments/` |
| `removeStudentApi` | DELETE | `/api/v1/teacher/classes/:id/enrollments/:enrollmentId/` |
| `getClassProgressApi` | GET | `/api/v1/teacher/classes/:id/progress/` |
| `getStudentProgressApi` | GET | `/api/v1/teacher/classes/:id/students/:studentId/progress/` |
| `searchStudentsApi` | GET | `/api/v1/teacher/students/search/?search=` |

## Types (`types.ts`)
- `TeacherClassListItem`, `TeacherClassDetail` — Turmas
- `EnrolledStudent` — Aluno matriculado
- `CreateClassPayload`, `UpdateClassPayload` — Payloads de escrita
- `ClassProgress`, `StudentProgressSummary` — Progresso coletivo
- `StudentDetailProgress`, `TeacherModuleProgress`, `TeacherLessonProgress`, `TeacherExerciseProgress` — Progresso individual
- `ListClassesParams` — Parâmetros de listagem
- `StudentSearchResult`, `SearchStudentsParams` — Busca de alunos para matrícula

## Hooks (`hooks.ts`)
- `useTeacherClasses(params?)` — Listar turmas
- `useTeacherClass(id)` — Detalhe de turma
- `useCreateTeacherClass()` — Criar turma
- `useUpdateTeacherClass()` — Editar turma
- `useEnrollments(classId)` — Listar matrículas
- `useEnrollStudent()` — Matricular aluno
- `useRemoveStudent()` — Remover aluno
- `useClassProgress(classId)` — Progresso coletivo
- `useStudentProgress(classId, studentId)` — Progresso individual
- `useSearchStudents(search)` — Buscar alunos para matrícula

## Model (`model.ts`)
- `computeDashboardMetrics()` — Calcula métricas agregadas do dashboard
- `getLearningStatusLabel()` — Traduz status para português
- `getLearningStatusColor()` — Cor Mantine para badge de status
- `sortStudentsByAttention()` — Ordena alunos por necessidade de atenção

## Dependências
- `@/shared/http/client` — Cliente HTTP
- `@/shared/ui/components` — PageHeader, StatCard, EmptyState, StatusBadge, ConfirmModal
- `@/domains/auth/hooks` — `useMe()` para dados do professor
- `@mantine/core` — Componentes UI
- `lucide-react` — Ícones

## Testes
- `e2e/classes.spec.ts` — J-005: criação de turma, progresso coletivo, estados vazios, busca, validação
- `e2e/progress.spec.ts` — J-006: progresso individual, stat cards, status badges, navegação, lista consolidada
