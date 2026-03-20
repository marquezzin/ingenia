# [ISSUE-010-E] Visão Administrativa de Turmas (Read-Only)

## Contexto

Sub-issue de [ISSUE-010](./ISSUE-010.md) — Frontend Admin (Fase 2).
Implementar a visão read-only de turmas no painel admin.

## Descrição

Criar a página de listagem de todas as turmas com professor responsável, apenas para visualização.

> **Dependência**: ISSUE-002 (ClassGroup model), 010-A (layout admin).

### Tarefas

1. **Lista de turmas** (`/admin/classes`):
   - Tabela: nome da turma, professor, status, número de alunos
   - Filtro por status
   - Read-only (sem criação/edição pelo admin)

## Critérios de Aceite

- [x] Lista de turmas com professor responsável
- [x] Filtro por status funcional
- [x] Read-only (sem ações de escrita)
- [x] States loading/empty

## Arquivos Afetados

- `frontend/src/domains/admin/pages/classes/ClassListPage.tsx`
- `frontend/src/domains/admin/api.ts`
- `frontend/src/domains/admin/hooks.ts`
- `frontend/src/domains/admin/types.ts`
- `frontend/src/domains/admin/model.ts`
- `frontend/src/app/routes.tsx`
- `backend/src/classes/selectors.py`
- `backend/src/classes/serializers.py`
- `backend/src/classes/views.py`
- `backend/src/classes/urls.py`
- `backend/src/config/urls.py`
- `backend/src/classes/tests/test_class_group_admin.py`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-010** | `.issues/ISSUE-010.md` | Contexto completo |

## Status

- **Prioridade**: baixa
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-20
