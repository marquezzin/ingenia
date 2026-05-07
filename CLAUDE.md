# ingenia

Monorepo full-stack com **Django + DRF** (backend) e **Vite + React + Mantine** (frontend). Template base para projetos da Synaptha.

## Estrutura

```
ingenia/
├── backend/        Django apps (Python 3.14, uv)
├── frontend/       Vite + React + TypeScript (pnpm)
├── docker/         compose.yml, Dockerfiles
├── docs/           Documentação técnica detalhada
├── .issues/        Issues e tracker do projeto
└── Makefile        Comandos do projeto
```

Cada subdiretório (`backend/`, `frontend/`, `docker/`, `.issues/` e cada app/domain) tem seu próprio `CLAUDE.md` com regras e contexto específicos. Eles são auto-carregados quando você toca arquivos naquele subtree — não precisa lê-los manualmente.

## Mapa App Django ↔ Domain Frontend

| Backend App  | Frontend Domain     | Descrição                            |
|--------------|---------------------|--------------------------------------|
| `accounts`   | `auth`              | Autenticação JWT, User model         |
| `curriculum` | `admin` / `student` | Módulos, aulas, exercícios           |
| `submissions`| `student`           | Submissões de código + Skulpt        |
| `progress`   | `student` / `teacher` | Progresso acadêmico                |
| `classes`    | `admin` / `teacher` | Turmas e matrículas                  |
| `ai`         | *(sem domain)*      | Jobs de IA via Celery                |
| `core`       | `shared/`           | Utilitários compartilhados           |
| `config`     | `app/`              | Settings / bootstrap                 |

## Criando uma feature nova

Toda feature de produto neste projeto = **1 app Django + 1 domain frontend espelhando**. Os dois lados são criados juntos seguindo os workflows oficiais:

- Backend: rode `/add-backend-app` (definido em `.claude/commands/add-backend-app.md`)
- Frontend: rode `/add-frontend-domain` (definido em `.claude/commands/add-frontend-domain.md`)
- Testes: rode `/run-tests` para validar

Quando o usuário pedir "criar feature X", siga ambos workflows na ordem (backend primeiro, depois domain frontend espelhando).

## Package Managers

**NUNCA** edite manualmente `pyproject.toml`, `uv.lock`, `package.json` ou `pnpm-lock.yaml` para adicionar/remover dependências.

- Python: `uv add <pacote>` / `uv add --dev <pacote>` / `uv sync` / `uv run <cmd>`
- Node: `pnpm add <pacote>` / `pnpm add -D <pacote>` / `pnpm install`
- Python version: 3.14 (em `backend/.python-version`)

## Comandos via Makefile

Sempre prefira o Makefile a comandos diretos.

```bash
make help           # Lista todos os comandos
make up             # Sobe os serviços
make migrate        # Aplica migrations
make seed           # Popula o banco
make test           # Roda todos os testes
make lint           # Roda todos os lints
make shell          # Shell Django
```

## Variáveis de Ambiente

- Configurações sensíveis em `.env` (não versionado). `.env.example` documenta tudo.
- **Nunca hardcode** credenciais, URLs ou secrets no código.
- Backend: `python-decouple`. Frontend: `import.meta.env`.

## Commits

Em inglês, formato `type(scope): description` (`feat`, `fix`, `refactor`, `test`, `docs`, `chore`).
Branches: `feature/`, `fix/`, `chore/` + descrição em kebab-case.

## Convenções de Código

- **Geral**: UTF-8, LF, sem trailing whitespace, final newline.
- **Python**: 4 espaços, max line 88 (ruff), `ruff format` + `ruff check`, type hints em funções públicas.
- **TypeScript**: 2 espaços, strict mode, ESLint + Prettier.

## Portas

| Serviço   | Porta |
|-----------|-------|
| Frontend  | 5173  |
| Backend   | 8000  |
| Postgres  | 5432  |
| Redis     | 6379  |

## Credenciais Dev

| Tipo    | Email          | Senha     |
|---------|----------------|-----------|
| Admin   | admin@hub.dev  | admin123  |
| Usuário | user@hub.dev   | user123   |

## Documentação Técnica

- `docs/backend/` — Arquitetura, padrões de apps, services, selectors, testes, API
- `docs/frontend/` — Arquitetura de domínios, contratos de API, state management, E2E
- `.issues/TRACKER.md` — Fonte de verdade de status de issues
