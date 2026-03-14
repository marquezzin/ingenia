# [ISSUE-012-A] Celery Task Básica — Receber submission_id e Atualizar Status

## Contexto

Sub-issue de [ISSUE-012](./ISSUE-012.md) — Motor de Correção (Fase 3).
Criar a task Celery que recebe uma submissão e orquestra o processo de avaliação.

## Descrição

Implementar a Celery task que será disparada pela submissão do aluno e coordenará a execução da avaliação.

> **Dependência**: ISSUE-004 (Submission model).

### Tarefas

1. **Celery task `evaluate_submission`**:
   - Receber `submission_id` como parâmetro
   - Carregar Submission do banco
   - Atualizar `evaluation_status` para `RUNNING`
   - Chamar executor de avaliação (será implementado em 012-B/C)
   - Atualizar `evaluation_status` para `EVALUATED` ou `FAILED`

2. **Configuração Celery** (se necessário):
   - Verificar config existente no template
   - Queue dedicada para avaliações (opcional)
   - Retry policy para falhas técnicas

## Critérios de Aceite

- [ ] Task registrada no Celery
- [ ] Status atualizado para `RUNNING` ao iniciar
- [ ] Status atualizado para `EVALUATED` ou `FAILED` ao finalizar
- [ ] Task executável de forma assíncrona

## Arquivos Afetados

- `backend/src/submissions/tasks.py` — Celery task
- `backend/src/config/celery.py` — config (se necessário)

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-012** | `.issues/ISSUE-012.md` | Contexto completo |
| **Architecture** | `docs/backend/01-architecture.md` | Celery e tasks |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Submission entity |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
