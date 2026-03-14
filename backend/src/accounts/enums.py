"""Accounts app — Enums."""

from django.db import models


class UserRole(models.TextChoices):
    """Perfil principal do usuário na plataforma."""

    STUDENT = "STUDENT", "Aluno"
    TEACHER = "TEACHER", "Professor"
    ADMIN = "ADMIN", "Administrador"


class AccountStatus(models.TextChoices):
    """Estado atual da conta para controle de acesso."""

    ACTIVE = "ACTIVE", "Ativa"
    INACTIVE = "INACTIVE", "Inativa"
    SUSPENDED = "SUSPENDED", "Suspensa"


class LearningStatus(models.TextChoices):
    """Situação geral do aluno na trilha de aprendizagem."""

    NOT_STARTED = "NOT_STARTED", "Não iniciada"
    IN_PROGRESS = "IN_PROGRESS", "Em andamento"
    COMPLETED = "COMPLETED", "Concluída"
