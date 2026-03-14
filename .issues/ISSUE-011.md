# [ISSUE-011] Backend Aluno — Endpoints de Trilha, Submissão e Progresso

## Contexto

Fase 3 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Experiência do Aluno.
Implementar os endpoints de leitura de conteúdo publicado, submissão de código, atualização de progresso e histórico para o aluno.

## Descrição

Criar endpoints de leitura filtrados por `PUBLISHED`, service de submissão, service de progresso automático e endpoints de histórico do aluno.

> **Dependência**: ISSUE-003 (curriculum models), ISSUE-004 (submission models), ISSUE-005 (progress models), ISSUE-007 (permissions).

### Tarefas

1. **Endpoints de leitura de Módulos/Aulas/Exercícios**:
   - Filtro fixo: `publication_status=PUBLISHED`
   - `GET /api/v1/student/modules/` — lista módulos publicados com progresso do aluno
   - `GET /api/v1/student/modules/:id/` — detalhe com aulas
   - `GET /api/v1/student/modules/:id/lessons/:id/` — aula com vídeo e exercícios
   - `GET /api/v1/student/modules/:id/lessons/:id/exercises/:id/` — exercício com enunciado

2. **Service de submissão de código**:
   - `POST /api/v1/student/submissions/` — cria `Submission`
   - Validar que aluno está autenticado e exercício está publicado (BR-011)
   - Disparar task Celery de avaliação (será implementada na ISSUE-012)
   - Retornar status da submissão

3. **Service de progresso** (atualização automática):
   - Atualizar `StudentLessonProgress` ao consumir aula
   - Atualizar `StudentExerciseProgress` ao submeter exercício (BR-014, BR-020)
   - Atualizar `StudentModuleProgress` quando todas aulas/exercícios concluídos (BR-015)
   - Atualizar `StudentProfile.learning_status` quando toda trilha concluída

4. **Endpoint de histórico de submissões**:
   - `GET /api/v1/student/submissions/` — lista com filtros por exercício e status
   - Inclui resultado da avaliação

5. **Endpoint de progresso consolidado**:
   - `GET /api/v1/student/progress/` — progresso por módulo
   - `GET /api/v1/student/progress/modules/:id/` — progresso detalhado por módulo

6. **Testes unitários** do service de progresso e submissão (pytest).

## Critérios de Aceite

- [ ] Endpoints de leitura retornam apenas conteúdo publicado (BR-019)
- [ ] Submissão cria registro e dispara avaliação assíncrona
- [ ] BR-011: Só aluno autenticado pode submeter para exercício publicado
- [ ] BR-014: Progresso de exercício marcado como concluído apenas com submissão aprovada
- [ ] BR-015: Módulo concluído quando todas aulas e exercícios concluídos
- [ ] BR-020: `attempts_count` reflete número de submissões
- [ ] BR-017: Aluno vê apenas próprio progresso e submissões
- [ ] Histórico de submissões funcional com filtros
- [ ] Progresso consolidado funcional
- [ ] Testes unitários cobrindo service de progresso e submissão

## Arquivos Afetados

- `backend/src/curriculum/serializers.py` — serializers de leitura para aluno
- `backend/src/curriculum/views.py` — ViewSets de leitura aluno
- `backend/src/submissions/serializers.py` — serializer de submissão
- `backend/src/submissions/services/` — service de submissão
- `backend/src/submissions/views.py` — views de submissão
- `backend/src/progress/services/` — service de progresso
- `backend/src/progress/serializers.py` — serializers de progresso
- `backend/src/progress/views.py` — views de progresso
- `backend/src/progress/tests/`, `backend/src/submissions/tests/`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 3", Backend |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Business Rules BR-011, BR-014, BR-015, BR-017, BR-019, BR-020 |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | Aluno: Module/Lesson/Exercise Read ✅, Submission Create ✅, Progress Read 🔒 |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-002, J-003, J-004 — steps e expected errors |
| **Backend Services** | `docs/backend/03-services-usecases.md` | Padrão UseCase/Service |
| **Backend Selectors** | `docs/backend/04-selectors.md` | Padrão de selectors |
| **API Conventions** | `docs/backend/06-api-conventions.md` | Padrão de API |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
