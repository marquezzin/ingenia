# [ISSUE-012-E] Tratamento de Erros e Timeout no Frontend (Skulpt)

## Contexto

Sub-issue de [ISSUE-012](./ISSUE-012.md) — Motor de Correção Skulpt (Fase 3).
Implementar tratamento de erros e timeout no frontend para a execução de código via Skulpt.

## Descrição

Garantir que o motor Skulpt no frontend lida com timeout, erros de sintaxe, runtime errors e erros inesperados de forma amigável.

> **Dependência**: 012-C (avaliação Skulpt).

### Tarefas

1. **Tratamento de timeout**:
   - Skulpt excedeu tempo (default 10s) → resultado `ERROR`
   - Mensagem: "Seu código excedeu o tempo limite. Verifique se não há loops infinitos."
   - Implementar via `setTimeout` + cancelamento de execução Skulpt

2. **Tratamento de erros de sintaxe**:
   - Skulpt levanta `Sk.builtin.SyntaxError` → capturar
   - Extrair número da linha e mensagem
   - Mensagem amigável: "Erro de sintaxe na linha X: [mensagem]"

3. **Tratamento de runtime errors**:
   - `NameError`, `TypeError`, `IndexError`, etc.
   - Extrair mensagem do Skulpt e simplificar
   - Mensagem: "Erro durante a execução: [mensagem simplificada]"

4. **Tratamento de erros inesperados**:
   - Falha do Skulpt → resultado `ERROR`
   - Mensagem: "Erro técnico na avaliação. Tente novamente."

## Critérios de Aceite

- [ ] Timeout → resultado ERROR com mensagem amigável
- [ ] Erro de sintaxe → capturado com número da linha
- [ ] Runtime error → capturado e simplificado
- [ ] Erro inesperado → mensagem genérica sem expor internals
- [ ] Nenhum erro interno do Skulpt exposto ao aluno

## Arquivos Afetados

- `frontend/src/domains/student/services/skulptRunner.ts` — timeout e captura de erros
- `frontend/src/domains/student/services/errorHandler.ts` — formatação de mensagens de erro

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-012** | `.issues/ISSUE-012.md` | Contexto completo |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-003 Expected Errors |

### Decisões Técnicas
- Timeout via `Sk.execLimit` (configuração nativa do Skulpt) ou fallback com `setTimeout`
- Erros do Skulpt estão em `Sk.builtin.*Error` — mapear para mensagens pedagógicas
- Nunca mostrar stack trace JavaScript ao aluno

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-26
