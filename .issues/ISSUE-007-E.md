# [ISSUE-007-E] Testes Unitários de Auth

## Contexto

Sub-issue de [ISSUE-007](./ISSUE-007.md) — Backend Auth (Fase 1).
Cobertura de testes unitários para toda a camada de autenticação e autorização.

## Descrição

Criar testes unitários cobrindo todos os cenários de auth implementados nas sub-issues 007-A a 007-D.

> **Dependência**: 007-A, 007-B, 007-C, 007-D (todas as sub-issues de auth).

### Tarefas

1. **Testes de JWT e login** (007-A):
   - Login com credenciais válidas retorna token com `role`
   - Login com credenciais inválidas retorna erro genérico
   - Login com conta inativa é bloqueado
   - Login com conta suspensa é bloqueado
   - Endpoint `/me/` retorna dados corretos do usuário

2. **Testes de registro** (007-B):
   - Registro com dados válidos cria User + StudentProfile
   - Registro com email duplicado retorna erro
   - Registro com senhas não coincidentes retorna erro
   - Registro com senha fraca retorna erro

3. **Testes de permissions** (007-C):
   - `IsStudent` aceita/rejeita corretamente
   - `IsTeacher` aceita/rejeita corretamente
   - `IsAdmin` aceita/rejeita corretamente
   - `IsActiveAccount` aceita/rejeita corretamente

4. **Testes de recuperação de senha** (007-D):
   - Forgot password com email existente gera token
   - Forgot password com email inexistente retorna sucesso (segurança)
   - Reset password com token válido atualiza senha
   - Reset password com token expirado retorna erro
   - Reset password com token já usado retorna erro

## Critérios de Aceite

- [ ] Testes de login: válido, inválido, inativo, suspensa
- [ ] Testes de `/me/`: dados corretos por role
- [ ] Testes de registro: válido, email duplicado, senha fraca
- [ ] Testes de permissions: aceitar/rejeitar por role
- [ ] Testes de reset password: válido, expirado, usado
- [ ] Todos os testes passando

## Arquivos Afetados

- `backend/src/accounts/tests/test_auth.py` — testes de login e JWT
- `backend/src/accounts/tests/test_register.py` — testes de registro
- `backend/src/accounts/tests/test_permissions.py` — testes de permissions
- `backend/src/accounts/tests/test_password_reset.py` — testes de reset

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-007** | `.issues/ISSUE-007.md` | Contexto completo da issue pai |
| **Testing** | `docs/backend/05-testing.md` | Padrão de testes |

## Status

- **Prioridade**: alta
- **Tipo**: chore
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
