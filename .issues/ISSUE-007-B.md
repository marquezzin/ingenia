# [ISSUE-007-B] Endpoint de Registro Público — Criar User + StudentProfile

## Contexto

Sub-issue de [ISSUE-007](./ISSUE-007.md) — Backend Auth (Fase 1).
Implementar o endpoint de registro público para auto-cadastro de alunos.

## Descrição

Criar o endpoint de registro que permite a qualquer pessoa se cadastrar como aluno na plataforma.

> **Dependência**: ISSUE-001 (User + StudentProfile precisam existir).

### Tarefas

1. **Criar endpoint `POST /api/v1/auth/register/`**:
   - Campos: `full_name`, `email`, `password`, `password_confirm`
   - Cria `User` com `role=STUDENT` + `account_status=ACTIVE`
   - Cria `StudentProfile` automaticamente vinculado ao User

2. **Validações do serializer**:
   - Email único (retornar erro adequado se já existe, sem expor se email está cadastrado)
   - Senha segura (mínimo 8 caracteres, ao menos 1 número)
   - `password` e `password_confirm` devem coincidir

3. **Service de registro** (seguir padrão de services do projeto):
   - `register_student(data)` → cria User + StudentProfile em transação
   - Retornar User criado

## Critérios de Aceite

- [x] Endpoint de registro cria User com `role=STUDENT`
- [x] StudentProfile criado automaticamente junto com User
- [x] Validação de email único
- [x] Validação de senha segura
- [x] Validação de confirmação de senha
- [x] Resposta não expõe se email já existe (mensagem genérica)

## Arquivos Afetados

- `backend/src/accounts/serializers.py` — `RegisterSerializer`
- `backend/src/accounts/services/` — `register_student` service
- `backend/src/accounts/views.py` — `RegisterView`
- `backend/src/accounts/urls.py` — rota `/register/`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-007** | `.issues/ISSUE-007.md` | Contexto completo da issue pai |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | §1 auto-cadastro como aluno |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Screen: Cadastro |
| **Backend Services** | `docs/backend/03-services-usecases.md` | Padrão UseCase/Service |

## Status

- **Status**: Concluída
- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-16
