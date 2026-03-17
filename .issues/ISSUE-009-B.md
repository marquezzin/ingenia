# [ISSUE-009-B] CRUD de Lesson + VideoLesson (Nested sob Module)

## Contexto

Sub-issue de [ISSUE-009](./ISSUE-009.md) — Backend Admin CRUD (Fase 2).
Implementar o CRUD de aulas e vídeos nested sob módulo.

## Descrição

Criar serializers, service e views para CRUD de Lesson e VideoLesson, acessíveis via rotas nested sob Module.

> **Dependência**: ISSUE-003 (Lesson, VideoLesson models), 007-C (IsAdmin), 009-A (módulo precisa existir para nested routing).

### Tarefas

1. **Serializer de Lesson**:
   - Inclui VideoLesson como nested (inline create/update)
   - Campos: title, written_content, sequence_order, publication_status, video_lesson

2. **Service de Lesson**:
   - `create_lesson(module_id, data)` — cria aula + vídeo se fornecido
   - `update_lesson(lesson_id, data)` — atualiza aula + vídeo
   - `delete_lesson(lesson_id)` — remove aula e vídeo associado

3. **ViewSet de Lesson (nested)**:
   - `GET /api/v1/modules/:moduleId/lessons/`
   - `POST /api/v1/modules/:moduleId/lessons/`
   - `GET /api/v1/modules/:moduleId/lessons/:lessonId/`
   - `PUT /api/v1/modules/:moduleId/lessons/:lessonId/`
   - `DELETE /api/v1/modules/:moduleId/lessons/:lessonId/`
   - Filtro por `publication_status`
   - Permission: `IsAuthenticated & IsAdmin`

## Critérios de Aceite

- [x] CRUD completo de Lesson nested sob Module
- [x] VideoLesson criado/atualizado inline com Lesson
- [x] Filtro por `publication_status`
- [x] Validação de `sequence_order` único por módulo
- [x] Protegido por `IsAdmin`

## Arquivos Afetados

- `backend/src/curriculum/serializers.py` — serializers de Lesson + VideoLesson
- `backend/src/curriculum/services/` — service de Lesson
- `backend/src/curriculum/views.py` — LessonViewSet
- `backend/src/curriculum/urls.py` — rotas nested

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-009** | `.issues/ISSUE-009.md` | Contexto completo |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Entities Lesson, VideoLesson |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-007 |
| **API Conventions** | `docs/backend/06-api-conventions.md` | Nested routing |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-17
