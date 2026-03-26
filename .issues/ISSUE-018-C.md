# [ISSUE-018-C] Testes de Performance do Motor Skulpt no Browser

## Contexto

Sub-issue de [ISSUE-018](./ISSUE-018.md) — Validação Final (Fase 5).

## Descrição

Testes de performance do motor de correção Skulpt executando no browser.

> **Dependência**: 012-F (motor testado).

### Tarefas

1. Tempo médio de avaliação de uma submissão no browser (Skulpt)
2. Performance com múltiplos test cases (10, 20, 50 test cases)
3. Timeout handling com código pesado
4. Verificar impacto na UI (bloqueio de rendering, web worker se necessário)

## Critérios de Aceite

- [ ] Avaliação < 5s para submissão típica (5-10 test cases) no browser
- [ ] UI não bloqueia durante execução (ou usa Web Worker)
- [ ] Timeout handled corretamente
- [ ] Performance aceitável em dispositivos de menor capacidade (considerar contexto escolar)

## Arquivos Afetados

- `frontend/src/domains/student/__tests__/performance.test.ts`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-018** | `.issues/ISSUE-018.md` | Contexto completo |
| **Spec** | `docs/requirements/ingenia-documents/discover/spec.md` | Non-Functional §8 |

### Decisões Técnicas
- Se o Skulpt bloquear a UI main thread, considerar execução em **Web Worker**
- Performance alvo: < 5s para submissão típica de aluno iniciante (código simples)

## Status

- **Prioridade**: média
- **Tipo**: chore
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-26
