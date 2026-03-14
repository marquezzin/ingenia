# [ISSUE-006] Admin Django + Seed Básico

## Contexto

Fase 0 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Fundação.
Entregável final da Fase 0: registrar todos os models no Django Admin e criar um seed básico funcional para desenvolvimento.

## Descrição

Registrar todos os models criados nas ISSUE-001 a ISSUE-005 no Django Admin e criar um seed script para popular dados de teste.

> **Dependência**: ISSUE-001 a ISSUE-005 (todos os models precisam existir).

### Tarefas

1. **Registrar models no Django Admin**:
   - `accounts`: User (já pode existir), StudentProfile, TeacherProfile, AdminProfile
   - `classes`: ClassGroup, ClassEnrollment
   - `curriculum`: Module, Lesson, VideoLesson, Exercise, ExerciseTestCase
   - `submissions`: Submission, SubmissionResult
   - `progress`: StudentModuleProgress, StudentLessonProgress, StudentExerciseProgress

2. **Configurar admin com filtros e busca básicos**:
   - `list_display` relevante para cada model
   - `list_filter` por status/enums
   - `search_fields` por nome/título/email

3. **Criar seed básico**:
   - 1 admin, 1 professor, 3 alunos
   - 2 módulos com 2 aulas cada
   - 1 vídeo por aula
   - 2 exercícios por aula com 2 test cases cada
   - 1 turma com os 3 alunos
   - Algumas submissões e progresso de exemplo

## Critérios de Aceite

- [ ] Todos os models registrados no Django Admin
- [ ] Admin configurado com list_display, list_filter e search_fields adequados
- [ ] Seed script funcional criando dados de exemplo
- [ ] Seed pode ser executado via management command
- [ ] Dados de exemplo são suficientes para testar visualmente no admin

## Arquivos Afetados

- `backend/src/accounts/admin.py` — registrar profiles
- `backend/src/classes/admin.py` — registrar ClassGroup, ClassEnrollment
- `backend/src/curriculum/admin.py` — registrar Module, Lesson, VideoLesson, Exercise, ExerciseTestCase
- `backend/src/submissions/admin.py` — registrar Submission, SubmissionResult
- `backend/src/progress/admin.py` — registrar progress models
- `backend/src/core/management/commands/seed.py` — seed script (ou local equivalente)

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 0", entregáveis |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Todos os entities e enums para definir list_display/filters |
| **Backend Architecture** | `docs/backend/02-apps-pattern.md` | Padrão de admin do projeto |
| **Contexto do Projeto** | `.context.md` | Credenciais dev para seed |

### Decisões de Design
- Seed deve usar as credenciais dev padrão do `.context.md` (admin@hub.dev / admin123).
- Verificar se já existe um pattern de seed no projeto (em `core/management/commands/`).

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
