# Ingenia

Plataforma educacional para introduzir programação a estudantes do 8º e 9º ano através de uma trilha estruturada de aulas, exercícios práticos e correção automática.

## O que é

Ingenia transforma o "começar a programar" em uma jornada clara: o aluno assiste a uma aula em vídeo, lê o conteúdo escrito, resolve exercícios em Python direto no navegador (executados via Skulpt), recebe feedback imediato e vê o progresso avançar módulo a módulo. Professores acompanham o desempenho da turma e de cada aluno individualmente.

A trilha é organizada em módulos progressivos cobrindo os fundamentos da programação, onde cada módulo desbloqueia ao concluir o anterior. O conteúdo específico (módulos, aulas, exercícios) é gerenciado pelo administrador via painel — não é fixo no código.

## Funcionalidades

### Para Estudantes
- Trilha de módulos com progresso visual e CTA "Continuar de onde parei"
- Aulas com vídeo embed (YouTube/Vimeo) + conteúdo markdown
- Editor de código (Monaco) com execução Python no navegador (Skulpt)
- Avaliação automática contra casos de teste (visíveis e ocultos)
- Feedback pedagógico instantâneo sem expor a resposta
- Histórico de submissões por exercício e geral

### Para Professores
- Gestão de turmas (criação, edição, status ativo/arquivado)
- Matrícula de alunos por busca
- Visão consolidada de progresso da turma (alunos que iniciaram, concluíram, etc.)
- Drill-down do progresso individual por módulo → aula → exercício

### Para Administradores
- CRUD completo de módulos, aulas, vídeo-aulas e exercícios com casos de teste
- Gestão de usuários por role (Aluno, Professor, Admin)
- Visão read-only de turmas e dashboard com métricas agregadas

## Stack

| Camada    | Tecnologia                                                        |
|-----------|-------------------------------------------------------------------|
| Backend   | Django 5 + DRF, Python 3.14, PostgreSQL 18, Redis, Celery         |
| Frontend  | Vite + React + TypeScript, Mantine v7, TanStack Query, Skulpt     |
| Auth      | JWT (djangorestframework-simplejwt) com refresh                   |
| Editor    | Monaco Editor                                                     |
| Infra     | Docker Compose, uv (backend), pnpm (frontend), Traefik (prod)     |
| Testes    | pytest + factory_boy, Vitest, Playwright                          |

## Quick Start

```bash
# 1. Clone o repositório
git clone <repo-url> ingenia && cd ingenia

# 2. Configure o ambiente
cp .env.example .env

# 3. Build + up + migrate + seed (one-liner)
make dev
```

Acesse o frontend em http://localhost:5173 e a API em http://localhost:8000. O comando `make seed` popula o banco com módulos, aulas, exercícios e usuários de exemplo.

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
├── CLAUDE.md            → Visão geral + convenções globais (Claude Code)
├── .claude/commands/    → Slash commands (workflows recorrentes)
├── .template.yml        → Manifesto do template
├── .github/workflows/   → CI pipeline (GitHub Actions)
├── backend/
│   ├── CLAUDE.md        → Regras backend (Django/DRF/pytest)
│   └── src/
│       ├── config/      → Settings, URLs, Celery, módulos opcionais
│       ├── core/        → Erros, paginação, permissions, seed
│       ├── accounts/    → Auth + User + Student/Teacher/Admin profiles
│       ├── curriculum/  → Módulos, aulas, vídeo-aulas, exercícios, test cases
│       ├── submissions/ → Submissões de código + resultados
│       ├── progress/    → Progresso aluno (módulo/aula/exercício) + visão professor
│       ├── classes/     → Turmas e matrículas
│       └── ai/          → Jobs de IA via Celery (opcional)
├── frontend/
│   ├── CLAUDE.md        → Regras frontend (React/Vite/vitest/Playwright)
│   └── src/
│       ├── app/         → Routes, providers, layout
│       ├── shared/      → Auth, HTTP, Design System
│       │   └── ui/      → Tokens, tema Mantine, componentes
│       └── domains/
│           ├── auth/    → Login, registro, refresh
│           ├── student/ → Trilha, aulas, exercícios + Skulpt
│           ├── teacher/ → Turmas, progresso de alunos
│           ├── admin/   → CRUD de conteúdo + gestão de usuários
│           └── landing/ → Página pública
├── docker/
│   ├── CLAUDE.md        → Regras Docker
│   ├── compose.yml      → Serviços principais
│   └── compose.test.yml → Override para testes
├── docs/                → Documentação técnica
├── .issues/             → Issues e tracker do projeto
├── Makefile             → Todos os comandos
└── init.sh              → Setup inicial
```

Cada app Django (`backend/src/<app>/`) e cada domain frontend (`frontend/src/domains/<dominio>/`) tem seu próprio `CLAUDE.md` com models/types, endpoints, services/hooks, dependências e testes específicos.

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

Criadas pelo `make seed`:

| Role       | Email               | Senha       |
|------------|---------------------|-------------|
| Admin      | admin@hub.dev       | admin123    |
| Professor  | teacher1@hub.dev    | teacher123  |
| Aluno      | user@hub.dev        | user123     |
| Aluno      | student2@hub.dev    | user123     |
| Aluno      | student3@hub.dev    | user123     |

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

| Área      | Local                                |
|-----------|--------------------------------------|
| Backend   | `docs/backend/`                      |
| Frontend  | `docs/frontend/`                     |
| Contexto  | `CLAUDE.md` em cada app/domain       |

## Para a IA (Claude Code)

O projeto usa o padrão nativo do Claude Code:

1. `CLAUDE.md` na raiz e em cada subdiretório (auto-carregado quando o agente toca arquivos naquele subtree)
2. Workflows recorrentes como slash commands em `.claude/commands/` (`/add-backend-app`, `/add-frontend-domain`, `/run-tests`)
3. `.template.yml` documenta os módulos disponíveis
