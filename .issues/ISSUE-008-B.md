# [ISSUE-008-B] Tela de Registro + Tela de Forgot Password

## Contexto

Sub-issue de [ISSUE-008](./ISSUE-008.md) — Frontend Auth (Fase 1).
Implementar as telas de registro de novo aluno e de recuperação de senha.

## Descrição

Criar as páginas de registro público e forgot password, integrando com as APIs correspondentes.

> **Dependência**: 007-B (endpoint de registro), 007-D (endpoint de reset password).

### Tarefas

1. **Tela `/register`**:
   - Formulário: Nome completo, Email, Senha, Confirmar senha
   - Botão "Criar conta" com loading
   - Link "Já tenho conta" → `/login`
   - Validações inline: email válido, senha mínima, senhas coincidem
   - Mensagem de sucesso e redirecionamento para login

2. **Tela `/forgot-password`**:
   - Campo Email
   - Botão "Enviar instruções" com loading
   - Mensagem de confirmação genérica (sem expor se email existe)
   - Link "Voltar para login"

## Critérios de Aceite

- [ ] Tela de registro funcional criando conta de aluno
- [ ] Validações inline de email e senha
- [ ] Redirecionamento para login após registro com sucesso
- [ ] Tela de forgot password funcional
- [ ] Mensagem genérica de confirmação (segurança)
- [ ] Estados de loading e error

## Arquivos Afetados

- `frontend/src/domains/auth/pages/RegisterPage.tsx`
- `frontend/src/domains/auth/pages/ForgotPasswordPage.tsx`
- `frontend/src/domains/auth/api.ts` — endpoints de registro e forgot
- `frontend/src/app/routes.tsx` — rotas

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-008** | `.issues/ISSUE-008.md` | Contexto completo da issue pai |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Screens: Cadastro, Recuperar Senha |
| **Design System** | `docs/frontend/05-design-system.md` | Componentes Mantine v7 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
