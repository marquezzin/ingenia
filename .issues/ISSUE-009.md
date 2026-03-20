# [ISSUE-009] Backend Admin — CRUD de Módulos, Aulas, Exercícios e Usuários

## Contexto

Fase 2 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Administração de Conteúdo.
Implementar todos os endpoints de CRUD para o administrador gerenciar conteúdo pedagógico e usuários da plataforma.

## Descrição

Criar serializers, services e views para o CRUD completo de módulos, aulas, vídeos, exercícios, test cases e usuários, acessíveis apenas por administradores.

> **Dependência**: ISSUE-001 a ISSUE-005 (models), ISSUE-007 (permissions).

### Tarefas

1. **CRUD de `Module`** — list, create, retrieve, update, delete:
   - Filtro por `publication_status`
   - Busca por `title`
   - Ordenação por `sequence_order`

2. **CRUD de `Lesson`** (nested sob Module):
   - `GET/POST /api/v1/modules/:moduleId/lessons/`
   - `GET/PUT/DELETE /api/v1/modules/:moduleId/lessons/:lessonId/`
   - Filtro por `publication_status`

3. **CRUD de `VideoLesson`** (inline com Lesson):
   - Gerenciado junto com o CRUD de Lesson
   - Criar/atualizar vídeo ao criar/editar aula

4. **CRUD de `Exercise`** (nested sob Lesson):
   - `GET/POST /api/v1/modules/:moduleId/lessons/:lessonId/exercises/`
   - `GET/PUT/DELETE /api/v1/modules/:moduleId/lessons/:lessonId/exercises/:exerciseId/`

5. **CRUD de `ExerciseTestCase`** (nested sob Exercise):
   - `GET/POST .../exercises/:exerciseId/test-cases/`
   - `GET/PUT/DELETE .../exercises/:exerciseId/test-cases/:testCaseId/`

6. **CRUD de `User`** (admin only):
   - Criar usuário com profile correspondente ao role
   - Listar com filtro por `role` e `account_status`
   - Busca por `full_name` e `email`

7. **Regra BR-010**: Impedir publicação de exercício sem test cases.

8. **Regra BR-008**: Validar que aula tenha vídeo e conteúdo escrito ao publicar.

9. **Testes unitários** dos serializers e services (pytest).

10. **Endpoint de estatísticas do dashboard admin** (`GET /api/v1/admin/stats/`):
    - Retorna contagens agregadas de módulos, aulas, exercícios e usuários
    - Acessível apenas por administradores

### Sub-issues

| Sub-issue | Escopo |
|---|---|
| ISSUE-009-A | CRUD de Module |
| ISSUE-009-B | CRUD de Lesson + VideoLesson |
| ISSUE-009-C | CRUD de Exercise + ExerciseTestCase |
| ISSUE-009-D | CRUD de User admin |
| ISSUE-009-E | Regras BR-008 e BR-010 |
| ISSUE-009-F | Testes unitários de admin CRUD |
| ISSUE-009-G | Endpoint de Estatísticas do Dashboard Admin |

## Critérios de Aceite

- [ ] CRUD completo de Module com filtros e busca
- [ ] CRUD de Lesson nested sob Module
- [ ] CRUD de VideoLesson (inline com Lesson)
- [ ] CRUD de Exercise nested sob Lesson
- [ ] CRUD de ExerciseTestCase nested sob Exercise
- [ ] CRUD de User (admin only) criando profile correspondente
- [ ] BR-010: Publicação de exercício sem test cases é impedida
- [ ] BR-008: Publicação de aula sem vídeo ou conteúdo é impedida
- [ ] Todos os endpoints protegidos por `IsAdmin` permission
- [ ] Testes unitários cobrindo serializers e services
- [ ] Filtros por publication_status e busca por título funcionando

## Arquivos Afetados

- `backend/src/curriculum/serializers.py` — serializers de Module, Lesson, Exercise, etc.
- `backend/src/curriculum/services/` — services de CRUD
- `backend/src/curriculum/views.py` — ViewSets com nested routing
- `backend/src/curriculum/urls.py` — rotas nested
- `backend/src/accounts/serializers.py` — serializer de User para admin CRUD
- `backend/src/accounts/services/` — service de criação de User com profile
- `backend/src/accounts/views.py` — ViewSet admin de Users
- `backend/src/accounts/urls.py` — rotas de admin users
- `backend/src/curriculum/tests/` — testes
- `backend/src/accounts/tests/` — testes

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 2", Backend |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Todos os entities de curriculum; Business Rules BR-008, BR-010 |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | Authorization Matrix §3 — Module, Lesson, Exercise, CorrectionTest, User: todas ações ✅ para Admin |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-007 (Admin cria módulo), J-008 (Admin gerencia usuários) |
| **Backend Services** | `docs/backend/03-services-usecases.md` | Padrão UseCase/Service |
| **Backend Selectors** | `docs/backend/04-selectors.md` | Padrão de selectors para queries |
| **API Conventions** | `docs/backend/06-api-conventions.md` | Padrão de API: pagination, filtros, response format |
| **Testing** | `docs/backend/05-testing.md` | Padrão de testes |

### Regras de Negócio
- **BR-008**: Validar que aula tenha vídeo E conteúdo escrito ao tentar mudar status para PUBLISHED.
- **BR-010**: Impedir publicação de exercício sem ao menos um test case.
- Apenas admin tem acesso a CorrectionTest (ExerciseTestCase) — ver authorization.md.

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
