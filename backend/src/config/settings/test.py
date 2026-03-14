"""
Django settings — Test
Configurações otimizadas para execução de testes.
"""

from decouple import config

from .base import *  # noqa: F401, F403

# Banco de teste separado — configurado via .env.test
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("POSTGRES_DB", default="hub_test_db"),
        "USER": config("POSTGRES_USER", default="ingenia_user"),
        "PASSWORD": config("POSTGRES_PASSWORD", default="ingenia_pass"),
        "HOST": config("POSTGRES_HOST", default="db_test"),
        "PORT": config("POSTGRES_PORT", default="5432"),
        "TEST": {
            "NAME": config("POSTGRES_DB", default="hub_test_db"),
        },
    }
}

# Senha simples para testes (mais rápido)
AUTH_PASSWORD_VALIDATORS = []

# Desabilita logging em testes
LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
}

# Secret key fixa para testes
SECRET_KEY = "test-secret-key-not-for-production"

# Desabilita Celery em testes (executa tasks sincronamente)
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
