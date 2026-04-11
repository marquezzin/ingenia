# App: classes

## Propósito
Agrupamento pedagógico de alunos em turmas gerenciadas por professores. Suporta criação de turmas e matrículas.

## Models
- **`ClassGroup`** — Turma vinculada a um professor. Campos: `teacher_profile` (FK → TeacherProfile), `name`, `description` (null), `class_status`. Unique: `(teacher_profile, name)`
- **`ClassEnrollment`** — Vínculo aluno ↔ turma. Campos: `class_group` (FK), `student_profile` (FK), `enrolled_at`, `enrollment_status`. Unique: `(class_group, student_profile)`

## Enums (`enums.py`)
- **`ClassStatus`**: ACTIVE, ARCHIVED
- **`EnrollmentStatus`**: ACTIVE, REMOVED

## Regras de Negócio
- **BR-004**: Apenas professores podem ser responsáveis por turmas (FK → TeacherProfile)
- **BR-005**: Aluno não pode ter mais de uma matrícula ativa na mesma turma (validação no UseCase)

## Endpoints
- `GET /api/v1/admin/classes/` — Lista de turmas (admin read-only, filtro por `class_status`, busca por `name`)
- `GET /api/v1/admin/classes/:id/` — Detalhe de turma (admin read-only)
- `GET /api/v1/teacher/classes/` — Lista turmas do professor autenticado (filtro por `class_status`, busca por `name`)
- `POST /api/v1/teacher/classes/` — Criar turma (professor)
- `GET /api/v1/teacher/classes/:id/` — Detalhe de turma com alunos (professor, BR-004)
- `PUT /api/v1/teacher/classes/:id/` — Editar turma (professor, BR-004)
- `GET /api/v1/teacher/classes/:id/enrollments/` — Listar alunos da turma (professor, BR-004)
- `POST /api/v1/teacher/classes/:id/enrollments/` — Associar aluno à turma (professor, BR-004, BR-005)
- `DELETE /api/v1/teacher/classes/:id/enrollments/:id/` — Remover aluno da turma (professor, BR-004, soft-delete)
- `GET /api/v1/teacher/classes/:id/progress/` — Progresso coletivo da turma: total alunos, iniciaram, concluíram, lista de alunos com módulos/exercícios concluídos (professor, BR-016)
- `GET /api/v1/teacher/classes/:id/students/:id/progress/` — Progresso individual detalhado: módulos → aulas → exercícios (professor, BR-016)

## Selectors (`selectors.py`)
- `list_class_groups()` — QuerySet com `select_related("teacher_profile__user")` e anotação `student_count` (matrículas ativas)
- `get_class_group_by_id()` — Retorna turma pelo ID com professor
- `list_class_groups_for_teacher()` — QuerySet filtrado por `teacher_profile_id` com `student_count`
- `get_class_group_for_teacher()` — Retorna turma do professor específico com `student_count`
- `list_enrollments_for_class_group()` — QuerySet de matrículas de uma turma
- `get_enrollment_for_class_group()` — Retorna uma matrícula específica de uma turma

## Serializers (`serializers.py`)
- `ClassGroupListSerializer` — Campos: `id`, `name`, `class_status`, `teacher_name`, `student_count`, `created_at`
- `ClassGroupDetailSerializer` — Campos de detalhe com `teacher_name`, `teacher_email`, `students`
- `EnrolledStudentSerializer` — Campos: `id`, `student_name`, `student_email`, `enrollment_status`, `enrolled_at`
- `ClassGroupCreateUpdateSerializer` — Campos de escrita: `name`, `description`, `class_status`
- `TeacherClassGroupDetailSerializer` — Detalhe para professor: `id`, `name`, `description`, `class_status`, `student_count`, `students`, `created_at`, `updated_at`
- `EnrollStudentSerializer` — Escrita para associar aluno: `student_profile_id`

## Services
### `services/class_group.py`
- `CreateClassGroupUseCase` — Cria turma vinculada ao professor (valida nome duplicado)
- `UpdateClassGroupUseCase` — Edita turma (verifica propriedade BR-004, valida nome duplicado)

### `services/enrollment.py`
- `EnrollStudentUseCase` — Associa aluno à turma (BR-004 propriedade, BR-005 duplicata, reativação de matrícula removida)
- `RemoveStudentUseCase` — Remove aluno da turma (soft-delete via status REMOVED, BR-004 propriedade)

## Testes
- `tests/factories.py` — `ClassGroupFactory`, `ClassEnrollmentFactory`
- `tests/test_class_group_admin.py` — Testes de listagem, filtros, permissões (admin)
- `tests/test_class_group_teacher.py` — Testes CRUD professor: list, create, retrieve, update, permissões (BR-004)
- `tests/test_enrollment_teacher.py` — Testes enrollment: list, create, delete, BR-004, BR-005, reativação, permissões

## Dependências
- `accounts` (TeacherProfile, StudentProfile)
- `progress` (TeacherClassProgressView, TeacherStudentProgressView — registradas nas URLs de classes)
- Usado por: ISSUE-010-E (visão de turmas admin), ISSUE-014 (CRUD professor), ISSUE-015 (frontend professor)

## Frontend Correspondente
- Domain: `frontend/src/domains/admin/` (página `/admin/classes` — read-only)
- Domain: `frontend/src/domains/teacher/` (futuro — ISSUE-015)
