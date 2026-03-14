---
trigger: model_decision
description: Modificando Docker, compose, Dockerfiles, infra
---

# Regras de Docker e Infraestrutura

> Leia também: `001-workspace.md` (regras gerais)

## Subindo os Serviços

```bash
make up       # Sobe todos os serviços em background
make down     # Derruba todos os serviços
make build    # Rebuilda as imagens
make restart  # Reinicia os serviços
make logs     # Tail dos logs
```

## Serviços Disponíveis

| Serviço    | Imagem              | Porta Local | Descrição              |
|------------|---------------------|-------------|------------------------|
| `db`       | postgres:18-alpine  | 5432        | Banco de dados         |
| `redis`    | redis:7-alpine      | 6379        | Cache / filas          |
| `backend`  | Dockerfile.backend  | 8000        | Django + DRF           |
| `frontend` | Dockerfile.frontend | 5173        | Vite dev server        |

## Variáveis de Ambiente

- **Nunca hardcode** credenciais, URLs ou secrets nos Dockerfiles ou compose.yml
- Todas as variáveis ficam no arquivo `.env` (não versionado)
- O `.env.example` documenta todas as variáveis necessárias
- O `compose.yml` usa `env_file: ../.env` para carregar as variáveis

## Estrutura dos Arquivos Docker

```
docker/
├── compose.yml           # Definição de todos os serviços
├── compose.override.yml  # Overrides locais (não versionado)
├── Dockerfile.backend    # Imagem do backend
└── Dockerfile.frontend   # Imagem do frontend
```

## Boas Práticas

### Dockerfiles
- Use multi-stage builds para imagens menores
- Copie apenas os arquivos necessários (`.dockerignore`)
- Instale dependências antes de copiar o código (aproveita cache)
- Use imagens alpine quando possível

### Compose
- Defina `healthcheck` para serviços críticos (db, redis)
- Use `depends_on` com `condition: service_healthy` para garantir ordem
- Volumes nomeados para dados persistentes (banco, redis)
- Não exponha portas desnecessariamente em produção

### Desenvolvimento Local
- O `compose.override.yml` pode ser usado para overrides locais (volumes de hot-reload, etc.)
- Dados do banco ficam em volume Docker (persistem entre `make down/up`)
- Para resetar o banco: `docker compose -f docker/compose.yml down -v`

## Adicionando Novo Serviço

1. Adicione o serviço em `docker/compose.yml`
2. Documente as variáveis de ambiente necessárias em `.env.example`
3. Adicione comandos relevantes no `Makefile` se necessário
4. Atualize este arquivo e o `README.md`
