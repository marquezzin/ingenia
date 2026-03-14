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

- [ ] Lista consolidada com filtros
- [ ] Progresso individual detalhado
- [ ] Estado vazio para turma sem alunos (edge case)

## Arquivos Afetados

- `frontend/src/domains/teacher/pages/students/`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-015** | `.issues/ISSUE-015.md` | Edge cases; Contexto completo |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-006 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
