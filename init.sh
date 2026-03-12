#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# init.sh — Setup inicial do projeto a partir do template Hub-Neutro
#
# Uso:
#   ./init.sh
#   ./init.sh meu-projeto
#
# O que faz:
#   1. Pergunta (ou usa argumento) o nome do projeto
#   2. Substitui "hub-neutro" / "hub_neutro" / "Hub-Neutro" pelo nome
#   3. Cria .env a partir de .env.example
#   4. Builda e sobe os containers
#   5. Aplica migrations e seed
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${BLUE}[init]${NC} $1"; }
success() { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1" >&2; exit 1; }

# ─── 1. Nome do projeto ──────────────────────────────────────────────────────
PROJECT_NAME="${1:-}"

if [ -z "$PROJECT_NAME" ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  Hub-Neutro Template — Setup Inicial${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    read -rp "Nome do projeto (kebab-case, ex: meu-app): " PROJECT_NAME
fi

[ -z "$PROJECT_NAME" ] && error "Nome do projeto não pode ser vazio."

# Gera variações do nome
PROJECT_SLUG="${PROJECT_NAME}"                                    # meu-app
PROJECT_UNDER="${PROJECT_NAME//-/_}"                              # meu_app
PROJECT_TITLE="$(echo "$PROJECT_NAME" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')"  # Meu App
PROJECT_DB="${PROJECT_UNDER}_db"                                  # meu_app_db
PROJECT_USER="${PROJECT_UNDER}_user"                              # meu_app_user

log "Projeto: $PROJECT_TITLE ($PROJECT_SLUG)"
log "Database: $PROJECT_DB / User: $PROJECT_USER"
echo ""

# ─── 2. Substituições ────────────────────────────────────────────────────────
log "Renomeando referências do template..."

# Arquivos a processar (exclui .git, node_modules, .venv, binários)
find . \
    -not -path './.git/*' \
    -not -path '*/node_modules/*' \
    -not -path '*/.venv/*' \
    -not -path '*/pnpm-lock.yaml' \
    -not -path '*/uv.lock' \
    -not -path './init.sh' \
    -type f \
    -exec grep -lI "hub.neutro\|hub_neutro\|Hub.Neutro\|hub-neutro\|Hub Neutro\|hub_db\|hub_user\|hub_pass" {} \; \
    | while read -r file; do
        sed -i '' \
            -e "s/hub-neutro/${PROJECT_SLUG}/g" \
            -e "s/hub_neutro/${PROJECT_UNDER}/g" \
            -e "s/Hub-Neutro/${PROJECT_TITLE}/g" \
            -e "s/Hub Neutro/${PROJECT_TITLE}/g" \
            -e "s/hub_db/${PROJECT_DB}/g" \
            -e "s/hub_user/${PROJECT_USER}/g" \
            -e "s/hub_pass/${PROJECT_UNDER}_pass/g" \
            "$file"
    done

success "Referências renomeadas."

# ─── 3. Criar .env ───────────────────────────────────────────────────────────
if [ ! -f .env ]; then
    log "Criando .env a partir de .env.example..."
    cp .env.example .env
    success ".env criado."
else
    warn ".env já existe, pulando."
fi

# ─── 4. Build e Up ───────────────────────────────────────────────────────────
log "Construindo imagens Docker..."
make build

log "Subindo serviços..."
make up

# ─── 5. Migrate e Seed ───────────────────────────────────────────────────────
log "Aguardando serviços ficarem saudáveis..."
sleep 5

log "Aplicando migrations..."
make migrate

log "Populando banco com dados iniciais..."
make seed

# ─── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✓ Projeto '${PROJECT_TITLE}' configurado com sucesso!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  Frontend:  ${BLUE}http://localhost:5173${NC}"
echo -e "  Backend:   ${BLUE}http://localhost:8000/api/${NC}"
echo -e "  Admin:     ${BLUE}http://localhost:8000/admin/${NC}"
echo -e "  API Docs:  ${BLUE}http://localhost:8000/api/docs/${NC}"
echo ""
echo -e "  Login:     ${YELLOW}admin@${PROJECT_SLUG}.dev / admin123${NC}"
echo ""
echo -e "  Comandos:  ${BLUE}make help${NC}"
echo ""
