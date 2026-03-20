# Admin Domain — .context.md

## Propósito

Domain frontend para o painel administrativo da plataforma. Permite ao administrador visualizar métricas, gerenciar módulos, aulas, exercícios (com test cases) e usuários.

## Páginas

| Página | Rota | Descrição |
|--------|------|-----------|
| `DashboardPage` | `/admin` | Visão geral com stat cards e atalhos rápidos |
| `ModuleListPage` | `/admin/modules` | Lista de módulos com busca, filtro e paginação |
| `ModuleCreatePage` | `/admin/modules/new` | Formulário de criação de módulo |
| `ModuleDetailPage` | `/admin/modules/:moduleId` | Detalhe do módulo com lista de aulas |
| `ModuleEditPage` | `/admin/modules/:moduleId/edit` | Edição de módulo com publish/unpublish e delete |
| `LessonCreatePage` | `/admin/modules/:moduleId/lessons/new` | Formulário de criação de aula com vídeo opcional |
| `LessonDetailPage` | `/admin/modules/:moduleId/lessons/:lessonId` | Detalhe da aula com lista de exercícios e alerta BR-008 |
| `LessonEditPage` | `/admin/modules/:moduleId/lessons/:lessonId/edit` | Edição de aula com publish/unpublish e delete |
| `ExerciseCreatePage` | `/admin/modules/:moduleId/lessons/:lessonId/exercises/new` | Formulário de criação de exercício |
| `ExerciseDetailPage` | `/admin/modules/:moduleId/lessons/:lessonId/exercises/:exerciseId` | Detalhe do exercício com test cases inline e alerta BR-010 |
| `ExerciseEditPage` | `/admin/modules/:moduleId/lessons/:lessonId/exercises/:exerciseId/edit` | Edição de exercício com publish/unpublish e delete |
| `UserListPage` | `/admin/users` | Lista de usuários com busca e filtros por role/status |
| `UserCreatePage` | `/admin/users/new` | Formulário de criação de usuário por role |
| `UserDetailPage` | `/admin/users/:userId` | Detalhe do usuário com informações de profile |
| `UserEditPage` | `/admin/users/:userId/edit` | Edição de dados e status da conta (role read-only) |
| `ClassListPage` | `/admin/classes` | Lista read-only de turmas (ISSUE-010-E) |
| `ClassDetailPage` | `/admin/classes/:classId` | Detalhe da turma com lista de alunos matriculados |

## API Contract

| Função | Endpoint | Descrição |
|--------|----------|-----------|
| `getAdminDashboardStatsApi` | `GET /api/v1/admin/stats/` | Estatísticas agregadas do dashboard |
| `listModulesApi` | `GET /api/v1/modules/` | Lista módulos (search, filter, pagination) |
| `getModuleApi` | `GET /api/v1/modules/:id/` | Detalhe de um módulo |
| `createModuleApi` | `POST /api/v1/modules/` | Cria um módulo |
| `updateModuleApi` | `PUT /api/v1/modules/:id/` | Atualiza um módulo |
| `deleteModuleApi` | `DELETE /api/v1/modules/:id/` | Exclui um módulo |
| `listModuleLessonsApi` | `GET /api/v1/modules/:id/lessons/` | Lista aulas de um módulo |
| `getLessonApi` | `GET /api/v1/modules/:id/lessons/:id/` | Detalhe de uma aula |
| `createLessonApi` | `POST /api/v1/modules/:id/lessons/` | Cria uma aula |
| `updateLessonApi` | `PUT /api/v1/modules/:id/lessons/:id/` | Atualiza uma aula |
| `deleteLessonApi` | `DELETE /api/v1/modules/:id/lessons/:id/` | Exclui uma aula |
| `listExercisesApi` | `GET .../lessons/:id/exercises/` | Lista exercícios de uma aula |
| `getExerciseApi` | `GET .../exercises/:id/` | Detalhe de um exercício |
| `createExerciseApi` | `POST .../exercises/` | Cria um exercício |
| `updateExerciseApi` | `PUT .../exercises/:id/` | Atualiza um exercício |
| `deleteExerciseApi` | `DELETE .../exercises/:id/` | Exclui um exercício |
| `listTestCasesApi` | `GET .../exercises/:id/test-cases/` | Lista test cases |
| `createTestCaseApi` | `POST .../test-cases/` | Cria um test case |
| `updateTestCaseApi` | `PUT .../test-cases/:id/` | Atualiza um test case |
| `deleteTestCaseApi` | `DELETE .../test-cases/:id/` | Exclui um test case |
| `listUsersApi` | `GET /api/auth/admin/users/` | Lista usuários (search, filter, pagination) |
| `getUserApi` | `GET /api/auth/admin/users/:id/` | Detalhe de um usuário |
| `createUserApi` | `POST /api/auth/admin/users/` | Cria um usuário com profile |
| `updateUserApi` | `PUT /api/auth/admin/users/:id/` | Atualiza usuário (sem alterar role) |
| `listClassGroupsApi` | `GET /api/v1/admin/classes/` | Lista turmas (read-only, search, filter) |
| `getClassGroupApi` | `GET /api/v1/admin/classes/:id/` | Detalhe de turma com alunos matriculados |

## Hooks

| Hook | Descrição |
|------|-----------|
| `useAdminDashboardStats` | `useQuery` para carregar stats do dashboard |
| `useModules` | `useQuery` para lista de módulos com params |
| `useModule` | `useQuery` para detalhe de um módulo |
| `useModuleLessons` | `useQuery` para aulas de um módulo |
| `useCreateModule` | `useMutation` para criar módulo |
| `useUpdateModule` | `useMutation` para atualizar módulo |
| `useDeleteModule` | `useMutation` para excluir módulo |
| `useLesson` | `useQuery` para detalhe de uma aula |
| `useCreateLesson` | `useMutation` para criar aula |
| `useUpdateLesson` | `useMutation` para atualizar aula |
| `useDeleteLesson` | `useMutation` para excluir aula |
| `useLessonExercises` | `useQuery` para exercícios de uma aula |
| `useExercise` | `useQuery` para detalhe de um exercício |
| `useCreateExercise` | `useMutation` para criar exercício |
| `useUpdateExercise` | `useMutation` para atualizar exercício |
| `useDeleteExercise` | `useMutation` para excluir exercício |
| `useExerciseTestCases` | `useQuery` para test cases de um exercício |
| `useCreateTestCase` | `useMutation` para criar test case |
| `useUpdateTestCase` | `useMutation` para atualizar test case |
| `useDeleteTestCase` | `useMutation` para excluir test case |
| `useUsers` | `useQuery` para lista de usuários com params |
| `useUser` | `useQuery` para detalhe de um usuário |
| `useCreateUser` | `useMutation` para criar usuário |
| `useUpdateUser` | `useMutation` para atualizar usuário |
| `useClassGroups` | `useQuery` para lista de turmas com params |
| `useClassGroup` | `useQuery` para detalhe de uma turma com alunos |

## Types

| Tipo | Descrição |
|------|-----------|
| `AdminDashboardStats` | Resposta do endpoint de stats |
| `PublicationStatus` | Union type: `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `ModuleListItem` | Campos resumidos de módulo para listagem |
| `ModuleDetail` | Todos os campos de módulo para detalhe |
| `CreateModulePayload` | Payload de criação de módulo |
| `UpdateModulePayload` | Payload de atualização de módulo |
| `LessonListItem` | Campos resumidos de aula para listagem |
| `LessonDetail` | Detalhe completo de aula com vídeo nested |
| `VideoLesson` / `VideoLessonPayload` | Dados do vídeo associado à aula |
| `CreateLessonPayload` / `UpdateLessonPayload` | Payloads de criação/edição de aula |
| `ExerciseListItem` | Campos resumidos de exercício |
| `ExerciseDetail` | Detalhe completo de exercício |
| `CreateExercisePayload` / `UpdateExercisePayload` | Payloads de criação/edição de exercício |
| `TestCaseListItem` | Campos resumidos de test case |
| `TestCaseDetail` | Detalhe completo de test case |
| `CreateTestCasePayload` / `UpdateTestCasePayload` | Payloads de criação/edição de test case |
| `ListModulesParams` | Parâmetros de busca/filtro/paginação |
| `ClassStatus` | Union type: `ACTIVE`, `ARCHIVED` |
| `ClassGroupListItem` | Campos de turma para listagem (id, name, class\_status, teacher\_name, student\_count, created\_at) |
| `ListClassGroupsParams` | Parâmetros de busca/filtro/paginação de turmas |

## Dependências

- `@/shared/ui/components` — `DataTable`, `PageHeader`, `StatCard`, `StatusBadge`, `FormSection`, `ConfirmModal`, `EmptyState`
- `@/shared/http/client` — `httpClient`
- `@tanstack/react-query` — hooks de dados
- `react-hook-form` + `zod` — validação de formulários
- `lucide-react` — ícones

## Backend Correspondente

- `curriculum` app — endpoints `/api/v1/modules/`, `/api/v1/modules/:id/lessons/`, `.../exercises/`, `.../test-cases/`, `/api/v1/admin/stats/`
- `accounts` app — endpoint `/api/auth/admin/users/` (gestão de usuários)
