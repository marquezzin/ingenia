"""Classes app — Models de turmas e matrículas."""

import uuid

from django.db import models

from src.accounts.models import StudentProfile, TeacherProfile

from .enums import ClassStatus, EnrollmentStatus


class ClassGroup(models.Model):
    """
    Turma organizada por professor para acompanhamento coletivo.
    BR-004: Apenas professores podem ser responsáveis (FK → TeacherProfile).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher_profile = models.ForeignKey(
        TeacherProfile,
        on_delete=models.CASCADE,
        related_name="class_groups",
        verbose_name="Professor",
    )
    name = models.CharField(max_length=255, verbose_name="Nome da turma")
    description = models.TextField(
        null=True,
        blank=True,
        verbose_name="Descrição",
    )
    class_status = models.CharField(
        max_length=20,
        choices=ClassStatus.choices,
        default=ClassStatus.ACTIVE,
        verbose_name="Status da turma",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Turma"
        verbose_name_plural = "Turmas"
        ordering = ["-created_at"]
        unique_together = [("teacher_profile", "name")]
        indexes = [
            models.Index(fields=["teacher_profile"], name="idx_classgroup_teacher"),
            models.Index(fields=["class_status"], name="idx_classgroup_status"),
        ]

    def __str__(self) -> str:
        return f"{self.name} ({self.teacher_profile.user.email})"


class ClassEnrollment(models.Model):
    """
    Vínculo entre aluno e turma.
    BR-005: Aluno não pode ter mais de uma matrícula na mesma turma (unique constraint).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    class_group = models.ForeignKey(
        ClassGroup,
        on_delete=models.CASCADE,
        related_name="enrollments",
        verbose_name="Turma",
    )
    student_profile = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="enrollments",
        verbose_name="Aluno",
    )
    enrolled_at = models.DateTimeField(verbose_name="Matriculado em")
    enrollment_status = models.CharField(
        max_length=20,
        choices=EnrollmentStatus.choices,
        default=EnrollmentStatus.ACTIVE,
        verbose_name="Status da matrícula",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Matrícula"
        verbose_name_plural = "Matrículas"
        ordering = ["-enrolled_at"]
        unique_together = [("class_group", "student_profile")]
        indexes = [
            models.Index(
                fields=["student_profile"],
                name="idx_enrollment_student",
            ),
            models.Index(
                fields=["enrollment_status"],
                name="idx_enrollment_status",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.student_profile.user.email} → {self.class_group.name}"
