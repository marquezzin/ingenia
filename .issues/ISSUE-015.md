# [ISSUE-015] Frontend Professor — Turmas, Alunos e Progresso

## Contexto

Fase 4 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Experiência do Professor.
Implementar todas as telas do painel do professor: gestão de turmas, visualização de alunos e acompanhamento de progresso.

## Descrição

Criar o domain frontend `teacher` com todas as telas da experiência do professor.

> **Dependência**: ISSUE-014 (endpoints de turmas e progresso), ISSUE-008 (layout base e guards).

### Tarefas

1. **Layout do professor**:
   - Sidebar com: Dashboard, Turmas, Alunos
   - Header com nome do professor

2. **Dashboard professor** (`/teacher`):
   - Cards resumo: turmas, alunos acompanhados, trilha iniciada, exercícios resolvidos
   - Lista resumida de turmas
   - Atalhos para criar turma e ver alunos

3. **CRUD de turmas** (`/teacher/classes/*`):
   - Lista de turmas com busca e indicadores
   - Nova turma (`/teacher/classes/new`): formulário com nome e busca de alunos
   - Detalhe da turma (`/teacher/classes/:id`): tabela de alunos com indicadores de progresso
   - Editar turma (`/teacher/classes/:id/edit`): alterar nome e composição de alunos

4. **Lista consolidada de alunos** (`/teacher/students`):
   - Tabela com filtros por turma e status de progresso
   - Colunas: nome, turma, iniciou trilha, módulos concluídos, exercícios resolvidos

5. **Progresso individual do aluno** (`/teacher/classes/:id/students/:id`):
   - Cabeçalho com nome do aluno e turma
   - Progresso por módulo e aula
   - Exercícios resolvidos e score

6. **Testes E2E** dos fluxos J-005 e J-006 (Playwright).

## Critérios de Aceite

- [ ] Dashboard professor com cards de resumo
- [ ] Lista de turmas funcional com busca
- [ ] Criar turma com seleção de alunos
- [ ] Detalhe da turma com indicadores por aluno
- [ ] Editar turma: alterar nome e composição
- [ ] Lista consolidada de alunos transversal
- [ ] Progresso individual do aluno detalhado
- [ ] States loading/empty/error/success em todas telas
- [ ] Turma sem alunos exibe estado vazio claro (não erro)
- [ ] Testes E2E cobrindo J-005 e J-006

## Arquivos Afetados

- `frontend/src/domains/teacher/` — novo domain (seguir workflow `/add-frontend-domain`)
- `frontend/src/domains/teacher/pages/` — todas as páginas
- `frontend/src/domains/teacher/api.ts` — chamadas API
- `frontend/src/domains/teacher/types.ts` — tipos
- `frontend/src/domains/teacher/hooks.ts` — hooks
- `frontend/src/domains/teacher/components/` — StudentTable, ProgressIndicator, etc.
- `frontend/src/domains/teacher/e2e/` — testes E2E
- `frontend/src/app/routes.tsx` — rotas teacher

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 4", Frontend |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Sitemap /teacher/*; Telas do Professor: Dashboard, Turmas (lista, nova, detalhe, editar), Alunos (lista consolidada), Progresso individual — **TODAS** com Components, States, Actions, Data |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-005 (Professor cria turma e acompanha desempenho), J-006 (Progresso individual); Edge Cases |
| **Frontend Architecture** | `docs/frontend/01-domain-architecture.md` | Padrão de domains |
| **Design System** | `docs/frontend/05-design-system.md` | Mantine v7 components |
| **Workflow** | `.agent/workflows/add-frontend-domain.md` | Como criar novo domain |

### Edge Cases Importantes
- Professor com turma sem alunos: mostrar estado vazio claro, não erro (journeys.md Edge Cases).
- Aluno em uso individual pode não estar em nenhuma turma — isso não afeta a experiência do professor.

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
