# [ISSUE-012-E] Tratamento de Erros e Timeout

## Contexto

Sub-issue de [ISSUE-012](./ISSUE-012.md) — Motor de Correção (Fase 3).
Implementar tratamento robusto de erros e timeout no motor de correção.

## Descrição

Garantir que o motor de correção lida graciosamente com timeout, erros de execução e falhas técnicas.

> **Dependência**: 012-B (sandbox), 012-C (avaliação).

### Tarefas

1. **Tratamento de timeout**:
   - Sandbox excedeu tempo → resultado `ERROR`
   - Mensagem amigável: "Seu código excedeu o tempo limite. Verifique se não há loops infinitos."

2. **Tratamento de erros de execução**:
   - Erro de sintaxe → capturar mensagem do stderr
   - Runtime error → capturar mensagem simplificada
   - Mensagem amigável sem expor internals do sistema

3. **Tratamento de falhas técnicas**:
   - Falha do sandbox → `evaluation_status = FAILED`
   - Log do erro para debugging
   - Mensagem: "Erro técnico na avaliação. Tente novamente."

## Critérios de Aceite

- [ ] Timeout → resultado ERROR com mensagem amigável
- [ ] Erro de sintaxe → capturado e reportado
- [ ] Runtime error → capturado e reportado
- [ ] Falha técnica → status FAILED + mensagem genérica
- [ ] Nenhum erro interno exposto ao aluno

## Arquivos Afetados

- `backend/src/submissions/services/sandbox.py` — tratamento no sandbox
- `backend/src/submissions/services/evaluation.py` — tratamento na avaliação
- `backend/src/submissions/tasks.py` — error handling na task

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-012** | `.issues/ISSUE-012.md` | Contexto completo |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-003 Expected Errors |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
