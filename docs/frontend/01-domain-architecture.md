# Arquitetura de Domínios

## Conceito

O frontend espelha a estrutura de apps do Django. Cada **domínio** corresponde a um app Django e encapsula tudo relacionado àquele contexto.

## Por que Domínios?

- **Coesão**: tudo relacionado a um contexto fica junto
- **Testabilidade**: cada domínio tem seus próprios testes E2E
- **Escalabilidade**: novos domínios não afetam os existentes
- **Contratos claros**: `api.ts` define o contrato com o backend

## Estrutura

```
frontend/src/
├── app/              # Bootstrap: providers, rotas, layout
├── shared/           # Código verdadeiramente compartilhado
│   ├── http/         # Cliente HTTP
│   ├── auth/         # Tokens, guards
│   ├── ui/           # Componentes genéricos
│   ├── hooks/        # Hooks genéricos
│   └── utils/        # Funções utilitárias
└── domains/          # Um diretório por domínio
    └── <dominio>/
        ├── api.ts    # Contrato de API
        ├── types.ts  # Tipos TypeScript
        ├── model.ts  # Lógica pura
        ├── hooks.ts  # React Query hooks
        ├── pages/    # Páginas (rotas)
        ├── ui/       # Componentes do domínio
        └── e2e/      # Testes Playwright
```

## Regras

1. **Domínios não se importam entre si** — use `shared/` para código comum
2. **`api.ts` é o contrato** — espelha os endpoints do app Django correspondente
3. **`model.ts` é puro** — sem side effects, facilmente testável
4. **E2E por domínio** — cada domínio tem seus testes de fluxo

## Criando um Novo Domínio

Veja `.claude/commands/add-frontend-domain.md` (slash command `/add-frontend-domain`) para o passo a passo completo.
