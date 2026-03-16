"""Submissions app — Models de submissão e resultado."""

import uuid

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from src.accounts.models import StudentProfile
from src.curriculum.models import Exercise

from .enums import ResultStatus, SubmissionStatus


class Submission(models.Model):
    """
    Submissão de código feita pelo aluno para um exercício.
    BR-011: Estrutura permite validar que submissão requer aluno autenticado + exercício publicado.
    BR-012: Relação 1:1 com SubmissionResult (garantida via OneToOneField).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exercise = models.ForeignKey(
        Exercise,
        on_delete=models.CASCADE,
        related_name="submissions",
        verbose_name="Exercício",
    )
    student_profile = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="submissions",
        verbose_name="Aluno",
    )
    source_code = models.TextField(verbose_name="Código-fonte")
    evaluation_status = models.CharField(
        max_length=20,
        choices=SubmissionStatus.choices,
        default=SubmissionStatus.PENDING,
        verbose_name="Status da avaliação",
    )
    score_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Percentual de acertos",
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ],
    )
    submitted_at = models.DateTimeField(verbose_name="Submetido em")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Submissão"
        verbose_name_plural = "Submissões"
        ordering = ["-submitted_at"]
        indexes = [
            models.Index(fields=["exercise"], name="idx_submission_exercise"),
            models.Index(fields=["student_profile"], name="idx_submission_student"),
            models.Index(
                fields=["student_profile", "exercise", "submitted_at"],
                name="idx_submission_student_ex_date",
            ),
            models.Index(
                fields=["evaluation_status"], name="idx_submission_eval_status"
            ),
        ]

    def __str__(self) -> str:
        return (
            f"{self.student_profile.user.email} → "
            f"{self.exercise.title} ({self.evaluation_status})"
        )


class SubmissionResult(models.Model):
    """
    Resultado detalhado da avaliação de uma submissão.
    BR-012: Relação 1:1 com Submission.
    BR-013: Estrutura para feedback pedagógico sem expor resposta.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.OneToOneField(
        Submission,
        on_delete=models.CASCADE,
        related_name="result",
        verbose_name="Submissão",
    )
    passed_tests_count = models.PositiveIntegerField(
        verbose_name="Testes aprovados",
    )
    failed_tests_count = models.PositiveIntegerField(
        verbose_name="Testes reprovados",
    )
    feedback_message = models.TextField(
        verbose_name="Mensagem de feedback",
    )
    result_status = models.CharField(
        max_length=20,
        choices=ResultStatus.choices,
        verbose_name="Resultado",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Resultado da Submissão"
        verbose_name_plural = "Resultados das Submissões"
        indexes = [
            models.Index(fields=["result_status"], name="idx_result_status"),
        ]

    def __str__(self) -> str:
        return f"Resultado: {self.submission} — {self.result_status}"
