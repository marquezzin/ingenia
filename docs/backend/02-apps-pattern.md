# Padrão de Apps Django

## Estrutura Padrão

Todo app Django no projeto segue esta estrutura:

```
backend/src/<nome_do_app>/
├── __init__.py
├── apps.py              # AppConfig
├── models.py            # Modelos de dados
├── serializers.py       # Serializers DRF
├── urls.py              # Rotas do app
├── views.py             # ViewSets / APIViews
├── selectors.py         # Queries read-only
├── services/
│   ├── __init__.py      # Exporta os UseCases
│   └── <entidade>.py    # UseCases por entidade
├── admin.py             # Registro no admin
└── tests/
    ├── __init__.py
    ├── factories.py     # Factory Boy factories
    └── test_<nome>.py   # Testes
```

## Convenções de Models

```python
import uuid
from django.db import models

class MyModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Meu Model"
        verbose_name_plural = "Meus Models"
```

## Registrando o App

Em `config/settings/base.py`:
```python
LOCAL_APPS = [
    "src.accounts",
    "src.meu_app",  # Adicione aqui
]
```

Em `config/urls.py`:
```python
path("api/meu-app/", include("src.meu_app.urls")),
```

## Workflow Completo

Veja `.claude/commands/add-backend-app.md` (slash command `/add-backend-app`) para o passo a passo completo.
