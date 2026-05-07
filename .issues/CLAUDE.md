# Issues — ingenia

> Leia este arquivo ao **criar, modificar ou concluir** issues, ou ao **escolher a próxima issue para trabalhar**.

## Estrutura

```
.issues/
├── TEMPLATE.md           ← Modelo para novas issues
├── TRACKER.md            ← Acompanhamento centralizado (FONTE DE VERDADE)
├── ISSUE-001.md          ← Issue individual (atômica — pode ser executada diretamente)
├── ISSUE-007.md          ← Issue pai (NÃO execute diretamente — foi decomposta)
├── ISSUE-007-A.md        ← Sub-issue (execute esta)
├── ISSUE-007-B.md        ← Sub-issue (execute esta)
└── ...
```

## ⚠️ Issues Pai vs Sub-Issues

### Regra fundamental: **NUNCA execute uma issue pai que foi decomposta em sub-issues**

- **Issues pai** (ex: `ISSUE-007.md`, `ISSUE-008.md`, etc.) que foram decompostas servem apenas como **documentação de contexto**.
- **Sub-issues** (ex: `ISSUE-007-A.md`, `ISSUE-007-B.md`, etc.) são as unidades de trabalho executáveis.
- **Issues atômicas** (ex: `ISSUE-001.md`, `ISSUE-002.md`, etc.) que **NÃO** foram decompostas PODEM ser executadas diretamente.

### Como saber se uma issue foi decomposta?

Olhe no `TRACKER.md`:
- Se a issue aparece **como seção de agrupamento** (ex: `### ISSUE-007 — Backend Auth (G)`), ela foi decomposta. NÃO execute a issue pai, execute as sub-issues listadas abaixo.
- Se a issue aparece **diretamente na tabela da fase** (ex: na tabela "Fase 0 — Fundação"), ela é atômica e pode ser executada.

### Issues que NÃO foram decompostas (executar diretamente)

| Issue | Motivo |
|-------|--------|
| ISSUE-001 | 6 tarefas claras e auto-contidas |
| ISSUE-002 | 2 models simples |
| ISSUE-003 | 5 models com mesmo pattern |
| ISSUE-004 | 2 models simples |
| ISSUE-005 | 3 models repetitivos |
| ISSUE-006 | Tarefa mecânica |
| ISSUE-017 | Revisão transversal iterativa |

### Issues que FORAM decompostas (executar sub-issues)

ISSUE-007, ISSUE-008, ISSUE-009, ISSUE-010, ISSUE-011, ISSUE-012, ISSUE-013, ISSUE-014, ISSUE-015, ISSUE-016, ISSUE-018.

---

## Escolhendo a Próxima Issue

### Algoritmo para determinar qual issue executar:

1. **Abra `.issues/TRACKER.md`**
2. **Procure a primeira issue/sub-issue com status 🟡 (Pendente) cujas dependências estão todas 🟢 (Concluídas)**
3. **Verifique a coluna "Depende de"** — todas as issues listadas precisam estar concluídas
4. **Priorize pela ordem no tracker** (as fases e camadas estão na ordem correta)

### Exemplo prático:

Se ISSUE-001 e ISSUE-003 estão 🟢, as próximas elegíveis são:
- ISSUE-002 (depende de 001 ✅)
- ISSUE-004 (depende de 001 ✅, 003 ✅)
- ISSUE-005 (depende de 001 ✅, 003 ✅)
- ISSUE-007-A (depende de 001 ✅)
- ISSUE-007-B (depende de 001 ✅)

**NÃO** seria elegível:
- ISSUE-006 (depende de 001-005, nem todos concluídos)
- ISSUE-007-C (depende de 007-A que ainda não foi feita)

---

## Fluxo de Trabalho

### 1. Criando uma Issue

1. Copie `.issues/TEMPLATE.md` para `.issues/ISSUE-XXX.md` (use o próximo número sequencial)
2. Preencha todas as seções do template
3. Defina prioridade, tipo e data de criação
4. **Atualize `.issues/TRACKER.md`** — adicione uma nova linha na tabela com status 🟡 Pendente

### 2. Iniciando Trabalho em uma Issue

1. Leia a issue completa antes de começar
2. **Se for uma sub-issue, leia também a issue pai** para entender o contexto completo
3. Consulte **toda a documentação listada em "Notas Técnicas"** da issue
4. Atualize o status na issue para "Em andamento"
5. **Atualize `.issues/TRACKER.md`** — mude o status para 🔵

### 3. Concluindo uma Issue

1. Verifique todos os critérios de aceite
2. Marque os critérios atendidos como `[x]`
3. Atualize o status na issue para "Concluída" e a data de atualização
4. **Atualize `.issues/TRACKER.md`** — mude o status para 🟢
5. **Verifique se a conclusão desbloqueia outras issues** — informe ao usuário

### 4. Durante Modificações

- **Sempre** atualize a data `Atualizado em` na issue
- **Sempre** atualize o `TRACKER.md` se houver mudança de status
- Se novos arquivos forem afetados, adicione-os na seção "Arquivos Afetados"
- Se critérios de aceite mudarem, registre a alteração

## Regras Obrigatórias

1. **Toda tarefa significativa deve ter uma issue** — features, bugs, refactors
2. **O tracker é a fonte de verdade** — mantenha-o sempre atualizado
3. **Nunca feche uma issue sem verificar os critérios de aceite**
4. **Numere sequencialmente** — verifique o último número usado no tracker antes de criar
5. **Uma issue = um escopo** — se o escopo crescer, crie issues filhas
6. **Nunca execute uma issue pai que foi decomposta** — execute as sub-issues
7. **Respeite dependências** — não inicie uma issue cujas dependências não estão concluídas
8. **Ao iniciar uma sub-issue, leia a issue pai primeiro** — ela contém contexto e documentação de referência adicional
