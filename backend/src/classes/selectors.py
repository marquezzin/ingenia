"""Classes app — Selectors."""

from django.db.models import Count, Q, QuerySet

from .models import ClassEnrollment, ClassGroup


def list_class_groups() -> QuerySet[ClassGroup]:
    """Lista todas as turmas com professor e contagem de alunos ativos."""
    return (
        ClassGroup.objects.select_related("teacher_profile__user")
        .annotate(
            student_count=Count(
                "enrollments",
                filter=Q(enrollments__enrollment_status="ACTIVE"),
            )
        )
        .order_by("-created_at")
    )


def get_class_group_by_id(*, class_group_id: str) -> ClassGroup:
    """Retorna uma turma pelo ID , traz também o professor."""
    return ClassGroup.objects.select_related("teacher_profile__user").get(
        id=class_group_id
    )


def list_class_groups_for_teacher(*, teacher_profile_id: str) -> QuerySet[ClassGroup]:
    """Lista turmas de um professor com contagem de alunos ativos."""
    return (
        ClassGroup.objects.filter(teacher_profile_id=teacher_profile_id)
        .select_related("teacher_profile__user")
        .annotate(
            student_count=Count(
                "enrollments",
                filter=Q(enrollments__enrollment_status="ACTIVE"),
            )
        )
        .order_by("-created_at")
    )


def get_class_group_for_teacher(
    *, class_group_id: str, teacher_profile_id: str
) -> ClassGroup:
    """Retorna uma turma do professor, com alunos. Lança DoesNotExist se não pertence ao professor."""
    return (
        ClassGroup.objects.select_related("teacher_profile__user")
        .annotate(
            student_count=Count(
                "enrollments",
                filter=Q(enrollments__enrollment_status="ACTIVE"),
            )
        )
        .get(id=class_group_id, teacher_profile_id=teacher_profile_id)
    )


def list_enrollments_for_class_group(
    *, class_group_id: str
) -> QuerySet[ClassEnrollment]:
    """Lista matrículas de uma turma com aluno e user."""
    return (
        ClassEnrollment.objects.filter(class_group_id=class_group_id)
        .select_related("student_profile__user")
        .order_by("-enrolled_at")
    )


def get_enrollment_for_class_group(
    *, enrollment_id: str, class_group_id: str
) -> ClassEnrollment:
    """Retorna uma matrícula específica de uma turma."""
    return ClassEnrollment.objects.select_related("student_profile__user").get(
        id=enrollment_id, class_group_id=class_group_id
    )
