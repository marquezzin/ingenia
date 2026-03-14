# [ISSUE-009-F] Testes Unitários — Serializers e Services de Admin CRUD

## Contexto

Sub-issue de [ISSUE-009](./ISSUE-009.md) — Backend Admin CRUD (Fase 2).
Cobertura de testes unitários para todos os CRUDs administrativos.

## Descrição

Criar testes unitários cobrindo serializers, services e validações de negócio de todos os CRUDs admin.

> **Dependência**: 009-A, 009-B, 009-C, 009-D, 009-E (todos os CRUDs e validações).

### Tarefas

1. **Testes de CRUD Module** (009-A):
   - Criar, listar, buscar, filtrar, editar, deletar
   - Validação de `sequence_order` único

2. **Testes de CRUD Lesson** (009-B):
   - CRUD nested sob Module
   - VideoLesson inline
   - Validação de `sequence_order` único por módulo

3. **Testes de CRUD Exercise + TestCase** (009-C):
   - CRUD nested sob Lesson
   - TestCase nested sob Exercise

4. **Testes de CRUD User** (009-D):
   - Criação por role com profile automático
   - Filtros por role e account_status

5. **Testes de Business Rules** (009-E):
   - BR-008: publicar aula sem vídeo → erro
   - BR-008: publicar aula sem conteúdo → erro
   - BR-010: publicar exercício sem test cases → erro

## Critérios de Aceite

- [ ] Testes de CRUD Module passando
- [ ] Testes de CRUD Lesson + VideoLesson passando
- [ ] Testes de CRUD Exercise + TestCase passando
- [ ] Testes de CRUD User passando
- [ ] Testes de BR-008 e BR-010 passando
- [ ] Todos endpoints testados com permission IsAdmin

## Arquivos Afetados

- `backend/src/curriculum/tests/` — testes de curriculum
- `backend/src/accounts/tests/` — testes de User admin

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-009** | `.issues/ISSUE-009.md` | Contexto completo |
| **Testing** | `docs/backend/05-testing.md` | Padrão de testes |

## Status

- **Prioridade**: alta
- **Tipo**: chore
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
