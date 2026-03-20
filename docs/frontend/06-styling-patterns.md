# Padrões de Estilização — Páginas e Componentes

> Referência visual: domínio `admin` (`frontend/src/domains/admin/pages/`).
> Todos os novos domínios e componentes devem seguir estes padrões.

---

## 1. Cards — Agrupamento de Conteúdo

Agrupar campos e informações em **Cards com borda**, padding generoso e bordas arredondadas.

```tsx
<Card withBorder padding="xl" radius="md" mb="lg">
  <Text size="sm" fw={600} tt="uppercase" c="dimmed" mb="lg">
    TÍTULO DA SEÇÃO
  </Text>
  {/* conteúdo */}
</Card>
```

**Regras:**
- Um Card por seção lógica (ex: "Informações", "Vídeo", "Conteúdo Escrito")
- Título da seção em **uppercase, dimmed, fw 600** acima do conteúdo
- Ícone opcional ao lado do título quando há contexto visual (ex: `<Video />` para videoaula)

---

## 2. Botões de Ação Principal — Gradient

Botões de ação principal (Salvar, Criar) usam **variant="gradient"** com sombra e animação de lift no hover.

```tsx
<Button
  type="submit"
  variant="gradient"
  gradient={{ from: "blue", to: "cyan", deg: 135 }}
  radius="md"
  leftSection={<Save size={16} />}
  styles={{
    root: {
      fontWeight: 600,
      transition: "transform 150ms ease, box-shadow 150ms ease",
      boxShadow: "0 4px 14px rgba(58, 134, 255, 0.25)",
    },
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 6px 20px rgba(58, 134, 255, 0.4)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 14px rgba(58, 134, 255, 0.25)";
  }}
>
  Salvar
</Button>
```

**Gradientes usados:**
| Ação | from → to | deg |
|------|-----------|-----|
| Salvar / Criar | `blue` → `cyan` | 135 |
| Publicar | `teal` → `green` | 135 |
| Novo item (+ botão) | `blue` → `cyan` | 135 |

---

## 3. Botões Secundários — Hover Lift

Cancelar, Despublicar, Excluir usam **variant="default"** ou **variant="light"** com hover lift sutil.

```tsx
<Button
  variant="default"
  radius="md"
  leftSection={<ArrowLeft size={16} />}
  styles={{ root: { transition: "transform 150ms ease" } }}
  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
>
  Cancelar
</Button>
```

**Variações:**
- **Despublicar**: `variant="light" color="orange"` + `<EyeOff />`
- **Excluir**: `variant="light" color="red"` + `<Trash2 />`
- **Cancelar**: `variant="default"` + `<ArrowLeft />`

---

## 4. Cards de Listagem — Slide-Right Hover

Itens em lista (aulas, exercícios, test cases) usam **cards com efeito de slide-right ao hover**.

```tsx
<Card
  withBorder
  padding="lg"
  radius="md"
  style={{
    cursor: "pointer",
    transition: "transform 150ms ease, box-shadow 150ms ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateX(4px)";
    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateX(0)";
    e.currentTarget.style.boxShadow = "none";
  }}
>
  {/* Row content com Group justify="space-between" */}
</Card>
```

**Cada item de lista contém:**
- **Badge de ordem** com gradiente circular (`background: linear-gradient(135deg, ...)`)
- **Título** truncado com `fw={600}`
- **Badges de status** à direita (`StatusBadge`, contadores)

---

## 5. Info Cards — Detalhes com Gradiente

Páginas de detalhe usam um **Card de informações** com gradiente suave no fundo e stats em `ThemeIcon`.

```tsx
<Card
  withBorder
  padding="xl"
  radius="md"
  style={{
    background: "linear-gradient(135deg, rgba(58, 134, 255, 0.03) 0%, rgba(0, 207, 232, 0.03) 100%)",
  }}
>
  {/* Stats grid com SimpleGrid */}
  <SimpleGrid cols={4}>
    <Group gap="sm">
      <ThemeIcon variant="light" color="blue" size="lg" radius="md">
        <Hash size={18} />
      </ThemeIcon>
      <div>
        <Text size="xs" c="dimmed">Label</Text>
        <Text size="sm" fw={600}>Valor</Text>
      </div>
    </Group>
  </SimpleGrid>
</Card>
```

---

## 6. Conteúdo Colapsável — Preview + Expand

Conteúdo longo (ex: Markdown) usa preview com **fade gradiente** e botão de expand/collapse.

```tsx
const CONTENT_PREVIEW_HEIGHT = 800; // ou valor adequado

{/* Preview colapsado */}
<Box style={{ position: "relative", maxHeight: CONTENT_PREVIEW_HEIGHT, overflow: "hidden" }}>
  {/* conteúdo */}
  <Box style={{
    position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
    background: "linear-gradient(transparent, var(--mantine-color-body))",
    pointerEvents: "none",
  }} />
</Box>

{/* Expandido com Collapse do Mantine */}
<Collapse in={expanded}>
  {/* conteúdo completo */}
</Collapse>
```

Botão toggle: `variant="subtle" size="compact-sm"` com ícone `ChevronDown` / `ChevronUp`.

---

## 7. Botão "Novo Item" — Gradiente com Ícone Animado

```tsx
<Button
  leftSection={<Plus size={18} />}
  variant="gradient"
  gradient={{ from: "blue", to: "cyan", deg: 135 }}
  radius="md"
  styles={{
    root: {
      fontWeight: 600,
      transition: "transform 150ms ease, box-shadow 150ms ease",
      boxShadow: "0 4px 14px rgba(58, 134, 255, 0.25)",
    },
    section: { transition: "transform 200ms ease" },
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 6px 20px rgba(58, 134, 255, 0.4)";
    const icon = e.currentTarget.querySelector("[data-position='left']");
    if (icon instanceof HTMLElement) icon.style.transform = "rotate(90deg)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 14px rgba(58, 134, 255, 0.25)";
    const icon = e.currentTarget.querySelector("[data-position='left']");
    if (icon instanceof HTMLElement) icon.style.transform = "rotate(0deg)";
  }}
>
  Novo Item
</Button>
```

---

## 8. Padrão de Formulários

- `PageHeader` com título, subtítulo, breadcrumbs e ações (publish/delete) no header
- Campos em `Card`s com seções lógicas
- `NumberInput` para ordem: `w={120}` (não `maw`)
- `Textarea` para conteúdo grande: `minRows={6}`, `autosize`, `maxRows={20}`
- Botões de ação na parte inferior à direita: `<Group justify="flex-end">`
- Alertas de erro com `<Alert icon={<AlertCircle />} color="red">` acima do form

---

## 9. Ícones — Lucide React

- Todos os ícones via `lucide-react`, **nunca** Tabler Icons diretamente
- Tamanho padrão: `size={16}` para botões, `size={18}` para seções/stats, `size={14}` para badges

---

## Checklist — Ao criar uma nova página

- [ ] Cards com borda para agrupar conteúdo
- [ ] Botão principal com gradiente + sombra + hover lift
- [ ] Botões secundários com hover lift sutil
- [ ] Itens de lista com cards + slide-right hover
- [ ] Badge de ordem com gradiente circular
- [ ] Status badges com `StatusBadge`
- [ ] Ícones Lucide em todos os botões/ações
- [ ] `PageHeader` com breadcrumbs navegáveis
- [ ] Formulários em `react-hook-form` + `zod`
- [ ] Alertas de erro da API com mensagem do backend
