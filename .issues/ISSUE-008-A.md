# [ISSUE-008-A] Tela de Login + Redirecionamento Pós-Login por Role

## Contexto

Sub-issue de [ISSUE-008](./ISSUE-008.md) — Frontend Auth (Fase 1).
Implementar a tela de login com autenticação JWT e redirecionamento automático para a área correta baseado no role do usuário.

## Descrição

Criar a página de login, integrar com a API de auth e implementar o redirecionamento pós-login.

> **Dependência**: 007-A (JWT login funcional + role no token), 007-C (permissions/roles).

### Tarefas

1. **Criar domain `auth`** seguindo workflow `/add-frontend-domain`

2. **Tela `/login`** (referência J-001):
   - Logo e nome da plataforma "Ingenia"
   - Formulário: Email + Senha
   - Botão "Entrar" com estado de loading
   - Links "Esqueci minha senha" e "Criar conta"
   - Mensagens de erro inline (credenciais inválidas, conta inativa)

3. **Auth context/store**:
   - Armazenar tokens JWT (access + refresh)
   - Estado de autenticação (`isAuthenticated`, `user`, `role`)
   - Função `login(email, password)` → chama API + salva tokens
   - Função `logout()` → limpa tokens + redireciona
   - Auto-refresh de token

4. **Redirecionamento pós-login por role**:
   - `STUDENT` → `/student`
   - `TEACHER` → `/teacher`
   - `ADMIN` → `/admin`

## Critérios de Aceite

- [x] Tela de login funcional com formulário
- [x] Login integrado com API JWT
- [x] Tokens armazenados de forma segura
- [x] Redirecionamento correto por role após login
- [x] Estados de loading, error exibidos corretamente
- [x] Links para registro e forgot password funcionais

## Arquivos Afetados

- `frontend/src/domains/auth/pages/LoginPage.tsx` — reescrita com logo, links, redirect por role
- `frontend/src/domains/auth/types.ts` — User alinhado com backend (role, accountStatus, fullName)
- `frontend/src/domains/auth/model.ts` — **novo**: getRedirectPathByRole, extractApiError
- `frontend/src/domains/auth/CLAUDE.md` — atualizado
- `frontend/src/app/routes.tsx` — rotas placeholder `/register` e `/forgot-password`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-008** | `.issues/ISSUE-008.md` | Contexto completo da issue pai |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Screen: Login |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-001 |
| **Frontend Architecture** | `docs/frontend/01-domain-architecture.md` | Padrão de domains |
| **Workflow** | `.claude/commands/add-frontend-domain.md` | Como criar domain |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-16
