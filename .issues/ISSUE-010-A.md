# [ISSUE-010-A] Layout Admin — Sidebar, Header, Breadcrumb + Dashboard

## Contexto

Sub-issue de [ISSUE-010](./ISSUE-010.md) — Frontend Admin (Fase 2).
Implementar o layout do painel administrativo e o dashboard com cards de resumo.

## Descrição

Criar o domain frontend `admin` com layout administrativo dedicado e dashboard com métricas resumidas.

> **Dependência**: 008-E (layout base), 008-D (AdminRoute guard).

### Tarefas

1. **Criar domain `admin`** seguindo workflow `/add-frontend-domain`

2. **Layout admin com sidebar**:
   - Sidebar com navegação: Dashboard, Módulos, Usuários, Turmas
   - Header com nome do admin e logout
   - Breadcrumb navigation contextual
   - Área de conteúdo principal

3. **Dashboard admin** (`/admin`):
   - Cards de resumo: total de módulos, aulas, exercícios, usuários
   - Atalhos rápidos para ações comuns (criar módulo, criar usuário)

## Critérios de Aceite

- [ ] Layout admin com sidebar funcional
- [ ] Navegação entre seções
- [ ] Dashboard com cards de resumo
- [ ] Breadcrumb navigation
- [ ] Layout responsivo (sidebar colapsável)

## Arquivos Afetados

- `frontend/src/domains/admin/` — novo domain
- `frontend/src/domains/admin/pages/DashboardPage.tsx`
- `frontend/src/domains/admin/components/AdminLayout.tsx`
- `frontend/src/domains/admin/api.ts`
- `frontend/src/app/routes.tsx`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-010** | `.issues/ISSUE-010.md` | Contexto completo |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Sitemap /admin/*; Dashboard Admin |
| **Design System** | `docs/frontend/05-design-system.md` | AppShell, NavLink |
| **Workflow** | `.agent/workflows/add-frontend-domain.md` | Como criar domain |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
