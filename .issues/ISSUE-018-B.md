# [ISSUE-018-B] Testes de Segurança do Sandbox

## Contexto

Sub-issue de [ISSUE-018](./ISSUE-018.md) — Validação Final (Fase 5).

## Descrição

Testes de segurança focados no sandbox de execução de código.

> **Dependência**: 016-C (sandbox hardened).

### Tarefas

1. Tentativa de acesso a arquivos do host
2. Tentativa de acesso à rede
3. Fork bomb / memory exhaustion
4. Timeout enforcement

## Critérios de Aceite

- [ ] Todas tentativas de escape bloqueadas
- [ ] Fork bomb contido
- [ ] Memory exhaustion contido
- [ ] Timeout enforced

## Arquivos Afetados

- `backend/src/submissions/tests/test_sandbox_security.py`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-018** | `.issues/ISSUE-018.md` | Contexto completo |
| **Spec** | `docs/requirements/ingenia-documents/discover/spec.md` | Security §9 |

## Status

- **Prioridade**: alta
- **Tipo**: chore
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
