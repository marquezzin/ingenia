# [ISSUE-011-E] Testes Unitários — Services de Progresso e Submissão

## Contexto

Sub-issue de [ISSUE-011](./ISSUE-011.md) — Backend Aluno (Fase 3).
Cobertura de testes unitários para os services de submissão e progresso do aluno.

## Descrição

Criar testes unitários cobrindo os cenários de submissão, progresso e consulta.

> **Dependência**: 011-A, 011-B, 011-C, 011-D (todos os services e endpoints).

### Tarefas

1. **Testes de leitura** (011-A):
   - Apenas conteúdo publicado é retornado
   - Test cases não são expostos
   - Progresso do aluno incluído

2. **Testes de submissão** (011-B):
   - Submissão válida cria registro
   - Submissão para exercício não publicado → erro
   - Aluno não autenticado → 401

3. **Testes de progresso** (011-C):
   - Exercício marcado como concluído após submissão aprovada
   - Módulo concluído quando tudo concluído
   - attempts_count incrementado corretamente

4. **Testes de histórico** (011-D):
   - Aluno vê apenas próprias submissões
   - Filtros funcionais

## Critérios de Aceite

- [ ] Testes de leitura de conteúdo publicado
- [ ] Testes de submissão (válido, inválido)
- [ ] Testes de progresso automático (cascata)
- [ ] Testes de BR-014, BR-015, BR-017, BR-020
- [ ] Todos passando

## Arquivos Afetados

- `backend/src/submissions/tests/` — testes de submissão
- `backend/src/progress/tests/` — testes de progresso
- `backend/src/curriculum/tests/` — testes de leitura aluno

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-011** | `.issues/ISSUE-011.md` | Contexto completo |
| **Testing** | `docs/backend/05-testing.md` | Padrão de testes |

## Status

- **Prioridade**: alta
- **Tipo**: chore
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
