# [ISSUE-011-F] Progresso de Aula por Acesso — Trigger de Visualização

## Contexto

Sub-issue de [ISSUE-011](./ISSUE-011.md) — Backend Aluno (Fase 3).
Gap identificado durante a implementação da ISSUE-011-C.
Atualmente, o progresso de aula (`StudentLessonProgress`) e módulo (`StudentModuleProgress`) só é criado/atualizado quando o aluno submete um exercício. Isso significa que:

- Aulas sem exercícios publicados nunca têm progresso registrado
- O progresso de módulo/aula não reflete o simples consumo de conteúdo (vídeo + material escrito)
- O aluno que assiste à aula mas não submete exercício fica invisível no rastreamento

## Descrição

Criar um endpoint e service para registrar progresso de aula ao acessar/visualizar conteúdo, independente de submissão de exercício.

### Tarefas

1. **Endpoint de marcação de aula**:
   - `POST /api/v1/student/lessons/:id/mark-started/`
   - Cria `StudentLessonProgress` como IN_PROGRESS (se ainda não existe)
   - Protegido por `IsStudent`
   - Aula deve estar publicada (BR-019)

2. **Completar aula sem exercícios**:
   - Definir critério de conclusão para aulas sem exercícios publicados
   - Opção: `POST /api/v1/student/lessons/:id/mark-completed/` (ação explícita do aluno)
   - Ou: marcar como COMPLETED automaticamente ao acessar

3. **Cascata de progresso**:
   - Ao marcar aula como IN_PROGRESS, criar `StudentModuleProgress` IN_PROGRESS (se não existe)
   - Atualizar `StudentProfile.learning_status` para IN_PROGRESS (se NOT_STARTED)

4. **Impacto no `UpdateModuleProgressUseCase`**:
   - Verificar se a conclusão do módulo considera aulas sem exercícios corretamente

## Critérios de Aceite

- [x] Endpoint de marcação de aula funcional
- [x] Aulas sem exercícios podem ter progresso registrado
- [x] Cascata de progresso atualiza módulo e perfil
- [x] Protegido por `IsStudent` + aula publicada
- [x] Testes unitários cobrindo o novo fluxo

## Arquivos Afetados

- `backend/src/progress/services/progress.py` — novo UseCase ou extensão dos existentes
- `backend/src/progress/views.py` — view de marcação
- `backend/src/progress/urls.py` — rota
- `backend/src/progress/serializers.py` — serializer
- `backend/src/progress/tests/` — novos testes

## Notas Técnicas

### Documentação de Referência

| Documento | Caminho | O que consultar |
|---|---|---|
| **ISSUE-011-C** | `.issues/ISSUE-011-C.md` | Implementação atual do progresso |
| **Domain Model** | `docs/requirements/ingenia-documents/design/domain_model.md` | StudentLessonProgress, BR-019 |
| **Journeys** | `docs/requirements/ingenia-documents/design/journeys.md` | J-002 (acessar aula), J-004 (progresso) |

## Status

- **Prioridade**: média
- **Tipo**: feature
- **Status**: Concluída
- **Criado em**: 2026-03-27
- **Atualizado em**: 2026-03-30
