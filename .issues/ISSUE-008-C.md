# [ISSUE-008-C] Telas de Erro — Unauthorized (401) e Not Found (404)

## Contexto

Sub-issue de [ISSUE-008](./ISSUE-008.md) — Frontend Auth (Fase 1).
Implementar as páginas de erro de acesso negado e página não encontrada.

## Descrição

Criar as telas de erro padrão da aplicação. Estas telas não dependem de backend e podem ser desenvolvidas em paralelo.

> **Dependência**: Nenhuma (sem dependência de backend).

### Tarefas

1. **Tela `/unauthorized`** (401/403):
   - Ícone/ilustração de acesso negado
   - Mensagem: "Você não tem permissão para acessar esta página"
   - Botão "Voltar" (history.back)
   - Botão "Ir para minha área" (redireciona pela role)

2. **Tela `/not-found`** (404):
   - Ícone/ilustração de página não encontrada
   - Mensagem: "Página não encontrada"
   - Botão "Voltar ao início"

## Critérios de Aceite

- [ ] Tela de unauthorized com mensagem clara e botões de navegação
- [ ] Tela de not found com mensagem e botão de voltar
- [ ] Layout visual consistente com o design system
- [ ] Botão "Ir para minha área" redireciona pela role do usuário

## Arquivos Afetados

- `frontend/src/domains/auth/pages/UnauthorizedPage.tsx`
- `frontend/src/domains/auth/pages/NotFoundPage.tsx`
- `frontend/src/app/routes.tsx` — rotas de fallback

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-008** | `.issues/ISSUE-008.md` | Contexto completo |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Screens: Acesso Negado, Página Não Encontrada |
| **Design System** | `docs/frontend/05-design-system.md` | Componentes Mantine v7 |

## Status

- **Prioridade**: média
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
