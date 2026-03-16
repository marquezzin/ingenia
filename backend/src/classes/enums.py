"""Classes app — Enums."""

from django.db import models


class ClassStatus(models.TextChoices):
    """Situação da turma para uso e acompanhamento."""

    ACTIVE = "ACTIVE", "Ativa"
    ARCHIVED = "ARCHIVED", "Arquivada"


class EnrollmentStatus(models.TextChoices):
    """Estado do vínculo do aluno com a turma."""

    ACTIVE = "ACTIVE", "Ativa"
    REMOVED = "REMOVED", "Removida"
