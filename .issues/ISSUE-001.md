# [ISSUE-001] App `accounts` — Estender User Model + Criar Profiles

## Contexto

Fase 0 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Fundação.
A plataforma Ingenia precisa de um modelo de usuário estendido com suporte a múltiplos papéis (Aluno, Professor, Administrador) e perfis especializados vinculados 1:1 ao User.

## Descrição

Estender o `User` model existente no app `accounts` e criar os models de perfil especializado.

### Tarefas

1. **Criar enums** no app `accounts`:
   - `UserRole`: `STUDENT`, `TEACHER`, `ADMIN`
   - `AccountStatus`: `ACTIVE`, `INACTIVE`, `SUSPENDED`
   - `LearningStatus`: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`

2. **Estender `User` model** com os seguintes campos:
   - `role` (UserRole, required) — Perfil principal do usuário
   - `account_status` (AccountStatus, required, default=ACTIVE)
   - `last_login_at` (DateTime, nullable)

3. **Criar `StudentProfile`** (1:1 com User):
   - `user` (OneToOneField → User)
   - `learning_status` (LearningStatus, default=NOT_STARTED)
   - `first_started_at` (DateTime, nullable)
   - Unique: `user_id`; Index: `learning_status`

4. **Criar `TeacherProfile`** (1:1 com User):
   - `user` (OneToOneField → User)
   - Unique: `user_id`

5. **Criar `AdminProfile`** (1:1 com User):
   - `user` (OneToOneField → User)
   - Unique: `user_id`

6. **Gerar migrations** e verificar que rodam sem erro.

## Critérios de Aceite

- [x] Enums `UserRole`, `AccountStatus` e `LearningStatus` implementados
- [x] `User` model estendido com `role`, `account_status`, `last_login_at`
- [x] `StudentProfile`, `TeacherProfile` e `AdminProfile` criados com relação 1:1
- [x] Constraints de unicidade aplicados conforme domain model
- [x] Índices criados conforme seção de indexes do domain model
- [x] Migrations geradas e executando sem erro
- [x] BR-001: Usuário possui exatamente um papel principal (validação)
- [x] BR-002: Perfil especializado existe apenas para role correspondente (validação)
- [x] BR-003: Email do usuário é único (constraint)

## Arquivos Afetados

- `backend/src/accounts/models.py` — estender User, criar Profiles
- `backend/src/accounts/enums.py` — criar enums (ou adicionar ao models)
- `backend/src/accounts/migrations/` — novas migrations

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 0", app `accounts` |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Entities: User, StudentProfile, TeacherProfile, AdminProfile; Enums §4; Business Rules BR-001 a BR-003; Invariants §5 |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | System Roles §1 |
| **Spec** | `docs/requirements/ingenia-documents/discover/spec.md` | Data Model §5, Auth §7 |
| **Backend Architecture** | `docs/backend/02-apps-pattern.md` | Padrão de apps Django do projeto |
| **Backend Services** | `docs/backend/03-services-usecases.md` | Padrão de services/use cases |
| **Contexto do Projeto** | `.context.md` | Stack e convenções |

### Regras de Negócio Aplicáveis
- **BR-001**: Todo usuário deve possuir exatamente um papel principal entre aluno, professor e administrador.
- **BR-002**: Perfil especializado deve existir apenas para usuários com papel correspondente.
- **BR-003**: Email do usuário deve ser único em toda a plataforma.

### Decisões de Design
- Os profiles usam UUID como pk e herdam `created_at`/`updated_at` do base model do template.
- `LearningStatus` fica no `StudentProfile`, não no `User`.
- Seguir o padrão de enums já existente no projeto (verificar `core/` ou `accounts/`).

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: ✅ Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-14
