"""Accounts app — Selectors."""

from django.db.models import Q, QuerySet

from .enums import AccountStatus, UserRole
from .models import StudentProfile, User


def list_users() -> QuerySet[User]:
    """Lista todos os usuários ordenados pela data de entrada."""
    return User.objects.all().order_by("-date_joined")


def list_student_profiles(*, search: str | None = None) -> QuerySet[StudentProfile]:
    """
    Lista perfis de alunos ativos, opcionalmente filtrando por nome ou email.
    Usado pela busca do professor ao matricular alunos.
    """
    qs = (
        StudentProfile.objects.select_related("user")
        .filter(
            user__role=UserRole.STUDENT,
            user__account_status=AccountStatus.ACTIVE,
        )
        .order_by("user__first_name", "user__last_name")
    )

    if search:
        qs = qs.filter(
            Q(user__first_name__icontains=search)
            | Q(user__last_name__icontains=search)
            | Q(user__email__icontains=search)
        )

    return qs
