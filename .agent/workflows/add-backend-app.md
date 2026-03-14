---
description: como criar um novo app Django no projeto
---

# Workflow: Criar Novo App Django

Este workflow descreve o passo a passo para adicionar um novo app Django ao projeto, seguindo os padrões estabelecidos.

Antes de começar, leia: `.agent/rules/002-backend.md`

## Passos

1. **Crie o diretório do app** em `backend/src/<nome_do_app>/`

2. **Crie os arquivos base** do app:
```
backend/src/<nome_do_app>/
├── __init__.py
├── apps.py
├── models.py
├── serializers.py
├── urls.py
├── views.py
├── selectors.py
├── services/
│   └── __init__.py
├── admin.py
└── tests/
    ├── __init__.py
    └── factories.py
```

3. **Configure o `apps.py`**:
```python
from django.apps import AppConfig

class <NomeDoApp>Config(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "src.<nome_do_app>"
    label = "<nome_do_app>"
```

4. **Registre o app** em `backend/src/config/settings/base.py`:
```python
LOCAL_APPS = [
    # ... apps existentes ...
    "src.<nome_do_app>",
]
```

5. **Defina os models** em `models.py` seguindo o padrão (UUID pk, timestamps).

6. **Crie a migration**:
```bash
make makemigrations
```

7. **Implemente os selectors** em `selectors.py` (queries read-only).

8. **Implemente os UseCases** em `services/<entidade>.py`.

9. **Implemente os serializers** em `serializers.py`.

10. **Implemente as views** em `views.py` usando os UseCases.

11. **Configure as URLs** em `urls.py`:
```python
from rest_framework.routers import DefaultRouter
from .views import MyViewSet

router = DefaultRouter()
router.register(r"<nome-do-recurso>", MyViewSet, basename="<nome>")
urlpatterns = router.urls
```

12. **Inclua as URLs** em `backend/src/config/urls.py`:
```python
path("api/<nome-do-app>/", include("src.<nome_do_app>.urls")),
```

13. **Crie as factories** em `tests/factories.py`.

14. **Escreva os testes** em `tests/test_<nome>.py`.

15. **Rode os testes** para verificar:
```bash
make test-backend
```

16. **Registre no admin** em `admin.py` se necessário.

17. **Crie o `.context.md`** do app com: propósito, models, endpoints, services, dependências, testes e frontend correspondente. Veja os `.context.md` existentes em outros apps como referência.
