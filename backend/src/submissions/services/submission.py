"""Submissions services — UseCase de submissão de código."""

from dataclasses import dataclass
from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from core.errors import ApplicationError

from ..enums import ResultStatus, SubmissionStatus
from ..models import Submission, SubmissionResult

MAX_SOURCE_CODE_LENGTH = 50_000


@dataclass
class CreateSubmissionInput:
    exercise_id: str
    student_profile_id: str
    source_code: str
    score_percentage: Decimal
    passed_tests_count: int
    failed_tests_count: int
    result_status: str
    feedback_message: str


@dataclass
class CreateSubmissionResult:
    instance: Submission


class CreateSubmissionUseCase:
    """Cria Submission + SubmissionResult em transação atômica.

    BR-011: Só aluno autenticado pode submeter para exercício publicado.
    BR-012: Cada submissão gera exatamente um resultado (1:1).
    """

    def execute(self, *, input: CreateSubmissionInput) -> CreateSubmissionResult:
        self._validate_source_code(input.source_code)
        self._validate_score(input.score_percentage)
        self._validate_result_status(input.result_status)
        exercise = self._get_published_exercise(input.exercise_id)

        with transaction.atomic():
            submission = Submission.objects.create(
                exercise=exercise,
                student_profile_id=input.student_profile_id,
                source_code=input.source_code,
                evaluation_status=SubmissionStatus.EVALUATED,
                score_percentage=input.score_percentage,
                submitted_at=timezone.now(),
            )

            SubmissionResult.objects.create(
                submission=submission,
                passed_tests_count=input.passed_tests_count,
                failed_tests_count=input.failed_tests_count,
                feedback_message=input.feedback_message,
                result_status=input.result_status,
            )

        # TODO: Chamar service de progresso (ISSUE-011-C) se resultado PASSED
        # if input.result_status == ResultStatus.PASSED:
        #     UpdateExerciseProgressUseCase().execute(...)

        return CreateSubmissionResult(instance=submission)

    def _validate_source_code(self, source_code: str) -> None:
        if not source_code or not source_code.strip():
            raise ApplicationError("O código-fonte não pode ser vazio.")
        if len(source_code) > MAX_SOURCE_CODE_LENGTH:
            raise ApplicationError(
                f"O código-fonte excede o limite de {MAX_SOURCE_CODE_LENGTH} caracteres."
            )

    def _validate_score(self, score: Decimal) -> None:
        if score < 0 or score > 100:
            raise ApplicationError("O percentual de acertos deve estar entre 0 e 100.")

    def _validate_result_status(self, result_status: str) -> None:
        valid = {choice.value for choice in ResultStatus}
        if result_status not in valid:
            raise ApplicationError(
                f"Status de resultado inválido: {result_status}. "
                f"Valores aceitos: {', '.join(sorted(valid))}."
            )

    def _get_published_exercise(self, exercise_id: str):
        from src.curriculum.enums import ContentStatus
        from src.curriculum.models import Exercise

        try:
            exercise = Exercise.objects.get(id=exercise_id)
        except Exercise.DoesNotExist:
            raise ApplicationError("Exercício não encontrado.")

        if exercise.publication_status != ContentStatus.PUBLISHED:
            raise ApplicationError(
                "Submissão permitida apenas para exercícios publicados."
            )

        return exercise
