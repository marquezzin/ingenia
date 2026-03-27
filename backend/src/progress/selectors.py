"""Progress app — Selectors."""

from django.db import models

from src.curriculum.enums import ContentStatus
from src.curriculum.models import Exercise, Lesson, Module

from .enums import ProgressStatus
from .models import (
    StudentExerciseProgress,
    StudentLessonProgress,
    StudentModuleProgress,
)


def list_module_progress_for_student(
    *, student_profile_id: str
) -> models.QuerySet[StudentModuleProgress]:
    """Retorna progresso de módulos publicados para o aluno.

    BR-017: Filtra apenas progresso do próprio aluno.
    Inclui apenas módulos publicados.
    """
    published_module_ids = Module.objects.filter(
        publication_status=ContentStatus.PUBLISHED,
    ).values_list("id", flat=True)

    return (
        StudentModuleProgress.objects.filter(
            student_profile_id=student_profile_id,
            module_id__in=published_module_ids,
        )
        .select_related("module")
        .order_by("module__sequence_order")
    )


def get_module_progress_for_student(
    *, student_profile_id: str, module_id: str
) -> StudentModuleProgress | None:
    """Retorna progresso de um módulo específico para o aluno."""
    return (
        StudentModuleProgress.objects.filter(
            student_profile_id=student_profile_id,
            module_id=module_id,
        )
        .select_related("module")
        .first()
    )


def list_lesson_progress_for_module(
    *, student_profile_id: str, module_id: str
) -> models.QuerySet[StudentLessonProgress]:
    """Retorna progresso de aulas publicadas de um módulo para o aluno."""
    published_lesson_ids = Lesson.objects.filter(
        module_id=module_id,
        publication_status=ContentStatus.PUBLISHED,
    ).values_list("id", flat=True)

    return (
        StudentLessonProgress.objects.filter(
            student_profile_id=student_profile_id,
            lesson_id__in=published_lesson_ids,
        )
        .select_related("lesson")
        .order_by("lesson__sequence_order")
    )


def list_exercise_progress_for_module(
    *, student_profile_id: str, module_id: str
) -> models.QuerySet[StudentExerciseProgress]:
    """Retorna progresso de exercícios publicados de um módulo para o aluno."""
    published_exercise_ids = Exercise.objects.filter(
        lesson__module_id=module_id,
        publication_status=ContentStatus.PUBLISHED,
    ).values_list("id", flat=True)

    return (
        StudentExerciseProgress.objects.filter(
            student_profile_id=student_profile_id,
            exercise_id__in=published_exercise_ids,
        )
        .select_related("exercise", "exercise__lesson")
        .order_by("exercise__sequence_order")
    )


def count_published_lessons_for_module(*, module_id: str) -> int:
    """Conta aulas publicadas de um módulo."""
    return Lesson.objects.filter(
        module_id=module_id,
        publication_status=ContentStatus.PUBLISHED,
    ).count()


def count_published_exercises_for_module(*, module_id: str) -> int:
    """Conta exercícios publicados de um módulo."""
    return Exercise.objects.filter(
        lesson__module_id=module_id,
        publication_status=ContentStatus.PUBLISHED,
    ).count()


def count_completed_lessons_for_module(
    *, student_profile_id: str, module_id: str
) -> int:
    """Conta aulas completadas pelo aluno em um módulo."""
    published_lesson_ids = Lesson.objects.filter(
        module_id=module_id,
        publication_status=ContentStatus.PUBLISHED,
    ).values_list("id", flat=True)

    return StudentLessonProgress.objects.filter(
        student_profile_id=student_profile_id,
        lesson_id__in=published_lesson_ids,
        progress_status=ProgressStatus.COMPLETED,
    ).count()


def count_completed_exercises_for_module(
    *, student_profile_id: str, module_id: str
) -> int:
    """Conta exercícios completados pelo aluno em um módulo."""
    published_exercise_ids = Exercise.objects.filter(
        lesson__module_id=module_id,
        publication_status=ContentStatus.PUBLISHED,
    ).values_list("id", flat=True)

    return StudentExerciseProgress.objects.filter(
        student_profile_id=student_profile_id,
        exercise_id__in=published_exercise_ids,
        progress_status=ProgressStatus.COMPLETED,
    ).count()
