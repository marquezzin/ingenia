# [ISSUE-018] Validação Final — E2E Completo, Performance e Revisão de Autorização

## Contexto

Fase 5 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Segurança, Polish & Validação Final.
Suite completa de testes E2E, validação de performance do motor de correção e revisão da matriz de autorização.

## Descrição

Garantir a qualidade e segurança completa da plataforma antes do release, com testes end-to-end abrangentes, validação de performance e auditoria de autorização.

> **Dependência**: ISSUE-016 (segurança), ISSUE-017 (UX). Deve ser a última issue executada.

### Tarefas

1. **Suite E2E cobrindo todas as 8 jornadas críticas** (Playwright):
   - J-001: Login e redirecionamento por perfil
   - J-002: Aluno percorre trilha e acessa aula
   - J-003: Aluno consome aula e resolve exercício
   - J-004: Aluno acompanha progresso
   - J-005: Professor cria turma e acompanha desempenho
   - J-006: Professor consulta progresso individual
   - J-007: Admin cria módulo com aula e exercício
   - J-008: Admin gerencia usuários

2. **Testes de segurança do sandbox**:
   - Tentativa de acesso a arquivos do host
   - Tentativa de acesso à rede
   - Fork bomb / memory exhaustion
   - Timeout enforcement

3. **Testes de performance do motor de correção**:
   - Tempo médio de avaliação de uma submissão
   - Comportamento sob carga (múltiplas submissões simultâneas)
   - Timeout handling

4. **Revisão completa da matriz de autorização**:
   - Testar cada combinação role × resource × action da matrix
   - Verificar que aluno não acessa rotas admin/teacher
   - Verificar que professor não acessa dados fora do escopo
   - Verificar que account_status != ACTIVE bloqueia acesso

## Critérios de Aceite

- [ ] Suite E2E cobrindo J-001 a J-008
- [ ] Todos os testes E2E passando
- [ ] Testes de segurança do sandbox passando
- [ ] Performance de avaliação < 30s para submissão típica
- [ ] Comportamento estável sob 10 submissões simultâneas
- [ ] Matriz de autorização verificada: nenhum acesso indevido
- [ ] Contas inativas não conseguem autenticar
- [ ] Cross-role access negado em todas rotas

## Arquivos Afetados

- `frontend/src/domains/*/e2e/` — suites E2E de todos domains
- `backend/src/*/tests/` — testes adicionais de autorização
- `backend/src/submissions/tests/` — testes de segurança e performance do sandbox

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 5 — Validação Final" |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | **TODAS** as jornadas J-001 a J-008 — Steps, Expected Errors e Edge Cases |
| **Authorization** | `docs/requirements/ingenia-documents/design/authorization.md` | Authorization Matrix §3 COMPLETA; Special Rules §4 |
| **Spec** | `docs/requirements/ingenia-documents/discover/spec.md` | Security §9; Non-Functional §8 |
| **Backend Testing** | `docs/backend/05-testing.md` | Padrão de testes |
| **Frontend Testing** | `docs/frontend/04-testing.md` | Padrão E2E Playwright |
| **Workflow** | `.agent/workflows/run-tests.md` | Como rodar testes |

## Status

- **Prioridade**: alta
- **Tipo**: chore
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
