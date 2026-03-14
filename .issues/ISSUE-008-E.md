# [ISSUE-008-E] Layout Base com Navegação por Perfil

## Contexto

Sub-issue de [ISSUE-008](./ISSUE-008.md) — Frontend Auth (Fase 1).
Implementar o layout base da aplicação com navegação diferenciada por role do usuário.

## Descrição

Criar o componente de layout base que será usado como wrapper de todas as áreas autenticadas, com sidebar/nav diferenciada pelo perfil do usuário.

> **Dependência**: 007-A (role no /me/), 008-A (auth context), 008-D (guards de rota).

### Tarefas

1. **Layout base (`AppLayout`)**:
   - Sidebar ou nav superior (responsivo)
   - Área de conteúdo principal com `<Outlet />`
   - Header com nome do usuário logado e botão de logout

2. **Navegação diferenciada por role**:
   - **Admin**: Dashboard, Módulos, Usuários, Turmas
   - **Professor**: Dashboard, Turmas, Alunos
   - **Aluno**: Trilha, Módulos, Progresso, Submissões

3. **Componentes compartilhados**:
   - `Sidebar` — navegação lateral com itens por role
   - `Header` — info do usuário + logout
   - `Breadcrumb` — opcional, para navegação contextual

## Critérios de Aceite

- [ ] Layout base renderizado em todas áreas autenticadas
- [ ] Navegação diferenciada por role
- [ ] Header com nome do usuário e logout funcional
- [ ] Layout responsivo (sidebar colapsável em telas menores)
- [ ] Transição suave entre páginas

## Arquivos Afetados

- `frontend/src/shared/components/Layout/AppLayout.tsx`
- `frontend/src/shared/components/Layout/Sidebar.tsx`
- `frontend/src/shared/components/Layout/Header.tsx`
- `frontend/src/app/routes.tsx` — usar layout como wrapper

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-008** | `.issues/ISSUE-008.md` | Contexto completo |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Sitemap §1 para navegação por role |
| **Design System** | `docs/frontend/05-design-system.md` | AppShell, NavLink Mantine |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
