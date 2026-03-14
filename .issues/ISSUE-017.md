# [ISSUE-017] UX & Responsividade — Feedback Visual, Erros Pedagógicos e Acessibilidade

## Contexto

Fase 5 do [roadmap.md](../docs/requirements/ingenia-documents/roadmap.md) — Segurança, Polish & Validação Final.
Polish de UX com mensagens pedagógicas, feedback visual e responsividade básica.

## Descrição

Revisar e melhorar a experiência do usuário em toda a plataforma, com foco em mensagens pedagógicas, estados visuais e acessibilidade mínima.

> **Dependência**: ISSUE-008, ISSUE-010, ISSUE-013, ISSUE-015 (todos os frontends implementados).

### Tarefas

1. **Mensagens de erro pedagógicas** (conforme UX Flows §5):
   - Erros de autenticação: linguagem clara sem expor dados
   - Erros de submissão: orientação sem revelar resposta
   - Erros de validação: indicação precisa do campo com problema
   - Estados vazios: texto explicativo e CTA

2. **Feedback visual em todas as telas**:
   - Loading: skeletons em todas listas e cards
   - Empty: mensagem com CTA relevante
   - Error: mensagem com botão de retry
   - Success: confirmação visual de ações (toast/notification)

3. **Responsividade básica tablet/mobile**:
   - Sidebar colapsável em telas menores
   - Tabelas responsivas (scroll horizontal ou card view)
   - Editor de código usável em tablet

4. **Acessibilidade mínima**:
   - Contraste suficiente (WCAG AA)
   - Focus visible em elementos interativos
   - Labels em todos inputs
   - Aria-labels em botões de ícone

## Critérios de Aceite

- [ ] Mensagens de erro pedagógicas em todas telas
- [ ] States de loading (skeleton) em todas listas
- [ ] States de empty com texto explicativo e CTA
- [ ] States de error com retry
- [ ] Notifications de sucesso para ações
- [ ] Layout funcional em tablet (1024px)
- [ ] Contraste WCAG AA
- [ ] Focus visible em elementos interativos
- [ ] Labels em todos inputs

## Arquivos Afetados

- `frontend/src/domains/*/pages/*.tsx` — revisão de states em todas telas
- `frontend/src/shared/ui/` — ajustes de design system
- `frontend/src/shared/components/` — componentes de feedback (EmptyState, ErrorState, etc.)
- CSS/styles globais

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **Roadmap** | `docs/requirements/ingenia-documents/roadmap.md` | Seção "Fase 5 — UX & Responsividade" |
| **UX Flows** | `docs/requirements/ingenia-documents/design/ux_flows.md` | **TODAS** as telas — seções States e Actions de cada screen |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | Expected Errors de TODAS as jornadas (J-001 a J-008); Edge Cases |
| **Spec** | `docs/requirements/ingenia-documents/discover/spec.md` | ADR-005 (Linguagem guiada para público iniciante); Non-Functional §8 (Usabilidade) |
| **Design System** | `docs/frontend/05-design-system.md` | Tokens e componentes Mantine |

### Diretrizes de UX
- Público alvo são alunos do 8º/9º ano sem experiência prévia — linguagem deve ser simples.
- Feedbacks de erro devem ser compreensíveis para crianças (ADR-005).
- Foco principal é desktop, mas tablet deve funcionar minimamente.

## Status

- **Prioridade**: média
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
