# Regras Gerais do Workspace — ingenia

> **Leia este arquivo em toda tarefa**, independente do contexto.

## Gerenciadores de Pacotes

### Python — `uv`
- **NUNCA** edite `pyproject.toml` ou `uv.lock` manualmente para adicionar/remover dependências
- Adicionar dependência de produção: `uv add <pacote>`
- Adicionar dependência de desenvolvimento: `uv add --dev <pacote>`
- Instalar todas as dependências: `uv sync`
- Rodar comando no ambiente: `uv run <comando>`
- A versão do Python é **3.14** (definida em `backend/.python-version`)

### Node — `pnpm`
- **NUNCA** edite `package.json` ou `pnpm-lock.yaml` manualmente para adicionar/remover dependências
- Adicionar dependência de produção: `pnpm add <pacote>`
- Adicionar dependência de desenvolvimento: `pnpm add -D <pacote>`
- Instalar todas as dependências: `pnpm install`
- Rodar script: `pnpm <script>`

## Estrutura do Monorepo

```
ingenia/
├── .agent/      # Regras e workflows para agentes
├── .issues/     # Issues e tracker do projeto
├── backend/     # Django + DRF (Python 3.14, uv)
├── frontend/    # Vite + React + TypeScript (pnpm)
├── docker/      # Docker Compose e Dockerfiles
├── docs/        # Documentação técnica
└── Makefile     # Comandos do projeto
```

## Comandos via Makefile

Sempre use o Makefile para executar tarefas. **Não rode comandos diretamente** sem passar pelo Docker Compose (exceto em desenvolvimento local sem Docker).

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

- Todas as configurações sensíveis ficam em `.env` (não versionado)
- O arquivo `.env.example` contém todas as variáveis necessárias com valores de exemplo
- **Nunca hardcode** credenciais, URLs ou secrets no código
- Use `python-decouple` no backend e `import.meta.env` no frontend para ler variáveis

## Convenções de Código

### Geral
- Encoding: UTF-8
- Line endings: LF
- Trailing whitespace: removido
- Final newline: sempre presente

### Python
- Indentação: 4 espaços
- Max line length: 88 (ruff)
- Formatter: `ruff format`
- Linter: `ruff check`
- Type hints: obrigatórios em funções públicas

### TypeScript / JavaScript
- Indentação: 2 espaços
- Strict mode: habilitado
- Linter: ESLint
- Formatter: Prettier (via ESLint)

## Commits e Branches

- Commits em inglês, formato: `type(scope): description`
  - Tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
  - Exemplo: `feat(accounts): add password reset endpoint`
- Branches: `feature/`, `fix/`, `chore/` + descrição em kebab-case

## Contexto para IA (.context.md)

Cada app Django e cada domain frontend possui um arquivo `.context.md` que resume o propósito, models/types, endpoints/API, services/hooks, dependências e testes do módulo.

**Regras**:
1. **Sempre leia** o `.context.md` do app/domain **antes** de modificar qualquer código nele
2. **Leia** o `.context.md` raiz do projeto (na raiz do repositório) para entender o contexto geral
3. **Ao criar** um novo app Django ou domain frontend, **crie** o `.context.md` correspondente
4. **Ao alterar** endpoints, models, services ou tipos, **atualize** o `.context.md`

## Onde Criar Cada Tipo de Arquivo

| Tipo de Arquivo                | Local                                    |
|-------------------------------|------------------------------------------|
| App Django novo               | `backend/src/<nome_do_app>/`             |
| Domínio frontend novo         | `frontend/src/domains/<nome_do_dominio>/`|
| Componente compartilhado UI   | `frontend/src/shared/ui/`                |
| Hook genérico                 | `frontend/src/shared/hooks/`             |
| Utilitário puro               | `frontend/src/shared/utils/`             |
| Teste backend                 | `backend/src/<app>/tests/`               |
| Teste E2E                     | `frontend/src/domains/<dominio>/e2e/`    |
| Documentação técnica          | `docs/backend/` ou `docs/frontend/`      |
| Workflow de agente            | `.agent/workflows/`                      |
| Issue do projeto              | `.issues/ISSUE-XXX.md`                   |

## Issues e Tracker

> **Antes de trabalhar em qualquer issue, leia `.agent/rules/006-issues.md`.**

### Regra Crítica: Issues Pai vs Sub-Issues

- **Issues pai decompostas** (007, 008, 009, 010, 011, 012, 013, 014, 015, 016, 018) **NÃO devem ser executadas**. Execute apenas suas **sub-issues** (ex: `ISSUE-007-A.md`).
- **Issues atômicas** (001, 002, 003, 004, 005, 006, 017) **podem ser executadas diretamente**.
- **O `TRACKER.md` é a fonte de verdade** — consulte-o para saber o status e dependências.
- **Respeite dependências** — nunca inicie uma issue cujas dependências não estão 🟢 Concluídas.

