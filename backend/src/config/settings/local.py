"""
Django settings — Local (desenvolvimento)
"""

from .base import *  # noqa: F401, F403

DEBUG = True

# Banco local (pode sobrescrever para apontar para localhost em vez de container)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "ingenia_db",
        "USER": "ingenia_user",
        "PASSWORD": "ingenia_pass",
        "HOST": "db",
        "PORT": "5432",
    }
}

# Permite qualquer host em desenvolvimento
ALLOWED_HOSTS = ["*"]

# Django Debug Toolbar (opcional — adicione se necessário)
# INSTALLED_APPS += ["debug_toolbar"]
