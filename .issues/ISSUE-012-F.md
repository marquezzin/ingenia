# [ISSUE-012-F] Testes Unitários do Motor de Correção

## Contexto

Sub-issue de [ISSUE-012](./ISSUE-012.md) — Motor de Correção (Fase 3).
Cobertura de testes unitários para o motor de correção automática.

## Descrição

Criar testes cobrindo todos os cenários do motor: sucesso, falha, timeout e erro técnico.

> **Dependência**: 012-A a 012-E (todo o motor implementado).

### Tarefas

1. **Cenário de sucesso**: código passa todos os test cases
2. **Cenário de falha parcial**: código passa alguns test cases
3. **Cenário de timeout**: código excede tempo limite
4. **Cenário de erro de sintaxe**: código com erro de sintaxe
5. **Cenário de runtime error**: código com erro de execução
6. **Cenário de falha técnica**: sandbox falha
7. **Verificar score_percentage calculado corretamente**
8. **Verificar feedback_message adequado**

## Critérios de Aceite

- [ ] Teste de sucesso completo (100% score)
- [ ] Teste de falha parcial (score < 100)
- [ ] Teste de timeout
- [ ] Teste de erro de sintaxe
- [ ] Teste de runtime error
- [ ] Teste de falha técnica
- [ ] Todos passando

## Arquivos Afetados

- `backend/src/submissions/tests/test_evaluation.py`
- `backend/src/submissions/tests/test_sandbox.py`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-012** | `.issues/ISSUE-012.md` | Contexto completo |
| **Testing** | `docs/backend/05-testing.md` | Padrão de testes |

## Status

- **Prioridade**: alta
- **Tipo**: chore
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
