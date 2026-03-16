# [ISSUE-008] Frontend Auth — Login, Registro, Guards de Rota e Layout Base

## Contexto

Fase 1 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Autenticação & Autorização.
Implementar todas as telas e lógica de autenticação no frontend, incluindo guards de rota por role e layout base com navegação por perfil.

## Descrição

Criar o domain frontend `auth` e implementar as telas de autenticação, guards de rota e layout base da aplicação.

> **Dependência**: ISSUE-007 (endpoints de auth no backend).

### Tarefas

1. **Tela `/login`** (referência J-001):
   - Logo e nome da plataforma
   - Formulário com E-mail e Senha
   - Botão "Entrar" com loading
   - Links para "Esqueci minha senha" e "Criar conta"
   - Mensagens de erro inline
   - Redirecionamento pós-login por role

2. **Tela `/register`**:
   - Formulário: Nome completo, E-mail, Senha, Confirmar senha
   - Botão "Criar conta"
   - Link "Já tenho conta"
   - Validações de senha e email

3. **Tela `/forgot-password`**:
   - Campo E-mail
   - Botão "Enviar instruções"
   - Mensagem de confirmação (sem expor se email existe)

4. **Telas `/unauthorized` e `/not-found`**:
   - Mensagem de acesso negado com botão "Voltar" e "Ir para minha área"
   - Página 404 com botão "Voltar ao início"

5. **Redirecionamento pós-login por `role`**:
   - `STUDENT` → `/student`
   - `TEACHER` → `/teacher`
   - `ADMIN` → `/admin`

6. **Guards de rota (ProtectedRoute)**:
   - `ProtectedRoute` geral (autenticado)
   - Guards por role: `StudentRoute`, `TeacherRoute`, `AdminRoute`
   - Redirecionar para `/unauthorized` se role incompatível

7. **Layout base com navegação por perfil**:
   - Sidebar ou nav superior diferenciado por role
   - Área de conteúdo principal
   - Header com nome do usuário e logout

8. **Testes E2E de login e registro** (Playwright).

## Critérios de Aceite

- [ ] Tela de login funcional com redirecionamento por role
- [ ] Tela de registro criando conta de aluno
- [x] Tela de recuperação de senha funcional
- [x] Telas de 401 e 404 implementadas
- [ ] Guards de rota bloqueando acesso por role incorreto
- [ ] Layout base renderizando navegação correta por perfil
- [ ] Testes E2E cobrindo login e registro (Playwright)
- [ ] States de loading, empty, error e success em todas telas

## Arquivos Afetados

- `frontend/src/domains/auth/` — novo domain (seguir workflow `/add-frontend-domain`)
- `frontend/src/domains/auth/pages/LoginPage.tsx`
- `frontend/src/domains/auth/pages/RegisterPage.tsx`
- `frontend/src/domains/auth/pages/ForgotPasswordPage.tsx`
- `frontend/src/domains/auth/pages/UnauthorizedPage.tsx`
- `frontend/src/domains/auth/pages/NotFoundPage.tsx`
- `frontend/src/domains/auth/api.ts` — chamadas aos endpoints de auth
- `frontend/src/domains/auth/types.ts` — tipos de auth
- `frontend/src/shared/components/ProtectedRoute.tsx`
- `frontend/src/shared/components/Layout/` — layout base
- `frontend/src/app/routes.tsx` — rotas

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 1", Frontend |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Sitemap §1; Screens: Login, Cadastro, Recuperar Senha, Acesso Negado, Página Não Encontrada §2 |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-001 (Login e redirecionamento) — todas as steps e expected errors |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | Estrutura de acesso por perfil; Public vs Authenticated §5 |
| **Frontend Architecture** | `docs/frontend/01-domain-architecture.md` | Padrão de domains |
| **API Contracts** | `docs/frontend/02-api-contracts.md` | Padrão de chamadas API |
| **Design System** | `docs/frontend/05-design-system.md` | Componentes Mantine v7 |
| **Frontend Testing** | `docs/frontend/04-testing.md` | Padrão E2E Playwright |
| **Workflow** | `.agent/workflows/add-frontend-domain.md` | Como criar novo domain frontend |

### Decisões de UX
- Mensagens de erro de login não devem confirmar se email existe ou não (referência journeys.md J-001).
- Cadastro público cria conta de Aluno por padrão.
- Redirecionamento pós-login baseado no `role` retornado pelo `/me/`.

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-16
