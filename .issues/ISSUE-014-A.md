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

- [ ] CRUD funcional para professor
- [ ] BR-004: Professor só acessa turmas próprias
- [ ] Protegido por `IsTeacher`

## Arquivos Afetados

- `backend/src/classes/serializers.py`, `services/`, `views.py`, `urls.py`

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
- **Atualizado em**: 2026-03-12
