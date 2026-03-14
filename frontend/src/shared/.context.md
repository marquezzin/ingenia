# Shared — Frontend

## Propósito
Código compartilhado entre todos os domains. Não é um domain — é infraestrutura.

## Módulos

### `auth/` — Gerenciamento de tokens e guards
- `storage.ts` — `setTokens()`, `clearTokens()`, `getTokens()`
- `guards.tsx` — `RequireAuth`, `RequireGuest` (componentes de rota)

### `http/` — Cliente HTTP
- `client.ts` — Instância axios com interceptors JWT (auto-refresh)

### `ui/` — Design System
- `tokens.css` — **CSS design tokens** (cores, espaçamento, tipografia)
- `theme.ts` — Tema Mantine sincronizado com tokens
- `Logo.tsx`, `UserMenu.tsx` — Componentes globais
- `layout/` — `MainLayout`, `PageContainer`
- `components/` — **Component Library** (DataTable, StatCard, PageHeader, EmptyState, ConfirmModal, FormSection, StatusBadge)

### Para mudar visual do projeto
1. Editar `shared/ui/tokens.css` (cores, fontes, espaçamento)
2. Ajustar `shared/ui/theme.ts` se necessário (paleta Mantine)
3. Componentes se ajustam automaticamente

## Regras
1. **Domínios não importam de outros domínios** — usam `shared/`
2. **Componentes genéricos** vão em `shared/ui/components/`
3. **Hooks genéricos** vão em `shared/hooks/`
4. **Utilitários puros** vão em `shared/utils/`

## Backend Correspondente
- Equivale a `backend/src/core/` (utilities compartilhados)
