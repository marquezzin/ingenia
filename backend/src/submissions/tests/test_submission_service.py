"""Submissions tests — UseCase de submissão."""

from decimal import Decimal

from django.test import TestCase

from core.errors import ApplicationError
from src.curriculum.enums import ContentStatus
from src.curriculum.tests.factories import ExerciseFactory
from src.submissions.enums import ResultStatus, SubmissionStatus
from src.submissions.models import Submission, SubmissionResult
from src.submissions.services import (
    CreateSubmissionInput,
    CreateSubmissionUseCase,
)


class CreateSubmissionUseCaseTest(TestCase):
    """Testes do CreateSubmissionUseCase."""

    def setUp(self):
        self.exercise = ExerciseFactory(publication_status=ContentStatus.PUBLISHED)
        self.student_profile = (
            self.exercise.lesson.module.lessons.first()
        )  # placeholder
        # Precisamos de um StudentProfile real
        from src.accounts.tests.factories import StudentProfileFactory

        self.student_profile = StudentProfileFactory()
        self.valid_input = CreateSubmissionInput(
            exercise_id=str(self.exercise.id),
            student_profile_id=str(self.student_profile.id),
            source_code='print("Hello, World!")',
            score_percentage=Decimal("100.00"),
            passed_tests_count=3,
            failed_tests_count=0,
            result_status=ResultStatus.PASSED,
            feedback_message="3 de 3 testes passaram. Parabéns!",
        )

    def test_creates_submission_successfully(self):
        """Submissão criada com sucesso para exercício publicado."""
        result = CreateSubmissionUseCase().execute(input=self.valid_input)

        self.assertIsNotNone(result.instance.id)
        self.assertEqual(result.instance.exercise, self.exercise)
        self.assertEqual(result.instance.student_profile, self.student_profile)
        self.assertEqual(result.instance.evaluation_status, SubmissionStatus.EVALUATED)
        self.assertEqual(result.instance.score_percentage, Decimal("100.00"))
        self.assertIsNotNone(result.instance.submitted_at)

    def test_creates_submission_result_one_to_one(self):
        """BR-012: Cada submissão gera exatamente um resultado."""
        result = CreateSubmissionUseCase().execute(input=self.valid_input)

        submission = result.instance
        self.assertTrue(hasattr(submission, "result"))
        submission_result = SubmissionResult.objects.get(submission=submission)
        self.assertEqual(submission_result.passed_tests_count, 3)
        self.assertEqual(submission_result.failed_tests_count, 0)
        self.assertEqual(submission_result.result_status, ResultStatus.PASSED)
        self.assertEqual(
            submission_result.feedback_message,
            "3 de 3 testes passaram. Parabéns!",
        )

    def test_evaluation_status_is_evaluated(self):
        """Status da submissão deve ser EVALUATED após criação."""
        result = CreateSubmissionUseCase().execute(input=self.valid_input)
        self.assertEqual(result.instance.evaluation_status, SubmissionStatus.EVALUATED)

    def test_raises_error_for_nonexistent_exercise(self):
        """Erro se exercício não existe."""
        import uuid

        input_data = CreateSubmissionInput(
            exercise_id=str(uuid.uuid4()),
            student_profile_id=str(self.student_profile.id),
            source_code='print("test")',
            score_percentage=Decimal("0.00"),
            passed_tests_count=0,
            failed_tests_count=1,
            result_status=ResultStatus.FAILED,
            feedback_message="0 de 1 testes passaram.",
        )
        with self.assertRaises(ApplicationError) as ctx:
            CreateSubmissionUseCase().execute(input=input_data)
        self.assertIn("não encontrado", str(ctx.exception))

    def test_raises_error_for_draft_exercise(self):
        """BR-011: Exercício deve estar publicado."""
        draft_exercise = ExerciseFactory(publication_status=ContentStatus.DRAFT)
        input_data = CreateSubmissionInput(
            exercise_id=str(draft_exercise.id),
            student_profile_id=str(self.student_profile.id),
            source_code='print("test")',
            score_percentage=Decimal("0.00"),
            passed_tests_count=0,
            failed_tests_count=1,
            result_status=ResultStatus.FAILED,
            feedback_message="0 de 1 testes passaram.",
        )
        with self.assertRaises(ApplicationError) as ctx:
            CreateSubmissionUseCase().execute(input=input_data)
        self.assertIn("publicados", str(ctx.exception))

    def test_raises_error_for_empty_source_code(self):
        """Erro se source_code é vazio."""
        input_data = CreateSubmissionInput(
            exercise_id=str(self.exercise.id),
            student_profile_id=str(self.student_profile.id),
            source_code="",
            score_percentage=Decimal("0.00"),
            passed_tests_count=0,
            failed_tests_count=0,
            result_status=ResultStatus.FAILED,
            feedback_message="Sem código.",
        )
        with self.assertRaises(ApplicationError) as ctx:
            CreateSubmissionUseCase().execute(input=input_data)
        self.assertIn("vazio", str(ctx.exception))

    def test_raises_error_for_whitespace_only_source_code(self):
        """Erro se source_code contém apenas espaços em branco."""
        input_data = CreateSubmissionInput(
            exercise_id=str(self.exercise.id),
            student_profile_id=str(self.student_profile.id),
            source_code="   \n\t  ",
            score_percentage=Decimal("0.00"),
            passed_tests_count=0,
            failed_tests_count=0,
            result_status=ResultStatus.FAILED,
            feedback_message="Sem código.",
        )
        with self.assertRaises(ApplicationError) as ctx:
            CreateSubmissionUseCase().execute(input=input_data)
        self.assertIn("vazio", str(ctx.exception))

    def test_raises_error_for_score_above_100(self):
        """Erro se score_percentage > 100."""
        input_data = CreateSubmissionInput(
            exercise_id=str(self.exercise.id),
            student_profile_id=str(self.student_profile.id),
            source_code='print("test")',
            score_percentage=Decimal("101.00"),
            passed_tests_count=1,
            failed_tests_count=0,
            result_status=ResultStatus.PASSED,
            feedback_message="OK",
        )
        with self.assertRaises(ApplicationError) as ctx:
            CreateSubmissionUseCase().execute(input=input_data)
        self.assertIn("0 e 100", str(ctx.exception))

    def test_raises_error_for_negative_score(self):
        """Erro se score_percentage < 0."""
        input_data = CreateSubmissionInput(
            exercise_id=str(self.exercise.id),
            student_profile_id=str(self.student_profile.id),
            source_code='print("test")',
            score_percentage=Decimal("-1.00"),
            passed_tests_count=0,
            failed_tests_count=1,
            result_status=ResultStatus.FAILED,
            feedback_message="Falha",
        )
        with self.assertRaises(ApplicationError) as ctx:
            CreateSubmissionUseCase().execute(input=input_data)
        self.assertIn("0 e 100", str(ctx.exception))

    def test_atomic_transaction_creates_both_records(self):
        """Submission e SubmissionResult são criados juntos."""
        initial_submissions = Submission.objects.count()
        initial_results = SubmissionResult.objects.count()

        CreateSubmissionUseCase().execute(input=self.valid_input)

        self.assertEqual(Submission.objects.count(), initial_submissions + 1)
        self.assertEqual(SubmissionResult.objects.count(), initial_results + 1)

    def test_partial_score_submission(self):
        """Submissão com score parcial (alguns testes falharam)."""
        input_data = CreateSubmissionInput(
            exercise_id=str(self.exercise.id),
            student_profile_id=str(self.student_profile.id),
            source_code='print("partial")',
            score_percentage=Decimal("66.67"),
            passed_tests_count=2,
            failed_tests_count=1,
            result_status=ResultStatus.FAILED,
            feedback_message="2 de 3 testes passaram.",
        )
        result = CreateSubmissionUseCase().execute(input=input_data)
        self.assertEqual(result.instance.score_percentage, Decimal("66.67"))
        self.assertEqual(result.instance.result.failed_tests_count, 1)
