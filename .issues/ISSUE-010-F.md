# [ISSUE-010-F] Testes E2E — Fluxos J-007 e J-008

## Contexto

Sub-issue de [ISSUE-010](./ISSUE-010.md) — Frontend Admin (Fase 2).
Cobertura E2E dos fluxos administradores com Playwright.

## Descrição

Criar testes end-to-end cobrindo os fluxos de criação de conteúdo e gestão de usuários.

> **Dependência**: 009-F (backend testado), 010-B, 010-C, 010-D (telas implementadas).

### Tarefas

1. **J-007 — Admin cria módulo com aula e exercício**:
   - Login como admin
   - Criar módulo → criar aula com vídeo → criar exercício com test cases
   - Publicar exercício → publicar aula → publicar módulo
   - Verificar validações BR-008 e BR-010

2. **J-008 — Admin gerencia usuários**:
   - Login como admin
   - Criar usuário por role
   - Editar status da conta
   - Verificar filtros e busca

## Critérios de Aceite

- [ ] Testes E2E de J-007 passando
- [ ] Testes E2E de J-008 passando
- [ ] Todos os testes executando no Playwright

## Arquivos Afetados

- `frontend/src/domains/admin/e2e/modules.spec.ts`
- `frontend/src/domains/admin/e2e/users.spec.ts`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-010** | `.issues/ISSUE-010.md` | Contexto completo |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-007, J-008 steps |
| **Frontend Testing** | `docs/frontend/04-testing.md` | Padrão E2E |

## Status

- **Prioridade**: alta
- **Tipo**: chore
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
