# [ISSUE-015-A] Layout Professor + Dashboard

## Contexto

Sub-issue de [ISSUE-015](./ISSUE-015.md) — Frontend Professor (Fase 4).

## Descrição

Criar domain frontend `teacher` com layout e dashboard do professor.

> **Dependência**: 008-E (layout base), 008-D (TeacherRoute).

### Tarefas

1. **Criar domain `teacher`** seguindo workflow `/add-frontend-domain`
2. **Layout com sidebar**: Dashboard, Turmas, Alunos
3. **Dashboard** (`/teacher`): cards resumo (turmas, alunos, trilha iniciada, exercícios resolvidos), lista de turmas, atalhos

## Critérios de Aceite

- [ ] Domain criado
- [ ] Layout com navegação funcional
- [ ] Dashboard com cards de resumo

## Arquivos Afetados

- `frontend/src/domains/teacher/` — novo domain
- `frontend/src/domains/teacher/pages/DashboardPage.tsx`
- `frontend/src/app/routes.tsx`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-015** | `.issues/ISSUE-015.md` | Contexto completo |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Sitemap /teacher/*; Dashboard Professor |
| **Workflow** | `.agent/workflows/add-frontend-domain.md` | Como criar domain |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
