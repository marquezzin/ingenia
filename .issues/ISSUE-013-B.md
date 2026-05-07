# [ISSUE-013-B] Lista de Módulos + Detalhe do Módulo

## Contexto

Sub-issue de [ISSUE-013](./ISSUE-013.md) — Frontend Aluno (Fase 3).

## Descrição

Criar as telas de listagem e detalhe de módulos para o aluno.

> **Dependência**: 011-A (API leitura módulos), 011-D (progresso), 013-A (layout aluno).

### Tarefas

1. **Lista de módulos** (`/student/modules`): busca, filtros por progresso, indicadores visuais
2. **Detalhe do módulo** (`/student/modules/:id`): título, descrição, barra de progresso, lista de aulas com status, CTA "Continuar módulo"

## Critérios de Aceite

- [x] Lista de módulos publicados com progresso
- [x] Detalhe com aulas e indicadores
- [x] Navegação para aula funcional
- [x] States loading/empty/error

## Arquivos Afetados

- `frontend/src/domains/student/pages/modules/ModulesListPage.tsx`
- `frontend/src/domains/student/pages/modules/ModuleDetailPage.tsx`
- `frontend/src/domains/student/ui/LessonItem.tsx`
- `frontend/src/domains/student/ui/LessonItem.module.css`
- `frontend/src/domains/student/ui/ModulesListSkeleton.tsx`
- `frontend/src/domains/student/ui/ModuleDetailSkeleton.tsx`
- `frontend/src/domains/student/types.ts`
- `frontend/src/domains/student/api/curriculum.ts`
- `frontend/src/domains/student/hooks/useStudentModules.ts`
- `frontend/src/app/routes.tsx`
- `frontend/src/domains/student/CLAUDE.md`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-013** | `.issues/ISSUE-013.md` | Contexto completo |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Telas Aluno: Módulos |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Status atual**: Concluída
- **Atualizado em**: 2026-04-06
