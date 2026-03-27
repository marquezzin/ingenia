"""Submissions app — Selectors."""

from django.db import models

from .models import Submission


def list_submissions_for_student(
    *,
    student_profile_id: str,
    exercise_id: str | None = None,
    evaluation_status: str | None = None,
) -> models.QuerySet[Submission]:
    """Retorna submissões do aluno com resultado, ordenadas por data.

    BR-017: Filtra apenas submissões do próprio aluno.
    """
    qs = (
        Submission.objects.filter(student_profile_id=student_profile_id)
        .select_related("exercise", "result")
        .order_by("-submitted_at")
    )

    if exercise_id is not None:
        qs = qs.filter(exercise_id=exercise_id)

    if evaluation_status is not None:
        qs = qs.filter(evaluation_status=evaluation_status)

    return qs
