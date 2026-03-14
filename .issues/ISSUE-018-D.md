# [ISSUE-018-D] Revisão Completa da Matriz de Autorização

## Contexto

Sub-issue de [ISSUE-018](./ISSUE-018.md) — Validação Final (Fase 5).

## Descrição

Testar cada combinação role × resource × action da matriz de autorização.

> **Dependência**: 007-C (permissions), 009-F, 011-E, 014-D (todos backends testados).

### Tarefas

1. Testar cada combinação da authorization matrix
2. Verificar aluno não acessa admin/teacher
3. Verificar professor não acessa fora do escopo
4. Verificar account_status != ACTIVE bloqueia acesso

## Critérios de Aceite

- [ ] Matriz completa verificada
- [ ] Nenhum acesso indevido
- [ ] Contas inativas bloqueadas
- [ ] Cross-role access negado

## Arquivos Afetados

- `backend/src/*/tests/` — testes adicionais de autorização

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-018** | `.issues/ISSUE-018.md` | Contexto completo |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | Matrix §3 COMPLETA; Special Rules §4 |

## Status

- **Prioridade**: alta
- **Tipo**: chore
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
