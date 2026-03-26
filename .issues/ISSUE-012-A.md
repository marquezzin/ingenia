# [ISSUE-012-A] Endpoint Síncrono de Submissão — Receber Resultado Avaliado e Persistir

## Contexto

Sub-issue de [ISSUE-012](./ISSUE-012.md) — Motor de Correção Skulpt (Fase 3).
Criar o endpoint de submissão que recebe o resultado já avaliado pelo frontend (via Skulpt) e persiste no banco.

## Descrição

O frontend avalia o código via Skulpt e envia o resultado consolidado. O backend apenas valida e persiste.

> **Dependência**: ISSUE-004 (Submission + SubmissionResult models).

### Tarefas

1. **Endpoint `POST /api/v1/submissions/`**:
   - Receber: `exercise_id`, `source_code`, `score_percentage`, `passed_tests_count`, `failed_tests_count`, `result_status`, `feedback_message`
   - Validar que exercício existe e está publicado
   - Validar que aluno está autenticado (IsStudent)
   - Criar `Submission` com `evaluation_status = EVALUATED`
   - Criar `SubmissionResult` associado
   - Em transação atômica

2. **Service de persistência**:
   - `SubmissionService.create_submission_with_result()`
   - Chamar service de progresso após persistência (integração com 011-C)

## Critérios de Aceite

- [ ] Endpoint aceita resultado avaliado do frontend
- [ ] Submission + SubmissionResult criados em transação atômica
- [ ] BR-012: Cada submissão gera exatamente um resultado
- [ ] BR-011: Submissão apenas por aluno autenticado para exercício publicado
- [ ] Validações de input (score entre 0-100, counts >= 0)

## Arquivos Afetados

- `backend/src/submissions/services/submission.py` — service de persistência
- `backend/src/submissions/serializers.py` — serializer
- `backend/src/submissions/views.py` — endpoint

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-012** | `.issues/ISSUE-012.md` | Contexto completo |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Submission, SubmissionResult entities; BR-011, BR-012 |
| **Backend Architecture** | `docs/backend/01-architecture.md` | Padrão de services |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-26
