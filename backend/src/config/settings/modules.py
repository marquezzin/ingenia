"""
Módulos opcionais — Configuração dinâmica de apps.

Cada módulo pode ser ativado/desativado via variável de ambiente.
Use isso para criar templates flexíveis onde a IA pode escolher
quais módulos subir.

Uso:
    # .env
    MODULE_AI_ENABLED=true
    MODULE_ASAAS_ENABLED=false

    # A lista de apps é gerada automaticamente em base.py
"""
from decouple import config


# ─── Registro de módulos opcionais ────────────────────────────────────────────
# Cada módulo define:
#   - app: nome do app Django (como em INSTALLED_APPS)
#   - enabled: variável de ambiente que controla ativação
#   - description: descrição para documentação
#   - dependencies: lista de outros módulos necessários

OPTIONAL_MODULES = {
    "ai": {
        "app": "src.ai",
        "enabled": config("MODULE_AI_ENABLED", default=True, cast=bool),
        "description": "Integração com LLMs (OpenRouter, OpenAI)",
        "dependencies": [],
    },
    # ─── Módulos futuros (exemplos) ───────────────────────────────────────
    # "dashboard": {
    #     "app": "src.dashboard",
    #     "enabled": config("MODULE_DASHBOARD_ENABLED", default=False, cast=bool),
    #     "description": "Dashboard com analytics e gráficos",
    #     "dependencies": [],
    # },
    # "notifications": {
    #     "app": "src.notifications",
    #     "enabled": config("MODULE_NOTIFICATIONS_ENABLED", default=False, cast=bool),
    #     "description": "Sistema de notificações (email, push, in-app)",
    #     "dependencies": [],
    # },
    # "integrations_asaas": {
    #     "app": "src.integrations.asaas",
    #     "enabled": config("MODULE_ASAAS_ENABLED", default=False, cast=bool),
    #     "description": "Integração com ASAAS (pagamentos, cobranças)",
    #     "dependencies": [],
    # },
}


def get_enabled_apps() -> list[str]:
    """Retorna lista de apps Django dos módulos habilitados."""
    return [
        module["app"]
        for module in OPTIONAL_MODULES.values()
        if module["enabled"]
    ]


def get_enabled_module_names() -> list[str]:
    """Retorna nomes dos módulos habilitados (para logging/debug)."""
    return [
        name
        for name, module in OPTIONAL_MODULES.items()
        if module["enabled"]
    ]
