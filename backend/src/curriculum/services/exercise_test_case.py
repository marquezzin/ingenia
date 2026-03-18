"""Curriculum services — ExerciseTestCase UseCases."""

from dataclasses import dataclass

from core.errors import ApplicationError, NotFoundError

from ..models import Exercise, ExerciseTestCase
from ..selectors import get_exercise_by_id, get_exercise_test_case_by_id

# ─── Inputs ───────────────────────────────────────────────────────────────────


@dataclass
class CreateExerciseTestCaseInput:
    exercise_id: str
    name: str
    expected_output: str
    sequence_order: int
    input_data: str | None = None
    is_hidden: bool = False


@dataclass
class UpdateExerciseTestCaseInput:
    id: str
    name: str
    expected_output: str
    sequence_order: int
    input_data: str | None = None
    is_hidden: bool = False


@dataclass
class DeleteExerciseTestCaseInput:
    id: str


# ─── UseCases ─────────────────────────────────────────────────────────────────


class CreateExerciseTestCaseUseCase:
    def execute(self, *, input: CreateExerciseTestCaseInput) -> ExerciseTestCase:
        # Validar que o exercício existe
        try:
            get_exercise_by_id(id=input.exercise_id)
        except Exercise.DoesNotExist:
            raise NotFoundError("Exercício não encontrado.")

        # Validar sequence_order único no exercício
        if ExerciseTestCase.objects.filter(
            exercise_id=input.exercise_id,
            sequence_order=input.sequence_order,
        ).exists():
            raise ApplicationError(
                f"Já existe um test case com sequence_order={input.sequence_order} "
                f"neste exercício."
            )

        return ExerciseTestCase.objects.create(
            exercise_id=input.exercise_id,
            name=input.name,
            input_data=input.input_data,
            expected_output=input.expected_output,
            sequence_order=input.sequence_order,
            is_hidden=input.is_hidden,
        )


class UpdateExerciseTestCaseUseCase:
    def execute(self, *, input: UpdateExerciseTestCaseInput) -> ExerciseTestCase:
        try:
            test_case = get_exercise_test_case_by_id(id=input.id)
        except ExerciseTestCase.DoesNotExist:
            raise NotFoundError("Caso de teste não encontrado.")

        # Validar sequence_order único no exercício (excluindo o próprio)
        if (
            ExerciseTestCase.objects.filter(
                exercise_id=test_case.exercise_id,
                sequence_order=input.sequence_order,
            )
            .exclude(id=input.id)
            .exists()
        ):
            raise ApplicationError(
                f"Já existe um test case com sequence_order={input.sequence_order} "
                f"neste exercício."
            )

        test_case.name = input.name
        test_case.input_data = input.input_data
        test_case.expected_output = input.expected_output
        test_case.sequence_order = input.sequence_order
        test_case.is_hidden = input.is_hidden
        test_case.save()

        return test_case


class DeleteExerciseTestCaseUseCase:
    def execute(self, *, input: DeleteExerciseTestCaseInput) -> None:
        try:
            test_case = get_exercise_test_case_by_id(id=input.id)
        except ExerciseTestCase.DoesNotExist:
            raise NotFoundError("Caso de teste não encontrado.")

        test_case.delete()
