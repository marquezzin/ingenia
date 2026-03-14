# Índice de Regras para Agentes — ingenia

Este arquivo é o **ponto de entrada** para qualquer agente de IA trabalhando neste repositório.
Leia este índice primeiro, identifique o contexto da tarefa e consulte as regras correspondentes.

## Quando Ler Cada Regra

| Situação / Tarefa                                      | Arquivo a Ler                          |
|--------------------------------------------------------|----------------------------------------|
| Qualquer tarefa neste repositório                      | `001-workspace.md` (sempre)            |
| Criando ou modificando app Django                      | `002-backend.md`                       |
| Criando ou modificando código no frontend              | `003-frontend.md`                      |
| Modificando Docker, compose, Dockerfiles, infra        | `004-docker.md`                        |
| Escrevendo ou corrigindo testes (qualquer camada)      | `005-testing.md`                       |
| Criando, modificando ou concluindo issues              | `006-issues.md`                        |
| Escolhendo a próxima issue para trabalhar              | `006-issues.md` (ler seção "Escolhendo a Próxima Issue") |
| Criando novo app Django do zero                        | `002-backend.md` + workflow `add-backend-app.md` |
| Criando novo domínio frontend do zero                  | `003-frontend.md` + workflow `add-frontend-domain.md` |
| Rodando testes                                         | `005-testing.md` + workflow `run-tests.md` |

## Estrutura das Regras

```
.agent/
├── rules/
│   ├── 000-index.md          ← Este arquivo
│   ├── 001-workspace.md      ← Regras gerais (SEMPRE ler)
│   ├── 002-backend.md        ← Django + DRF + Python
│   ├── 003-frontend.md       ← Vite + React + Domínios
│   ├── 004-docker.md         ← Docker + Infra
│   ├── 005-testing.md        ← Testes (pytest + playwright)
│   └── 006-issues.md         ← Issues e tracker
└── workflows/
    ├── add-backend-app.md    ← Como criar novo app Django
    ├── add-frontend-domain.md← Como criar novo domínio frontend
    └── run-tests.md          ← Como rodar testes
```

## Documentação Técnica

Para detalhes de arquitetura e padrões, consulte `docs/`:

- `docs/backend/` — Arquitetura, padrões de apps, services, selectors, testes, API
- `docs/frontend/` — Arquitetura de domínios, contratos de API, state management, E2E

## Princípios Fundamentais

1. **Nunca edite arquivos de dependência manualmente** — use `uv add` ou `pnpm add`
2. **Siga os padrões estabelecidos** — consulte a documentação antes de criar algo novo
3. **Testes são obrigatórios** — todo código novo deve ter testes correspondentes
4. **Consulte os workflows** — para tarefas recorrentes, existe um workflow documentado
5. **Issues e Tracker** — toda tarefa significativa deve ter uma issue; atualize o `TRACKER.md` após cada modificação
