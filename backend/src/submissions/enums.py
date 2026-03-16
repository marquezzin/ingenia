"""Submissions app — Enums."""

from django.db import models


class SubmissionStatus(models.TextChoices):
    """Situação da avaliação da submissão."""

    PENDING = "PENDING", "Aguardando avaliação"
    RUNNING = "RUNNING", "Em processamento"
    EVALUATED = "EVALUATED", "Avaliada"
    FAILED = "FAILED", "Falha no processamento"


class ResultStatus(models.TextChoices):
    """Resultado consolidado da avaliação."""

    PASSED = "PASSED", "Aprovada"
    FAILED = "FAILED", "Reprovada"
    ERROR = "ERROR", "Erro técnico"
