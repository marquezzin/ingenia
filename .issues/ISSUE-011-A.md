# [ISSUE-011-A] Endpoints de Leitura — Módulos, Aulas, Exercícios Publicados

## Contexto

Sub-issue de [ISSUE-011](./ISSUE-011.md) — Backend Aluno (Fase 3).
Implementar endpoints de leitura de conteúdo publicado para o aluno.

## Descrição

Criar endpoints de leitura filtrados por `publication_status=PUBLISHED` com progresso do aluno.

> **Dependência**: ISSUE-003 (curriculum models), 007-C (IsStudent permission).

### Tarefas

1. **Endpoints de leitura para aluno**:
   - `GET /api/v1/student/modules/` — módulos publicados com progresso do aluno
   - `GET /api/v1/student/modules/:id/` — detalhe com aulas
   - `GET /api/v1/student/modules/:id/lessons/:id/` — aula com vídeo e exercícios
   - `GET /api/v1/student/modules/:id/lessons/:id/exercises/:id/` — exercício com enunciado

2. **Serializers de leitura para aluno**:
   - Incluir progresso do aluno em cada nível (se existe)
   - NÃO expor test cases (apenas admin vê)
   - Filtro fixo: `publication_status=PUBLISHED`

3. **Selectors/queries otimizados**:
   - Prefetch de progresso do aluno
   - Evitar N+1 queries

## Critérios de Aceite

- [ ] Endpoints retornam apenas conteúdo publicado (BR-019)
- [ ] Test cases NÃO são expostos ao aluno
- [ ] Progresso do aluno incluído nos serializers
- [ ] Protegido por `IsStudent`
- [ ] Queries otimizadas (sem N+1)

## Arquivos Afetados

- `backend/src/curriculum/serializers.py` — serializers de leitura aluno
- `backend/src/curriculum/views.py` — ViewSets de leitura aluno
- `backend/src/curriculum/urls.py` — rotas student

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-011** | `.issues/ISSUE-011.md` | Contexto completo |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | Aluno: Module/Lesson/Exercise Read ✅ |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-002 |
| **Backend Selectors** | `docs/backend/04-selectors.md` | Padrão selectors |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
