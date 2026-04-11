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


# ─── Teacher Progress Selectors (ISSUE-014-C) ────────────────────────────────


def list_student_progress_summaries_for_class(*, class_group_id: str) -> list[dict]:
    """Retorna progresso agregado de cada aluno matriculado (ativo) na turma.

    Para cada aluno, inclui: nome, e-mail, learning_status,
    módulos concluídos, exercícios resolvidos.
    BR-016: O escopo vem da turma do professor.
    """
    from src.classes.models import ClassEnrollment

    enrollments = (
        ClassEnrollment.objects.filter(
            class_group_id=class_group_id,
            enrollment_status="ACTIVE",
        )
        .select_related("student_profile__user")
        .order_by("student_profile__user__first_name")
    )

    summaries = []
    for enrollment in enrollments:
        sp = enrollment.student_profile
        student_profile_id = str(sp.id)

        modules_completed = StudentModuleProgress.objects.filter(
            student_profile_id=student_profile_id,
            progress_status=ProgressStatus.COMPLETED,
        ).count()

        exercises_completed = StudentExerciseProgress.objects.filter(
            student_profile_id=student_profile_id,
            progress_status=ProgressStatus.COMPLETED,
        ).count()

        summaries.append(
            {
                "student_profile_id": sp.id,
                "student_name": sp.user.full_name,
                "student_email": sp.user.email,
                "learning_status": sp.learning_status,
                "modules_completed": modules_completed,
                "exercises_completed": exercises_completed,
            }
        )

    return summaries


def get_student_detail_progress(*, student_profile_id: str) -> list[dict]:
    """Retorna progresso detalhado por módulo → aula → exercício de um aluno.

    Usado na view de progresso individual do professor.
    """
    published_modules = Module.objects.filter(
        publication_status=ContentStatus.PUBLISHED,
    ).order_by("sequence_order")

    module_progress_map = {
        str(mp.module_id): mp
        for mp in StudentModuleProgress.objects.filter(
            student_profile_id=student_profile_id,
        )
    }

    result = []
    for module in published_modules:
        mid = str(module.id)
        mp = module_progress_map.get(mid)

        # Aulas publicadas do módulo
        published_lessons = Lesson.objects.filter(
            module_id=mid,
            publication_status=ContentStatus.PUBLISHED,
        ).order_by("sequence_order")

        lesson_progress_map = {
            str(lp.lesson_id): lp
            for lp in StudentLessonProgress.objects.filter(
                student_profile_id=student_profile_id,
                lesson_id__in=[lesson.id for lesson in published_lessons],
            )
        }

        # Exercícios publicados do módulo, agrupados por aula
        published_exercises = Exercise.objects.filter(
            lesson__module_id=mid,
            publication_status=ContentStatus.PUBLISHED,
        ).order_by("sequence_order")

        exercise_progress_map = {
            str(ep.exercise_id): ep
            for ep in StudentExerciseProgress.objects.filter(
                student_profile_id=student_profile_id,
                exercise_id__in=[e.id for e in published_exercises],
            )
        }

        exercises_by_lesson: dict[str, list] = {}
        for exercise in published_exercises:
            lid = str(exercise.lesson_id)
            ep = exercise_progress_map.get(str(exercise.id))
            exercises_by_lesson.setdefault(lid, []).append(
                {
                    "exercise_id": exercise.id,
                    "exercise_title": exercise.title,
                    "progress_status": (
                        ep.progress_status if ep else ProgressStatus.NOT_STARTED
                    ),
                    "attempts_count": ep.attempts_count if ep else 0,
                    "completed_at": ep.completed_at if ep else None,
                }
            )

        lessons_data = []
        for lesson in published_lessons:
            lid = str(lesson.id)
            lp = lesson_progress_map.get(lid)
            lessons_data.append(
                {
                    "lesson_id": lesson.id,
                    "lesson_title": lesson.title,
                    "progress_status": (
                        lp.progress_status if lp else ProgressStatus.NOT_STARTED
                    ),
                    "started_at": lp.started_at if lp else None,
                    "completed_at": lp.completed_at if lp else None,
                    "exercises": exercises_by_lesson.get(lid, []),
                }
            )

        total_lessons = len(published_lessons)
        total_exercises = len(published_exercises)
        completed_lessons = sum(
            1
            for lp in lesson_progress_map.values()
            if lp.progress_status == ProgressStatus.COMPLETED
        )
        completed_exercises = sum(
            1
            for ep in exercise_progress_map.values()
            if ep.progress_status == ProgressStatus.COMPLETED
        )

        result.append(
            {
                "module_id": module.id,
                "module_title": module.title,
                "progress_status": (
                    mp.progress_status if mp else ProgressStatus.NOT_STARTED
                ),
                "started_at": mp.started_at if mp else None,
                "completed_at": mp.completed_at if mp else None,
                "total_lessons": total_lessons,
                "completed_lessons": completed_lessons,
                "total_exercises": total_exercises,
                "completed_exercises": completed_exercises,
                "lessons": lessons_data,
            }
        )

    return result
