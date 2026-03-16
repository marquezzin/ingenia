"""Submissions app config."""

from django.apps import AppConfig


class SubmissionsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "src.submissions"
    label = "submissions"
    verbose_name = "Submissões"
