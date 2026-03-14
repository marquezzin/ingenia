# [ISSUE-008-F] Testes E2E de Login e Registro

## Contexto

Sub-issue de [ISSUE-008](./ISSUE-008.md) — Frontend Auth (Fase 1).
Cobertura E2E dos fluxos de login e registro com Playwright.

## Descrição

Criar testes end-to-end cobrindo os fluxos de autenticação implementados.

> **Dependência**: 007-E (backend testado), 008-A, 008-B, 008-D, 008-E (frontend de auth completo).

### Tarefas

1. **Testes de login (J-001)**:
   - Login com credenciais válidas → redirecionado por role
   - Login com credenciais inválidas → mensagem de erro
   - Login com conta inativa → mensagem de bloqueio
   - Logout funcional

2. **Testes de registro**:
   - Registro com dados válidos → conta criada → redirecionado para login
   - Registro com email duplicado → erro
   - Registro com senhas não coincidentes → erro inline

3. **Testes de guards**:
   - Acesso a rota protegida sem login → redirecionado para login
   - Acesso a rota admin como aluno → unauthorized

## Critérios de Aceite

- [ ] Testes E2E de login passando (válido, inválido, inativo)
- [ ] Testes E2E de registro passando (válido, duplicado)
- [ ] Testes de guards de rota passando
- [ ] Todos os testes executando no Playwright

## Arquivos Afetados

- `frontend/src/domains/auth/e2e/login.spec.ts`
- `frontend/src/domains/auth/e2e/register.spec.ts`
- `frontend/src/domains/auth/e2e/guards.spec.ts`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-008** | `.issues/ISSUE-008.md` | Contexto completo |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-001 steps e expected errors |
| **Frontend Testing** | `docs/frontend/04-testing.md` | Padrão E2E Playwright |

## Status

- **Prioridade**: alta
- **Tipo**: chore
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
