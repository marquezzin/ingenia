# [ISSUE-010-D] CRUD Usuários — Lista, Criação, Edição por Role

## Contexto

Sub-issue de [ISSUE-010](./ISSUE-010.md) — Frontend Admin (Fase 2).
Implementar as telas de gestão de usuários no painel administrativo.

## Descrição

Criar as páginas de listagem, criação e edição de usuários com seleção por role.

> **Dependência**: 009-D (API CRUD User), 010-A (layout admin).

### Tarefas

1. **Lista de usuários** (`/admin/users`):
   - Tabela: nome, email, role, account_status, ações
   - Filtros por role e account_status
   - Busca por nome e email

2. **Criar usuário** (`/admin/users/new`):
   - Formulário: nome, email, senha, role (dropdown)
   - Ao selecionar role, exibir campos específicos se necessário

3. **Editar usuário** (`/admin/users/:id`):
   - Edição de dados e status da conta
   - Ativar/desativar/suspender conta

4. **Detalhe do usuário** (`/admin/users/:id`):
   - Informações completas com profile

## Critérios de Aceite

- [ ] Lista de usuários com filtros e busca
- [ ] Criar usuário por role funcional
- [ ] Editar dados e status da conta
- [ ] Detalhe com informações de profile
- [ ] States loading/empty/error/success

## Arquivos Afetados

- `frontend/src/domains/admin/pages/users/`
- `frontend/src/domains/admin/api.ts`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-010** | `.issues/ISSUE-010.md` | Contexto completo |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-008 |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Telas Admin: Usuários |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
