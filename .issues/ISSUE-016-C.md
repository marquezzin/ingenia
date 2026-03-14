# [ISSUE-016-C] Hardening do Sandbox — Rede, Disco, CPU, Memória

## Contexto

Sub-issue de [ISSUE-016](./ISSUE-016.md) — Segurança (Fase 5).

## Descrição

Hardening do sandbox de execução de código.

> **Dependência**: 012-B (sandbox implementado).

### Tarefas

1. Garantir isolamento de rede
2. Garantir isolamento de disco
3. Limitar CPU e memória do container
4. Testes de tentativas de escape

## Critérios de Aceite

- [ ] Sem acesso à rede do host
- [ ] Sem acesso ao disco do host
- [ ] Limites de CPU/memória configurados
- [ ] Testes de segurança passando

## Arquivos Afetados

- `backend/src/submissions/services/sandbox.py`
- `docker/` — config do container sandbox

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-016** | `.issues/ISSUE-016.md` | Contexto completo |
| **Spec** | `docs/requirements/ingenia-documents/discover/spec.md` | Security §9 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
