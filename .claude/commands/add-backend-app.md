---
description: Cria um novo app Django seguindo os padrões do projeto
---

# Workflow: Criar Novo App Django

Adicionar um novo app Django ao projeto, seguindo os padrões estabelecidos.

Antes de começar, leia: `backend/CLAUDE.md`

## Passos

1. **Crie o diretório do app** em `backend/src/<nome_do_app>/`

2. **Crie os arquivos base** do app:
```
backend/src/<nome_do_app>/
├── __init__.py
├── apps.py
├── models.py
├── serializers.py
├── schemas.py
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

10. **Crie os schemas OpenAPI** em `schemas.py` — defina os decoradores `@extend_schema` em variáveis nomeadas:
```python
# schemas.py
from drf_spectacular.utils import extend_schema
from .serializers import MyInputSerializer, MyOutputSerializer

create_my_entity_schema = extend_schema(
    request=MyInputSerializer,
    responses={201: MyOutputSerializer},
    summary="Criar entidade",
)
```

11. **Implemente as views** em `views.py` usando os UseCases. Importe e aplique os schemas como decoradores:
```python
# views.py
from .schemas import create_my_entity_schema

class MyView(APIView):
    @create_my_entity_schema
    def post(self, request):
        ...
```

12. **Configure as URLs** em `urls.py`:
```python
from rest_framework.routers import DefaultRouter
from .views import MyViewSet

router = DefaultRouter()
router.register(r"<nome-do-recurso>", MyViewSet, basename="<nome>")
urlpatterns = router.urls
```

13. **Inclua as URLs** em `backend/src/config/urls.py`:
```python
path("api/<nome-do-app>/", include("src.<nome_do_app>.urls")),
```

14. **Crie as factories** em `tests/factories.py`.

15. **Escreva os testes** em `tests/test_<nome>.py`.

16. **Rode os testes** para verificar:
```bash
make test-backend
```

17. **Registre no admin** em `admin.py` se necessário.

18. **Atualize o seed** em `core/management/commands/seed.py` se o novo app precisa de dados iniciais para desenvolvimento:
    - Adicione um método `_seed_<entidade>()` com os dados de dev
    - Use `get_or_create()` para garantir idempotência
    - Chame o novo método no `handle()` do command
    - Rode `make seed` para verificar

19. **Crie o `CLAUDE.md`** do app com: propósito, models, endpoints, services, dependências, testes e frontend correspondente. Veja os `CLAUDE.md` existentes em outros apps como referência.
