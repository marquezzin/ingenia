# [ISSUE-007-A] JWT Custom — Incluir `role` no Payload + Endpoint `/me/` + Bloquear Login Inativo

## Contexto

Sub-issue de [ISSUE-007](./ISSUE-007.md) — Backend Auth (Fase 1).
Adaptar o sistema JWT existente no template para incluir o role do usuário no token e criar o endpoint de perfil autenticado.

## Descrição

Modificar o fluxo de autenticação JWT para que o token contenha o `role` do usuário, adaptar o serializer de login para retornar informações de perfil, criar o endpoint `/me/` e bloquear login para contas não ativas.

> **Dependência**: ISSUE-001 (User + Profiles precisam existir).

### Tarefas

1. **Customizar JWT payload** para incluir `role`:
   - Sobrescrever `TokenObtainPairSerializer` para adicionar `role` ao token
   - Garantir que `role` está disponível ao decodificar o token

2. **Adaptar serializer de login** para retornar:
   - `role`, `account_status`, `full_name`, `email`
   - Dados do profile correspondente ao role

3. **Criar endpoint `GET /api/v1/auth/me/`**:
   - Retorna dados completos do User autenticado
   - Inclui `role`, `account_status` e profile info (nested)
   - Serializer dedicado com profile do role correspondente

4. **Bloquear login se `account_status != ACTIVE`**:
   - Validar no `TokenObtainPairSerializer.validate()`
   - Retornar mensagem clara: "Conta inativa" ou "Conta suspensa"
   - Mensagem NÃO deve confirmar se email existe (segurança)

## Critérios de Aceite

- [ ] JWT inclui `role` no payload do token
- [ ] Login retorna `role` e profile info
- [ ] Endpoint `/me/` retorna dados completos do usuário autenticado
- [ ] Login bloqueado para contas com `account_status != ACTIVE`
- [ ] Mensagem de erro não expõe se email existe ou não

## Arquivos Afetados

- `backend/src/accounts/serializers.py` — `CustomTokenObtainPairSerializer`, `UserMeSerializer`
- `backend/src/accounts/views.py` — `UserMeView`
- `backend/src/accounts/urls.py` — rota `/me/`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-007** | `.issues/ISSUE-007.md` | Contexto completo da issue pai |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | System Roles §1; Special Rules §4.3 (account_status) |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-001 (Login e acesso por perfil); Expected Errors |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Entity User, enums UserRole/AccountStatus |
| **API Conventions** | `docs/backend/06-api-conventions.md` | Convenções de API |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
