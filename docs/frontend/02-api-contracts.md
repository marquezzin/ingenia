# Contratos de API

## Conceito

O arquivo `api.ts` de cada domínio define o **contrato** entre o frontend e o backend.
Ele espelha os endpoints do app Django correspondente.

## Estrutura

```typescript
// domains/<dominio>/api.ts
import { httpClient } from "@/shared/http/client";
import type { MyEntity, CreateMyEntityPayload } from "./types";
import type { PaginatedResponse } from "@/shared/http/types";

// Uma função por endpoint
export const listMyEntitiesApi = async (): Promise<PaginatedResponse<MyEntity>> => {
  const { data } = await httpClient.get("/api/my-entities/");
  return data;
};

export const getMyEntityApi = async (id: string): Promise<MyEntity> => {
  const { data } = await httpClient.get(`/api/my-entities/${id}/`);
  return data;
};

export const createMyEntityApi = async (
  payload: CreateMyEntityPayload
): Promise<MyEntity> => {
  const { data } = await httpClient.post("/api/my-entities/", payload);
  return data;
};

export const updateMyEntityApi = async (
  id: string,
  payload: Partial<CreateMyEntityPayload>
): Promise<MyEntity> => {
  const { data } = await httpClient.patch(`/api/my-entities/${id}/`, payload);
  return data;
};

export const deleteMyEntityApi = async (id: string): Promise<void> => {
  await httpClient.delete(`/api/my-entities/${id}/`);
};
```

## Tipos Correspondentes

```typescript
// domains/<dominio>/types.ts

// Espelha o serializer Django (response)
export interface MyEntity {
  id: string;
  name: string;
  createdAt: string;  // snake_case → camelCase
}

// Payload para criação/atualização
export interface CreateMyEntityPayload {
  name: string;
}
```

## Regras

1. **Uma função por endpoint** — não agrupe múltiplos endpoints
2. **Tipagem completa** — inputs e outputs sempre tipados
3. **Sufixo `Api`** — `createMyEntityApi`, não `createMyEntity`
4. **Nunca importe axios diretamente** — use sempre `@/shared/http/client`
5. **Erros são propagados** — não trate erros aqui, deixe para os hooks
