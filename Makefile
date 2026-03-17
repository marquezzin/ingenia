# ingenia — Makefile
# Todos os comandos rodam via Docker Compose por padrão.
# Use `make help` para ver todos os comandos disponíveis.

COMPOSE = docker compose -f docker/compose.yml
BACKEND = $(COMPOSE) exec backend
FRONTEND = $(COMPOSE) exec frontend

.PHONY: help init dev status reset-db up down build restart logs \
        migrate makemigrations seed shell \
        test-up test-down test-seed test-reset \
        test-backend test-backend-cov test-frontend test-e2e test-e2e-ui test \
        lint-backend lint-frontend lint setup-hooks \
        install-backend install-frontend

# ─── Help ─────────────────────────────────────────────────────────────────────
help: ## Mostra este menu de ajuda
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'

# ─── Setup & DX ──────────────────────────────────────────────────────────────
init: ## Setup inicial do projeto (renomeia, builda, sobe)
	@bash init.sh

dev: ## One-liner: build → up → migrate → seed
	$(COMPOSE) up -d --build --wait
	$(BACKEND) uv run python manage.py migrate --no-input
	$(BACKEND) uv run python manage.py seed
	@echo ""
	@echo "✓ Projeto rodando!"
	@echo "  Frontend:  http://localhost:5173"
	@echo "  Backend:   http://localhost:8000/api/"
	@echo "  API Docs:  http://localhost:8000/api/docs/"

status: ## Mostra status dos containers e módulos
	@echo "─── Containers ──────────────────────────────"
	@$(COMPOSE) ps
	@echo ""
	@echo "─── Módulos (backend) ───────────────────────"
	@$(BACKEND) uv run python -c "from config.settings.modules import get_enabled_module_names; print('  Ativos:', ', '.join(get_enabled_module_names()) or 'nenhum')" 2>/dev/null || echo "  (containers não estão rodando)"

reset-db: ## Derruba e recria o banco do zero
	$(COMPOSE) down db -v
	$(COMPOSE) up -d db --wait
	$(BACKEND) uv run python manage.py migrate --no-input
	$(BACKEND) uv run python manage.py seed
	@echo "✓ Banco recriado e populado."

# ─── Infra ────────────────────────────────────────────────────────────────────
up: ## Sobe todos os serviços em background
	$(COMPOSE) up -d

down: ## Derruba todos os serviços
	$(COMPOSE) down

build: ## Builda as imagens Docker
	$(COMPOSE) build

restart: ## Reinicia todos os serviços
	$(COMPOSE) restart

logs: ## Tail dos logs de todos os serviços
	$(COMPOSE) logs -f

logs-backend: ## Tail dos logs do backend
	$(COMPOSE) logs -f backend

logs-frontend: ## Tail dos logs do frontend
	$(COMPOSE) logs -f frontend

# ─── Backend ──────────────────────────────────────────────────────────────────
migrate: ## Aplica as migrations no banco
	$(BACKEND) uv run python manage.py migrate

makemigrations: ## Cria novas migrations
	$(BACKEND) uv run python manage.py makemigrations

seed: ## Popula o banco com dados iniciais
	$(BACKEND) uv run python manage.py seed

shell: ## Abre shell Django no container backend
	$(BACKEND) uv run python manage.py shell

shell-db: ## Abre psql no container do banco
	$(COMPOSE) exec db psql -U ingenia_user -d ingenia_db

install-backend: ## Instala dependências do backend (dentro do container)
	$(BACKEND) uv sync

# ─── Frontend ─────────────────────────────────────────────────────────────────
install-frontend: ## Instala dependências do frontend (dentro do container)
	$(FRONTEND) pnpm install

# ─── Testes ───────────────────────────────────────────────────────────────────
#   Todos os comandos de teste usam um DB separado (hub_test_db) via
#   docker/compose.test.yml. O DB roda em tmpfs para velocidade.
#   O seed é executado automaticamente antes dos testes E2E.

COMPOSE_TEST = docker compose -f docker/compose.yml -f docker/compose.test.yml
BACKEND_TEST = $(COMPOSE_TEST) exec backend
FRONTEND_TEST = $(COMPOSE_TEST) exec frontend

test-up: ## Sobe containers de teste (DB separado em tmpfs)
	$(COMPOSE_TEST) up -d --wait

test-down: ## Derruba containers de teste e remove volumes
	$(COMPOSE_TEST) down -v --remove-orphans

test-seed: ## Aplica migrations e seed de teste (idempotente)
	$(BACKEND_TEST) uv run python manage.py migrate --no-input
	$(BACKEND_TEST) uv run python manage.py seed_test

test-reset: ## Derruba, sobe e popula o banco de teste do zero
	$(MAKE) test-down
	$(MAKE) test-up
	$(MAKE) test-seed

test-backend: ## Roda testes do backend (pytest) com DB de teste
	$(COMPOSE_TEST) up -d db_test redis --wait
	$(COMPOSE_TEST) run --rm -e DJANGO_SETTINGS_MODULE=config.settings.test backend uv run pytest -v
	$(COMPOSE_TEST) down db_test -v

test-backend-cov: ## Roda testes do backend com cobertura
	$(COMPOSE_TEST) up -d db_test redis --wait
	$(COMPOSE_TEST) run --rm -e DJANGO_SETTINGS_MODULE=config.settings.test backend uv run pytest -v --cov=src --cov-report=term-missing
	$(COMPOSE_TEST) down db_test -v

test-frontend: ## Roda testes unitários do frontend (vitest)
	$(FRONTEND_TEST) pnpm test

test-e2e: ## Roda E2E completo (up → seed → playwright → logs)
	$(MAKE) test-reset
	$(COMPOSE_TEST) exec -T backend uv run python manage.py runserver 0.0.0.0:8000 &
	@sleep 3
	$(FRONTEND_TEST) pnpm exec playwright test
	@echo "✓ Resultados em frontend/playwright-report/"

test-e2e-ui: ## Roda Playwright com UI interativa (http://localhost:8080)
	$(MAKE) test-reset
	$(COMPOSE_TEST) exec -T backend uv run python manage.py runserver 0.0.0.0:8000 &
	@sleep 3
	$(FRONTEND_TEST) xvfb-run pnpm exec playwright test --ui --ui-host 0.0.0.0 --ui-port 8080

test: test-backend test-frontend test-e2e test-down ## Roda todos os testes (backend + frontend + E2E)

# ─── Lint / Format ────────────────────────────────────────────────────────────
lint-backend: ## Lint + format do backend (ruff)
	$(BACKEND) uv run ruff check src/
	$(BACKEND) uv run ruff format src/

lint-frontend: ## Lint + type-check do frontend
	$(FRONTEND) pnpm lint
	$(FRONTEND) pnpm tsc --noEmit

lint: lint-backend lint-frontend ## Roda todos os lints

setup-hooks: ## Instala pre-commit hooks (ruff auto-fix no commit)
	uv tool install pre-commit
	pre-commit install
	@echo "✓ Pre-commit hooks instalados."

# ─── Celery ───────────────────────────────────────────────────────────────────
celery-worker: ## Sobe o worker do Celery manualmente
	$(COMPOSE) exec backend uv run celery -A config worker -l info

celery-beat: ## Sobe o scheduler do Celery manualmente
	$(COMPOSE) exec backend uv run celery -A config beat -l info

celery-logs: ## Tail dos logs do worker
	$(COMPOSE) logs -f celery_worker
