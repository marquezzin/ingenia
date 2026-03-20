# [ISSUE-010-C] CRUD Aulas + Exercícios — Nested com Test Cases

## Contexto

Sub-issue de [ISSUE-010](./ISSUE-010.md) — Frontend Admin (Fase 2).
Implementar as telas de CRUD de aulas e exercícios, nested dentro de módulos.

## Descrição

Criar as páginas de gestão de aulas (com vídeo e conteúdo) e exercícios (com test cases) no admin.

> **Dependência**: 009-B (API Lesson), 009-C (API Exercise), 010-B (módulo como contexto pai).

### Tarefas

1. **CRUD Aulas** (`/admin/modules/:id/lessons/*`):
   - Lista de aulas dentro do módulo
   - Formulário de criação/edição com campos de vídeo URL e conteúdo escrito
   - Editor de conteúdo escrito (markdown ou rich text)

2. **CRUD Exercícios** (`/admin/modules/:id/lessons/:id/exercises/*`):
   - Lista de exercícios dentro da aula
   - Formulário com enunciado e support_message
   - Alerta visual se exercício sem test cases (BR-010)

3. **Gestão de Test Cases**:
   - Lista de test cases dentro do exercício
   - Criar/editar/remover test cases inline
   - Campos: name, input_data, expected_output, is_hidden

## Critérios de Aceite

- [x] CRUD de aulas nested dentro de módulo
- [x] Editor de conteúdo escrito funcional
- [x] CRUD de exercícios nested dentro de aula
- [x] Gestão de test cases inline
- [x] Alerta visual para exercício sem test cases (BR-010)
- [x] Feedback visual de BR-008 (aula sem vídeo/conteúdo)
- [x] States loading/empty/error/success

## Arquivos Afetados

- `frontend/src/domains/admin/types.ts`
- `frontend/src/domains/admin/api.ts`
- `frontend/src/domains/admin/hooks.ts`
- `frontend/src/domains/admin/model.ts`
- `frontend/src/domains/admin/.context.md`
- `frontend/src/domains/admin/pages/lessons/LessonDetailPage.tsx`
- `frontend/src/domains/admin/pages/lessons/LessonCreatePage.tsx`
- `frontend/src/domains/admin/pages/lessons/LessonEditPage.tsx`
- `frontend/src/domains/admin/pages/exercises/ExerciseDetailPage.tsx`
- `frontend/src/domains/admin/pages/exercises/ExerciseCreatePage.tsx`
- `frontend/src/domains/admin/pages/exercises/ExerciseEditPage.tsx`
- `frontend/src/domains/admin/pages/modules/ModuleDetailPage.tsx`
- `frontend/src/app/routes.tsx`
- `frontend/src/shared/ui/components/DataTable.tsx`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-010** | `.issues/ISSUE-010.md` | Contexto completo |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Telas Admin: Aulas, Exercícios |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | BR-008, BR-010 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-20
