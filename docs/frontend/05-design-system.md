# Design System (Mantine v7 + CSS Tokens)

## Arquitetura

O Design System do ingenia é composto por 3 camadas:

```
tokens.css          → Variáveis CSS (cores, espaçamento, tipografia)
theme.ts            → Tema Mantine (sincronizado com tokens)
components/         → Componentes pré-construídos (usam ambos)
```

**Para mudar o visual do projeto inteiro, edite apenas `tokens.css`.**

## Tokens (`shared/ui/tokens.css`)

Arquivo central com todas as variáveis CSS:

| Categoria    | Exemplos                                     |
|-------------|----------------------------------------------|
| Brand       | `--brand-primary`, `--brand-secondary`, etc  |
| Neutral     | `--color-bg`, `--color-text`, `--color-border` |
| Spacing     | `--space-xs` a `--space-3xl`                 |
| Radius      | `--radius-sm` a `--radius-full`              |
| Shadows     | `--shadow-xs` a `--shadow-xl`                |
| Typography  | `--font-sans`, `--font-mono`, `--text-xs` a `--text-3xl` |
| Transitions | `--transition-fast`, `--transition-base`, `--transition-slow` |

Dark mode: automático via `[data-mantine-color-scheme="dark"]`.

## Tema Mantine (`shared/ui/theme.ts`)

- Cores `brand` customizadas (paleta 0-9)
- Fontes via CSS vars (`var(--font-sans)`)
- Defaults para: Button, TextInput, Card, Modal, Table, Badge, etc.

## Component Library (`shared/ui/components/`)

Todos importáveis via `@/shared/ui/components`:

```tsx
import { DataTable, PageHeader, StatCard, StatusBadge } from "@/shared/ui/components";
```

### Componentes disponíveis

| Componente      | Propósito                                              |
|----------------|-------------------------------------------------------|
| `PageHeader`   | Título da página + breadcrumbs + ações                |
| `StatCard`     | Card de métricas com ícone e trend                    |
| `DataTable`    | Tabela paginada, filtrável, sortable                  |
| `EmptyState`   | Placeholder para listas vazias                        |
| `ConfirmModal` | Modal de confirmação genérico                         |
| `FormSection`  | Seção de formulário com título e descrição             |
| `StatusBadge`  | Badge colorido por status (mapa configurável)         |

### Catálogo Visual

Acesse **`/dev/components`** para ver todos os componentes com exemplos interativos.

## Resources

- [Documentação Mantine](https://mantine.dev/)
- [Lucide Icons](https://lucide.dev/icons/)

## Regras

1. **Nunca hardcode cores** — use tokens CSS ou props do Mantine
2. **Componente existe na lib?** Use-o em vez de criar novo
3. **Novo componente genérico?** Adicione em `shared/ui/components/` + exporte no barrel
4. **Estilos específicos do domínio** → CSS modules em `domains/<domain>/ui/`
5. **Siga os padrões de estilização** → Veja [Padrões de Estilização](./06-styling-patterns.md) para cards, botões, hover, listas e formulários
