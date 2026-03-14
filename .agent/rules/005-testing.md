---
trigger: model_decision
description: Rodando testes
---

# Regras de Testes

> Leia também: `001-workspace.md` (regras gerais)
> Documentação detalhada: `docs/backend/05-testing.md`, `docs/frontend/04-testing.md`

## Visão Geral

| Tipo       | Framework         | Localização                              | Comando              |
|------------|-------------------|------------------------------------------|----------------------|
| Backend    | pytest + factory_boy | `backend/src/<app>/tests/`            | `make test-backend`  |
| Frontend   | Vitest            | `frontend/src/**/*.test.ts(x)`           | `make test-frontend` |
| E2E        | Playwright        | `frontend/src/domains/<dominio>/e2e/`    | `make test-e2e`      |

## Backend — pytest

### Configuração
- Configurado em `pyproject.toml` (seção `[tool.pytest.ini_options]`)
- Settings de teste: `DJANGO_SETTINGS_MODULE=config.settings.test`
- Banco de teste isolado, criado e destruído a cada execução

### Estrutura de Testes

```
backend/src/<app>/tests/
├── __init__.py
├── factories.py      # Factory Boy factories
└── test_<nome>.py    # Arquivo de testes
```

### Factories (factory_boy)
- Uma factory por model, em `tests/factories.py`
- Herdam de `factory.django.DjangoModelFactory`
- Use `factory.Faker` para dados realistas
- Use `factory.SubFactory` para relacionamentos

```python
import factory
from factory.django import DjangoModelFactory
from ..models import MyModel

class MyModelFactory(DjangoModelFactory):
    class Meta:
        model = MyModel

    name = factory.Faker("name")
    owner = factory.SubFactory("accounts.tests.factories.UserFactory")
```

### Escrevendo Testes
- Use `APIClient` do DRF para testes de API
- Herde de `core.testing.APITestCase` para helpers comuns
- Teste os casos de sucesso E os casos de erro
- Nomeie os métodos como `test_<ação>_<contexto>_<resultado_esperado>`

```python
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.tests.factories import UserFactory
from .factories import MyModelFactory

class MyModelViewSetTest(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)

    def test_list_returns_only_user_models(self):
        MyModelFactory.create_batch(3, owner=self.user)
        MyModelFactory()  # outro usuário
        response = self.client.get("/api/my-models/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 3)

    def test_create_with_empty_name_returns_400(self):
        response = self.client.post("/api/my-models/", {"name": ""})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
```

### Testando UseCases Diretamente
- Teste os UseCases em isolamento (sem HTTP)
- Mais rápido e mais preciso para lógica de negócio

```python
from django.test import TestCase
from accounts.tests.factories import UserFactory
from ..services.my_entity import CreateMyEntityUseCase, CreateMyEntityInput
from core.errors import ApplicationError

class CreateMyEntityUseCaseTest(TestCase):
    def test_creates_entity_successfully(self):
        user = UserFactory()
        result = CreateMyEntityUseCase().execute(
            input=CreateMyEntityInput(name="Test", owner_id=str(user.id))
        )
        self.assertEqual(result.instance.name, "Test")

    def test_raises_error_for_empty_name(self):
        user = UserFactory()
        with self.assertRaises(ApplicationError):
            CreateMyEntityUseCase().execute(
                input=CreateMyEntityInput(name="", owner_id=str(user.id))
            )
```

## Frontend — vitest

### Localização
- Arquivos: `*.test.ts` ou `*.test.tsx` ao lado do arquivo testado
- Ou em `__tests__/` dentro do módulo

### O que Testar com vitest
- Funções de `model.ts` (lógica pura — mais importante)
- Funções utilitárias de `shared/utils/`
- Componentes simples com `@testing-library/react`

```typescript
// model.test.ts
import { describe, it, expect } from "vitest";
import { formatMyEntityName, isMyEntityValid } from "./model";

describe("formatMyEntityName", () => {
  it("returns uppercase trimmed name", () => {
    expect(formatMyEntityName({ id: "1", name: "  hello  ", createdAt: "" }))
      .toBe("HELLO");
  });
});
```

## E2E — Playwright

### Localização
- `frontend/src/domains/<dominio>/e2e/<fluxo>.spec.ts`
- Um arquivo por fluxo principal do domínio

### Convenções
- Use `page.getByRole()` e `page.getByLabel()` (preferível a seletores CSS)
- Evite `page.waitForTimeout()` — use `expect(locator).toBeVisible()`
- Use `test.beforeEach` para setup comum (login, navegação)
- Nomeie os testes descrevendo o comportamento do usuário

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

  test("shows error with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("wrong@example.com");
    await page.getByLabel("Password").fill("wrongpass");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });
});
```

### Rodando E2E
```bash
make test-e2e        # Headless (CI)
make test-e2e-ui     # Com UI interativa (debug)
```

## Regras Gerais de Testes

1. **Todo código novo deve ter testes** — sem exceção
2. **Testes devem ser independentes** — não dependam de ordem de execução
3. **Use factories, não fixtures estáticas** — mais flexível e legível
4. **Teste comportamento, não implementação** — o que o código faz, não como
5. **Nomes descritivos** — o nome do teste deve explicar o que está sendo testado
