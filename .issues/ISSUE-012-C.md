# [ISSUE-012-C] Avaliação no Frontend — Hook/Service Skulpt por Test Case

## Contexto

Sub-issue de [ISSUE-012](./ISSUE-012.md) — Motor de Correção Skulpt (Fase 3).
Implementar o service/hook React que executa o código do aluno via Skulpt para cada test case e compara outputs.

## Descrição

Criar a camada de avaliação no frontend que usa o Skulpt para interpretar o código Python do aluno, fornecendo input e capturando output de cada test case.

> **Dependência**: ISSUE-003 (ExerciseTestCase — precisa do endpoint que retorna test cases).

### Tarefas

1. **Integração Skulpt**:
   - Instalar Skulpt (`pnpm add skulpt`)
   - Configurar `Sk.configure()` com `output` e `inputfun` customizados
   - Criar `skulptRunner.ts`:
     - `runCode(sourceCode, stdin, timeout) → { stdout, stderr, exitCode, timedOut }`

2. **Avaliador por test case**:
   - Criar `evaluator.ts`:
     - Para cada `ExerciseTestCase`:
       - Chamar `runCode()` com `input_data` como stdin
       - Comparar `stdout.trim()` com `expected_output.trim()`
       - Registrar `PASSED` ou `FAILED`
     - Retornar resultado consolidado: `{ results[], passedCount, failedCount, scorePercentage }`

3. **Hook React**:
   - Criar `useCodeExecution()`:
     - Estado: idle → running → complete/error
     - Executa avaliação para todos test cases
     - Retorna resultados por test case + score + status

## Critérios de Aceite

- [x] Skulpt executa código Python no browser
- [x] Cada test case avaliado individualmente
- [x] input_data fornecido como stdin via `Sk.inputfun`
- [x] stdout capturado via `Sk.output`
- [x] Comparação output × expected_output (whitespace trimmed)
- [x] Score calculado corretamente
- [x] Hook gerencia estados (idle/running/complete/error)

## Arquivos Afetados

- `frontend/src/domains/student/services/skulptRunner.ts`
- `frontend/src/domains/student/services/evaluator.ts`
- `frontend/src/domains/student/hooks/useCodeExecution.ts`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-012** | `.issues/ISSUE-012.md` | Contexto completo |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | ExerciseTestCase entity |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-003 steps 5-6 |

### Decisões Técnicas
- `Sk.output`: função customizada que acumula stdout em array
- `Sk.inputfun`: retorna os valores de `input_data` na ordem, ou prompt no browser se chamado pelo código
- Timeout: implementar via `setTimeout` + rejeição de Promise (default 10s)

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: Concluída 🟢
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-04-01
