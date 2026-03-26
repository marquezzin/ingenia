# [ISSUE-013-D] Tela de Exercício com Editor de Código + Motor Skulpt + Submissão

## Contexto

Sub-issue de [ISSUE-013](./ISSUE-013.md) — Frontend Aluno (Fase 3).
Tela mais complexa do frontend: editor de código integrado com **execução Python via Skulpt** e submissão.

## Descrição

Criar a tela de exercício com editor de código Monaco, motor de correção Skulpt (avaliação local) e painel de resultado com feedback instantâneo.

> **Dependência**: 011-B (API submissão), 012-C (avaliação Skulpt), 012-D (resultado + feedback), 012-E (tratamento de erros), 013-C (navegação vem da aula).

### Tarefas

1. **Tela de exercício** (`/student/modules/:id/lessons/:id/exercises/:id`):
   - Enunciado do exercício
   - **Editor de código** (Monaco Editor — `@monaco-editor/react`)
   - Botões: "Executar/Testar código", "Submeter solução", "Limpar editor"
   - Confirmação antes de limpar editor

2. **Fluxo de execução/teste (via Skulpt)**:
   - Ao clicar "Executar" → executa código via Skulpt no browser
   - Usa `useCodeExecution()` hook (012-C)
   - Avalia todos os test cases localmente
   - **Feedback instantâneo** — sem esperar servidor

3. **Fluxo de submissão**:
   - Ao clicar "Submeter" → executa avaliação + envia resultado ao backend
   - Persiste resultado via POST `/api/v1/student/submissions/`
   - Exibe resultado final: passed/failed + feedback pedagógico

4. **Painel de resultado**:
   - Score visual (barra de progresso ou indicador)
   - Lista de test cases com PASSED/FAILED por test case
   - Feedback pedagógico (mensagem da 012-D)
   - Erros de execução formatados (012-E)

5. **Console de output**:
   - Exibir stdout/stderr do Skulpt
   - Exibir erros de sintaxe com número da linha

## Critérios de Aceite

- [ ] Editor de código funcional (Monaco) com syntax highlighting Python
- [ ] Código executado via Skulpt no browser
- [ ] Resultado exibido instantaneamente (sem waiting para servidor)
- [ ] Resultado: passed/failed + score + feedback por test case
- [ ] Submissão persiste resultado no backend
- [ ] Erros de sintaxe/runtime exibidos de forma amigável
- [ ] Confirmação antes de limpar editor

## Arquivos Afetados

- `frontend/src/domains/student/pages/exercises/ExercisePage.tsx`
- `frontend/src/domains/student/components/CodeEditor.tsx`
- `frontend/src/domains/student/components/ResultPanel.tsx`
- `frontend/src/domains/student/components/OutputConsole.tsx`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-013** | `.issues/ISSUE-013.md` | Monaco Editor decision |
| **ISSUE-012** | `.issues/ISSUE-012.md` | Arquitetura Skulpt |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Tela Exercício |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-003 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-26
