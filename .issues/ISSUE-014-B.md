# [ISSUE-014-B] CRUD ClassEnrollment — Associar/Remover Alunos

## Contexto

Sub-issue de [ISSUE-014](./ISSUE-014.md) — Backend Professor (Fase 4).

## Descrição

Implementar a gestão de alunos na turma: associar e remover.

> **Dependência**: ISSUE-002 (ClassEnrollment), ISSUE-001 (StudentProfile), 014-A (turma precisa existir).

### Tarefas

1. **Endpoints de enrollment**:
   - `GET /api/v1/teacher/classes/:id/enrollments/` — listar alunos
   - `POST /api/v1/teacher/classes/:id/enrollments/` — associar aluno
   - `DELETE /api/v1/teacher/classes/:id/enrollments/:id/` — remover aluno
   - BR-005: Sem matrícula duplicada

## Critérios de Aceite

- [x] Associar aluno à turma
- [x] Remover aluno da turma
- [x] BR-005: Matrícula duplicada impedida
- [x] Professor só gerencia alunos das próprias turmas

## Arquivos Afetados

- `backend/src/classes/serializers.py` — EnrollStudentSerializer
- `backend/src/classes/services/enrollment.py` — EnrollStudentUseCase, RemoveStudentUseCase
- `backend/src/classes/views.py` — ClassEnrollmentTeacherViewSet
- `backend/src/classes/selectors.py` — get_enrollment_for_class_group
- `backend/src/classes/urls.py` — nested enrollment routes
- `backend/src/classes/tests/test_enrollment_teacher.py` — 15 testes
- `backend/src/classes/.context.md` — Atualizado

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-014** | `.issues/ISSUE-014.md` | Contexto completo |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | BR-005 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-04-11
