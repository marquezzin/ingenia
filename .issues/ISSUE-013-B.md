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

- [ ] Lista de módulos publicados com progresso
- [ ] Detalhe com aulas e indicadores
- [ ] Navegação para aula funcional
- [ ] States loading/empty/error

## Arquivos Afetados

- `frontend/src/domains/student/pages/modules/`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-013** | `.issues/ISSUE-013.md` | Contexto completo |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Telas Aluno: Módulos |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
