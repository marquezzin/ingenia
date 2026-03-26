# [ISSUE-012-B] ~~Executor de Sandbox~~ — CANCELADA

## Status: ⚪ Cancelada

> **Motivo do cancelamento**: Com a migração para Skulpt (execução Python no browser), não há mais necessidade de sandbox server-side (subprocess/Docker). O código do aluno é executado inteiramente no browser pelo Skulpt, que roda dentro do sandbox nativo do browser.

## Contexto Original

Sub-issue de [ISSUE-012](./ISSUE-012.md) — Motor de Correção (Fase 3).
~~Implementar o executor de sandbox que roda código em ambiente isolado e seguro.~~

## Substituído por

- A execução de código agora é feita pelo **Skulpt** no frontend (ver [ISSUE-013-D](./ISSUE-013-D.md))
- O isolamento é garantido pelo **browser sandbox nativo**

## Status

- **Prioridade**: —
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-26
- **Cancelado em**: 2026-03-26
