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

- [x] Testes de BR-004, BR-005, BR-016 passando
- [x] Testes de cross-role access passando

## Arquivos Afetados

- `backend/src/classes/tests/test_class_group_teacher.py` (BR-004, cross-role)
- `backend/src/classes/tests/test_enrollment_teacher.py` (BR-004, BR-005, cross-role)
- `backend/src/progress/tests/test_teacher_progress_api.py` (BR-016, cross-role)

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **Testing** | `docs/backend/05-testing.md` | Padrão de testes |

## Status

- **Prioridade**: alta
- **Tipo**: chore
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-04-11
