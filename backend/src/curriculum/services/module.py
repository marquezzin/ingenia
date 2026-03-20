"""Curriculum services — Module UseCases."""

from dataclasses import dataclass

from core.errors import ApplicationError, NotFoundError

from ..models import Module
from ..selectors import get_module_by_id

# ─── Inputs ───────────────────────────────────────────────────────────────────


@dataclass
class CreateModuleInput:
    title: str
    description: str
    sequence_order: int
    publication_status: str = "DRAFT"


@dataclass
class UpdateModuleInput:
    id: str
    title: str
    description: str
    sequence_order: int
    publication_status: str


@dataclass
class DeleteModuleInput:
    id: str


# ─── UseCases ─────────────────────────────────────────────────────────────────


class CreateModuleUseCase:
    def execute(self, *, input: CreateModuleInput) -> Module:
        if Module.objects.filter(sequence_order=input.sequence_order).exists():
            raise ApplicationError(
                f"Já existe um módulo com ordem = {input.sequence_order}."
            )

        return Module.objects.create(
            title=input.title,
            description=input.description,
            sequence_order=input.sequence_order,
            publication_status=input.publication_status,
        )


class UpdateModuleUseCase:
    def execute(self, *, input: UpdateModuleInput) -> Module:
        try:
            module = get_module_by_id(id=input.id)
        except Module.DoesNotExist:
            raise NotFoundError("Módulo não encontrado.")

        if (
            Module.objects.filter(sequence_order=input.sequence_order)
            .exclude(id=input.id)
            .exists()
        ):
            raise ApplicationError(
                f"Já existe um módulo com ordem = {input.sequence_order}."
            )

        module.title = input.title
        module.description = input.description
        module.sequence_order = input.sequence_order
        module.publication_status = input.publication_status
        module.save()

        return module


class DeleteModuleUseCase:
    def execute(self, *, input: DeleteModuleInput) -> None:
        try:
            module = get_module_by_id(id=input.id)
        except Module.DoesNotExist:
            raise NotFoundError("Módulo não encontrado.")

        module.delete()
