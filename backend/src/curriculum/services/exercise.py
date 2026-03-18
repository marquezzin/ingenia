"""Curriculum services — Exercise UseCases."""

from dataclasses import dataclass

from core.errors import ApplicationError, NotFoundError

from ..models import Exercise, ExerciseTestCase, Lesson
from ..selectors import get_exercise_by_id, get_lesson_by_id

# ─── Inputs ───────────────────────────────────────────────────────────────────


@dataclass
class CreateExerciseInput:
    lesson_id: str
    title: str
    statement: str
    sequence_order: int
    support_message: str | None = None
    publication_status: str = "DRAFT"


@dataclass
class UpdateExerciseInput:
    id: str
    title: str
    statement: str
    sequence_order: int
    publication_status: str
    support_message: str | None = None


@dataclass
class DeleteExerciseInput:
    id: str


# ─── UseCases ─────────────────────────────────────────────────────────────────


class CreateExerciseUseCase:
    def execute(self, *, input: CreateExerciseInput) -> Exercise:
        # Validar que a aula existe
        try:
            get_lesson_by_id(id=input.lesson_id)
        except Lesson.DoesNotExist:
            raise NotFoundError("Aula não encontrada.")

        # BR-010: Exercício recém-criado não pode ser publicado (sem test cases)
        if input.publication_status == "PUBLISHED":
            raise ApplicationError(
                "O exercício deve possuir ao menos um caso de teste "
                "para ser publicado. Crie o exercício como rascunho e "
                "adicione casos de teste antes de publicá-lo."
            )

        # Validar sequence_order único na aula
        if Exercise.objects.filter(
            lesson_id=input.lesson_id,
            sequence_order=input.sequence_order,
        ).exists():
            raise ApplicationError(
                f"Já existe um exercício com sequence_order={input.sequence_order} "
                f"nesta aula."
            )

        return Exercise.objects.create(
            lesson_id=input.lesson_id,
            title=input.title,
            statement=input.statement,
            support_message=input.support_message,
            sequence_order=input.sequence_order,
            publication_status=input.publication_status,
        )


class UpdateExerciseUseCase:
    def execute(self, *, input: UpdateExerciseInput) -> Exercise:
        try:
            exercise = get_exercise_by_id(id=input.id)
        except Exercise.DoesNotExist:
            raise NotFoundError("Exercício não encontrado.")

        # BR-010: Validar que exercício tem ao menos 1 test case ao publicar
        if input.publication_status == "PUBLISHED":
            if not ExerciseTestCase.objects.filter(exercise=exercise).exists():
                raise ApplicationError(
                    "O exercício deve possuir ao menos um caso de teste "
                    "para ser publicado."
                )

        # Validar sequence_order único na aula (excluindo o próprio)
        if (
            Exercise.objects.filter(
                lesson_id=exercise.lesson_id,
                sequence_order=input.sequence_order,
            )
            .exclude(id=input.id)
            .exists()
        ):
            raise ApplicationError(
                f"Já existe um exercício com sequence_order={input.sequence_order} "
                f"nesta aula."
            )

        exercise.title = input.title
        exercise.statement = input.statement
        exercise.support_message = input.support_message
        exercise.sequence_order = input.sequence_order
        exercise.publication_status = input.publication_status
        exercise.save()

        return exercise


class DeleteExerciseUseCase:
    def execute(self, *, input: DeleteExerciseInput) -> None:
        try:
            exercise = get_exercise_by_id(id=input.id)
        except Exercise.DoesNotExist:
            raise NotFoundError("Exercício não encontrado.")

        exercise.delete()
