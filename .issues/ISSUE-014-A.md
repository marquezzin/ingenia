# [ISSUE-014-A] CRUD ClassGroup — Professor Cria/Edita Suas Turmas

## Contexto

Sub-issue de [ISSUE-014](./ISSUE-014.md) — Backend Professor (Fase 4).

## Descrição

Implementar o CRUD de turmas acessível pelo professor, restrito às suas próprias turmas.

> **Dependência**: ISSUE-002 (ClassGroup model), 007-C (IsTeacher permission).

### Tarefas

1. **ViewSet de ClassGroup para professor**:
   - `GET /api/v1/teacher/classes/` — apenas turmas do professor autenticado
   - `POST /api/v1/teacher/classes/` — criar turma
   - `GET /api/v1/teacher/classes/:id/` — detalhe
   - `PUT /api/v1/teacher/classes/:id/` — editar
   - Professor só vê/edita próprias turmas (BR-004)

## Critérios de Aceite

- [x] CRUD funcional para professor
- [x] BR-004: Professor só acessa turmas próprias
- [x] Protegido por `IsTeacher`

## Arquivos Afetados

- `backend/src/classes/services/class_group.py` — UseCases de criação e edição
- `backend/src/classes/services/__init__.py` — Exportação dos UseCases
- `backend/src/classes/selectors.py` — Selectors scoped por professor
- `backend/src/classes/serializers.py` — Serializers de escrita e detalhe para professor
- `backend/src/classes/views.py` — ClassGroupTeacherViewSet
- `backend/src/classes/urls.py` — Rotas teacher
- `backend/src/classes/tests/test_class_group_teacher.py` — Testes

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-014** | `.issues/ISSUE-014.md` | Contexto completo |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | BR-004 |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-005 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-04-11
