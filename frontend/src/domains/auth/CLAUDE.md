# Domain: auth

## Propósito
Autenticação do usuário: login, registro, refresh de tokens, logout.
Redirecionamento pós-login baseado no role do usuário.

## Páginas
- **`LoginPage.tsx`** — Formulário de login com Logo, links para registro/forgot-password, erro inline, redirecionamento por role

## API Contract (`api.ts`)

| Função         | Método | Endpoint                | Retorno                  |
|---------------|--------|------------------------|--------------------------| 
| `loginApi`    | POST   | `/api/auth/login/`     | `{ user, access, refresh }` |
| `registerApi` | POST   | `/api/auth/register/`  | `{ user, access, refresh }` |
| `refreshApi`  | POST   | `/api/auth/refresh/`   | `{ access }`             |
| `getMeApi`    | GET    | `/api/auth/me/`        | `User`                   |

## Model (`model.ts`)
- `getRedirectPathByRole(role)` — Retorna path de redirect: STUDENT→`/student`, TEACHER→`/teacher`, ADMIN→`/admin`
- `extractApiError(error)` — Extrai mensagem de erro legível de erro axios

## Hooks (`hooks.ts`)
- `useMe()` — Query do usuário logado (key: `["auth", "me"]`)
- `useLogin()` — Mutation de login → salva tokens + invalida `me`
- `useRegister()` — Mutation de registro → salva tokens + invalida `me`
- `useLogout()` — Limpa tokens + redireciona para `/login`

## Types (`types.ts`)
- `UserRole` — `"STUDENT" | "TEACHER" | "ADMIN"`
- `AccountStatus` — `"ACTIVE" | "INACTIVE" | "SUSPENDED"`
- `User` — id, email, firstName, lastName, fullName, role, accountStatus, dateJoined, profileInfo
- `AuthTokens` — access, refresh
- `LoginPayload` — email, password
- `RegisterPayload` — fullName, email, password, passwordConfirm

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
