# [ISSUE-010] Frontend Admin — Telas de Administração de Conteúdo e Usuários

## Contexto

Fase 2 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Administração de Conteúdo.
Implementar todas as telas do painel administrativo para gestão de módulos, aulas, exercícios e usuários.

## Descrição

Criar o domain frontend `admin` com layout administrativo, dashboard e telas de CRUD para todos os recursos de conteúdo e gestão de usuários.

> **Dependência**: ISSUE-009 (endpoints de CRUD no backend), ISSUE-008 (layout base e guards).

### Tarefas

1. **Layout admin com sidebar**:
   - Sidebar com navegação: Dashboard, Módulos, Usuários, Turmas
   - Header com nome do admin e logout
   - Breadcrumb navigation

2. **Dashboard admin** (`/admin`):
   - Cards de resumo: total de módulos, aulas, exercícios, usuários
   - Atalhos rápidos para ações comuns

3. **CRUD Módulos** (`/admin/modules/*`):
   - Lista de módulos com busca e filtro por status
   - Formulário de criação/edição de módulo
   - Detalhe do módulo com lista de aulas
   - Botão de publicar/despublicar

4. **CRUD Aulas** (`/admin/modules/:id/lessons/*`):
   - Lista de aulas dentro do módulo
   - Formulário de criação/edição com campos de vídeo e conteúdo escrito
   - Editor de conteúdo escrito (markdown ou rich text)

5. **CRUD Exercícios** (`/admin/modules/:id/lessons/:id/exercises/*`):
   - Lista de exercícios dentro da aula
   - Formulário de criação/edição com enunciado e support_message
   - Gestão de test cases (listar, criar, editar, remover)
   - Alerta visual se exercício sem test cases

6. **CRUD Usuários** (`/admin/users/*`):
   - Lista de usuários com filtros por role e account_status
   - Formulário de criação com seleção de role
   - Edição de dados e status da conta
   - Detalhe do usuário com informações de profile

7. **Visão administrativa de turmas** (`/admin/classes`):
   - Lista read-only de todas as turmas com professor responsável

8. **Testes E2E** dos fluxos J-007 e J-008 (Playwright).

## Critérios de Aceite

- [ ] Layout admin com sidebar e navegação funcional
- [ ] Dashboard com cards de resumo
- [ ] CRUD completo de Módulos (list, create, edit, detail, delete)
- [ ] CRUD de Aulas nested dentro de módulo
- [ ] CRUD de Exercícios nested dentro de aula
- [ ] Gestão de test cases dentro de exercício
- [ ] CRUD de Usuários com criação por role
- [ ] Visão de turmas (read-only)
- [ ] Feedback visual de BR-010 (exercício sem test cases)
- [ ] States loading/empty/error/success em todas telas
- [ ] Testes E2E cobrindo J-007 e J-008

## Arquivos Afetados

- `frontend/src/domains/admin/` — novo domain (seguir workflow `/add-frontend-domain`)
- `frontend/src/domains/admin/pages/` — todas as páginas admin
- `frontend/src/domains/admin/api.ts` — chamadas API admin
- `frontend/src/domains/admin/types.ts` — tipos admin
- `frontend/src/domains/admin/hooks.ts` — hooks admin
- `frontend/src/domains/admin/components/` — componentes reutilizáveis (forms, tables)
- `frontend/src/domains/admin/e2e/` — testes E2E
- `frontend/src/app/routes.tsx` — rotas admin

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 2", Frontend |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Sitemap (rotas /admin/*); Telas do Administrador (a partir da seção de telas admin) |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-007 (Cria e organiza módulo), J-008 (Gerencia usuários) |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Entities para definir formulários e tipos |
| **Frontend Architecture** | `docs/frontend/01-domain-architecture.md` | Padrão de domains |
| **Design System** | `docs/frontend/05-design-system.md` | Componentes Mantine v7 para Table, Form, Card, etc. |
| **State Management** | `docs/frontend/03-state-management.md` | Padrão de gerenciamento de estado |
| **Frontend Testing** | `docs/frontend/04-testing.md` | Padrão E2E Playwright |
| **Workflow** | `.agent/workflows/add-frontend-domain.md` | Como criar novo domain frontend |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
