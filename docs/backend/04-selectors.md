# Selectors

## Conceito

Selectors são funções que fazem **queries read-only** ao banco de dados.
Eles centralizam as queries e evitam duplicação de código.

## Regras

1. **Apenas leitura** — nunca crie, atualize ou delete em um selector
2. **Sem lógica de negócio** — apenas filtragem e ordenação
3. **Nomes descritivos** — `get_<entidade>_by_<campo>()`, `list_<entidades>_for_<contexto>()`
4. **Keyword-only args** — use `*` para forçar kwargs

## Exemplos

```python
# selectors.py
from django.db import models
from .models import MyModel

def get_my_model_by_id(*, id: str) -> MyModel:
    """Retorna um MyModel pelo ID ou lança DoesNotExist."""
    return MyModel.objects.get(id=id)

def get_my_model_by_id_or_none(*, id: str) -> MyModel | None:
    """Retorna um MyModel pelo ID ou None."""
    return MyModel.objects.filter(id=id).first()

def list_my_models_for_user(*, user) -> models.QuerySet[MyModel]:
    """Retorna todos os MyModels do usuário."""
    return MyModel.objects.filter(owner=user).select_related("owner")

def list_active_my_models() -> models.QuerySet[MyModel]:
    """Retorna todos os MyModels ativos."""
    return MyModel.objects.filter(is_active=True).order_by("-created_at")
```

## Usando em UseCases

```python
from .selectors import get_my_model_by_id
from core.errors import NotFoundError

class UpdateMyModelUseCase:
    def execute(self, *, input):
        try:
            instance = get_my_model_by_id(id=input.id)
        except MyModel.DoesNotExist:
            raise NotFoundError("MyModel não encontrado.")
        # ... continua
```
