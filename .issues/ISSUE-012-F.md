# [ISSUE-012-F] Testes do Motor de Correção — Vitest (Frontend) + Pytest (Backend)

## Contexto

Sub-issue de [ISSUE-012](./ISSUE-012.md) — Motor de Correção Skulpt (Fase 3).
Cobertura de testes para o motor de correção: frontend (Skulpt/avaliação) e backend (persistência).

## Descrição

Criar testes cobrindo todos os cenários do motor: sucesso, falha, timeout, erros e persistência.

> **Dependência**: 012-A, 012-C, 012-D, 012-E (todo o motor implementado).

### Tarefas

#### Testes Frontend (vitest)
1. **Cenário de sucesso**: código passa todos os test cases (score 100%)
2. **Cenário de falha parcial**: código passa alguns test cases
3. **Cenário de timeout**: código com loop infinito excede o tempo
4. **Cenário de erro de sintaxe**: código com syntax error
5. **Cenário de runtime error**: código com NameError, TypeError, etc.
6. **Verificar comparação de output**: whitespace trimming, case sensitivity
7. **Verificar feedback_message**: mensagens pedagógicas adequadas

#### Testes Backend (pytest)
8. **Endpoint de submissão**: criação de Submission + SubmissionResult
9. **Validações**: exercício publicado, aluno autenticado, score range
10. **Transação atômica**: rollback se falhar parcialmente
11. **Integração com progresso**: chamar service de progresso após submissão aprovada

## Critérios de Aceite

- [x] Teste de sucesso completo (100% score) — vitest
- [x] Teste de falha parcial (score < 100) — vitest
- [x] Teste de timeout — vitest
- [x] Teste de erro de sintaxe — vitest
- [x] Teste de runtime error — vitest
- [x] Teste de persistência da submissão — pytest (já existente)
- [x] Teste de validações — pytest (já existente)
- [x] Todos passando

## Arquivos Afetados

### Frontend
- `frontend/src/domains/student/__tests__/errorHandler.test.ts`
- `frontend/src/domains/student/__tests__/evaluator.test.ts`
- `frontend/src/domains/student/__tests__/feedbackGenerator.test.ts`
- `frontend/src/domains/student/__tests__/skulptRunner.test.ts`

### Backend
- `backend/src/submissions/tests/test_submission_service.py` (já existente)
- `backend/src/submissions/tests/test_submission_api.py` (já existente)

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-012** | `.issues/ISSUE-012.md` | Contexto completo |
| **Testing** | `docs/backend/05-testing.md` | Padrão de testes backend |
| **Frontend Rules** | `.agent/rules/003-frontend.md` | Padrão de testes frontend |

### Resultados

| Tipo | Arquivo | Testes |
|---|---|---|
| vitest | `errorHandler.test.ts` | 25 |
| vitest | `evaluator.test.ts` | 19 |
| vitest | `feedbackGenerator.test.ts` | 9 |
| vitest | `skulptRunner.test.ts` | 12 |
| pytest | `test_submission_service.py` | 10 (já existente) |
| pytest | `test_submission_api.py` | 10 (já existente) |
| **Total** | | **85** |

## Status

- **Prioridade**: alta
- **Tipo**: chore
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-04-06
