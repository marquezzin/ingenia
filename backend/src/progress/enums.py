"""Progress app — Enums."""

from django.db import models


class ProgressStatus(models.TextChoices):
    """Situação do progresso do aluno em um item da trilha."""

    NOT_STARTED = "NOT_STARTED", "Não iniciado"
    IN_PROGRESS = "IN_PROGRESS", "Em andamento"
    COMPLETED = "COMPLETED", "Concluído"
