# State Management

## Princípio

- **Dados do servidor** → TanStack Query (`useQuery`, `useMutation`)
- **Estado UI local** → `useState`, `useReducer`
- **Estado global UI** → Context API (use com moderação)

## TanStack Query

### Queries (leitura)

```typescript
// hooks.ts
import { useQuery } from "@tanstack/react-query";
import { listMyEntitiesApi } from "./api";

const MY_ENTITY_KEYS = {
  all: ["my-entities"] as const,
  list: () => [...MY_ENTITY_KEYS.all, "list"] as const,
  detail: (id: string) => [...MY_ENTITY_KEYS.all, "detail", id] as const,
};

export const useMyEntities = () =>
  useQuery({
    queryKey: MY_ENTITY_KEYS.list(),
    queryFn: listMyEntitiesApi,
  });
```

### Mutations (escrita)

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMyEntityApi } from "./api";

export const useCreateMyEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMyEntityApi,
    onSuccess: () => {
      // Invalida o cache da lista após criar
      queryClient.invalidateQueries({ queryKey: MY_ENTITY_KEYS.all });
    },
  });
};
```

### Usando nos Componentes

```tsx
const MyListPage = () => {
  const { data, isLoading, error } = useMyEntities();
  const createMutation = useCreateMyEntity();

  if (isLoading) return <Loader />;
  if (error) return <Alert color="red">{error.message}</Alert>;

  return (
    <Stack>
      {data?.results.map((item) => <MyCard key={item.id} item={item} />)}
      <Button 
        onClick={() => createMutation.mutate({ name: "Novo" })}
        loading={createMutation.isPending}
      >
        Criar
      </Button>
    </Stack>
  );
};
```

## Regras

1. **Nunca use `useState` para dados de API** — use TanStack Query
2. **Cache keys organizadas** — objeto `<ENTIDADE>_KEYS` por domínio
3. **Invalide o cache no `onSuccess`** das mutations
4. **Não duplique estado** — se está no servidor, não precisa de `useState`
