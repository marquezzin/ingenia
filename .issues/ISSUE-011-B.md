# [ISSUE-011-B] Service de Submissão de Código + Endpoint

## Contexto

Sub-issue de [ISSUE-011](./ISSUE-011.md) — Backend Aluno (Fase 3).
Implementar o service e endpoint de submissão de código pelo aluno.

## Descrição

Criar o endpoint de submissão que recebe o código fonte do aluno **junto com o resultado já avaliado pelo frontend (via Skulpt)** e persiste `Submission` + `SubmissionResult`.

> **Dependência**: ISSUE-004 (Submission model), ISSUE-003 (Exercise), 007-C (IsStudent).
> **Nota**: Com a migração para Skulpt, este endpoint é **síncrono** — não dispara Celery task. O frontend envia o resultado já avaliado.

### Tarefas

1. **Endpoint `POST /api/v1/student/submissions/`**:
   - Campos: `exercise_id`, `source_code`, `score_percentage`, `passed_tests_count`, `failed_tests_count`, `result_status`, `feedback_message`
   - Cria registro `Submission` com `evaluation_status=EVALUATED`
   - Cria `SubmissionResult` associado
   - Retorna `submission_id`, `evaluation_status`, `score_percentage`

2. **Service de submissão**:
   - Validar que aluno está autenticado (IsStudent)
   - Validar que exercício está publicado (BR-011)
   - Criar `Submission` + `SubmissionResult` em transação atômica
   - Chamar service de progresso (011-C) se resultado PASSED

3. **Serializer de submissão**:
   - Input: `exercise_id`, `source_code`, `score_percentage`, `passed_tests_count`, `failed_tests_count`, `result_status`, `feedback_message`
   - Output: `id`, `evaluation_status`, `score_percentage`, `submitted_at`

## Critérios de Aceite

- [x] Endpoint cria Submission + SubmissionResult corretamente
- [x] BR-011: Só aluno autenticado pode submeter para exercício publicado
- [x] BR-012: Cada submissão gera exatamente um resultado (transação atômica)
- [x] Status retornado como `EVALUATED`
- [x] Validação de tamanho máximo de source_code
- [x] Validação de score entre 0-100

## Arquivos Afetados

- `backend/src/submissions/serializers.py` — SubmissionCreateSerializer
- `backend/src/submissions/services/` — submission service
- `backend/src/submissions/views.py` — SubmissionCreateView
- `backend/src/submissions/urls.py` — rotas

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-011** | `.issues/ISSUE-011.md` | Contexto completo |
| **ISSUE-012** | `.issues/ISSUE-012.md` | Arquitetura Skulpt (resultado vem do frontend) |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | BR-011, BR-012 |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-003 steps 1-4 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-26
