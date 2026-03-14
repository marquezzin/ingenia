# [ISSUE-009-C] CRUD de Exercise + ExerciseTestCase (Nested sob Lesson)

## Contexto

Sub-issue de [ISSUE-009](./ISSUE-009.md) — Backend Admin CRUD (Fase 2).
Implementar o CRUD de exercícios e test cases nested sob aula.

## Descrição

Criar serializers, service e views para CRUD de Exercise e ExerciseTestCase, acessíveis via rotas nested.

> **Dependência**: ISSUE-003 (Exercise, ExerciseTestCase models), 007-C (IsAdmin), 009-B (aula precisa existir para nested routing).

### Tarefas

1. **Serializer de Exercise**:
   - Campos: title, statement, support_message, sequence_order, publication_status
   - `test_cases_count` como campo calculado

2. **Serializer de ExerciseTestCase**:
   - Campos: name, input_data, expected_output, sequence_order, is_hidden

3. **Service de Exercise e TestCase**:
   - CRUD padrão para ambos
   - Validação de `sequence_order` único por aula/exercício

4. **ViewSets nested**:
   - `GET/POST /api/v1/modules/:moduleId/lessons/:lessonId/exercises/`
   - `GET/PUT/DELETE .../exercises/:exerciseId/`
   - `GET/POST .../exercises/:exerciseId/test-cases/`
   - `GET/PUT/DELETE .../exercises/:exerciseId/test-cases/:testCaseId/`
   - Permission: `IsAuthenticated & IsAdmin`

## Critérios de Aceite

- [ ] CRUD completo de Exercise nested sob Lesson
- [ ] CRUD completo de ExerciseTestCase nested sob Exercise
- [ ] Validação de `sequence_order` único
- [ ] Protegido por `IsAdmin`
- [ ] Apenas admin tem acesso a test cases (authorization.md)

## Arquivos Afetados

- `backend/src/curriculum/serializers.py` — serializers de Exercise + TestCase
- `backend/src/curriculum/services/` — services
- `backend/src/curriculum/views.py` — ViewSets
- `backend/src/curriculum/urls.py` — rotas nested

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-009** | `.issues/ISSUE-009.md` | Contexto completo |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Entities Exercise, ExerciseTestCase |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | CorrectionTest: Admin only |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
