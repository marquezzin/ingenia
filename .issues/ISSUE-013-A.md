# [ISSUE-013-A] Layout Aluno + Dashboard/Trilha

## Contexto

Sub-issue de [ISSUE-013](./ISSUE-013.md) — Frontend Aluno (Fase 3).
Implementar o layout do aluno e a tela de dashboard com trilha de aprendizagem.

## Descrição

Criar o domain frontend `student` com layout dedicado e dashboard exibindo a trilha de módulos com progresso.

> **Dependência**: 008-E (layout base), 008-D (StudentRoute), 011-A (API leitura módulos).

### Tarefas

1. **Criar domain `student`** seguindo workflow `/add-frontend-domain`
2. **Layout do aluno** com navegação superior: Trilha, Módulos, Progresso, Submissões
3. **Dashboard** (`/student`):
   - Cards de módulos com progresso
   - "Continuar de onde parei" (último módulo/aula acessado)
   - Resumo de exercícios resolvidos

## Critérios de Aceite

- [ ] Domain `student` criado
- [ ] Layout com navegação funcional
- [ ] Dashboard com trilha de módulos e progresso
- [ ] "Continuar de onde parei" funcional

## Arquivos Afetados

- `frontend/src/domains/student/` — novo domain
- `frontend/src/domains/student/pages/DashboardPage.tsx`
- `frontend/src/domains/student/components/StudentLayout.tsx`
- `frontend/src/app/routes.tsx`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-013** | `.issues/ISSUE-013.md` | Contexto completo |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Sitemap /student/*; Dashboard Aluno |
| **Workflow** | `.agent/workflows/add-frontend-domain.md` | Como criar domain |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
