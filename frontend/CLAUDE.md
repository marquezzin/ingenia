# Frontend — Vite + React + Domínios

Cada domain em `frontend/src/domains/<dominio>/` tem seu próprio `CLAUDE.md` com páginas, hooks, types e api specifics. `frontend/src/shared/CLAUDE.md` cobre infraestrutura compartilhada.

> Workflow: ao **criar um novo domínio**, sugira ao usuário rodar `/add-frontend-domain` (definido em `.claude/commands/add-frontend-domain.md`).
> Workflow: ao **rodar testes frontend ou E2E**, considere `/run-tests`.

## Arquitetura de Domínios

O frontend espelha a estrutura de apps do Django. Cada **domínio** corresponde a um app Django e encapsula tudo relacionado: tipos, chamadas de API, lógica, hooks, páginas e testes E2E.

```
frontend/src/
├── app/          # Bootstrap: providers, rotas, layout
├── shared/       # Código verdadeiramente compartilhado
└── domains/      # Um diretório por domínio (= app Django)
    └── <dominio>/
        ├── api.ts        # Contratos de API (chamadas HTTP)
        ├── types.ts      # Tipos TypeScript do domínio
        ├── model.ts      # Lógica de negócio pura (sem side effects)
        ├── hooks.ts      # React Query hooks
        ├── pages/        # Páginas (rotas)
        ├── ui/           # Componentes específicos do domínio
        ├── e2e/          # Testes Playwright do domínio
        └── CLAUDE.md     # Contexto do domínio
```

## Estrutura Detalhada de um Domínio

### `api.ts` — Contrato de API
- Funções que fazem chamadas HTTP usando o cliente compartilhado
- Nomeadas como `list<Entidade>Api()`, `create<Entidade>Api()`, etc.
- Retornam dados tipados (sem lógica de negócio)

```typescript
import { httpClient } from "@/shared/http/client";
import type { MyEntity, CreateMyEntityPayload } from "./types";
import type { PaginatedResponse } from "@/shared/http/types";

export const listMyEntitiesApi = async (): Promise<PaginatedResponse<MyEntity>> => {
  const { data } = await httpClient.get("/api/my-entities/");
  return data;
};

export const createMyEntityApi = async (
  payload: CreateMyEntityPayload
): Promise<MyEntity> => {
  const { data } = await httpClient.post("/api/my-entities/", payload);
  return data;
};
```

### `types.ts` — Tipos do Domínio
- Interfaces e types TypeScript que espelham os serializers Django
- Separar tipos de leitura (response) e escrita (payload)

```typescript
export interface MyEntity {
  id: string;
  name: string;
  createdAt: string;
}

export interface CreateMyEntityPayload {
  name: string;
}
```

### `model.ts` — Lógica de Negócio Pura
- Funções puras sem side effects
- Transformações, validações, formatações de dados
- Facilmente testáveis com vitest

```typescript
export const formatMyEntityName = (entity: MyEntity): string =>
  entity.name.trim().toUpperCase();

export const isMyEntityValid = (entity: Partial<MyEntity>): boolean =>
  Boolean(entity.name && entity.name.length > 0);
```

### `hooks.ts` — React Query Hooks
- Encapsulam `useQuery` e `useMutation` do TanStack Query
- Nomeados como `use<Entidade>s()`, `useCreate<Entidade>()`
- Gerenciam cache keys, invalidação e estados de loading/error

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listMyEntitiesApi, createMyEntityApi } from "./api";
import type { CreateMyEntityPayload } from "./types";

const MY_ENTITY_KEYS = {
  all: ["my-entities"] as const,
  list: () => [...MY_ENTITY_KEYS.all, "list"] as const,
};

export const useMyEntities = () =>
  useQuery({
    queryKey: MY_ENTITY_KEYS.list(),
    queryFn: listMyEntitiesApi,
  });

export const useCreateMyEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMyEntityPayload) => createMyEntityApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_ENTITY_KEYS.all });
    },
  });
};
```

### `pages/` — Páginas do Domínio
- Componentes de página (conectados às rotas)
- Usam os hooks do domínio para dados
- Delegam renderização para componentes de `ui/`

### `ui/` — Componentes do Domínio
- Componentes React específicos do domínio
- Recebem dados via props (não fazem chamadas de API diretamente)
- Reutilizáveis dentro do domínio

### `e2e/` — Testes Playwright
- Um arquivo `.spec.ts` por fluxo principal do domínio
- Veja `docs/frontend/04-testing.md` para convenções

## Shared — Código Compartilhado

### `shared/http/`
- `client.ts`: instância axios com interceptors (JWT, 401 redirect)
- `types.ts`: `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiError`
- **Nunca** importe axios diretamente nos domínios — use sempre `@/shared/http/client`

### `shared/auth/`
- `storage.ts`: get/set/clear tokens no localStorage
- `guards.tsx`: `<RequireAuth>`, `<RequireGuest>` para proteger rotas

### `shared/ui/`
- Componentes genéricos reutilizáveis em qualquer domínio
- `Button`, `Input`, `Card`, `Spinner`, `ErrorMessage`, `DataTable`, `StatCard`, `PageHeader`, etc.
- **Não** coloque componentes específicos de domínio aqui

### `shared/hooks/`
- Hooks genéricos não relacionados a domínio específico (`useDebounce`, `useLocalStorage`, etc.)

### `shared/utils/`
- Funções utilitárias puras (formatadores, validações genéricas)

## App — Bootstrap

### `app/providers.tsx`
- `QueryClientProvider` (TanStack Query)
- `RouterProvider` (React Router)
- Outros providers globais

### `app/routes.tsx`
- Definição centralizada de todas as rotas
- Lazy loading por domínio: `React.lazy(() => import("@/domains/<dominio>/pages/<Page>"))`
- Usa guards de auth quando necessário

## Convenções

### Imports
- Use sempre o alias `@/` para imports absolutos (configurado em `tsconfig.json` e `vite.config.ts`)
- Ordem: externos → `@/shared` → `@/domains` → relativos

```typescript
// ✅ Correto
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/http/client";
import { useMyEntities } from "@/domains/my-domain/hooks";
import type { MyEntity } from "./types";

// ❌ Errado
import { httpClient } from "../../shared/http/client";
```

### Naming
- Componentes: PascalCase (`MyComponent.tsx`)
- Hooks: camelCase com prefixo `use` (`useMyHook.ts`)
- Funções de API: camelCase com sufixo `Api` (`createEntityApi`)
- Types/Interfaces: PascalCase (`MyEntity`, `CreateMyEntityPayload`)
- Arquivos de tipo: `types.ts`

### Formulários
- Use `react-hook-form` + `zod` para validação
- Schema Zod no mesmo arquivo do formulário ou em `<dominio>/schemas.ts`

### Estado
- **Servidor**: TanStack Query (nunca `useState` para dados de API)
- **UI local**: `useState` / `useReducer`
- **Global UI**: Context API (evite Redux/Zustand a menos que necessário)

## Comandos Úteis

```bash
make test-frontend    # Vitest (testes unitários)
make test-e2e         # Playwright (testes E2E)
make lint-frontend    # ESLint + tsc --noEmit
```

## Testes — vitest

### Localização
- `*.test.ts` ou `*.test.tsx` ao lado do arquivo testado, ou em `__tests__/` dentro do módulo

### O que Testar
- Funções de `model.ts` (lógica pura — mais importante)
- Funções utilitárias de `shared/utils/`
- Componentes simples com `@testing-library/react`

```typescript
// model.test.ts
import { describe, it, expect } from "vitest";
import { formatMyEntityName } from "./model";

describe("formatMyEntityName", () => {
  it("returns uppercase trimmed name", () => {
    expect(formatMyEntityName({ id: "1", name: "  hello  ", createdAt: "" }))
      .toBe("HELLO");
  });
});
```

## Testes — Playwright (E2E)

### Localização
- `frontend/src/domains/<dominio>/e2e/<fluxo>.spec.ts`
- Um arquivo por fluxo principal do domínio

### Convenções
- Use `page.getByRole()` e `page.getByLabel()` (preferível a seletores CSS)
- Evite `page.waitForTimeout()` — use `expect(locator).toBeVisible()`
- Use `test.beforeEach` para setup comum (login, navegação)
- Nomeie descrevendo o comportamento do usuário

```typescript
import { test, expect } from "@playwright/test";

test.describe("Auth — Login", () => {
  test("user can login with valid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL("/dashboard");
  });
});
```

### Rodando E2E
```bash
make test-e2e        # Headless (CI)
make test-e2e-ui     # Com UI interativa (debug)
```

## Documentação Detalhada

- [Arquitetura de Domínios](../docs/frontend/01-domain-architecture.md)
- [Contratos de API](../docs/frontend/02-api-contracts.md)
- [State Management](../docs/frontend/03-state-management.md)
- [Testes E2E](../docs/frontend/04-testing.md)
- [Design System](../docs/frontend/05-design-system.md)
- [Padrões de Estilização](../docs/frontend/06-styling-patterns.md)
