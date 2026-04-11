"""Classes services — ClassGroup UseCases."""

from dataclasses import dataclass

from core.errors import ApplicationError, NotFoundError, PermissionDeniedError

from ..models import ClassGroup

# ─── Inputs ───────────────────────────────────────────────────────────────────


@dataclass
class CreateClassGroupInput:
    teacher_profile_id: str
    name: str
    description: str | None = None


@dataclass
class UpdateClassGroupInput:
    id: str
    teacher_profile_id: str
    name: str
    description: str | None = None
    class_status: str = "ACTIVE"


# ─── UseCases ─────────────────────────────────────────────────────────────────


class CreateClassGroupUseCase:
    def execute(self, *, input: CreateClassGroupInput) -> ClassGroup:
        if ClassGroup.objects.filter(
            teacher_profile_id=input.teacher_profile_id,
            name=input.name,
        ).exists():
            raise ApplicationError(
                "Já existe uma turma com esse nome para este professor."
            )

        return ClassGroup.objects.create(
            teacher_profile_id=input.teacher_profile_id,
            name=input.name,
            description=input.description,
        )


class UpdateClassGroupUseCase:
    def execute(self, *, input: UpdateClassGroupInput) -> ClassGroup:
        try:
            class_group = ClassGroup.objects.select_related(
                "teacher_profile__user"
            ).get(id=input.id)
        except ClassGroup.DoesNotExist:
            raise NotFoundError("Turma não encontrada.")

        # BR-004: Professor só edita turmas próprias
        if str(class_group.teacher_profile_id) != input.teacher_profile_id:
            raise PermissionDeniedError(
                "Você não tem permissão para editar esta turma."
            )

        # Verifica nome duplicado (excluindo a própria turma)
        if (
            ClassGroup.objects.filter(
                teacher_profile_id=input.teacher_profile_id,
                name=input.name,
            )
            .exclude(id=input.id)
            .exists()
        ):
            raise ApplicationError(
                "Já existe uma turma com esse nome para este professor."
            )

        class_group.name = input.name
        class_group.description = input.description
        class_group.class_status = input.class_status
        class_group.save()

        return class_group
