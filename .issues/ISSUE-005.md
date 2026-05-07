# [ISSUE-005] App `progress` — Models de Progresso do Aluno

## Contexto

Fase 0 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Fundação.
Criar o app `progress` com os models de acompanhamento do progresso do aluno por módulo, aula e exercício.

## Descrição

Criar um novo app Django `progress` contendo os models de progresso acadêmico.

> **Dependência**: ISSUE-001 (`StudentProfile`), ISSUE-003 (`Module`, `Lesson`, `Exercise`).

### Tarefas

1. **Criar app Django `progress`** seguindo o workflow `/add-backend-app`.

2. **Criar enum**:
   - `ProgressStatus`: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`

3. **Criar model `StudentModuleProgress`**:
   - `student_profile` (FK → StudentProfile)
   - `module` (FK → Module)
   - `progress_status` (ProgressStatus, default=NOT_STARTED)
   - `started_at` (DateTime, nullable)
   - `completed_at` (DateTime, nullable)
   - Unique: `(student_profile_id, module_id)`
   - Index: `module_id`, `progress_status`

4. **Criar model `StudentLessonProgress`**:
   - `student_profile` (FK → StudentProfile)
   - `lesson` (FK → Lesson)
   - `progress_status` (ProgressStatus, default=NOT_STARTED)
   - `started_at` (DateTime, nullable)
   - `completed_at` (DateTime, nullable)
   - Unique: `(student_profile_id, lesson_id)`
   - Index: `lesson_id`, `progress_status`

5. **Criar model `StudentExerciseProgress`**:
   - `student_profile` (FK → StudentProfile)
   - `exercise` (FK → Exercise)
   - `progress_status` (ProgressStatus, default=NOT_STARTED)
   - `attempts_count` (Integer, required, default=0)
   - `first_attempt_at` (DateTime, nullable)
   - `completed_at` (DateTime, nullable)
   - Unique: `(student_profile_id, exercise_id)`
   - Index: `exercise_id`, `progress_status`

6. **Gerar migrations** e verificar execução.

## Critérios de Aceite

- [x] App `progress` criado seguindo padrão do projeto
- [x] Enum `ProgressStatus` implementado
- [x] Models `StudentModuleProgress`, `StudentLessonProgress`, `StudentExerciseProgress` criados
- [x] Unique constraints conforme domain model
- [x] Invariant: `completed_at` preenchido → `progress_status = COMPLETED`
- [x] Invariant: `progress_status = NOT_STARTED` → `started_at` e `completed_at` vazios
- [x] Invariant: `attempts_count >= 0`
- [x] Migrations geradas e executando sem erro

## Arquivos Afetados

- `backend/src/progress/` — novo app Django completo
- `backend/src/progress/models.py` — StudentModuleProgress, StudentLessonProgress, StudentExerciseProgress
- `backend/src/progress/enums.py` — ProgressStatus
- `backend/src/config/settings/base.py` — registrar app em INSTALLED_APPS

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 0", app `progress` |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Entities: StudentModuleProgress, StudentLessonProgress, StudentExerciseProgress; Enums §4 (ProgressStatus); Business Rules BR-014, BR-015, BR-020; Invariants §5 |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-004 (Aluno acompanha progresso) |
| **Backend Architecture** | `docs/backend/02-apps-pattern.md` | Padrão de apps Django |
| **Workflow** | `.claude/commands/add-backend-app.md` | Como criar novo app Django |

### Regras de Negócio Aplicáveis
- **BR-014**: Progresso de exercício marcado como concluído apenas com submissão aprovada.
- **BR-015**: Módulo concluído quando todas aulas e exercícios concluídos.
- **BR-020**: `attempts_count` reflete número de submissões do aluno.

> **Nota**: A lógica de atualização automática de progresso será implementada na ISSUE-011 (Fase 3). Nesta issue, foco apenas nos models/migrations.

## Status

- **Status**: Concluída
- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-16
