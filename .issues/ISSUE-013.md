# [ISSUE-013] Frontend Aluno — Trilha, Aulas, Editor de Código e Progresso

## Contexto

Fase 3 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Experiência do Aluno.
Implementar todas as telas da experiência do aluno: trilha de aprendizagem, consumo de aulas, editor de código com submissão, e acompanhamento de progresso.

## Descrição

Criar o domain frontend `student` com todas as telas da jornada do aluno, incluindo o editor de código integrado.

> **Dependência**: ISSUE-011 (endpoints de leitura e submissão), ISSUE-012 (motor de correção), ISSUE-008 (layout base e guards).

### Tarefas

1. **Layout do aluno** com navegação superior:
   - Nav: Trilha, Módulos, Progresso, Submissões
   - Header com nome do aluno

2. **Dashboard / Trilha** (`/student`):
   - Cards de módulos com progresso
   - "Continuar de onde parei"
   - Resumo de exercícios resolvidos

3. **Lista de módulos** (`/student/modules`):
   - Busca e filtros por status de progresso
   - Indicadores visuais de progresso por módulo

4. **Detalhe do módulo** (`/student/modules/:id`):
   - Título, descrição, barra de progresso
   - Lista sequencial de aulas com status
   - CTA "Continuar módulo"

5. **Tela de aula** (`/student/modules/:id/lessons/:id`):
   - Player de vídeo (embed URL)
   - Bloco de conteúdo escrito (markdown render)
   - Lista de exercícios da aula
   - Navegação entre aulas (anterior/próxima)

6. **Tela de exercício** (`/student/modules/:id/lessons/:id/exercises/:id`):
   - Enunciado do exercício
   - **Editor de código** (Monaco Editor ou CodeMirror)
   - Botões: "Submeter código", "Limpar editor"
   - Painel de resultado: loading → passed/failed com feedback
   - Histórico de tentativas recentes
   - Confirmação antes de limpar editor

7. **Tela de progresso** (`/student/progress`):
   - Resumo geral de progresso
   - Módulos com percentual concluído
   - Indicadores de exercícios resolvidos

8. **Tela de histórico de submissões** (`/student/submissions`):
   - Tabela com filtros por módulo, aula, exercício, status
   - Detalhe do feedback

9. **Testes E2E** dos fluxos J-002, J-003, J-004 (Playwright).

## Critérios de Aceite

- [ ] Dashboard exibe trilha com progresso do aluno
- [ ] Lista de módulos com filtros e busca
- [ ] Detalhe do módulo com aulas e progresso
- [ ] Aula exibe vídeo, conteúdo escrito e exercícios
- [ ] Editor de código funcional (Monaco ou CodeMirror)
- [ ] Submissão de código com feedback em tempo real
- [ ] Painel de resultado com states: loading/running/passed/failed
- [ ] Histórico de tentativas visível no exercício
- [ ] Tela de progresso consolidado
- [ ] Tela de histórico de submissões com filtros
- [ ] States loading/empty/error/success em todas telas
- [ ] Testes E2E cobrindo J-002, J-003, J-004

## Arquivos Afetados

- `frontend/src/domains/student/` — novo domain (seguir workflow `/add-frontend-domain`)
- `frontend/src/domains/student/pages/` — todas as páginas
- `frontend/src/domains/student/api.ts` — chamadas API
- `frontend/src/domains/student/types.ts` — tipos
- `frontend/src/domains/student/hooks.ts` — hooks
- `frontend/src/domains/student/components/` — CodeEditor, ResultPanel, ProgressCard, etc.
- `frontend/src/domains/student/e2e/` — testes E2E
- `frontend/src/app/routes.tsx` — rotas student

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 3", Frontend |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Sitemap /student/*; Telas do Aluno: Dashboard, Módulos, Aula, Exercício, Progresso, Submissões — **TODAS** com Components, States, Actions, Data |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-002 (Trilha e aula), J-003 (Exercício e correção), J-004 (Progresso) — steps e expected errors |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | Relationships: module→lesson→exercise |
| **Frontend Architecture** | `docs/frontend/01-domain-architecture.md` | Padrão de domains |
| **Design System** | `docs/frontend/05-design-system.md` | Mantine v7 components |
| **Workflow** | `.claude/commands/add-frontend-domain.md` | Como criar novo domain |

### Decisões Técnicas
- **Editor de código**: Monaco Editor (pacote `@monaco-editor/react`) é recomendado por ser o mesmo do VS Code.
- **Markdown render**: usar `react-markdown` ou similar.
- **Player de vídeo**: embed simples com iframe para URLs do YouTube/Vimeo.
- A UX deve ser simples e guiada conforme ADR-005 do Spec — linguagem pedagógica.

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
