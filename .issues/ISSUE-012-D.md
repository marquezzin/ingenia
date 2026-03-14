# [ISSUE-012-D] Gerar SubmissionResult + Feedback Pedagógico

## Contexto

Sub-issue de [ISSUE-012](./ISSUE-012.md) — Motor de Correção (Fase 3).
Gerar o resultado da avaliação e feedback para o aluno.

## Descrição

Criar o `SubmissionResult` com contagem de testes e feedback pedagógico sem expor respostas.

> **Dependência**: ISSUE-004 (SubmissionResult model), 012-C (resultado da avaliação).

### Tarefas

1. **Gerar `SubmissionResult`**:
   - `passed_tests_count` e `failed_tests_count`
   - `result_status`: `PASSED` se todos passaram, `FAILED` se algum falhou, `ERROR` se erro técnico
   - Atualizar `Submission.score_percentage`
   - Atualizar `Submission.evaluation_status` para `EVALUATED`

2. **Gerar `feedback_message`** (BR-013):
   - Mensagem pedagógica simples
   - Exemplos: "Parabéns! Todos os X testes passaram! 🎉"
   - "X de Y testes passaram. Revise sua lógica e tente novamente."
   - NÃO expor resposta esperada dos test cases

3. **Trigger de progresso**:
   - Após gerar resultado, chamar service de progresso (011-C) se aprovado

## Critérios de Aceite

- [ ] SubmissionResult criado corretamente
- [ ] BR-012: Cada submissão gera exatamente um resultado
- [ ] BR-013: Feedback não expõe resposta completa
- [ ] result_status correto (PASSED/FAILED/ERROR)
- [ ] score_percentage atualizado na Submission
- [ ] Progresso do aluno atualizado após aprovação

## Arquivos Afetados

- `backend/src/submissions/services/evaluation.py` — geração de resultado
- `backend/src/submissions/services/` — trigger de progresso

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-012** | `.issues/ISSUE-012.md` | Contexto completo |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | BR-012, BR-013 |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-003 step 7 (feedback) |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
