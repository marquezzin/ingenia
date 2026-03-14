# [ISSUE-014] Backend Professor — CRUD Turmas, Enrollment e Progresso

## Contexto

Fase 4 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Experiência do Professor.
Implementar endpoints de gestão de turmas, associação de alunos e consulta de progresso coletivo e individual.

## Descrição

Criar serializers, services e views para o professor gerenciar turmas e acompanhar o progresso dos seus alunos.

> **Dependência**: ISSUE-002 (classes models), ISSUE-005 (progress models), ISSUE-007 (permissions).

### Tarefas

1. **CRUD `ClassGroup`** (professor cria/edita suas turmas):
   - `GET /api/v1/teacher/classes/` — lista turmas do professor autenticado
   - `POST /api/v1/teacher/classes/` — cria turma
   - `GET /api/v1/teacher/classes/:id/` — detalhe da turma
   - `PUT /api/v1/teacher/classes/:id/` — editar turma
   - Professor só vê/edita suas próprias turmas (BR-004)

2. **CRUD `ClassEnrollment`** (associar/remover alunos):
   - `GET /api/v1/teacher/classes/:id/enrollments/` — listar alunos da turma
   - `POST /api/v1/teacher/classes/:id/enrollments/` — associar aluno
   - `DELETE /api/v1/teacher/classes/:id/enrollments/:id/` — remover aluno
   - Validar BR-005 (aluno sem matrícula duplicada)

3. **Endpoint de progresso coletivo da turma**:
   - `GET /api/v1/teacher/classes/:id/progress/` — agregado
   - Indicadores: alunos que iniciaram trilha, módulos concluídos, exercícios resolvidos

4. **Endpoint de progresso individual do aluno**:
   - `GET /api/v1/teacher/classes/:id/students/:id/progress/`
   - Progresso detalhado por módulo, aula e exercício
   - Validar BR-016: professor só vê alunos das suas turmas

5. **Autorização**: professor vê apenas alunos das suas turmas (BR-016).

6. **Testes unitários** de autorização e services (pytest).

## Critérios de Aceite

- [ ] CRUD completo de ClassGroup para professor
- [ ] Professor só acessa turmas próprias
- [ ] Enrollment: associar e remover alunos
- [ ] BR-004: Apenas professor como responsável de turma
- [ ] BR-005: Sem matrícula duplicada
- [ ] BR-016: Professor vê apenas alunos das suas turmas
- [ ] Endpoint de progresso coletivo com indicadores agregados
- [ ] Endpoint de progresso individual detalhado
- [ ] Testes unitários de autorização e services

## Arquivos Afetados

- `backend/src/classes/serializers.py` — serializers de ClassGroup, ClassEnrollment
- `backend/src/classes/services/` — services de turmas e enrollment
- `backend/src/classes/views.py` — ViewSets do professor
- `backend/src/classes/urls.py` — rotas teacher
- `backend/src/progress/serializers.py` — serializers de progresso para professor
- `backend/src/progress/views.py` — views de progresso coletivo/individual
- `backend/src/classes/tests/`, `backend/src/progress/tests/`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 4", Backend |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Entities: ClassGroup, ClassEnrollment; Business Rules BR-004, BR-005, BR-016 |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | Matrix §3: Class e ClassMembership — Professor; Special Rules §4.1 (Professor → alunos vinculados) |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-005 (Professor cria turma), J-006 (Professor consulta progresso individual) |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Telas do professor: detalhe turma, progresso individual (para entender dados necessários) |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
