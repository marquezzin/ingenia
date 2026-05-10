# Domain: auth

## Propósito
Autenticação do usuário: login, registro, refresh de tokens, logout.
Redirecionamento pós-login baseado no role do usuário.

## Páginas
- **`LoginPage.tsx`** — Formulário de login com Logo, links para registro/forgot-password, erro inline, redirecionamento por role
- **`RegisterPage.tsx`** — Formulário de registro de novo aluno
- **`ForgotPasswordPage.tsx`** — Solicita email para envio do link de reset; estado de sucesso confirma envio sem expor existência do email
- **`ResetPasswordPage.tsx`** — Recebe `?token=...` da querystring, formulário de nova senha + confirmação. Redireciona pra `/forgot-password` se token ausente. Estado de sucesso → CTA pro login.
- **`UnauthorizedPage.tsx`** / **`NotFoundPage.tsx`** — Telas de erro

## API Contract (`api.ts`)

| Função              | Método | Endpoint                     | Retorno                     |
|---------------------|--------|------------------------------|-----------------------------|
| `loginApi`          | POST   | `/api/auth/login/`           | `{ user, access, refresh }` |
| `registerApi`       | POST   | `/api/auth/register/`        | `{ user, access, refresh }` |
| `refreshApi`        | POST   | `/api/auth/refresh/`         | `{ access }`                |
| `getMeApi`          | GET    | `/api/auth/me/`              | `User`                      |
| `forgotPasswordApi` | POST   | `/api/auth/forgot-password/` | `void`                      |
| `resetPasswordApi`  | POST   | `/api/auth/reset-password/`  | `void`                      |

> `resetPasswordApi` converte camelCase → snake_case (`newPassword` → `new_password`, `newPasswordConfirm` → `new_password_confirm`) antes de enviar.

## Model (`model.ts`)
- `getRedirectPathByRole(role)` — Retorna path de redirect: STUDENT→`/student`, TEACHER→`/teacher`, ADMIN→`/admin`
- `extractApiError(error)` — Extrai mensagem de erro legível de erro axios

## Hooks (`hooks.ts`)
- `useMe()` — Query do usuário logado (key: `["auth", "me"]`)
- `useLogin()` — Mutation de login → salva tokens + invalida `me`
- `useRegister()` — Mutation de registro → salva tokens + invalida `me`
- `useForgotPassword()` — Mutation que dispara email de recuperação
- `useResetPassword()` — Mutation que troca a senha usando token recebido por email
- `useLogout()` — Limpa tokens + redireciona para `/login`

## Types (`types.ts`)
- `UserRole` — `"STUDENT" | "TEACHER" | "ADMIN"`
- `AccountStatus` — `"ACTIVE" | "INACTIVE" | "SUSPENDED"`
- `User` — id, email, firstName, lastName, fullName, role, accountStatus, dateJoined, profileInfo
- `AuthTokens` — access, refresh
- `LoginPayload` — email, password
- `RegisterPayload` — fullName, email, password, passwordConfirm
- `ForgotPasswordPayload` — email
- `ResetPasswordPayload` — token, newPassword, newPasswordConfirm

## E2E (`e2e/`)
- `login.spec.ts` — Login com redirect por role, credenciais inválidas, conta inativa, logout
- `register.spec.ts` — Registro válido, email duplicado, senhas não coincidentes
- `guards.spec.ts` — ProtectedRoute redirect, RoleRoute redirect

## Dependências
- `shared/auth` — `setTokens`, `clearTokens`, guards (`RequireAuth`, `RequireGuest`)
- `shared/http` — `httpClient` (axios com interceptors JWT)
- `shared/ui` — `Logo`

## Backend Correspondente
- App: `backend/src/accounts/`
