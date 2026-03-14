# [ISSUE-016-D] Auditoria de Ações Admin + CORS/CSRF/Headers

## Contexto

Sub-issue de [ISSUE-016](./ISSUE-016.md) — Segurança (Fase 5).

## Descrição

Implementar auditoria de ações administrativas e revisar configurações de segurança HTTP.

> **Dependência**: 009-A a 009-D (rotas admin existem).

### Tarefas

1. **Auditoria**: log de criação/edição/exclusão (módulos, aulas, exercícios, usuários, account_status)
2. **CORS**: apenas origens permitidas
3. **CSRF**: protection ativa
4. **Security headers**: X-Content-Type-Options, X-Frame-Options, etc.

## Critérios de Aceite

- [ ] Auditoria básica de ações admin
- [ ] CORS configurado corretamente
- [ ] Security headers configurados

## Arquivos Afetados

- `backend/src/config/settings/base.py`
- `backend/src/core/middleware/` — audit middleware (se necessário)

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-016** | `.issues/ISSUE-016.md` | Contexto completo |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | §4.4 |

## Status

- **Prioridade**: média
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
