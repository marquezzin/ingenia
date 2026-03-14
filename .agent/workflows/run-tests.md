---
description: como rodar os diferentes tipos de teste do projeto
---

# Workflow: Rodar Testes

## Conceitos

- **DB de teste separado**: todos os testes usam `hub_test_db` via `docker/compose.test.yml`
- **Seed determinístico**: `seed_test` sempre cria os mesmos dados (admin@test.dev / user@test.dev)
- **Containers isolados**: testes sobem `db_test` em tmpfs (rápido, sem persistir)
- **Celery desabilitado**: tasks rodam em modo eager durante testes

## Todos os Testes (pipeline completo)

```bash
# Roda backend + frontend + E2E e derruba tudo no final
make test
```

## Backend (pytest)

```bash
# Todos os testes (sobe DB de teste automaticamente)
make test-backend

# Com cobertura
make test-backend-cov

# Testes de um app específico (dentro do container)
docker compose -f docker/compose.yml -f docker/compose.test.yml run --rm \
    -e DJANGO_SETTINGS_MODULE=config.settings.test \
    backend uv run pytest src/<app>/tests/ -v

# Teste específico
docker compose -f docker/compose.yml -f docker/compose.test.yml run --rm \
    -e DJANGO_SETTINGS_MODULE=config.settings.test \
    backend uv run pytest src/<app>/tests/test_<nome>.py::<TestClass>::<test_method> -v
```

## Frontend — Unitários (vitest)

```bash
make test-frontend
```

## E2E (Playwright)

```bash
# Pipeline completo: sobe containers → seed → runserver → playwright
make test-e2e

# Com UI interativa (para debug, acessível em http://localhost:8080)
make test-e2e-ui

# Spec específico (após make test-up + make test-seed)
docker compose -f docker/compose.yml -f docker/compose.test.yml exec frontend \
    pnpm exec playwright test src/domains/<dominio>/e2e/<spec>.spec.ts
```

## Gerenciamento de Containers de Teste

```bash
make test-up      # Sobe containers de teste
make test-down    # Derruba e remove volumes
make test-seed    # Migrations + seed determinístico
make test-reset   # test-down + test-up + test-seed (reset completo)
```

## Credenciais de Teste

| Tipo    | Email           | Senha        |
|---------|----------------|-------------|
| Admin   | admin@test.dev | Test@123456 |
| Usuário | user@test.dev  | Test@123456 |
