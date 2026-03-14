# [ISSUE-016-A] Rate Limiting — Login + Submissões

## Contexto

Sub-issue de [ISSUE-016](./ISSUE-016.md) — Segurança (Fase 5).

## Descrição

Implementar rate limiting em rotas críticas.

> **Dependência**: 007-A (login endpoint), 011-B (submissão endpoint).

### Tarefas

1. **Rate limiting no login**: por IP e por email
2. **Rate limiting nas submissões**: por aluno (ex: 1 submissão a cada 5 segundos)
3. Usar DRF throttle classes ou `django-ratelimit`

## Critérios de Aceite

- [ ] Login rate limited por IP e email
- [ ] Submissões rate limited por aluno
- [ ] Mensagem de erro clara ao exceder limite

## Arquivos Afetados

- `backend/src/config/settings/base.py` — throttle config
- `backend/src/accounts/views.py`, `backend/src/submissions/views.py`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-016** | `.issues/ISSUE-016.md` | Contexto completo |
| **Spec** | `docs/requirements/ingenia-documents/discover/spec.md` | Security §9 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
