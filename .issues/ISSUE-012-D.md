# [ISSUE-012-D] Resultado no Frontend + Persistência Backend — Score, Feedback e Submissão

## Contexto

Sub-issue de [ISSUE-012](./ISSUE-012.md) — Motor de Correção Skulpt (Fase 3).
Calcular score, montar feedback pedagógico no frontend e enviar resultado ao backend para persistência.

## Descrição

Após a avaliação dos test cases (012-C), montar o resultado consolidado com feedback pedagógico e enviar ao endpoint de submissão (012-A).

> **Dependência**: ISSUE-004 (SubmissionResult model), 012-A (endpoint de persistência), 012-C (avaliação Skulpt).

### Tarefas

1. **Cálculo de resultado**:
   - `result_status`: `PASSED` se todos passaram, `FAILED` se algum falhou, `ERROR` se erro técnico
   - `score_percentage = (passed_count / total_count) * 100`
   - `passed_tests_count` e `failed_tests_count`

2. **Geração de `feedback_message`** (BR-013):
   - Mensagem pedagógica simples:
     - "Parabéns! Todos os X testes passaram! 🎉"
     - "X de Y testes passaram. Revise sua lógica e tente novamente."
     - "Erro de sintaxe: [mensagem simplificada]"
   - NÃO expor resposta esperada dos test cases

3. **Envio ao backend**:
   - POST `/api/v1/submissions/` com payload completo
   - Aguardar confirmação de persistência
   - Exibir resultado final ao aluno

## Critérios de Aceite

- [x] result_status correto (PASSED/FAILED/ERROR)
- [x] score_percentage calculado
- [x] BR-013: Feedback não expõe resposta completa
- [x] Resultado enviado e aceito pelo backend
- [x] Feedback exibido imediatamente ao aluno

## Arquivos Afetados

- `frontend/src/domains/student/services/feedbackGenerator.ts`
- `frontend/src/domains/student/hooks/useSubmission.ts`
- `frontend/src/domains/student/api/submissions.ts`

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
- **Status**: Concluída
- **Atualizado em**: 2026-04-06
