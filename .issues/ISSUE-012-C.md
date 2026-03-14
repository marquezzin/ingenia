# [ISSUE-012-C] Avaliação por Test Cases — Comparação Output e Cálculo Score

## Contexto

Sub-issue de [ISSUE-012](./ISSUE-012.md) — Motor de Correção (Fase 3).
Implementar a lógica de avaliação que roda cada test case e calcula o score.

## Descrição

Criar o avaliador que, para cada test case, fornece o input ao sandbox, compara o output e calcula a pontuação.

> **Dependência**: ISSUE-003 (ExerciseTestCase), 012-A (task que recebe a submission), 012-B (sandbox que executa o código).

### Tarefas

1. **Avaliação por test case**:
   - Para cada `ExerciseTestCase`:
     - Fornecer `input_data` como stdin ao sandbox
     - Executar código do aluno
     - Comparar stdout com `expected_output` (trim whitespace)
     - Registrar resultado: `PASSED` ou `FAILED`

2. **Cálculo de score**:
   - `score_percentage = (passed_count / total_count) * 100`
   - Contar passed_tests_count e failed_tests_count

3. **Integração com task**:
   - Receber source_code e test_cases
   - Chamar sandbox para cada test case
   - Retornar resultado consolidado

## Critérios de Aceite

- [ ] Cada test case avaliado individualmente
- [ ] Comparação output × expected_output funcional
- [ ] Score calculado corretamente
- [ ] Whitespace trimmed na comparação
- [ ] Resultados individuais rastreados

## Arquivos Afetados

- `backend/src/submissions/services/evaluation.py` — service de avaliação

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-012** | `.issues/ISSUE-012.md` | Contexto completo |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | ExerciseTestCase entity |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-003 steps 5-6 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
