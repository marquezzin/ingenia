"""Classes services — ClassEnrollment UseCases."""

from dataclasses import dataclass

from django.utils import timezone

from core.errors import ApplicationError, NotFoundError, PermissionDeniedError

from ..enums import EnrollmentStatus
from ..models import ClassEnrollment, ClassGroup

# ─── Inputs ───────────────────────────────────────────────────────────────────


@dataclass
class EnrollStudentInput:
    class_group_id: str
    teacher_profile_id: str
    student_profile_id: str


@dataclass
class RemoveStudentInput:
    enrollment_id: str
    class_group_id: str
    teacher_profile_id: str


# ─── UseCases ─────────────────────────────────────────────────────────────────


class EnrollStudentUseCase:
    """Associa um aluno a uma turma do professor."""

    def execute(self, *, input: EnrollStudentInput) -> ClassEnrollment:
        # Verifica se a turma pertence ao professor (BR-004)
        try:
            class_group = ClassGroup.objects.get(id=input.class_group_id)
        except ClassGroup.DoesNotExist:
            raise NotFoundError("Turma não encontrada.")

        if str(class_group.teacher_profile_id) != input.teacher_profile_id:
            raise PermissionDeniedError(
                "Você não tem permissão para gerenciar alunos desta turma."
            )

        # BR-005: Verifica matrícula duplicada (ativa)
        existing = ClassEnrollment.objects.filter(
            class_group_id=input.class_group_id,
            student_profile_id=input.student_profile_id,
            enrollment_status=EnrollmentStatus.ACTIVE,
        ).exists()

        if existing:
            raise ApplicationError("Este aluno já possui matrícula ativa nesta turma.")

        # Se existia matrícula REMOVED, reativa
        removed = ClassEnrollment.objects.filter(
            class_group_id=input.class_group_id,
            student_profile_id=input.student_profile_id,
            enrollment_status=EnrollmentStatus.REMOVED,
        ).first()

        if removed:
            removed.enrollment_status = EnrollmentStatus.ACTIVE
            removed.enrolled_at = timezone.now()
            removed.save()
            return removed

        return ClassEnrollment.objects.create(
            class_group_id=input.class_group_id,
            student_profile_id=input.student_profile_id,
            enrolled_at=timezone.now(),
            enrollment_status=EnrollmentStatus.ACTIVE,
        )


class RemoveStudentUseCase:
    """Remove (soft-delete) um aluno de uma turma do professor."""

    def execute(self, *, input: RemoveStudentInput) -> None:
        # Verifica se a turma pertence ao professor (BR-004)
        try:
            class_group = ClassGroup.objects.get(id=input.class_group_id)
        except ClassGroup.DoesNotExist:
            raise NotFoundError("Turma não encontrada.")

        if str(class_group.teacher_profile_id) != input.teacher_profile_id:
            raise PermissionDeniedError(
                "Você não tem permissão para gerenciar alunos desta turma."
            )

        try:
            enrollment = ClassEnrollment.objects.get(
                id=input.enrollment_id,
                class_group_id=input.class_group_id,
            )
        except ClassEnrollment.DoesNotExist:
            raise NotFoundError("Matrícula não encontrada.")

        enrollment.enrollment_status = EnrollmentStatus.REMOVED
        enrollment.save()
