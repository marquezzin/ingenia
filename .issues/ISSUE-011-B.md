# [ISSUE-011-B] Service de Submissão de Código + Endpoint

## Contexto

Sub-issue de [ISSUE-011](./ISSUE-011.md) — Backend Aluno (Fase 3).
Implementar o service e endpoint de submissão de código pelo aluno.

## Descrição

Criar o endpoint de submissão que recebe o código fonte do aluno e dispara a avaliação assíncrona.

> **Dependência**: ISSUE-004 (Submission model), ISSUE-003 (Exercise), 007-C (IsStudent).

### Tarefas

1. **Endpoint `POST /api/v1/student/submissions/`**:
   - Campos: `exercise_id`, `source_code`
   - Cria registro `Submission` com `evaluation_status=PENDING`
   - Dispara Celery task de avaliação (ISSUE-012)
   - Retorna `submission_id` e status

2. **Service de submissão**:
   - Validar que aluno está autenticado
   - Validar que exercício está publicado (BR-011)
   - Criar `Submission` em transação
   - Disparar task `.delay(submission_id)`

3. **Serializer de submissão**:
   - Input: `exercise_id`, `source_code`
   - Output: `id`, `evaluation_status`, `submitted_at`

## Critérios de Aceite

- [ ] Endpoint cria Submission corretamente
- [ ] BR-011: Só aluno autenticado pode submeter para exercício publicado
- [ ] Task de avaliação é disparada assincronamente
- [ ] Status retornado como `PENDING`
- [ ] Validação de tamanho máximo de source_code

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
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | BR-011 |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-003 steps 1-4 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
