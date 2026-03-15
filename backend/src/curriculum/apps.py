"""Curriculum app config."""

from django.apps import AppConfig


class CurriculumConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "src.curriculum"
    label = "curriculum"
    verbose_name = "Currículo"
