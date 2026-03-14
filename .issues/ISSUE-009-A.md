# [ISSUE-009-A] CRUD de Module — Serializer, Service, View, URLs

## Contexto

Sub-issue de [ISSUE-009](./ISSUE-009.md) — Backend Admin CRUD (Fase 2).
Implementar o CRUD completo de módulos acessível apenas por administradores.

## Descrição

Criar serializer, service e view para o CRUD de Module com filtros, busca e ordenação.

> **Dependência**: ISSUE-003 (Module model), 007-C (IsAdmin permission).

### Tarefas

1. **Serializer de Module**:
   - `ModuleListSerializer` — campos resumidos (id, title, sequence_order, publication_status)
   - `ModuleDetailSerializer` — todos os campos + count de aulas
   - `ModuleCreateUpdateSerializer` — validações de criação/edição

2. **Service de Module** (seguir padrão):
   - `create_module(data)`, `update_module(id, data)`, `delete_module(id)`
   - Validação de `sequence_order` único

3. **ViewSet de Module**:
   - `GET /api/v1/modules/` — lista com paginação
   - `POST /api/v1/modules/` — criar
   - `GET /api/v1/modules/:id/` — detalhe
   - `PUT /api/v1/modules/:id/` — editar
   - `DELETE /api/v1/modules/:id/` — remover
   - Filtro por `publication_status`
   - Busca por `title`
   - Ordenação por `sequence_order`
   - Permission: `IsAuthenticated & IsAdmin`

## Critérios de Aceite

- [ ] CRUD completo de Module funcionando
- [ ] Filtro por `publication_status`
- [ ] Busca por `title`
- [ ] Ordenação por `sequence_order`
- [ ] Protegido por `IsAdmin`
- [ ] Paginação funcional

## Arquivos Afetados

- `backend/src/curriculum/serializers.py` — serializers de Module
- `backend/src/curriculum/services/` — service de Module
- `backend/src/curriculum/views.py` — ModuleViewSet
- `backend/src/curriculum/urls.py` — rotas

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-009** | `.issues/ISSUE-009.md` | Contexto completo da issue pai |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Entity Module |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | Matrix §3: Module Admin ✅ |
| **API Conventions** | `docs/backend/06-api-conventions.md` | Padrão de API |
| **Backend Selectors** | `docs/backend/04-selectors.md` | Padrão de selectors |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
