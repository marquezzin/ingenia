# [ISSUE-013-C] Tela de Aula — Vídeo + Conteúdo Markdown + Exercícios

## Contexto

Sub-issue de [ISSUE-013](./ISSUE-013.md) — Frontend Aluno (Fase 3).

## Descrição

Criar a tela de consumo de aula com player de vídeo, renderização de conteúdo markdown e lista de exercícios.

> **Dependência**: 011-A (API leitura aulas), 013-B (navegação vem do módulo).

### Tarefas

1. **Tela de aula** (`/student/modules/:id/lessons/:id`):
   - Player de vídeo (iframe embed YouTube/Vimeo)
   - Bloco de conteúdo escrito (react-markdown)
   - Lista de exercícios da aula com status
   - Navegação anterior/próxima entre aulas

## Critérios de Aceite

- [ ] Vídeo embed funcional
- [ ] Conteúdo markdown renderizado
- [ ] Lista de exercícios com status de progresso
- [ ] Navegação entre aulas

## Arquivos Afetados

- `frontend/src/domains/student/pages/lessons/LessonPage.tsx`
- `frontend/src/domains/student/components/VideoPlayer.tsx`
- `frontend/src/domains/student/components/MarkdownContent.tsx`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-013** | `.issues/ISSUE-013.md` | Contexto completo, decisões técnicas (react-markdown, iframe) |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Tela Aluno: Aula |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-002 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
