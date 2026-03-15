# [ISSUE-003] App `curriculum` — Models de Módulos, Aulas, Vídeos e Exercícios

## Contexto

Fase 0 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Fundação.
Criar o app `curriculum` com toda a estrutura de conteúdo pedagógico: módulos, aulas, vídeos, exercícios e test cases.

## Descrição

Criar um novo app Django `curriculum` contendo os models que representam a trilha de aprendizagem.

### Tarefas

1. **Criar app Django `curriculum`** seguindo o workflow `/add-backend-app`.

2. **Criar enum**:
   - `ContentStatus`: `DRAFT`, `PUBLISHED`, `ARCHIVED`

3. **Criar model `Module`**:
   - `title` (String, required)
   - `description` (Text, required)
   - `sequence_order` (Integer, required, unique)
   - `publication_status` (ContentStatus, default=DRAFT)
   - Index: `publication_status`

4. **Criar model `Lesson`**:
   - `module` (FK → Module)
   - `title` (String, required)
   - `written_content` (Text, required)
   - `sequence_order` (Integer, required)
   - `publication_status` (ContentStatus, default=DRAFT)
   - Unique: `(module_id, sequence_order)`
   - Index: `module_id`, `publication_status`

5. **Criar model `VideoLesson`** (1:1 com Lesson):
   - `lesson` (OneToOneField → Lesson)
   - `title` (String, required)
   - `video_url` (String/URLField, required)
   - `duration_seconds` (Integer, nullable)

6. **Criar model `Exercise`**:
   - `lesson` (FK → Lesson)
   - `title` (String, required)
   - `statement` (Text, required)
   - `support_message` (Text, nullable)
   - `sequence_order` (Integer, required)
   - `publication_status` (ContentStatus, default=DRAFT)
   - Unique: `(lesson_id, sequence_order)`
   - Index: `lesson_id`, `publication_status`

7. **Criar model `ExerciseTestCase`**:
   - `exercise` (FK → Exercise)
   - `name` (String, required)
   - `input_data` (Text, nullable)
   - `expected_output` (Text, required)
   - `sequence_order` (Integer, required)
   - `is_hidden` (Boolean, required, default=False)
   - Unique: `(exercise_id, sequence_order)`
   - Index: `exercise_id`

8. **Gerar migrations** e verificar execução.

## Critérios de Aceite

- [x] App `curriculum` criado seguindo padrão do projeto
- [x] Enum `ContentStatus` implementado
- [x] Models `Module`, `Lesson`, `VideoLesson`, `Exercise`, `ExerciseTestCase` criados
- [x] Todos os campos conforme domain model
- [x] BR-006: Ordenação única de módulos por `sequence_order` (unique)
- [x] BR-007: Ordem das aulas única dentro de cada módulo (unique constraint)
- [x] BR-008: Estrutura para validar que aula tenha vídeo + conteúdo ao publicar
- [x] BR-009: Exercício vinculado a uma aula (FK)
- [x] BR-010: Estrutura preparada para validar ao menos um test case ao publicar exercício
- [x] `VideoLesson` é 1:1 com `Lesson` (OneToOneField)
- [x] Migrations geradas e executando sem erro

## Arquivos Afetados

- `backend/src/curriculum/` — novo app Django completo
- `backend/src/curriculum/models.py` — Module, Lesson, VideoLesson, Exercise, ExerciseTestCase
- `backend/src/curriculum/enums.py` — ContentStatus
- `backend/src/config/settings/base.py` — registrar app em INSTALLED_APPS

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 0", app `curriculum` |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Entities: Module, Lesson, VideoLesson, Exercise, ExerciseTestCase; Relationships §2; Enums §4 (ContentStatus); Business Rules BR-006 a BR-010; Invariants §5 |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-007 (Admin cria módulo com aula e exercício) |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Telas Admin: CRUD Módulos, Aulas, Exercícios |
| **Backend Architecture** | `docs/backend/02-apps-pattern.md` | Padrão de apps Django |
| **Workflow** | `.agent/workflows/add-backend-app.md` | Como criar novo app Django |

### Regras de Negócio Aplicáveis
- **BR-006**: Trilha respeita ordenação única de módulos.
- **BR-007**: Ordem das aulas é única dentro de cada módulo.
- **BR-008**: Aula deve ter material escrito + vídeo ao publicar.
- **BR-009**: Exercício deve estar vinculado a uma aula.
- **BR-010**: Exercício deve ter ao menos um test case antes de ser publicado.

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-14
