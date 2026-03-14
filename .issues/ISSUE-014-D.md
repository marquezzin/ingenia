# [ISSUE-014-D] Testes Unitários de Autorização — BR-016, BR-004, BR-005

## Contexto

Sub-issue de [ISSUE-014](./ISSUE-014.md) — Backend Professor (Fase 4).

## Descrição

Cobertura de testes de autorização do professor.

> **Dependência**: 014-A, 014-B, 014-C.

### Tarefas

1. Testar que professor só vê turmas próprias (BR-004)
2. Testar que matrícula duplicada é impedida (BR-005)
3. Testar que professor só vê alunos das suas turmas (BR-016)
4. Testar que aluno/admin não acessa rotas de professor

## Critérios de Aceite

- [ ] Testes de BR-004, BR-005, BR-016 passando
- [ ] Testes de cross-role access passando

## Arquivos Afetados

- `backend/src/classes/tests/`, `backend/src/progress/tests/`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **Testing** | `docs/backend/05-testing.md` | Padrão de testes |

## Status

- **Prioridade**: alta
- **Tipo**: chore
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
