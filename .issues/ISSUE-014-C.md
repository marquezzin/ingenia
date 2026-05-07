# [ISSUE-014-C] Progresso Coletivo + Individual do Aluno na Turma

## Contexto

Sub-issue de [ISSUE-014](./ISSUE-014.md) — Backend Professor (Fase 4).

## Descrição

Implementar endpoints de consulta de progresso coletivo da turma e individual dos alunos.

> **Dependência**: ISSUE-005 (progress models), 011-C (progresso sendo rastreado), 014-A (turma), 014-B (alunos na turma).

### Tarefas

1. **Progresso coletivo**: `GET /api/v1/teacher/classes/:id/progress/` — agregado
2. **Progresso individual**: `GET /api/v1/teacher/classes/:id/students/:id/progress/` — detalhado
3. **BR-016**: Professor vê apenas alunos das suas turmas

## Critérios de Aceite

- [x] Progresso coletivo com indicadores agregados
- [x] Progresso individual detalhado por módulo/aula/exercício
- [x] BR-016: Acesso restrito às próprias turmas

## Arquivos Afetados

- `backend/src/progress/selectors.py` — `list_student_progress_summaries_for_class`, `get_student_detail_progress`
- `backend/src/progress/serializers.py` — `ClassProgressSerializer`, `StudentDetailProgressSerializer`, etc.
- `backend/src/progress/views.py` — `TeacherClassProgressView`, `TeacherStudentProgressView`
- `backend/src/classes/urls.py` — Rotas teacher progress
- `backend/src/progress/tests/test_teacher_progress_api.py` — 20+ testes
- `backend/src/progress/CLAUDE.md` — Atualizado
- `backend/src/classes/CLAUDE.md` — Atualizado

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-014** | `.issues/ISSUE-014.md` | Contexto completo |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | BR-016 |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-006 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-04-11

