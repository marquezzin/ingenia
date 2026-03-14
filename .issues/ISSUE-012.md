# [ISSUE-012] Backend — Motor de Correção Automática (Celery + Sandbox)

## Contexto

Fase 3 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Experiência do Aluno.
Implementar o motor de correção automática que executa o código submetido pelo aluno em ambiente controlado, roda os test cases e gera o resultado da avaliação.

## Descrição

Criar a Celery task de avaliação automática que recebe o source code e os test cases, executa em sandbox isolado e gera o `SubmissionResult`.

> **Dependência**: ISSUE-004 (Submission/SubmissionResult models), ISSUE-003 (ExerciseTestCase model).

### Tarefas

1. **Celery task de avaliação automática**:
   - Receber `submission_id` como parâmetro
   - Carregar submission, exercise e test cases
   - Atualizar `evaluation_status` para `RUNNING`

2. **Execução em sandbox**:
   - Executar código em container Docker isolado OU subprocess com resource limits
   - Limitar tempo de execução (timeout configurável)
   - Limitar memória e acesso a rede/disco do host
   - Capturar stdout/stderr da execução

3. **Avaliação por test cases**:
   - Para cada `ExerciseTestCase`:
     - Fornecer `input_data` como stdin
     - Comparar stdout com `expected_output`
     - Registrar PASSED/FAILED por test case
   - Calcular `score_percentage` = (passed / total) * 100

4. **Gerar `SubmissionResult`**:
   - `passed_tests_count` e `failed_tests_count`
   - `feedback_message` gerado automaticamente (BR-013: sem expor resposta)
   - `result_status`: `PASSED` se todos aprovados, `FAILED` se algum falhou, `ERROR` se erro técnico
   - Atualizar `evaluation_status` da Submission para `EVALUATED` ou `FAILED`

5. **Tratamento de erros**:
   - Timeout → resultado `ERROR` + mensagem amigável
   - Erro de execução → capturar mensagem simplificada
   - Falha técnica → `evaluation_status = FAILED`

6. **Testes unitários** do motor de correção (pytest).

## Critérios de Aceite

- [ ] Celery task processa submissão assincronamente
- [ ] Código executado em ambiente isolado (sandbox)
- [ ] Sandbox sem acesso a rede/disco do host
- [ ] Timeout configurável por execução
- [ ] Comparação output × expected_output para cada test case
- [ ] `SubmissionResult` gerado com contagem de passed/failed
- [ ] BR-012: Cada submissão gera exatamente um resultado
- [ ] BR-013: Feedback não expõe resposta completa do exercício
- [ ] Tratamento de timeout e erros de execução
- [ ] Testes unitários cobrindo cenários: sucesso, falha, timeout, erro

## Arquivos Afetados

- `backend/src/submissions/tasks.py` — Celery task de avaliação
- `backend/src/submissions/services/evaluation.py` — service de avaliação
- `backend/src/submissions/services/sandbox.py` — executor de sandbox
- `backend/src/config/celery.py` — configuração Celery (se necessário)
- `docker/` — possível Dockerfile de sandbox
- `backend/src/submissions/tests/` — testes

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 3 — Motor de correção automática" |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Entities: Submission, SubmissionResult, ExerciseTestCase; Business Rules BR-012, BR-013 |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-003 — Steps 5-7 (execução, avaliação, feedback); Expected Errors |
| **Spec** | `docs/requirements/ingenia-documents/discover/spec.md` | Architecture §4 (Camada de avaliação automática); Security §9 (Execução segura) |
| **Architecture** | `docs/backend/01-architecture.md` | Celery e tasks assíncronas |

### Decisões Técnicas Críticas
- **Linguagem de programação dos exercícios**: GAP #1 do roadmap — precisa ser definido com o cliente. Iniciar com Python é recomendado.
- **Sandbox**: Docker container isolado é mais seguro; subprocess com `resource` limits é mais simples para MVP.
- **Timeout**: sugerir 10-30 segundos como default.
- **Feedback**: mensagens pedagógicas simples como "X de Y testes passaram. Revise sua lógica de [dica]."

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
