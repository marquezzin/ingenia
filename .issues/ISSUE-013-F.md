# [ISSUE-013-F] Tela de Progresso + Histórico de Submissões

## Contexto

Sub-issue de [ISSUE-013](./ISSUE-013.md) — Frontend Aluno (Fase 3).

## Descrição

Criar telas de acompanhamento de progresso consolidado e histórico geral de submissões do aluno.

> **Dependência**: 011-D (API progresso + histórico), 013-A (navegação do aluno).

### Tarefas

1. **Tela de progresso** (`/student/progress`): resumo geral, módulos com percentual, indicadores de exercícios
2. **Tela de histórico** (`/student/submissions`): tabela com filtros por módulo/aula/exercício/status, detalhe do feedback

## Critérios de Aceite

- [ ] Progresso consolidado exibido
- [ ] Histórico com filtros funcionais
- [ ] Detalhe do feedback acessível

## Arquivos Afetados

- `frontend/src/domains/student/pages/ProgressPage.tsx`
- `frontend/src/domains/student/pages/SubmissionsPage.tsx`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-013** | `.issues/ISSUE-013.md` | Contexto completo |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Telas: Progresso, Submissões |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-004 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
