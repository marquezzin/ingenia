# Services e UseCases

## Conceito

Todo efeito colateral (criar, atualizar, deletar) passa por um **UseCase**.
Um UseCase encapsula uma operação de negócio completa.

## Estrutura

```python
from dataclasses import dataclass
from core.errors import ApplicationError
from ..models import MyModel

# Input tipado
@dataclass
class CreateMyModelInput:
    name: str
    owner_id: str

# Output tipado
@dataclass
class CreateMyModelResult:
    instance: MyModel

# UseCase
class CreateMyModelUseCase:
    def execute(self, *, input: CreateMyModelInput) -> CreateMyModelResult:
        # 1. Validações de negócio
        if not input.name.strip():
            raise ApplicationError("Nome não pode ser vazio.")

        # 2. Operação no banco
        instance = MyModel.objects.create(
            name=input.name,
            owner_id=input.owner_id,
        )

        # 3. Retorno tipado
        return CreateMyModelResult(instance=instance)
```

## Regras

1. **Nunca acesse `request`** — receba apenas dados já extraídos
2. **Inputs e outputs tipados** — use dataclasses
3. **Erros explícitos** — use `ApplicationError`, `NotFoundError`, etc.
4. **Um arquivo por entidade** — `services/my_entity.py`
5. **Exporte no `__init__.py`** do services

## Exportando no `__init__.py`

```python
# services/__init__.py
from .my_entity import (
    CreateMyModelUseCase,
    UpdateMyModelUseCase,
    DeleteMyModelUseCase,
)
```

## Testando UseCases

```python
from django.test import TestCase
from core.errors import ApplicationError
from .services import CreateMyModelUseCase, CreateMyModelInput

class CreateMyModelUseCaseTest(TestCase):
    def test_creates_successfully(self):
        result = CreateMyModelUseCase().execute(
            input=CreateMyModelInput(name="Test", owner_id="...")
        )
        self.assertEqual(result.instance.name, "Test")

    def test_raises_for_empty_name(self):
        with self.assertRaises(ApplicationError):
            CreateMyModelUseCase().execute(
                input=CreateMyModelInput(name="", owner_id="...")
            )
```
