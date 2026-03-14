# [ISSUE-016-B] Validação de Entrada — Revisão de Serializers

## Contexto

Sub-issue de [ISSUE-016](./ISSUE-016.md) — Segurança (Fase 5).

## Descrição

Revisar todos os serializers para validações completas e sanitização de inputs.

> **Dependência**: 009-A a 009-D (serializers admin), 011-A a 011-B (serializers aluno).

### Tarefas

1. Revisar validações de todos os serializers
2. Sanitizar inputs de texto longo (source_code, written_content)
3. Validar tamanho máximo de source_code

## Critérios de Aceite

- [ ] Validações completas em todos serializers
- [ ] Input sanitizado contra injection
- [ ] Tamanho máximo de source_code configurado

## Arquivos Afetados

- `backend/src/*/serializers.py`

## Notas Técnicas

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-016** | `.issues/ISSUE-016.md` | Contexto completo |

## Status

- **Prioridade**: média
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
