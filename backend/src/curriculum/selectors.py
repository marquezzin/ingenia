"""Curriculum app — Selectors (queries read-only)."""

from django.db import models
from django.db.models import Count, Prefetch

from .enums import ContentStatus
from .models import Exercise, ExerciseTestCase, Lesson, Module


def get_module_by_id(*, id: str) -> Module:
    """Retorna um Module pelo ID ou lança DoesNotExist."""
    return Module.objects.get(id=id)


def list_modules() -> models.QuerySet[Module]:
    """Retorna todos os módulos ordenados por sequence_order."""
    return Module.objects.all().order_by("sequence_order")


def get_lesson_by_id(*, id: str) -> Lesson:
    """Retorna uma Lesson pelo ID ou lança DoesNotExist."""
    return Lesson.objects.get(id=id)


def list_lessons_for_module(*, module_id: str) -> models.QuerySet[Lesson]:
    """Retorna todas as aulas de um módulo, ordenadas por sequence_order."""
    return Lesson.objects.filter(module_id=module_id).order_by("sequence_order")


def get_exercise_by_id(*, id: str) -> Exercise:
    """Retorna um Exercise pelo ID ou lança DoesNotExist."""
    return Exercise.objects.get(id=id)


def list_exercises_for_lesson(*, lesson_id: str) -> models.QuerySet[Exercise]:
    """Retorna todos os exercícios de uma aula, ordenados por sequence_order."""
    return Exercise.objects.filter(lesson_id=lesson_id).order_by("sequence_order")


def get_exercise_test_case_by_id(*, id: str) -> ExerciseTestCase:
    """Retorna um ExerciseTestCase pelo ID ou lança DoesNotExist."""
    return ExerciseTestCase.objects.get(id=id)


def list_test_cases_for_exercise(
    *, exercise_id: str
) -> models.QuerySet[ExerciseTestCase]:
    """Retorna todos os test cases de um exercício, ordenados por sequence_order."""
    return ExerciseTestCase.objects.filter(exercise_id=exercise_id).order_by(
        "sequence_order"
    )


# ─── Student Selectors (conteúdo publicado + progresso) ──────────────────────


def list_published_modules(*, student_profile_id: str) -> models.QuerySet[Module]:
    """Retorna módulos publicados com progresso do aluno prefetched."""
    from src.progress.models import StudentModuleProgress

    return (
        Module.objects.filter(publication_status=ContentStatus.PUBLISHED)
        .prefetch_related(
            Prefetch(
                "student_progress",
                queryset=StudentModuleProgress.objects.filter(
                    student_profile_id=student_profile_id
                ),
                to_attr="student_progress_list",
            )
        )
        .annotate(lesson_count=Count("lessons"))
        .order_by("sequence_order")
    )


def list_published_lessons_for_module(
    *, module_id: str, student_profile_id: str
) -> models.QuerySet[Lesson]:
    """Retorna aulas publicadas de um módulo com progresso do aluno."""
    from src.progress.models import StudentLessonProgress

    return (
        Lesson.objects.filter(
            module_id=module_id,
            publication_status=ContentStatus.PUBLISHED,
        )
        .select_related("video")
        .prefetch_related(
            Prefetch(
                "student_progress",
                queryset=StudentLessonProgress.objects.filter(
                    student_profile_id=student_profile_id
                ),
                to_attr="student_progress_list",
            )
        )
        .annotate(exercise_count=Count("exercises"))
        .order_by("sequence_order")
    )


def list_published_exercises_for_lesson(
    *, lesson_id: str, student_profile_id: str
) -> models.QuerySet[Exercise]:
    """Retorna exercícios publicados de uma aula com progresso do aluno."""
    from src.progress.models import StudentExerciseProgress

    return (
        Exercise.objects.filter(
            lesson_id=lesson_id,
            publication_status=ContentStatus.PUBLISHED,
        )
        .prefetch_related(
            Prefetch(
                "student_progress",
                queryset=StudentExerciseProgress.objects.filter(
                    student_profile_id=student_profile_id
                ),
                to_attr="student_progress_list",
            )
        )
        .order_by("sequence_order")
    )
