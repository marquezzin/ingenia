# [ISSUE-011-C] Service de Progresso Automático — Lesson, Exercise, Module

## Contexto

Sub-issue de [ISSUE-011](./ISSUE-011.md) — Backend Aluno (Fase 3).
Implementar a atualização automática de progresso do aluno ao consumir conteúdo e submeter exercícios.

## Descrição

Criar o service de progresso que atualiza automaticamente os registros de progresso do aluno em cascata.

> **Dependência**: ISSUE-005 (progress models), ISSUE-003 (curriculum models), ISSUE-004 (Submission), 011-B (submissão precisa existir para atualizar progresso de exercício).

### Tarefas

1. **Atualizar `StudentLessonProgress`**:
   - Marcar como `IN_PROGRESS` ao acessar aula pela primeira vez
   - Marcar como `COMPLETED` quando aula é concluída (critério a definir)

2. **Atualizar `StudentExerciseProgress`**:
   - Marcar como `IN_PROGRESS` na primeira submissão
   - Marcar como `COMPLETED` quando submissão aprovada (BR-014)
   - Incrementar `attempts_count` a cada submissão (BR-020)

3. **Atualizar `StudentModuleProgress`**:
   - Marcar como `IN_PROGRESS` ao iniciar primeiro conteúdo
   - Marcar como `COMPLETED` quando todas aulas e exercícios concluídos (BR-015)

4. **Atualizar `StudentProfile.learning_status`**:
   - `IN_PROGRESS` ao iniciar primeiro módulo
   - `COMPLETED` quando todos módulos concluídos

## Critérios de Aceite

- [ ] BR-014: Exercício concluído apenas com submissão aprovada
- [ ] BR-015: Módulo concluído quando todos conteúdos concluídos
- [ ] BR-020: `attempts_count` incrementado a cada submissão
- [ ] Progresso atualizado em cascata (exercise → lesson → module → profile)
- [ ] Invariants de progresso respeitados (completed_at preenchido ↔ COMPLETED)

## Arquivos Afetados

- `backend/src/progress/services/` — progress service
- `backend/src/submissions/services/` — hook de progresso pós-avaliação

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-011** | `.issues/ISSUE-011.md` | Contexto completo |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | BR-014, BR-015, BR-020; Invariants §5 |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-004 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
