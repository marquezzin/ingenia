# App: config

## Propósito
Configuração central do Django: settings, URLs, Celery, WSGI/ASGI.

## Módulos

### `settings/`
- **`base.py`** — Settings base compartilhados (DB, REST, JWT, CORS, Celery, AI)
- **`local.py`** — Desenvolvimento local (DEBUG=True, ALLOWED_HOSTS=*)
- **`test.py`** — Testes (DB separado via env, Celery eager, sem validators)
- **`modules.py`** — Registro de módulos opcionais (ativados via env vars)

### Módulos Opcionais (`modules.py`)
Apps podem ser ativados/desativados via variáveis de ambiente:

| Variável              | Default | App           |
|----------------------|---------|---------------|
| `MODULE_AI_ENABLED`  | true    | `src.ai`      |

### `urls.py`
- Rotas core: `/admin/`, `/api/auth/`, `/api/schema/`, `/api/docs/`
- Rotas opcionais: incluídas condicionalmente via `apps.is_installed()`

### `celery.py`
- Configuração do Celery com autodiscovery de tasks

## Dependências
- Nenhuma — é o ponto de entrada da aplicação

## Frontend Correspondente
- `frontend/src/app/` (routes, providers, modules)
