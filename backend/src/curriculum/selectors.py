"""Curriculum app — Selectors (queries read-only)."""

from django.db import models

from .models import Lesson, Module


def get_module_by_id(*, id: str) -> Module:
    """Retorna um Module pelo ID ou lança DoesNotExist."""
    return Module.objects.get(id=id)


def list_modules() -> models.QuerySet[Module]:
    """Retorna todos os módulos ordenados por sequence_order."""
    return Module.objects.all().order_by("sequence_order")


def get_lesson_by_id(*, id: str) -> Lesson:
    """Retorna uma Lesson pelo ID ou lança DoesNotExist."""
    return Lesson.objects.get(id=id)


def list_lessons_for_module(*, module_id: str) -> models.QuerySet[Lesson]:
    """Retorna todas as aulas de um módulo, ordenadas por sequence_order."""
    return Lesson.objects.filter(module_id=module_id).order_by("sequence_order")
