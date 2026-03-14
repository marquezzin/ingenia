"""Accounts app — User model customizado + Profiles."""

import uuid

from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models

from .enums import AccountStatus, LearningStatus, UserRole


class User(AbstractUser):
    """
    User model customizado.
    Usa UUID como primary key e email como identificador principal.
    Possui um papel (role) e status de conta.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.STUDENT,
        verbose_name="Papel",
    )
    account_status = models.CharField(
        max_length=20,
        choices=AccountStatus.choices,
        default=AccountStatus.ACTIVE,
        verbose_name="Status da conta",
    )
    last_login_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Último login em",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
        ordering = ["-date_joined"]
        indexes = [
            models.Index(fields=["role"], name="idx_user_role"),
            models.Index(fields=["account_status"], name="idx_user_account_status"),
        ]

    def __str__(self) -> str:
        return self.email

    def clean(self) -> None:
        """BR-001: Validar que o role é válido."""
        super().clean()
        if self.role not in UserRole.values:
            raise ValidationError({"role": "Papel inválido."})


class StudentProfile(models.Model):
    """
    Perfil especializado para usuários com papel de aluno.
    Relação 1:1 com User. BR-002: deve existir apenas para role=STUDENT.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="student_profile",
        verbose_name="Usuário",
    )
    learning_status = models.CharField(
        max_length=20,
        choices=LearningStatus.choices,
        default=LearningStatus.NOT_STARTED,
        verbose_name="Status de aprendizagem",
    )
    first_started_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Primeira vez iniciada em",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Perfil de Aluno"
        verbose_name_plural = "Perfis de Alunos"
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=["learning_status"], name="idx_student_learning_status"
            ),
        ]

    def __str__(self) -> str:
        return f"StudentProfile({self.user.email})"

    def clean(self) -> None:
        """BR-002: Perfil de aluno só pode existir para user com role=STUDENT."""
        super().clean()
        if self.user.role != UserRole.STUDENT:
            raise ValidationError(
                "Perfil de aluno só pode ser criado para usuários com papel de Aluno."
            )


class TeacherProfile(models.Model):
    """
    Perfil especializado para usuários com papel de professor.
    Relação 1:1 com User. BR-002: deve existir apenas para role=TEACHER.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="teacher_profile",
        verbose_name="Usuário",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Perfil de Professor"
        verbose_name_plural = "Perfis de Professores"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"TeacherProfile({self.user.email})"

    def clean(self) -> None:
        """BR-002: Perfil de professor só pode existir para user com role=TEACHER."""
        super().clean()
        if self.user.role != UserRole.TEACHER:
            raise ValidationError(
                "Perfil de professor só pode ser criado para usuários com papel de Professor."
            )


class AdminProfile(models.Model):
    """
    Perfil especializado para usuários com papel de administrador.
    Relação 1:1 com User. BR-002: deve existir apenas para role=ADMIN.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="admin_profile",
        verbose_name="Usuário",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Perfil de Administrador"
        verbose_name_plural = "Perfis de Administradores"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"AdminProfile({self.user.email})"

    def clean(self) -> None:
        """BR-002: Perfil de admin só pode existir para user com role=ADMIN."""
        super().clean()
        if self.user.role != UserRole.ADMIN:
            raise ValidationError(
                "Perfil de administrador só pode ser criado para usuários com papel de Administrador."
            )
