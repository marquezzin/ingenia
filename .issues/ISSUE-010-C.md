# [ISSUE-010-C] CRUD Aulas + Exercícios — Nested com Test Cases

## Contexto

Sub-issue de [ISSUE-010](./ISSUE-010.md) — Frontend Admin (Fase 2).
Implementar as telas de CRUD de aulas e exercícios, nested dentro de módulos.

## Descrição

Criar as páginas de gestão de aulas (com vídeo e conteúdo) e exercícios (com test cases) no admin.

> **Dependência**: 009-B (API Lesson), 009-C (API Exercise), 010-B (módulo como contexto pai).

### Tarefas

1. **CRUD Aulas** (`/admin/modules/:id/lessons/*`):
   - Lista de aulas dentro do módulo
   - Formulário de criação/edição com campos de vídeo URL e conteúdo escrito
   - Editor de conteúdo escrito (markdown ou rich text)

2. **CRUD Exercícios** (`/admin/modules/:id/lessons/:id/exercises/*`):
   - Lista de exercícios dentro da aula
   - Formulário com enunciado e support_message
   - Alerta visual se exercício sem test cases (BR-010)

3. **Gestão de Test Cases**:
   - Lista de test cases dentro do exercício
   - Criar/editar/remover test cases inline
   - Campos: name, input_data, expected_output, is_hidden

## Critérios de Aceite

- [ ] CRUD de aulas nested dentro de módulo
- [ ] Editor de conteúdo escrito funcional
- [ ] CRUD de exercícios nested dentro de aula
- [ ] Gestão de test cases inline
- [ ] Alerta visual para exercício sem test cases (BR-010)
- [ ] Feedback visual de BR-008 (aula sem vídeo/conteúdo)
- [ ] States loading/empty/error/success

## Arquivos Afetados

- `frontend/src/domains/admin/pages/lessons/`
- `frontend/src/domains/admin/pages/exercises/`
- `frontend/src/domains/admin/components/TestCaseForm.tsx`

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-010** | `.issues/ISSUE-010.md` | Contexto completo |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | Telas Admin: Aulas, Exercícios |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | BR-008, BR-010 |

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
