"""Curriculum app — Selectors (queries read-only)."""

from django.db import models

from .models import Module


def get_module_by_id(*, id: str) -> Module:
    """Retorna um Module pelo ID ou lança DoesNotExist."""
    return Module.objects.get(id=id)


def list_modules() -> models.QuerySet[Module]:
    """Retorna todos os módulos ordenados por sequence_order."""
    return Module.objects.all().order_by("sequence_order")
