# [ISSUE-015-B] CRUD de Turmas — Lista, Nova, Detalhe, Editar

## Contexto

Sub-issue de [ISSUE-015](./ISSUE-015.md) — Frontend Professor (Fase 4).

## Descrição

Telas de gestão de turmas do professor.

> **Dependência**: 014-A (API turmas), 014-B (API enrollment), 015-A (layout).

### Tarefas

1. Lista de turmas com busca e indicadores
2. Nova turma com formulário e busca de alunos
3. Detalhe da turma com tabela de alunos e indicadores de progresso
4. Editar turma: alterar nome e composição

## Critérios de Aceite

- [x] Lista, criar, detalhe, editar turmas
- [x] Seleção de alunos funcional
- [x] Indicadores de progresso por aluno na turma

## Arquivos Afetados

- `frontend/src/domains/teacher/pages/classes/ClassListPage.tsx`
- `frontend/src/domains/teacher/pages/classes/ClassCreatePage.tsx`
- `frontend/src/domains/teacher/pages/classes/ClassDetailPage.tsx`
- `frontend/src/domains/teacher/pages/classes/ClassEditPage.tsx`
- `frontend/src/domains/teacher/api.ts`
- `frontend/src/domains/teacher/types.ts`
- `frontend/src/domains/teacher/hooks.ts`
- `frontend/src/app/routes.tsx`
- `backend/src/accounts/selectors.py`
- `backend/src/classes/serializers.py`
- `backend/src/classes/views.py`
- `backend/src/classes/urls.py`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-015** | `.issues/ISSUE-015.md` | Contexto completo |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Telas Professor: Turmas |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-005 |

### Decisão técnica: Endpoint de busca de alunos
O endpoint admin `/api/auth/admin/users/` exige `IsAdmin`, então foi criado um endpoint leve `GET /api/v1/teacher/students/search/` com permissão `IsTeacher` para que o professor possa buscar alunos para matrícula.

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-04-12
