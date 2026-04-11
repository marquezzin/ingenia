# [ISSUE-013-E] Painel de Resultado + Histórico de Tentativas

## Contexto

Sub-issue de [ISSUE-013](./ISSUE-013.md) — Frontend Aluno (Fase 3).

## Descrição

Implementar o painel de resultado de submissão e histórico de tentativas no contexto do exercício.

> **Dependência**: 011-D (API histórico), 012-D (resultado), 013-D (exibido no exercício).

### Tarefas

1. **Painel de resultado**: states loading/running/passed/failed/error com feedback pedagógico
2. **Histórico de tentativas**: últimas submissões com score e status, expandir para ver código submetido

## Critérios de Aceite

- [x] Painel de resultado com todos os states
- [x] Feedback pedagógico exibido
- [x] Histórico de tentativas recentes
- [x] Score exibido por tentativa

## Arquivos Afetados

- `frontend/src/domains/student/ui/ResultPanel.tsx`
- `frontend/src/domains/student/ui/SubmissionHistory.tsx`
- `frontend/src/domains/student/ui/SubmissionHistory.module.css`
- `frontend/src/domains/student/pages/exercises/ExercisePage.tsx`
- `frontend/src/domains/student/pages/exercises/ExercisePage.module.css`
- `frontend/src/domains/student/hooks/useExerciseHistory.ts`
- `frontend/src/domains/student/api/submissions.ts`
- `frontend/src/domains/student/types.ts`
- `frontend/src/domains/student/.context.md`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-013** | `.issues/ISSUE-013.md` | Contexto completo |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Tela Exercício — states |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-04-11
