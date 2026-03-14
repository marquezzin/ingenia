# [ISSUE-008-D] Guards de Rota — ProtectedRoute, StudentRoute, TeacherRoute, AdminRoute

## Contexto

Sub-issue de [ISSUE-008](./ISSUE-008.md) — Frontend Auth (Fase 1).
Implementar os guards de rota para proteger áreas da aplicação por autenticação e role.

## Descrição

Criar componentes wrapper de rota que verificam autenticação e role, redirecionando para login ou unauthorized conforme necessário.

> **Dependência**: 007-A (JWT auth + role), 007-C (roles), 008-A (auth context precisa existir).

### Tarefas

1. **`ProtectedRoute`** — guard geral:
   - Verifica se usuário está autenticado
   - Se não autenticado → redireciona para `/login`
   - Salva URL atual para redirect pós-login

2. **Guards por role**:
   - `StudentRoute` — verifica `role === STUDENT`
   - `TeacherRoute` — verifica `role === TEACHER`
   - `AdminRoute` — verifica `role === ADMIN`
   - Se role incompatível → redireciona para `/unauthorized`

3. **Integração com rotas**:
   - Configurar rotas com guards em `routes.tsx`
   - Rotas públicas: `/login`, `/register`, `/forgot-password`
   - Rotas protegidas: `/student/*`, `/teacher/*`, `/admin/*`

## Critérios de Aceite

- [ ] Rotas protegidas redirecionam para login se não autenticado
- [ ] Rotas por role redirecionam para unauthorized se role incorreto
- [ ] URL original preservada para redirect pós-login
- [ ] Guards composíveis (ProtectedRoute + StudentRoute)
- [ ] Rotas públicas acessíveis sem autenticação

## Arquivos Afetados

- `frontend/src/shared/components/ProtectedRoute.tsx`
- `frontend/src/shared/components/RoleRoute.tsx` — ou guards individuais
- `frontend/src/app/routes.tsx` — configuração de rotas

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-008** | `.issues/ISSUE-008.md` | Contexto completo |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | Public vs Authenticated §5 |
| **Frontend Architecture** | `docs/frontend/01-domain-architecture.md` | Padrão de rotas |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
