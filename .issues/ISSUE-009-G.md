# [ISSUE-009-G] Endpoint de Estatísticas do Dashboard Admin

## Contexto

Sub-issue de [ISSUE-009](./ISSUE-009.md) — Backend Admin CRUD (Fase 2).
A ISSUE-010-A (Frontend Admin Dashboard) precisa de um endpoint que retorne métricas agregadas para os cards de resumo. Em vez de fazer múltiplas chamadas aos endpoints de listagem existentes para extrair `.count`, é mais eficiente ter um endpoint dedicado que retorne todos os totais em uma única requisição.

## Descrição

Criar um endpoint `GET /api/v1/admin/stats/` acessível apenas por administradores. O endpoint retorna contagens totais de módulos, aulas, exercícios e usuários, executando apenas queries `.count()` eficientes no banco.

### Tarefas

1. Criar serializer `AdminDashboardStatsSerializer`
2. Criar view `AdminDashboardStatsView` (APIView)
3. Registrar URL em `curriculum/urls.py`
4. Escrever testes unitários

## Critérios de Aceite

- [x] `GET /api/v1/admin/stats/` retorna `{ total_modules, total_lessons, total_exercises, total_users }`
- [x] Endpoint acessível apenas por admins autenticados (403 para outros roles, 401 para anônimos)
- [x] Testes unitários cobrindo resposta de sucesso e permissões

## Arquivos Afetados

- `backend/src/curriculum/views.py` — nova view
- `backend/src/curriculum/serializers.py` — novo serializer
- `backend/src/curriculum/urls.py` — nova rota
- `backend/src/curriculum/tests/test_admin_stats.py` — testes

## Notas Técnicas

- Não precisa de service/usecase pois é uma query read-only simples
- Usa `APIView` em vez de `ModelViewSet` pois não é CRUD
- Resposta sem paginação (dados fixos, sem lista)

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-20
- **Atualizado em**: 2026-03-20
