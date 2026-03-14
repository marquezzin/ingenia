# [ISSUE-011-D] Endpoints de Histórico de Submissões + Progresso Consolidado

## Contexto

Sub-issue de [ISSUE-011](./ISSUE-011.md) — Backend Aluno (Fase 3).
Implementar endpoints de consulta de histórico e progresso para o aluno.

## Descrição

Criar endpoints para o aluno consultar seu histórico de submissões e progresso consolidado.

> **Dependência**: ISSUE-004, ISSUE-005, 007-C, 011-B (submissões precisam existir), 011-C (progresso precisa estar sendo rastreado).

### Tarefas

1. **Endpoint de histórico de submissões**:
   - `GET /api/v1/student/submissions/` — lista com paginação
   - Filtros: por exercício, por status
   - Inclui resultado da avaliação (se existe)
   - BR-017: Aluno vê apenas próprias submissões

2. **Endpoint de progresso consolidado**:
   - `GET /api/v1/student/progress/` — progresso geral por módulo
   - `GET /api/v1/student/progress/modules/:id/` — detalhe por módulo (aulas e exercícios)
   - BR-017: Aluno vê apenas próprio progresso

## Critérios de Aceite

- [ ] Histórico de submissões com filtros e paginação
- [ ] Resultado da avaliação incluído nas submissões
- [ ] Progresso consolidado por módulo
- [ ] Progresso detalhado com aulas e exercícios
- [ ] BR-017: Apenas submissões e progresso do próprio aluno
- [ ] Protegido por `IsStudent`

## Arquivos Afetados

- `backend/src/submissions/views.py` — SubmissionListView
- `backend/src/submissions/serializers.py` — serializers de listagem
- `backend/src/progress/views.py` — ProgressView
- `backend/src/progress/serializers.py` — serializers de progresso

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-011** | `.issues/ISSUE-011.md` | Contexto completo |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | BR-017 |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | Aluno: Progress Read 🔒 (own only) |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-004 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
