"""Progress app — Models de progresso do aluno."""

import uuid

from django.core.exceptions import ValidationError
from django.db import models

from src.accounts.models import StudentProfile
from src.curriculum.models import Exercise, Lesson, Module

from .enums import ProgressStatus


class StudentModuleProgress(models.Model):
    """
    Progresso do aluno em um módulo da trilha.
    BR-015: Estrutura para rastrear conclusão de módulo (lógica em ISSUE-011).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_profile = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="module_progress",
        verbose_name="Aluno",
    )
    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name="student_progress",
        verbose_name="Módulo",
    )
    progress_status = models.CharField(
        max_length=20,
        choices=ProgressStatus.choices,
        default=ProgressStatus.NOT_STARTED,
        verbose_name="Status do progresso",
    )
    started_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Iniciado em",
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Concluído em",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Progresso de Módulo"
        verbose_name_plural = "Progressos de Módulo"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["student_profile", "module"],
                name="uq_student_module_progress",
            ),
        ]
        indexes = [
            models.Index(fields=["module"], name="idx_mod_progress_module"),
            models.Index(fields=["progress_status"], name="idx_mod_progress_status"),
        ]

    def clean(self) -> None:
        super().clean()
        _validate_progress_invariants(
            self.progress_status, self.started_at, self.completed_at
        )

    def __str__(self) -> str:
        return (
            f"{self.student_profile.user.email} → "
            f"{self.module.title} ({self.progress_status})"
        )


class StudentLessonProgress(models.Model):
    """
    Progresso do aluno em uma aula específica.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_profile = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="lesson_progress",
        verbose_name="Aluno",
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="student_progress",
        verbose_name="Aula",
    )
    progress_status = models.CharField(
        max_length=20,
        choices=ProgressStatus.choices,
        default=ProgressStatus.NOT_STARTED,
        verbose_name="Status do progresso",
    )
    started_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Iniciado em",
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Concluído em",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Progresso de Aula"
        verbose_name_plural = "Progressos de Aula"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["student_profile", "lesson"],
                name="uq_student_lesson_progress",
            ),
        ]
        indexes = [
            models.Index(fields=["lesson"], name="idx_les_progress_lesson"),
            models.Index(fields=["progress_status"], name="idx_les_progress_status"),
        ]

    def clean(self) -> None:
        super().clean()
        _validate_progress_invariants(
            self.progress_status, self.started_at, self.completed_at
        )

    def __str__(self) -> str:
        return (
            f"{self.student_profile.user.email} → "
            f"{self.lesson.title} ({self.progress_status})"
        )


class StudentExerciseProgress(models.Model):
    """
    Progresso do aluno em um exercício específico.
    BR-014: Estrutura para rastrear conclusão por submissão aprovada (lógica em ISSUE-011).
    BR-020: attempts_count reflete número de submissões (atualização em ISSUE-011).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_profile = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="exercise_progress",
        verbose_name="Aluno",
    )
    exercise = models.ForeignKey(
        Exercise,
        on_delete=models.CASCADE,
        related_name="student_progress",
        verbose_name="Exercício",
    )
    progress_status = models.CharField(
        max_length=20,
        choices=ProgressStatus.choices,
        default=ProgressStatus.NOT_STARTED,
        verbose_name="Status do progresso",
    )
    attempts_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Número de tentativas",
    )
    first_attempt_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Primeira tentativa em",
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Concluído em",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Progresso de Exercício"
        verbose_name_plural = "Progressos de Exercício"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["student_profile", "exercise"],
                name="uq_student_exercise_progress",
            ),
        ]
        indexes = [
            models.Index(fields=["exercise"], name="idx_ex_progress_exercise"),
            models.Index(fields=["progress_status"], name="idx_ex_progress_status"),
        ]

    def clean(self) -> None:
        super().clean()
        if self.progress_status == ProgressStatus.NOT_STARTED:
            if self.first_attempt_at is not None:
                raise ValidationError(
                    {
                        "first_attempt_at": (
                            "first_attempt_at deve ser nulo quando "
                            "progress_status é NOT_STARTED."
                        )
                    }
                )
            if self.completed_at is not None:
                raise ValidationError(
                    {
                        "completed_at": (
                            "completed_at deve ser nulo quando "
                            "progress_status é NOT_STARTED."
                        )
                    }
                )
        if (
            self.completed_at is not None
            and self.progress_status != ProgressStatus.COMPLETED
        ):
            raise ValidationError(
                {
                    "progress_status": (
                        "progress_status deve ser COMPLETED quando "
                        "completed_at está preenchido."
                    )
                }
            )

    def __str__(self) -> str:
        return (
            f"{self.student_profile.user.email} → "
            f"{self.exercise.title} ({self.progress_status})"
        )


def _validate_progress_invariants(
    progress_status: str,
    started_at: object,
    completed_at: object,
) -> None:
    """Valida invariantes comuns de progresso (Module e Lesson)."""
    if progress_status == ProgressStatus.NOT_STARTED:
        if started_at is not None:
            raise ValidationError(
                {
                    "started_at": (
                        "started_at deve ser nulo quando progress_status é NOT_STARTED."
                    )
                }
            )
        if completed_at is not None:
            raise ValidationError(
                {
                    "completed_at": (
                        "completed_at deve ser nulo quando "
                        "progress_status é NOT_STARTED."
                    )
                }
            )
    if completed_at is not None and progress_status != ProgressStatus.COMPLETED:
        raise ValidationError(
            {
                "progress_status": (
                    "progress_status deve ser COMPLETED quando "
                    "completed_at está preenchido."
                )
            }
        )
