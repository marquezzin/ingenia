# [ISSUE-007-C] Permissions Customizadas — IsStudent, IsTeacher, IsAdmin, IsActiveAccount

## Contexto

Sub-issue de [ISSUE-007](./ISSUE-007.md) — Backend Auth (Fase 1).
Criar as permission classes customizadas que serão usadas em toda a plataforma.

## Descrição

Implementar permission classes do Django REST Framework para controlar acesso por role e status da conta.

> **Dependência**: ISSUE-001 (User.role), 007-A (JWT precisa estar funcionando para testar as permissions).

### Tarefas

1. **Criar permission classes em `core/permissions.py`**:
   - `IsStudent` — `request.user.role == UserRole.STUDENT`
   - `IsTeacher` — `request.user.role == UserRole.TEACHER`
   - `IsAdmin` — `request.user.role == UserRole.ADMIN`
   - `IsActiveAccount` — `request.user.account_status == AccountStatus.ACTIVE`

2. **Compor permissions** para uso em views:
   - Combinações comuns: `IsAuthenticated & IsAdmin`, `IsAuthenticated & IsStudent & IsActiveAccount`
   - Documentar padrão de composição

3. **Configurar default permission** no settings (se necessário):
   - `DEFAULT_PERMISSION_CLASSES` para incluir `IsActiveAccount` globalmente (ou não, decidir)

## Critérios de Aceite

- [x] `IsStudent` permite apenas alunos
- [x] `IsTeacher` permite apenas professores
- [x] `IsAdmin` permite apenas administradores
- [x] `IsActiveAccount` bloqueia contas inativas/suspensas
- [x] Permissions são composíveis com `&` e `|`
- [x] Retornam status HTTP 403 com mensagem clara

## Arquivos Afetados

- `backend/src/core/permissions.py` — todas as permission classes
- `backend/src/core/tests/test_permissions.py` — testes unitários
- `backend/src/core/CLAUDE.md` — contexto atualizado

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-007** | `.issues/ISSUE-007.md` | Contexto completo da issue pai |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | Auth Matrix §3; Special Rules §4 |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Enums UserRole, AccountStatus |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-16
