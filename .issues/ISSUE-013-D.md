# [ISSUE-013-D] Tela de Exercício com Editor de Código (Monaco) + Submissão

## Contexto

Sub-issue de [ISSUE-013](./ISSUE-013.md) — Frontend Aluno (Fase 3).
Tela mais complexa do frontend: editor de código integrado com submissão e feedback.

## Descrição

Criar a tela de exercício com editor de código Monaco, submissão e painel de resultado.

> **Dependência**: 011-B (API submissão), 012-D (SubmissionResult), 013-C (navegação vem da aula).

### Tarefas

1. **Tela de exercício** (`/student/modules/:id/lessons/:id/exercises/:id`):
   - Enunciado do exercício
   - **Editor de código** (Monaco Editor — `@monaco-editor/react`)
   - Botões: "Submeter código", "Limpar editor"
   - Confirmação antes de limpar editor

2. **Fluxo de submissão**:
   - Ao clicar submeter → loading state
   - Polling ou WebSocket para resultado (fallback: polling)
   - Exibir resultado: passed/failed com feedback

## Critérios de Aceite

- [ ] Editor de código funcional (Monaco)
- [ ] Submissão de código integrada com API
- [ ] Loading state durante avaliação
- [ ] Resultado exibido: passed/failed + feedback
- [ ] Confirmação antes de limpar editor

## Arquivos Afetados

- `frontend/src/domains/student/pages/exercises/ExercisePage.tsx`
- `frontend/src/domains/student/components/CodeEditor.tsx`
- `frontend/src/domains/student/components/ResultPanel.tsx`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-013** | `.issues/ISSUE-013.md` | Monaco Editor decision |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Tela Exercício |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-003 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
