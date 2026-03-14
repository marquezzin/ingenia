# Testes Frontend

O projeto utiliza dois frameworks principais para testes no frontend: **Vitest** para testes unitários e de lógica, e **Playwright** para testes de integração de ponta a ponta (E2E).

## 1. Testes Unitários (Vitest)

Utilizados para testar lógica de negócio pura (`model.ts`), funções utilitárias e componentes isolados.

### Localização
Os arquivos devem seguir o sufixo `*.test.ts` ou `*.test.tsx` e ficar ao lado do arquivo testado.
```
frontend/src/shared/auth/storage.ts
frontend/src/shared/auth/storage.test.ts
```

### Exemplo
```typescript
import { describe, it, expect } from "vitest";
import { formatName } from "./model";

describe("formatName", () => {
  it("should uppercase the name", () => {
    expect(formatName("hub")).toBe("HUB");
  });
});
```

### Rodando
```bash
make test-frontend
```

---

## 2. Testes E2E (Playwright)

Utilizados para testar fluxos completos do usuário, simulando interações reais no navegador.

### Localização
Ficam dentro da pasta `e2e/` de cada domínio.
```
frontend/src/domains/<dominio>/e2e/<fluxo>.spec.ts
```

### Convenções de Seletores
Sempre prefira seletores semânticos em vez de classes CSS ou IDs:
1. `page.getByRole("button", { name: "Salvar" })`
2. `page.getByLabel("E-mail")`
3. `page.getByText("Sucesso!")`

### Rodando
```bash
make test-e2e        # Headless (CI)
make test-e2e-ui     # Com interface visual (Debug)
```

## Resumo de Comandos

| Comando | Descrição |
|---------|-----------|
| `make test-frontend` | Executa testes unitários (Vitest) |
| `make test-e2e` | Executa testes E2E (Playwright) |
| `make test` | Executa todos os testes (Backend, Frontend, E2E) |
