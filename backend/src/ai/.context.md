# App: ai

## Propósito
Integração com LLMs (OpenRouter, OpenAI). Gerencia jobs de IA com execução assíncrona via Celery.

## Models
- **`AIJob`** — Registra cada chamada de IA (input, output, status, duração, usage)
  - Status: `pending` → `running` → `success` | `failed`
  - Campos: `provider`, `model`, `messages` (JSON), `json_schema` (opcional), `result`, `error`

## Endpoints (`/api/ai/`)

| Método | Rota           | View              | Descrição                    |
|--------|---------------|-------------------|------------------------------|
| GET    | `jobs/`       | `AIJobViewSet`    | Lista jobs (user vê os seus, admin vê todos) |
| GET    | `jobs/:id/`   | `AIJobViewSet`    | Detalhe de um job            |
| POST   | `jobs/`       | `AIJobViewSet`    | Cria job → dispara task Celery |
| POST   | `jobs/batch/` | `AIJobViewSet`    | Cria múltiplos jobs em batch |

## Services (`services/ai_job.py`)
- **`CreateAIJobUseCase`** — Cria AIJob + dispara task `run_ai_job`
- **`CreateBatchAIJobsUseCase`** — Cria N jobs + dispara `run_ai_jobs_batch`

## Tasks Celery (`tasks.py`)
- **`run_ai_job(job_id)`** — Executa um job (3 retries com backoff)
- **`run_ai_jobs_batch(job_ids)`** — Dispara grupo de sub-tasks

## Providers (`providers/`)
- **`base.py`** — `AIProvider` ABC + `AIRequest`/`AIResponse` dataclasses
- **`openrouter.py`** — Provider para OpenRouter API
- **`openai.py`** — Provider para OpenAI API direta
- **`__init__.py`** — `get_provider(name)` factory

## Configuração (`settings/base.py`)
- `OPENROUTER_API_KEY`, `OPENROUTER_BASE_URL`
- `AI_DEFAULT_MODEL`, `AI_REQUEST_TIMEOUT`

## Dependências
- `accounts` (via `created_by` FK em `AIJob`)
- Redis (Celery broker)

## Frontend Correspondente
- Sem domain dedicado no momento
