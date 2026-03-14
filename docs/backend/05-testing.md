# Testes Backend

## Stack

- **pytest** + **pytest-django** — runner e integração Django
- **factory-boy** — criação de dados de teste
- **faker** — dados realistas

## Configuração

Em `pyproject.toml`:
```toml
[tool.pytest.ini_options]
DJANGO_SETTINGS_MODULE = "config.settings.test"
testpaths = ["src"]
```

## Factories

```python
# tests/factories.py
import factory
from factory.django import DjangoModelFactory
from ..models import MyModel

class MyModelFactory(DjangoModelFactory):
    class Meta:
        model = MyModel

    name = factory.Faker("name")
    owner = factory.SubFactory("accounts.tests.factories.UserFactory")
```

## Testes de API

```python
from core.testing import APITestCase
from rest_framework import status
from .factories import MyModelFactory

class MyModelViewSetTest(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.authenticate(self.user)

    def test_list_returns_200(self):
        MyModelFactory.create_batch(3, owner=self.user)
        response = self.client.get("/api/my-models/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 3)
```

## Testes de UseCase

```python
from django.test import TestCase
from core.errors import ApplicationError
from .services import CreateMyModelUseCase, CreateMyModelInput

class CreateMyModelUseCaseTest(TestCase):
    def test_creates_successfully(self):
        result = CreateMyModelUseCase().execute(
            input=CreateMyModelInput(name="Test", owner_id="...")
        )
        self.assertIsNotNone(result.instance.id)
```

## Rodando

```bash
make test-backend          # Todos os testes
make test-backend-cov      # Com cobertura
```
