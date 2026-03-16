# [ISSUE-004] App `submissions` — Models de Submissão e Resultado

## Contexto

Fase 0 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Fundação.
Criar o app `submissions` com os models de submissão de código e resultado de avaliação automática.

## Descrição

Criar um novo app Django `submissions` contendo os models de submissão e resultado da avaliação.

> **Dependência**: ISSUE-001 (`StudentProfile`), ISSUE-003 (`Exercise`).

### Tarefas

1. **Criar app Django `submissions`** seguindo o workflow `/add-backend-app`.

2. **Criar enums**:
   - `SubmissionStatus`: `PENDING`, `RUNNING`, `EVALUATED`, `FAILED`
   - `ResultStatus`: `PASSED`, `FAILED`, `ERROR`

3. **Criar model `Submission`**:
   - `exercise` (FK → Exercise)
   - `student_profile` (FK → StudentProfile)
   - `source_code` (Text, required)
   - `evaluation_status` (SubmissionStatus, default=PENDING)
   - `score_percentage` (Decimal(5,2), nullable)
   - `submitted_at` (DateTime, required)
   - Index: `exercise_id`, `student_profile_id`, `(student_profile_id, exercise_id, submitted_at)`, `evaluation_status`

4. **Criar model `SubmissionResult`** (1:1 com Submission):
   - `submission` (OneToOneField → Submission)
   - `passed_tests_count` (Integer, required)
   - `failed_tests_count` (Integer, required)
   - `feedback_message` (Text, required)
   - `result_status` (ResultStatus, required)
   - Index: `result_status`

5. **Gerar migrations** e verificar execução.

## Critérios de Aceite

- [x] App `submissions` criado seguindo padrão do projeto
- [x] Enums `SubmissionStatus` e `ResultStatus` implementados
- [x] Model `Submission` com todos os campos e indexes
- [x] Model `SubmissionResult` com relação 1:1 ao Submission
- [x] BR-011: Estrutura permite validar que submissão requer aluno autenticado + exercício publicado
- [x] BR-012: Estrutura 1:1 entre Submission e SubmissionResult
- [x] `score_percentage` validável entre 0 e 100 (invariant)
- [x] Migrations geradas e executando sem erro

## Arquivos Afetados

- `backend/src/submissions/` — novo app Django completo
- `backend/src/submissions/models.py` — Submission, SubmissionResult
- `backend/src/submissions/enums.py` — SubmissionStatus, ResultStatus
- `backend/src/config/settings/base.py` — registrar app em INSTALLED_APPS

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 0", app `submissions` |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Entities: Submission, SubmissionResult; Relationships §2; Enums §4 (SubmissionStatus, ResultStatus); Business Rules BR-011 a BR-013; Invariants §5 |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-003 (Aluno consome aula e resolve exercício) |
| **Spec** | `docs/requirements/ingenia-documents/discover/spec.md` | Exercícios e submissões §6 |
| **Backend Architecture** | `docs/backend/02-apps-pattern.md` | Padrão de apps Django |
| **Workflow** | `.agent/workflows/add-backend-app.md` | Como criar novo app Django |

### Regras de Negócio Aplicáveis
- **BR-011**: Submissão só pode ser realizada por aluno autenticado para exercício publicado.
- **BR-012**: Cada submissão gera exatamente um resultado consolidado.
- **BR-013**: Feedback automático deve orientar sem expor resposta completa.

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-15
