# [ISSUE-013-G] Testes E2E — Fluxos J-002, J-003, J-004

## Contexto

Sub-issue de [ISSUE-013](./ISSUE-013.md) — Frontend Aluno (Fase 3).

## Descrição

Criar testes E2E cobrindo os fluxos do aluno com Playwright.

> **Dependência**: 011-E (backend testado), 012-F (motor testado), 013-A a 013-F (tudo implementado).

### Tarefas

1. **J-002**: Aluno percorre trilha e acessa aula
2. **J-003**: Aluno consome aula e resolve exercício
3. **J-004**: Aluno acompanha progresso

## Critérios de Aceite

- [ ] Testes J-002 passando
- [ ] Testes J-003 passando (inclui submissão + resultado)
- [ ] Testes J-004 passando

## Arquivos Afetados

- `frontend/src/domains/student/e2e/`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-002, J-003, J-004 |
| **Frontend Testing** | `docs/frontend/04-testing.md` | Padrão E2E |

## Status

- **Prioridade**: alta
- **Tipo**: chore
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
