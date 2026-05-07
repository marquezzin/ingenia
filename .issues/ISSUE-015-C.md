# [ISSUE-015-C] Lista Consolidada de Alunos + Progresso Individual

## Contexto

Sub-issue de [ISSUE-015](./ISSUE-015.md) — Frontend Professor (Fase 4).

## Descrição

Telas de acompanhamento de alunos e progresso individual.

> **Dependência**: 014-C (API progresso turma), 015-B (navegação vem da turma).

### Tarefas

1. **Lista de alunos** (`/teacher/students`): tabela com filtros por turma e progresso
2. **Progresso individual** (`/teacher/classes/:id/students/:id`): cabeçalho, progresso por módulo/aula, exercícios com score

## Critérios de Aceite

- [x] Lista consolidada com filtros
- [x] Progresso individual detalhado
- [x] Estado vazio para turma sem alunos (edge case)

## Arquivos Afetados

- `frontend/src/domains/teacher/pages/students/StudentListPage.tsx` — **[NEW]**
- `frontend/src/domains/teacher/pages/students/StudentProgressPage.tsx` — **[NEW]**
- `frontend/src/domains/teacher/pages/classes/ClassDetailPage.tsx` — Linhas de alunos clicáveis
- `frontend/src/app/routes.tsx` — Rotas `/teacher/students` e `/teacher/classes/:classId/students/:studentId`
- `frontend/src/domains/teacher/CLAUDE.md` — Atualizado com novas páginas

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-015** | `.issues/ISSUE-015.md` | Edge cases; Contexto completo |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-006 |

### Decisões técnicas

- **StudentListPage** usa `useQueries` do TanStack Query para buscar progresso de todas as turmas em paralelo, em vez de criar um endpoint novo de listagem consolidada.
- **ClassDetailPage** agora tem linhas clicáveis que levam ao progresso individual (J-006 journey).
- Ambas as páginas tratam corretamente os estados Loading, Empty, Error e Success.

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-04-12
