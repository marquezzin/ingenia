# [ISSUE-018-C] Testes de Performance do Motor de Correção

## Contexto

Sub-issue de [ISSUE-018](./ISSUE-018.md) — Validação Final (Fase 5).

## Descrição

Testes de performance do motor de correção automática.

> **Dependência**: 012-F (motor testado), 016-A (rate limiting).

### Tarefas

1. Tempo médio de avaliação de uma submissão
2. Comportamento sob carga (10 submissões simultâneas)
3. Timeout handling sob carga

## Critérios de Aceite

- [ ] Avaliação < 30s para submissão típica
- [ ] Estável com 10 submissões simultâneas
- [ ] Timeout handled corretamente sob carga

## Arquivos Afetados

- `backend/src/submissions/tests/test_performance.py`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-018** | `.issues/ISSUE-018.md` | Contexto completo |
| **Spec** | `docs/requirements/ingenia-documents/discover/spec.md` | Non-Functional §8 |

## Status

- **Prioridade**: alta
- **Tipo**: chore
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
