# ingenia — Template Base

Template full-stack **Django + DRF** (backend) e **Vite + React + Mantine** (frontend).

## Quick Start

```bash
# 1. Clone o template
git clone <repo-url> meu-projeto && cd meu-projeto

# 2. Setup automático (renomeia, builda, sobe, migra, popula)
./init.sh meu-projeto

# Ou manualmente:
cp .env.example .env
make dev
```

## Comandos Principais

```bash
make help            # Lista todos os comandos
make dev             # Build + up + migrate + seed (one-liner)
make status          # Status dos containers e módulos
make up / down       # Sobe / derruba serviços
make migrate         # Aplica migrations
make seed            # Popula banco com dados iniciais
make reset-db        # Derruba e recria banco do zero
make shell           # Shell Django interativo
```

## Testes

```bash
make test            # Todos (backend + frontend + E2E)
make test-backend    # pytest com DB separado
make test-frontend   # vitest (unitários)
make test-e2e        # Playwright (full pipeline)
make test-reset      # Reset containers de teste
```

> Testes usam banco separado (`hub_test_db` em tmpfs via `docker/compose.test.yml`).

## Lint

```bash
make lint            # Backend (ruff) + Frontend (eslint + tsc)
```

## Estrutura

```
├── .agent/              → Regras e workflows para agentes IA
├── .context.md          → Contexto do projeto para IA
├── .template.yml        → Manifesto do template
├── .github/workflows/   → CI pipeline (GitHub Actions)
├── backend/src/
│   ├── config/          → Settings, URLs, Celery, modules
│   ├── accounts/        → Auth + User model (core)
│   ├── ai/              → Integração LLM (opcional)
│   └── core/            → Utilities compartilhados
├── frontend/src/
│   ├── app/             → Routes, providers, modules
│   ├── shared/          → Auth, HTTP, Design System
│   │   └── ui/          → Tokens, tema Mantine, componentes
│   └── domains/         → Um por domínio (espelha apps Django)
├── docker/
│   ├── compose.yml      → Serviços principais
│   └── compose.test.yml → Override para testes
├── docs/                → Documentação técnica
├── Makefile             → Todos os comandos
└── init.sh              → Setup inicial do template
```

## Módulos Opcionais

Ative/desative módulos via variáveis de ambiente no `.env`:

```env
MODULE_AI_ENABLED=true       # Backend — ativa src.ai
VITE_MODULE_AI_ENABLED=true  # Frontend — ativa domain/rotas AI
```

## Portas

| Serviço    | Porta |
|-----------|-------|
| Frontend  | 5173  |
| Backend   | 8000  |
| Postgres  | 5432  |
| Redis     | 6379  |

## Credenciais Dev

| Tipo    | Email          | Senha    |
|--------|---------------|---------|
| Admin  | admin@hub.dev | admin123 |
| Usuário | user@hub.dev  | user123  |

## Component Catalog

Acesse `/dev/components` para visualizar todos os componentes da lib com exemplos interativos.

## Design System

- `shared/ui/tokens.css` → CSS design tokens (cores, espaçamento, tipografia)
- `shared/ui/theme.ts` → Tema Mantine sincronizado
- `shared/ui/components/` → DataTable, StatCard, PageHeader, StatusBadge, etc.

**Para mudar o visual**, edite apenas `tokens.css`.

## Deploy em Produção

Stack atual: VPS com Traefik (TLS via Let's Encrypt) + `docker/compose.prod.yml`.
O arquivo `.env.prod` fica **apenas no servidor** (contém secrets) — versionar é só `compose.prod.yml`.

```bash
# No servidor, na raiz do repo — deploy completo (pull + build + up + migrate):
make prod-deploy

# Outros comandos úteis em prod:
make prod-logs       # tail dos logs
make prod-status     # status dos containers
make prod-restart    # reinicia tudo
make prod-shell      # shell Django
make prod-seed       # popula com dados iniciais (cuidado)
```

Pontos de atenção do deploy atual (a melhorar):

- Backend roda `manage.py runserver` (dev server) — trocar por gunicorn/uvicorn.
- Frontend roda `pnpm dev` (Vite dev server) — fazer build estático servido por nginx.
- `DJANGO_SETTINGS_MODULE=config.settings.base` em prod — falta um `settings/prod.py` com hardening (DEBUG=False, SECURE_SSL_REDIRECT, etc).
- Sem `migrate` / `collectstatic` automático no boot.

## Documentação Técnica

| Área      | Local                   |
|----------|------------------------|
| Backend  | `docs/backend/`        |
| Frontend | `docs/frontend/`       |
| Contexto | `.context.md` em cada app/domain |

## Para a IA

1. Leia `.context.md` antes de modificar qualquer módulo
2. Consulte `.agent/rules/` para regras do projeto
3. Use `.agent/workflows/` para tarefas recorrentes
4. Veja `.template.yml` para entender módulos disponíveis
