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

## Mantendo os CLAUDE.md atualizados

**Toda alteração que mude o contrato/estrutura de um app ou domain DEVE ser refletida no `CLAUDE.md` correspondente, no mesmo commit.** Os `CLAUDE.md` são auto-carregados em conversas futuras — se ficarem desatualizados, agentes futuros vão receber contexto errado e produzir trabalho incorreto.

Atualize o `CLAUDE.md` do app/domain quando:
- Adicionar/remover/renomear página, rota, view, endpoint, model, enum, hook, service/UseCase, selector, serializer, type/interface, schema OpenAPI, factory de teste
- Mudar regra de negócio (BR-XXX), regra de validação, ou comportamento documentado
- Adicionar/remover/mudar dependência entre apps/domains
- Adicionar template, static file, management command, task Celery, ou template de email
- Mudar contrato de API (payload, response, status code)

**Não** atualize o `CLAUDE.md` para:
- Refactors internos que não mudam a interface pública do módulo
- Bug fixes que não mudam comportamento documentado
- Mudanças puramente de estilo/formatação

Se a mudança é grande o bastante pra precisar de documentação detalhada, atualize também `docs/backend/` ou `docs/frontend/` — o `CLAUDE.md` aponta pra eles.

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
