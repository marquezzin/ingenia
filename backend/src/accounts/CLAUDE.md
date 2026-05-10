# App: accounts

## Propósito
Autenticação, registro e gerenciamento de usuários. App **core** do sistema.

## Models
- **`User`** — `AbstractUser` customizado com UUID pk, `email` como `USERNAME_FIELD`, campo `username` removido, `role` (UserRole), `account_status` (AccountStatus), `last_login_at`
- **`StudentProfile`** — Perfil 1:1 com User (role=STUDENT). Campos: `learning_status`, `first_started_at`
- **`TeacherProfile`** — Perfil 1:1 com User (role=TEACHER)
- **`AdminProfile`** — Perfil 1:1 com User (role=ADMIN)
- **`PasswordResetToken`** — Token de recuperação de senha. Campos: `user` (FK), `token` (unique), `expires_at`, `used`, `created_at`

## Enums (`enums.py`)
- **`UserRole`**: STUDENT, TEACHER, ADMIN
- **`AccountStatus`**: ACTIVE, INACTIVE, SUSPENDED
- **`LearningStatus`**: NOT_STARTED, IN_PROGRESS, COMPLETED

## Regras de Negócio
- **BR-001**: Todo usuário deve possuir exatamente um papel válido (validação em `User.clean()`)
- **BR-002**: Perfil especializado só pode existir para role correspondente (validação em `clean()` dos profiles)
- **BR-003**: Email do usuário é único (constraint no model)

## Endpoints (`/api/auth/`)

| Método | Rota                | View                  | Auth   | Descrição                                  |
|--------|--------------------|-----------------------|--------|--------------------------------------------|
| POST   | `register/`        | `RegisterView`        | Public | Cria usuário + retorna JWT                 |
| POST   | `login/`           | `LoginView`           | Public | Autentica + retorna JWT                    |
| POST   | `refresh/`         | `TokenRefreshView`    | Public | Refresh do access token                    |
| GET    | `me/`              | `MeView`              | Auth   | Dados do usuário logado                    |
| POST   | `forgot-password/` | `ForgotPasswordView`  | Public | Solicita recuperação de senha              |
| POST   | `reset-password/`  | `ResetPasswordView`   | Public | Redefine senha com token                   |
| CRUD   | `admin/users/`     | `UserAdminViewSet`    | Admin  | CRUD de usuários via painel administrador  |

## Services (`services/auth.py`)
- **`RegisterUserUseCase`** — Valida email único, cria User (role=STUDENT) + StudentProfile em transação
- **`LoginUserUseCase`** — Autentica por email+password

## Services (`services/password_reset.py`)
- **`ForgotPasswordUseCase`** — Gera token de reset e dispara email HTML (`emails/reset_password.html`) via `core.services.email.SendEmailUseCase` com link `{CORS_ALLOWED_ORIGINS[0]}/reset-password?token=...`. Retorna silenciosamente se email não existe.
- **`ResetPasswordUseCase`** — Valida token (existência, expiração, uso), atualiza senha e marca token como usado.

## Services (`services/user_admin.py`)
- **`CreateUserAdminUseCase`** — Cria um User e seuProfile correspondente a partir do admin.
- **`UpdateUserAdminUseCase`** — Atualiza um User pelo admin. **NOTA IMPORTANTE:** O update de usuários bloqueia intencionalmente a mudança de `role` para evitar perda ou inconsistência de Profile correspondente (ex: StudentProfile), conforme alinhado em ISSUE-009-D.

## Selectors (`selectors.py`)
- `list_users` — Retorna queryset `User.objects.all().order_by("-date_joined")`.

## Serializers
- `UserSerializer` — Leitura (id, email, first_name, last_name, role, account_status, date_joined)
- `RegisterSerializer` — Escrita (full_name, email, password, password_confirm) + validação de senha forte e confirmação
- `LoginSerializer` — Escrita (email, password)
- `ForgotPasswordSerializer` — Escrita (email)
- `ResetPasswordSerializer` — Escrita (token, new_password, new_password_confirm) + validação de senha forte e confirmação
- `UserAdminListSerializer` / `UserAdminDetailSerializer` / `UserAdminCreateSerializer` / `UserAdminUpdateSerializer` — Serializers utilizados na ViewSet de Admin, com perfis customizados explícitos e bloqueio de alteração de role.

## Testes
- `tests/test_auth.py` — Fluxos JWT via API (register, login, me, forgot-password, reset-password)
- `tests/test_use_cases.py` — UseCases isolados (register, login, forgot-password, reset-password)
- `tests/test_user_admin.py` — CRUD admin de usuários (criação por role, filtros, permissões, bloqueio de delete)
- `tests/factories.py` — `UserFactory`, `StudentProfileFactory`, `TeacherProfileFactory`, `AdminProfileFactory`

## Dependências
- Nenhuma (app core do sistema)
- Usado por: todos os outros apps (via `AUTH_USER_MODEL`)

## Frontend Correspondente
- Domain: `frontend/src/domains/auth/`
