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

- [x] Testes J-002 passando
- [x] Testes J-003 passando (inclui submissão + resultado)
- [x] Testes J-004 passando

## Arquivos Afetados

- `frontend/src/domains/student/e2e/trail.spec.ts` — J-002 (5 testes)
- `frontend/src/domains/student/e2e/exercise.spec.ts` — J-003 (7 testes)
- `frontend/src/domains/student/e2e/progress.spec.ts` — J-004 (5 testes)
- `backend/src/core/management/commands/seed_test.py` — seed curricular para E2E
- `frontend/src/domains/student/CLAUDE.md` — documentação atualizada

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-002, J-003, J-004 |
| **Frontend Testing** | `docs/frontend/04-testing.md` | Padrão E2E |

### Detalhes da Implementação

- **Seed**: `seed_test.py` agora cria 1 módulo publicado ("Introdução ao Python") com 2 aulas (uma com vídeo + exercício, outra sem exercício), 1 exercício ("Primeiro Programa") com 2 test cases
- **J-002 (trail.spec.ts)**: Dashboard → módulos → módulo → aula, verificando vídeo/conteúdo/exercícios, e bloqueio de acesso por role
- **J-003 (exercise.spec.ts)**: Execução Skulpt real no browser, resposta correta/errada/erro de sintaxe, submissão, histórico, dica
- **J-004 (progress.spec.ts)**: Tela de progresso, tela de submissões, atualização de progresso após exercício

## Status

- **Prioridade**: alta
- **Tipo**: chore
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-04-11
