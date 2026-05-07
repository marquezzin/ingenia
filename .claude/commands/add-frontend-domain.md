---
description: Cria um novo domínio frontend espelhando um app Django existente
---

# Workflow: Criar Novo Domínio Frontend

Adicionar um novo domínio ao frontend, espelhando um app Django existente.

Antes de começar, leia: `frontend/CLAUDE.md`

## Passos

1. **Crie o diretório do domínio** em `frontend/src/domains/<nome_do_dominio>/`

2. **Crie a estrutura de arquivos**:
```
frontend/src/domains/<nome_do_dominio>/
├── api.ts          # Chamadas HTTP (contrato com o backend)
├── types.ts        # Tipos TypeScript
├── model.ts        # Lógica de negócio pura
├── hooks.ts        # React Query hooks
├── pages/          # Páginas (componentes de rota)
├── ui/             # Componentes específicos do domínio
└── e2e/            # Testes Playwright
```

3. **Defina os tipos** em `types.ts` espelhando os serializers Django:
```typescript
// Tipo de leitura (response da API)
export interface <Entidade> {
  id: string;
  // ... campos
  createdAt: string;
}

// Tipo de escrita (payload para a API)
export interface Create<Entidade>Payload {
  // ... campos editáveis
}
```

4. **Implemente o contrato de API** em `api.ts`:
- Uma função por endpoint
- Sufixo `Api` no nome
- Tipagem completa de inputs e outputs

5. **Implemente a lógica pura** em `model.ts`:
- Funções de transformação, validação, formatação
- Sem side effects, sem chamadas de API

6. **Implemente os hooks** em `hooks.ts`:
- `useQuery` para leitura de dados
- `useMutation` para escrita
- Cache keys organizadas em objeto `<ENTIDADE>_KEYS`
- Invalidação de cache no `onSuccess` das mutations

7. **Crie as páginas** em `pages/`:
- Um arquivo por página/rota
- Nomeadas como `<Entidade>ListPage.tsx`, `<Entidade>DetailPage.tsx`, etc.
- Usam os hooks para dados, delegam UI para `ui/`

8. **Crie os componentes** em `ui/`:
- Recebem dados via props
- Não fazem chamadas de API diretamente

9. **Registre as rotas** em `frontend/src/app/routes.tsx`:
```typescript
{
  path: "/<nome-do-dominio>",
  element: <RequireAuth><Layout /></RequireAuth>,
  children: [
    {
      index: true,
      element: React.lazy(() => import("@/domains/<nome>/pages/<Entidade>ListPage")),
    },
  ],
}
```

10. **Escreva os testes E2E** em `e2e/<fluxo>.spec.ts`:
- Um arquivo por fluxo principal
- Teste os caminhos felizes e os principais erros

11. **Rode os testes** para verificar:
```bash
make test-e2e
make test-frontend
```

12. **Crie o `CLAUDE.md`** do domain com: propósito, páginas, API contract, hooks, types, dependências e backend correspondente. Veja os `CLAUDE.md` existentes em outros domains como referência.
