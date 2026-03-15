"""Curriculum app — Models de conteúdo pedagógico."""

import uuid

from django.db import models

from .enums import ContentStatus


class Module(models.Model):
    """
    Unidade temática da trilha de aprendizagem.
    BR-006: Ordenação única de módulos por sequence_order.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, verbose_name="Título")
    description = models.TextField(verbose_name="Descrição")
    sequence_order = models.PositiveIntegerField(
        unique=True,
        verbose_name="Ordem na trilha",
    )
    publication_status = models.CharField(
        max_length=20,
        choices=ContentStatus.choices,
        default=ContentStatus.DRAFT,
        verbose_name="Status de publicação",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Módulo"
        verbose_name_plural = "Módulos"
        ordering = ["sequence_order"]
        indexes = [
            models.Index(fields=["publication_status"], name="idx_module_pub_status"),
        ]

    def __str__(self) -> str:
        return f"{self.sequence_order}. {self.title}"


class Lesson(models.Model):
    """
    Aula pertencente a um módulo.
    BR-007: Ordem das aulas única dentro de cada módulo.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name="lessons",
        verbose_name="Módulo",
    )
    title = models.CharField(max_length=255, verbose_name="Título")
    written_content = models.TextField(verbose_name="Conteúdo escrito")
    sequence_order = models.PositiveIntegerField(verbose_name="Ordem na aula")
    publication_status = models.CharField(
        max_length=20,
        choices=ContentStatus.choices,
        default=ContentStatus.DRAFT,
        verbose_name="Status de publicação",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Aula"
        verbose_name_plural = "Aulas"
        ordering = ["module", "sequence_order"]
        unique_together = [("module", "sequence_order")]
        indexes = [
            models.Index(fields=["module"], name="idx_lesson_module"),
            models.Index(fields=["publication_status"], name="idx_lesson_pub_status"),
        ]

    def __str__(self) -> str:
        return f"{self.module.title} — {self.sequence_order}. {self.title}"


class VideoLesson(models.Model):
    """
    Recurso de videoaula associado 1:1 a uma aula.
    BR-008: Estrutura para validar que aula tenha vídeo + conteúdo ao publicar.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lesson = models.OneToOneField(
        Lesson,
        on_delete=models.CASCADE,
        related_name="video",
        verbose_name="Aula",
    )
    title = models.CharField(max_length=255, verbose_name="Título")
    video_url = models.URLField(verbose_name="URL do vídeo")
    duration_seconds = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name="Duração (segundos)",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Videoaula"
        verbose_name_plural = "Videoaulas"
        indexes = [
            models.Index(fields=["lesson"], name="idx_videolesson_lesson"),
        ]

    def __str__(self) -> str:
        return self.title


class Exercise(models.Model):
    """
    Exercício prático de programação vinculado a uma aula.
    BR-009: Exercício deve estar vinculado a uma aula (FK).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="exercises",
        verbose_name="Aula",
    )
    title = models.CharField(max_length=255, verbose_name="Título")
    statement = models.TextField(verbose_name="Enunciado")
    support_message = models.TextField(
        null=True,
        blank=True,
        verbose_name="Mensagem de apoio",
    )
    sequence_order = models.PositiveIntegerField(
        verbose_name="Ordem no exercício",
    )
    publication_status = models.CharField(
        max_length=20,
        choices=ContentStatus.choices,
        default=ContentStatus.DRAFT,
        verbose_name="Status de publicação",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Exercício"
        verbose_name_plural = "Exercícios"
        ordering = ["lesson", "sequence_order"]
        unique_together = [("lesson", "sequence_order")]
        indexes = [
            models.Index(fields=["lesson"], name="idx_exercise_lesson"),
            models.Index(fields=["publication_status"], name="idx_exercise_pub_status"),
        ]

    def __str__(self) -> str:
        return f"{self.lesson.title} — {self.sequence_order}. {self.title}"


class ExerciseTestCase(models.Model):
    """
    Teste interno para validação automática de exercício.
    BR-010: Exercício deve ter ao menos um test case antes de ser publicado.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exercise = models.ForeignKey(
        Exercise,
        on_delete=models.CASCADE,
        related_name="test_cases",
        verbose_name="Exercício",
    )
    name = models.CharField(max_length=255, verbose_name="Nome do teste")
    input_data = models.TextField(
        null=True,
        blank=True,
        verbose_name="Dados de entrada",
    )
    expected_output = models.TextField(verbose_name="Saída esperada")
    sequence_order = models.PositiveIntegerField(
        verbose_name="Ordem de execução",
    )
    is_hidden = models.BooleanField(
        default=False,
        verbose_name="Oculto ao aluno",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Caso de Teste"
        verbose_name_plural = "Casos de Teste"
        ordering = ["exercise", "sequence_order"]
        unique_together = [("exercise", "sequence_order")]
        indexes = [
            models.Index(fields=["exercise"], name="idx_testcase_exercise"),
        ]

    def __str__(self) -> str:
        return f"{self.exercise.title} — {self.name}"
