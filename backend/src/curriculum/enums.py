"""Curriculum app — Enums."""

from django.db import models


class ContentStatus(models.TextChoices):
    """Estado de publicação do conteúdo pedagógico."""

    DRAFT = "DRAFT", "Rascunho"
    PUBLISHED = "PUBLISHED", "Publicado"
    ARCHIVED = "ARCHIVED", "Arquivado"
