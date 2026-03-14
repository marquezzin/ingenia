# [ISSUE-009-D] CRUD de User (Admin) — Criação com Profile por Role

## Contexto

Sub-issue de [ISSUE-009](./ISSUE-009.md) — Backend Admin CRUD (Fase 2).
Implementar o CRUD de usuários acessível apenas por administradores, com criação automática de profile.

## Descrição

Criar serializers, service e views para o admin gerenciar usuários da plataforma, incluindo criação por role com profile correspondente.

> **Dependência**: ISSUE-001 (User + Profiles), 007-C (IsAdmin).

### Tarefas

1. **Serializer de User para admin**:
   - `UserAdminListSerializer` — id, full_name, email, role, account_status
   - `UserAdminDetailSerializer` — todos campos + profile info
   - `UserAdminCreateSerializer` — full_name, email, password, role

2. **Service de User admin**:
   - `create_user_with_profile(data)` — cria User + Profile correspondente ao role
   - `update_user(id, data)` — atualiza dados do user
   - Se role muda, gerenciar profiles (ou não permitir mudança de role)

3. **ViewSet de User admin**:
   - `GET /api/v1/admin/users/` — lista com paginação
   - `POST /api/v1/admin/users/` — criar com role
   - `GET /api/v1/admin/users/:id/` — detalhe
   - `PUT /api/v1/admin/users/:id/` — editar
   - Filtro por `role` e `account_status`
   - Busca por `full_name` e `email`
   - Permission: `IsAuthenticated & IsAdmin`

## Critérios de Aceite

- [ ] CRUD completo de User para admin
- [ ] Criação cria profile correspondente ao role
- [ ] Filtro por `role` e `account_status`
- [ ] Busca por `full_name` e `email`
- [ ] Protegido por `IsAdmin`

## Arquivos Afetados

- `backend/src/accounts/serializers.py` — serializers admin de User
- `backend/src/accounts/services/` — service de criação com profile
- `backend/src/accounts/views.py` — UserAdminViewSet
- `backend/src/accounts/urls.py` — rotas admin

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-009** | `.issues/ISSUE-009.md` | Contexto completo |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-008 (Admin gerencia usuários) |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | User, Profiles, BR-001, BR-002 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
