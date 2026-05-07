# [ISSUE-002] App `classes` — Models de Turmas e Matrículas

## Contexto

Fase 0 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Fundação.
Criar o app `classes` com os models de turma (`ClassGroup`) e matrícula (`ClassEnrollment`) que sustentam o agrupamento pedagógico.

## Descrição

Criar um novo app Django `classes` contendo os models de turma e matrícula, com seus enums e constraints.

> **Dependência**: ISSUE-001 (precisa do `TeacherProfile` e `StudentProfile`).

### Tarefas

1. **Criar app Django `classes`** seguindo o workflow `/add-backend-app`.

2. **Criar enums**:
   - `ClassStatus`: `ACTIVE`, `ARCHIVED`
   - `EnrollmentStatus`: `ACTIVE`, `REMOVED`

3. **Criar model `ClassGroup`**:
   - `teacher_profile` (FK → TeacherProfile)
   - `name` (String, required)
   - `description` (Text, nullable)
   - `class_status` (ClassStatus, default=ACTIVE)
   - Unique: `(teacher_profile_id, name)`
   - Index: `teacher_profile_id`, `class_status`

4. **Criar model `ClassEnrollment`**:
   - `class_group` (FK → ClassGroup)
   - `student_profile` (FK → StudentProfile)
   - `enrolled_at` (DateTime, required)
   - `enrollment_status` (EnrollmentStatus, default=ACTIVE)
   - Unique: `(class_group_id, student_profile_id)`
   - Index: `student_profile_id`, `enrollment_status`

5. **Gerar migrations** e verificar execução.

## Critérios de Aceite

- [x] App `classes` criado seguindo padrão do projeto
- [x] Enums `ClassStatus` e `EnrollmentStatus` implementados
- [x] Model `ClassGroup` com todos os campos, constraints e indexes
- [x] Model `ClassEnrollment` com todos os campos, constraints e indexes
- [x] BR-004: Apenas professores podem ser responsáveis por turmas (FK → TeacherProfile)
- [x] BR-005: Aluno não pode ter mais de uma matrícula ativa na mesma turma (unique constraint)
- [x] Migrations geradas e executando sem erro

## Arquivos Afetados

- `backend/src/classes/` — novo app Django completo
- `backend/src/classes/models.py` — ClassGroup, ClassEnrollment
- `backend/src/classes/enums.py` — ClassStatus, EnrollmentStatus
- `backend/src/config/settings/base.py` — registrar app em INSTALLED_APPS

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 0", app `classes` |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Entities: ClassGroup, ClassEnrollment; Relationships §2; Enums §4; Business Rules BR-004, BR-005 |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | Protected Resources: Class, ClassMembership |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-005 (Professor cria turma) |
| **Backend Architecture** | `docs/backend/02-apps-pattern.md` | Padrão de apps Django |
| **Workflow** | `.claude/commands/add-backend-app.md` | Como criar novo app Django |

### Regras de Negócio Aplicáveis
- **BR-004**: Apenas professores podem ser responsáveis por turmas.
- **BR-005**: Aluno não pode ter mais de uma matrícula ativa na mesma turma.

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-15
