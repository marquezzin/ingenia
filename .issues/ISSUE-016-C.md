# [ISSUE-016-C] ~~Hardening do Sandbox~~ — CANCELADA

## Status: ⚪ Cancelada

> **Motivo do cancelamento**: Com a migração para Skulpt (execução Python no browser), não há mais sandbox server-side (subprocess/Docker) para endurecer. O código do aluno é executado inteiramente no browser pelo Skulpt, que roda dentro do sandbox nativo do browser.

## Contexto Original

Sub-issue de [ISSUE-016](./ISSUE-016.md) — Segurança (Fase 5).
~~Hardening do sandbox de execução de código (rede, disco, CPU, memória).~~

## Substituído por

- O isolamento é garantido pelo **browser sandbox nativo** — Skulpt roda em JS sem acesso a sistema de arquivos, rede ou OS
- O Skulpt não implementa módulos perigosos (`os`, `sys`, `subprocess`)
- Timeout configurável no frontend previne loops infinitos

## Status

- **Prioridade**: —
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-26
- **Cancelado em**: 2026-03-26
