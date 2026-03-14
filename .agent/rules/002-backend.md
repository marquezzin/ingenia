---
trigger: model_decision
description: Criando ou modificando app Django
---

# Regras de Backend — Django + DRF

> Leia também: `001-workspace.md` (regras gerais)
> Documentação detalhada: `docs/backend/`

## Estrutura de um App Django

Todo app Django segue esta estrutura padrão:

```
backend/src/<nome_do_app>/
├── __init__.py
├── apps.py
├── models.py           # Modelos de dados
├── serializers.py      # Serializers DRF
├── urls.py             # Rotas do app
├── views.py            # ViewSets / APIViews
├── selectors.py        # Queries read-only (sem lógica de negócio)
├── services/
│   ├── __init__.py     # Exporta os UseCases
│   └── <entidade>.py   # UseCases por entidade
├── admin.py            # Registro no admin Django
└── tests/
    ├── __init__.py
    ├── factories.py    # Factory Boy factories
    └── test_<nome>.py  # Testes
```

Para criar um novo app, siga o workflow: `.agent/workflows/add-backend-app.md`

## Camadas da Arquitetura

### 1. Models (`models.py`)
- Apenas definição de dados e relacionamentos
- Sem lógica de negócio nos models
- Sempre use `created_at` e `updated_at` com `auto_now_add` e `auto_now`
- Use `UUIDField` como primary key quando possível

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
```

### 2. Selectors (`selectors.py`)
- **Apenas queries** — sem efeitos colaterais
- Funções puras que retornam querysets ou objetos
- Nomeadas como `get_<entidade>_by_<campo>()` ou `list_<entidades>_for_<contexto>()`

```python
from django.db import models
from .models import MyModel

def get_my_model_by_id(*, id: str) -> MyModel:
    return MyModel.objects.get(id=id)

def list_my_models_for_user(*, user) -> models.QuerySet[MyModel]:
    return MyModel.objects.filter(owner=user).select_related("owner")
```

### 3. Services / UseCases (`services/<entidade>.py`)
- **Toda lógica de negócio** fica aqui
- Cada UseCase é uma classe com método `execute()`
- Recebe inputs via dataclass ou kwargs nomeados
- Retorna resultado ou lança exceção de `core.errors`
- **Nunca** acessa `request` diretamente — recebe dados já extraídos

```python
from dataclasses import dataclass
from core.errors import ApplicationError
from ..models import MyModel
from ..selectors import get_my_model_by_id

@dataclass
class CreateMyModelInput:
    name: str
    owner_id: str

@dataclass
class CreateMyModelResult:
    instance: MyModel

class CreateMyModelUseCase:
    def execute(self, *, input: CreateMyModelInput) -> CreateMyModelResult:
        if not input.name.strip():
            raise ApplicationError("Name cannot be empty")
        instance = MyModel.objects.create(
            name=input.name,
            owner_id=input.owner_id,
        )
        return CreateMyModelResult(instance=instance)
```

### 4. Serializers (`serializers.py`)
- Herdam de `core.serializers.BaseModelSerializer`
- Separar serializers de leitura e escrita quando necessário
- Nunca coloque lógica de negócio no `validate_*` ou `create/update` do serializer

### 5. Views (`views.py`)
- Use `ModelViewSet` ou `APIView` do DRF
- A view **extrai dados** do request e **chama o UseCase**
- Trate exceções de `core.errors` e retorne respostas padronizadas

```python
from rest_framework import viewsets, status
from rest_framework.response import Response
from core.errors import ApplicationError
from .services import CreateMyModelUseCase, CreateMyModelInput
from .serializers import MyModelSerializer

class MyModelViewSet(viewsets.ModelViewSet):
    serializer_class = MyModelSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            result = CreateMyModelUseCase().execute(
                input=CreateMyModelInput(
                    name=serializer.validated_data["name"],
                    owner_id=str(request.user.id),
                )
            )
        except ApplicationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(MyModelSerializer(result.instance).data, status=status.HTTP_201_CREATED)
```

## Core Utilities

### Erros (`core/errors.py`)
```python
from core.errors import ApplicationError, NotFoundError, PermissionDeniedError
raise ApplicationError("Mensagem de erro")
raise NotFoundError("Recurso não encontrado")
```

### Paginação
- Use `StandardPagination` de `core.pagination` (page_size=20)
- Configurada globalmente no `REST_FRAMEWORK` settings

## Configurações

### Settings
- `config/settings/base.py` — configurações compartilhadas
- `config/settings/local.py` — desenvolvimento local (DEBUG=True)
- `config/settings/test.py` — testes (banco separado, sem migrations pesadas)
- Variável de ambiente `DJANGO_SETTINGS_MODULE` controla qual usar

### Banco de Dados
- Postgres 18 em produção e desenvolvimento
- Use `DATABASE_URL` via `python-decouple`
- Migrations sempre versionadas no git

## Autenticação

- JWT via `djangorestframework-simplejwt`
- Endpoints: `POST /api/auth/login/`, `POST /api/auth/refresh/`, `GET /api/auth/me/`
- Header: `Authorization: Bearer <token>`

## Convenções de URL

```
GET    /api/<recurso>/          # list
POST   /api/<recurso>/          # create
GET    /api/<recurso>/<id>/     # retrieve
PUT    /api/<recurso>/<id>/     # update
PATCH  /api/<recurso>/<id>/     # partial_update
DELETE /api/<recurso>/<id>/     # destroy
```

## Comandos Úteis

```bash
make migrate                    # Aplica migrations
make makemigrations             # Cria novas migrations
make shell                      # Shell Django
make test-backend               # Roda pytest
make lint-backend               # Ruff check + format
```

## Documentação Detalhada

- [Arquitetura](../../docs/backend/01-architecture.md)
- [Padrão de Apps](../../docs/backend/02-apps-pattern.md)
- [Services e UseCases](../../docs/backend/03-services-usecases.md)
- [Selectors](../../docs/backend/04-selectors.md)
- [Testes](../../docs/backend/05-testing.md)
- [Convenções de API](../../docs/backend/06-api-conventions.md)
