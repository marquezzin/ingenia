# [ISSUE-009-E] Regras BR-008 e BR-010 — Validações de Publicação

## Contexto

Sub-issue de [ISSUE-009](./ISSUE-009.md) — Backend Admin CRUD (Fase 2).
Implementar as validações de negócio para publicação de aulas e exercícios.

## Descrição

Garantir que aulas e exercícios só possam ser publicados quando atenderem aos requisitos mínimos de conteúdo.

> **Dependência**: 009-B (CRUD de Lesson para BR-008), 009-C (CRUD de Exercise para BR-010).

### Tarefas

1. **BR-008 — Validação de publicação de aula**:
   - Ao mudar `publication_status` para `PUBLISHED`, validar:
     - Aula tem `written_content` preenchido
     - Aula tem `VideoLesson` associado
   - Retornar erro claro se requisitos não atendidos

2. **BR-010 — Validação de publicação de exercício**:
   - Ao mudar `publication_status` para `PUBLISHED`, validar:
     - Exercício tem ao menos 1 `ExerciseTestCase`
   - Retornar erro claro se nenhum test case existe

3. **Implementação**:
   - Validação no Service (não no serializer) para manter lógica de negócio centralizada
   - Mensagens de erro descritivas

## Critérios de Aceite

- [ ] BR-008: Não é possível publicar aula sem vídeo
- [ ] BR-008: Não é possível publicar aula sem conteúdo escrito
- [ ] BR-010: Não é possível publicar exercício sem test cases
- [ ] Mensagens de erro descritivas e claras
- [ ] Validação ocorre no service layer

## Arquivos Afetados

- `backend/src/curriculum/services/` — validações nos services de Lesson e Exercise

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-009** | `.issues/ISSUE-009.md` | Contexto completo |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Business Rules BR-008, BR-010 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
