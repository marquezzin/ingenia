# [ISSUE-007] Backend Auth — JWT, Registro, Permissions e Recuperação de Senha

## Contexto

Fase 1 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Autenticação & Autorização.
Implementar toda a camada de autenticação e autorização no backend, incluindo JWT adaptado para roles, registro público, permissions customizadas e recuperação de senha.

## Descrição

Adaptar o sistema de autenticação JWT existente no template para suportar os papéis do Ingenia e implementar os endpoints de auth.

> **Dependência**: ISSUE-001 (User + Profiles precisam existir).

### Tarefas

1. **Adaptar JWT auth para `role`**:
   - Incluir `role` no payload do token JWT
   - Adaptar serializers de login existentes para retornar role e profile info

2. **Endpoint de registro público** — `POST /api/v1/auth/register/`:
   - Cria `User` com `role=STUDENT` + `StudentProfile` automaticamente
   - Campos: `full_name`, `email`, `password`, `password_confirm`
   - Validações: email único, senha segura, senhas coincidem

3. **Endpoint `/api/v1/auth/me/`** — `GET`:
   - Retorna dados do User autenticado com `role`, `account_status` e profile info
   - Adaptar serializer para incluir profile nested

4. **Bloquear login se `account_status != ACTIVE`**:
   - Validar no processo de autenticação
   - Retornar mensagem clara de conta inativa/suspensa

5. **Permissions customizadas**:
   - `IsStudent` — verifica `request.user.role == STUDENT`
   - `IsTeacher` — verifica `request.user.role == TEACHER`
   - `IsAdmin` — verifica `request.user.role == ADMIN`
   - `IsActiveAccount` — verifica `account_status == ACTIVE`

6. **Endpoint de recuperação de senha** (básico):
   - `POST /api/v1/auth/forgot-password/` — solicita reset
   - `POST /api/v1/auth/reset-password/` — confirma reset com token
   - Implementação básica com token por email

7. **Testes unitários de auth** (pytest).

## Critérios de Aceite

- [ ] JWT inclui `role` no token
- [ ] Endpoint de registro cria User + StudentProfile
- [ ] Endpoint `/me/` retorna role e profile info
- [ ] Login bloqueado para contas não ativas
- [ ] Permissions `IsStudent`, `IsTeacher`, `IsAdmin` implementadas
- [ ] Recuperação de senha funcional (fluxo básico)
- [ ] Testes unitários cobrindo todos os cenários de auth
- [ ] Testes de registro com email duplicado
- [ ] Testes de login com conta inativa

## Arquivos Afetados

- `backend/src/accounts/serializers.py` — serializers de auth e registro
- `backend/src/accounts/views.py` — views de auth
- `backend/src/accounts/urls.py` — rotas de auth
- `backend/src/accounts/services/` — service de registro
- `backend/src/core/permissions.py` — permissions customizadas
- `backend/src/accounts/tests/` — testes unitários

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 1", Backend |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | System Roles §1; Auth Matrix §3; Special Rules §4 (account_status, auto-cadastro) |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-001 (Login e acesso por perfil); Expected Errors |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Screen: Login §2, Screen: Cadastro, Screen: Recuperar senha |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Entity User, enums UserRole/AccountStatus |
| **Spec** | `docs/requirements/ingenia-documents/discover/spec.md` | Auth §7 |
| **Backend Services** | `docs/backend/03-services-usecases.md` | Padrão UseCase/Service |
| **API Conventions** | `docs/backend/06-api-conventions.md` | Convenções de API |
| **Testing** | `docs/backend/05-testing.md` | Padrão de testes |

### Regras de Negócio
- Registro público cria conta de Aluno (assunção validada em authorization.md §1).
- Login deve ser bloqueado se `account_status != ACTIVE` (authorization.md §4.3).
- Mensagem de falha de auth não deve confirmar se email existe (journeys.md J-001).

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
