# [ISSUE-007-D] Recuperação de Senha — Forgot + Reset Password

## Contexto

Sub-issue de [ISSUE-007](./ISSUE-007.md) — Backend Auth (Fase 1).
Implementar o fluxo básico de recuperação de senha por email.

## Descrição

Criar os endpoints de solicitação e confirmação de reset de senha, com envio de token por email.

> **Dependência**: ISSUE-001 (User), 007-A (fluxo de auth precisa estar funcional).

### Tarefas

1. **Endpoint `POST /api/v1/auth/forgot-password/`**:
   - Recebe `email`
   - Gera token de reset com expiração
   - Envia email com link de reset (ou apenas log em dev)
   - Resposta SEMPRE retorna sucesso (sem expor se email existe)

2. **Endpoint `POST /api/v1/auth/reset-password/`**:
   - Recebe `token`, `new_password`, `new_password_confirm`
   - Valida token e expiração
   - Atualiza senha do usuário
   - Invalida token após uso

3. **Service de reset de senha**:
   - Gerar token seguro (UUID ou similar)
   - Armazenar token com expiração (em cache ou model)
   - Implementação básica para MVP (pode evoluir depois)

## Critérios de Aceite

- [x] Endpoint forgot-password gera e "envia" token
- [x] Endpoint reset-password valida token e atualiza senha
- [x] Token expira após tempo configurável
- [x] Token invalidado após uso
- [x] Resposta de forgot-password não expõe se email existe
- [x] Validação de senha segura no reset

## Arquivos Afetados

- `backend/src/accounts/serializers.py` — `ForgotPasswordSerializer`, `ResetPasswordSerializer`
- `backend/src/accounts/services/` — service de reset de senha
- `backend/src/accounts/views.py` — views de forgot/reset
- `backend/src/accounts/urls.py` — rotas

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-007** | `.issues/ISSUE-007.md` | Contexto completo da issue pai |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Screen: Recuperar Senha |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-001 Expected Errors |

## Status

- **Prioridade**: média
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-16
