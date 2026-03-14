# [ISSUE-012-B] Executor de Sandbox — Subprocess/Docker com Limites

## Contexto

Sub-issue de [ISSUE-012](./ISSUE-012.md) — Motor de Correção (Fase 3).
Implementar o executor de sandbox que roda código em ambiente isolado e seguro.

## Descrição

Criar o componente de sandbox que executa código submetido pelo aluno em ambiente controlado com limites de tempo, memória e acesso.

> **Dependência**: Nenhuma dependência direta — pode ser desenvolvida em paralelo com 012-A.

### Tarefas

1. **Executor de sandbox**:
   - Opção A (MVP): subprocess com `resource` limits (Unix)
   - Opção B (recomendado): Docker container isolado
   - Interface: `execute(source_code, stdin, timeout) → ExecutionResult`

2. **Limites de segurança**:
   - Timeout configurável (default: 10-30 segundos)
   - Limite de memória (ex: 256MB)
   - Sem acesso à rede do host
   - Sem acesso ao disco do host (além do workspace temporário)

3. **Captura de output**:
   - Capturar stdout e stderr separadamente
   - Retornar exit code
   - Tratar timeout como caso especial

## Critérios de Aceite

- [ ] Código executado em ambiente isolado
- [ ] Timeout funcional e configurável
- [ ] Limite de memória aplicado
- [ ] Sem acesso a rede do host
- [ ] Sem acesso a disco do host
- [ ] stdout e stderr capturados
- [ ] Interface clara `execute() → ExecutionResult`

## Arquivos Afetados

- `backend/src/submissions/services/sandbox.py` — executor de sandbox
- `docker/` — Dockerfile de sandbox (se opção Docker)

## Notas Técnicas

### Documentação de Referência (a IA DEVE consultar)

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-012** | `.issues/ISSUE-012.md` | Contexto completo, decisões técnicas |
| **Spec** | `docs/requirements/ingenia-documents/discover/spec.md` | Security §9 (execução segura) |

### Decisões Técnicas
- **GAP #1**: Linguagem dos exercícios. Iniciar com Python é recomendado.
- Para MVP, subprocess com `resource` limits é aceitável. Docker é mais seguro para produção.

## Status

- **Prioridade**: alta
- **Tipo**: feature
- **Criado em**: 2026-03-12
- **Atualizado em**: 2026-03-12
