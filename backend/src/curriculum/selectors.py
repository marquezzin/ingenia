"""Curriculum app — Selectors (queries read-only)."""

from django.db import models

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
