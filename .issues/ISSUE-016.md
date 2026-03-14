# [ISSUE-016] Segurança — Rate Limiting, Validação, Sandbox e Auditoria

## Contexto

Fase 5 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Segurança, Polish & Validação Final.
Hardening de segurança da plataforma, incluindo rate limiting, validação de entrada, isolamento de sandbox e auditoria administrativa.

## Descrição

Implementar medidas de segurança transversais em toda a plataforma.

> **Dependência**: ISSUE-007 (auth), ISSUE-012 (sandbox), ISSUE-009 (rotas admin).

### Tarefas

1. **Rate limiting** em rotas críticas:
   - Login: limitar tentativas por IP e por email
   - Submissões: limitar frequência por aluno
   - Usar `django-ratelimit` ou DRF throttle classes

2. **Validação de entrada em todas as rotas**:
   - Revisar todos os serializers para validações completas
   - Sanitizar inputs de texto longo (source_code, written_content)
   - Validar tamanho máximo de source_code

3. **Segurança do sandbox de execução**:
   - Garantir que sandbox não acessa rede do host
   - Garantir que sandbox não acessa disco do host
   - Limitar CPU e memória do container
   - Teste de tentativas de escape

4. **Auditoria de ações administrativas**:
   - Log de criação/edição/exclusão de módulos, aulas, exercícios
   - Log de criação/edição de usuários
   - Log de alterações de account_status

5. **Revisão de CORS, CSRF e headers de segurança**:
   - Verificar configuração CORS (apenas origens permitidas)
   - CSRF protection ativa
   - Security headers: X-Content-Type-Options, X-Frame-Options, etc.

## Critérios de Aceite

- [ ] Rate limiting ativo em login e submissões
- [ ] Validação de entrada completa em todos serializers
- [ ] Sandbox sem acesso a rede/disco do host (teste de segurança)
- [ ] Limites de CPU/memória configurados no sandbox
- [ ] Auditoria básica de ações administrativas
- [ ] CORS configurado apenas para origens permitidas
- [ ] Security headers configurados
- [ ] Testes de segurança do sandbox passando

## Arquivos Afetados

- `backend/src/config/settings/base.py` — configurações de segurança, CORS, throttle
- `backend/src/accounts/views.py` — rate limiting no login
- `backend/src/submissions/views.py` — rate limiting nas submissões
- `backend/src/submissions/services/sandbox.py` — hardening do sandbox
- `backend/src/core/middleware/` — audit middleware (se necessário)
- `docker/` — limites do container sandbox

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 5 — Segurança" |
| **Spec** | `docs/requirements/ingenia-documents/discover/spec.md` | Security §9 (todas as seções); Rate Limiting |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | Special Rules §4.4 (proteção de dados, auditoria) |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | Edge Cases (submissões rápidas, tentativas de escape) |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
