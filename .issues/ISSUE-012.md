# [ISSUE-012] Backend + Frontend — Motor de Correção Automática (Skulpt — Client-Side)

## Contexto

Fase 3 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Experiência do Aluno.
Implementar o motor de correção automática que executa o código submetido pelo aluno **no browser via Skulpt** (interpretador Python em JavaScript), avalia os test cases localmente e persiste o resultado no backend.

## Descrição

O motor de correção é dividido em duas partes:
- **Frontend**: executa o código via Skulpt, fornece input dos test cases, captura stdout, compara com expected_output, calcula score e monta feedback — tudo no browser.
- **Backend**: recebe o resultado já avaliado e persiste `Submission` + `SubmissionResult`.

> **Dependência**: ISSUE-004 (Submission/SubmissionResult models), ISSUE-003 (ExerciseTestCase model).

### Tarefas

1. **Endpoint síncrono de submissão** (backend):
   - Receber source_code + resultado avaliado (score, passed, failed, status, feedback)
   - Persistir `Submission` + `SubmissionResult` em transação única
   - Atualizar `evaluation_status` para `EVALUATED`
   - Chamar service de progresso (011-C)

2. **Motor de avaliação Skulpt** (frontend):
   - Integrar lib Skulpt no projeto frontend (pnpm)
   - Para cada `ExerciseTestCase`:
     - Fornecer `input_data` via `Sk.inputfun`
     - Capturar `stdout` via `Sk.output`
     - Comparar stdout com `expected_output` (trim whitespace)
     - Registrar PASSED/FAILED por test case
   - Calcular `score_percentage` = (passed / total) * 100

3. **Resultado e feedback** (frontend):
   - Gerar `feedback_message` pedagógico (BR-013: sem expor resposta)
   - Determinar `result_status`: PASSED se todos aprovados, FAILED se algum falhou, ERROR se erro técnico
   - Enviar resultado ao backend via POST

4. **Tratamento de erros** (frontend):
   - Timeout configurável → mensagem amigável ("código excedeu o tempo limite")
   - Erro de sintaxe → capturar mensagem do Skulpt e simplificar
   - Runtime error → mensagem amigável sem expor internals

5. **Testes**:
   - vitest: avaliação Skulpt, comparação de output, tratamento de erros
   - pytest: endpoint de submissão, persistência, validações

## Critérios de Aceite

- [ ] Código Python executado no browser via Skulpt
- [ ] Cada test case avaliado individualmente com comparação output × expected_output
- [ ] Score calculado corretamente
- [ ] Feedback pedagógico gerado (BR-013)
- [ ] Resultado enviado e persistido no backend
- [ ] BR-012: Cada submissão gera exatamente um resultado
- [ ] Timeout configurável no frontend
- [ ] Erros de sintaxe e runtime capturados e reportados
- [ ] Testes unitários cobrindo: sucesso, falha parcial, timeout, erro de sintaxe, runtime error

## Arquivos Afetados

### Backend
- `backend/src/submissions/services/submission.py` — service de persistência
- `backend/src/submissions/views.py` — endpoint de submissão
- `backend/src/submissions/serializers.py` — serializer de submissão com resultado
- `backend/src/submissions/tests/` — testes pytest

### Frontend
- `frontend/src/domains/student/services/skulptRunner.ts` — executor Skulpt
- `frontend/src/domains/student/services/evaluator.ts` — avaliador por test cases
- `frontend/src/domains/student/hooks/useCodeExecution.ts` — hook React
- `frontend/src/domains/student/__tests__/` — testes vitest

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 3 — Motor de correção Skulpt" |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Entities: Submission, SubmissionResult, ExerciseTestCase; Business Rules BR-012, BR-013 |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-003 — Steps 5-7 |
| **Spec** | `docs/requirements/ingenia-documents/discover/spec.md` | ADR-004 (Skulpt no browser) |

### Decisões Técnicas
- **Linguagem**: Python via Skulpt (resolve GAP #1 do roadmap)
- **Execução**: client-side no browser — sem Celery, sem sandbox server-side
- **Timeout**: sugerir 10 segundos como default no frontend
- **Hidden test cases**: não utilizados no MVP — todos os test cases são visíveis
- **Feedback**: mensagens pedagógicas simples como "X de Y testes passaram."
- **Skulpt**: instalar via `pnpm add skulpt`

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-26
