# [ISSUE-010-B] CRUD Módulos — Lista, Criação, Edição, Detalhe

## Contexto

Sub-issue de [ISSUE-010](./ISSUE-010.md) — Frontend Admin (Fase 2).
Implementar as telas de CRUD de módulos no painel administrativo.

## Descrição

Criar as páginas de listagem, criação, edição e detalhe de módulos.

> **Dependência**: 009-A (API CRUD Module), 010-A (layout admin).

### Tarefas

1. **Lista de módulos** (`/admin/modules`):
   - Tabela com colunas: título, ordem, status, ações
   - Busca por título
   - Filtro por publication_status
   - Botão "Criar módulo"

2. **Criar módulo** (`/admin/modules/new`):
   - Formulário: título, descrição, sequence_order
   - Validações inline
   - Redirect para detalhe após criar

3. **Editar módulo** (`/admin/modules/:id/edit`):
   - Formulário preenchido com dados atuais
   - Botão publicar/despublicar

4. **Detalhe do módulo** (`/admin/modules/:id`):
   - Informações do módulo
   - Lista de aulas do módulo
   - Botão editar e publicar/despublicar

## Critérios de Aceite

- [ ] Lista de módulos com busca e filtros
- [ ] Criar módulo funcional
- [ ] Editar módulo funcional
- [ ] Detalhe com lista de aulas
- [ ] Botão publicar/despublicar
- [ ] States loading/empty/error/success

## Arquivos Afetados

- `frontend/src/domains/admin/pages/modules/`
- `frontend/src/domains/admin/api.ts`
- `frontend/src/domains/admin/hooks.ts`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-010** | `.issues/ISSUE-010.md` | Contexto completo |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Telas Admin: CRUD Módulos |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-007 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
