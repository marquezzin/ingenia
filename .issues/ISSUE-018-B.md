# [ISSUE-018-B] ~~Testes de Segurança do Sandbox~~ — CANCELADA

## Status: ⚪ Cancelada

> **Motivo do cancelamento**: Com a migração para Skulpt (execução Python no browser), não há mais sandbox server-side para testar. O isolamento é garantido pelo browser sandbox nativo.

## Contexto Original

Sub-issue de [ISSUE-018](./ISSUE-018.md) — Validação Final (Fase 5).
~~Testes de segurança focados no sandbox de execução de código (tentativas de escape, fork bomb, memory exhaustion).~~

## Substituído por

- Testes de timeout e erro do Skulpt estão cobertos em [ISSUE-012-E](./ISSUE-012-E.md) e [ISSUE-012-F](./ISSUE-012-F.md)
- Browser sandbox nativo não requer testes de segurança customizados

## Status

- **Prioridade**: —
- **Tipo**: chore
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-26
- **Cancelado em**: 2026-03-26
