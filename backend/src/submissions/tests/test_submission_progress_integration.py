"""Submissions + Progress — Teste de integração end-to-end.

Verifica que a submissão via API dispara corretamente a cascata de progresso:
submission → exercise progress → lesson progress → module progress → learning_status.

Cobre: BR-014, BR-015, BR-017, BR-020 na camada de integração.
"""

from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import LearningStatus, UserRole
from src.accounts.tests.factories import (
    StudentProfileFactory,
    UserFactory,
)
from src.curriculum.enums import ContentStatus
from src.curriculum.tests.factories import ExerciseFactory, LessonFactory, ModuleFactory
from src.progress.enums import ProgressStatus
from src.progress.models import (
    StudentExerciseProgress,
    StudentLessonProgress,
    StudentModuleProgress,
)
from src.submissions.enums import ResultStatus
from src.submissions.models import Submission

URL = "/api/v1/student/submissions/"


class SubmissionProgressIntegrationTest(APITestCase):
    """Testes de integração: submissão via API → cascata de progresso."""

    def setUp(self):
        self.student_user = UserFactory(role=UserRole.STUDENT)
        self.student_profile = StudentProfileFactory(user=self.student_user)
        self.module = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        self.lesson = LessonFactory(
            module=self.module, publication_status=ContentStatus.PUBLISHED
        )
        self.exercise = ExerciseFactory(
            lesson=self.lesson, publication_status=ContentStatus.PUBLISHED
        )

    def _make_payload(self, exercise, *, passed=True):
        return {
            "exercise_id": str(exercise.id),
            "source_code": 'print("Hello")',
            "score_percentage": "100.00" if passed else "0.00",
            "passed_tests_count": 3 if passed else 0,
            "failed_tests_count": 0 if passed else 3,
            "result_status": ResultStatus.PASSED if passed else ResultStatus.FAILED,
            "feedback_message": "OK" if passed else "Falha",
        }

    def test_passed_submission_creates_exercise_progress_completed(self):
        """BR-014: Submissão aprovada → exercício COMPLETED."""
        self.authenticate(self.student_user)
        response = self.client.post(
            URL, self._make_payload(self.exercise, passed=True), format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        progress = StudentExerciseProgress.objects.get(
            student_profile=self.student_profile, exercise=self.exercise
        )
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)
        self.assertEqual(progress.attempts_count, 1)
        self.assertIsNotNone(progress.completed_at)

    def test_failed_submission_creates_exercise_progress_in_progress(self):
        """Submissão reprovada → exercício IN_PROGRESS (não COMPLETED)."""
        self.authenticate(self.student_user)
        response = self.client.post(
            URL, self._make_payload(self.exercise, passed=False), format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        progress = StudentExerciseProgress.objects.get(
            student_profile=self.student_profile, exercise=self.exercise
        )
        self.assertEqual(progress.progress_status, ProgressStatus.IN_PROGRESS)
        self.assertEqual(progress.attempts_count, 1)
        self.assertIsNone(progress.completed_at)

    def test_br020_attempts_count_increments_via_api(self):
        """BR-020: attempts_count incrementa a cada submissão via API."""
        self.authenticate(self.student_user)

        # Primeira submissão (falha)
        self.client.post(
            URL, self._make_payload(self.exercise, passed=False), format="json"
        )
        progress = StudentExerciseProgress.objects.get(
            student_profile=self.student_profile, exercise=self.exercise
        )
        self.assertEqual(progress.attempts_count, 1)

        # Segunda submissão (falha)
        self.client.post(
            URL, self._make_payload(self.exercise, passed=False), format="json"
        )
        progress.refresh_from_db()
        self.assertEqual(progress.attempts_count, 2)

        # Terceira submissão (aprovada)
        self.client.post(
            URL, self._make_payload(self.exercise, passed=True), format="json"
        )
        progress.refresh_from_db()
        self.assertEqual(progress.attempts_count, 3)
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)

    def test_submission_cascades_to_lesson_progress(self):
        """Submissão cria StudentLessonProgress na cascata."""
        self.authenticate(self.student_user)
        self.client.post(
            URL, self._make_payload(self.exercise, passed=True), format="json"
        )

        lesson_progress = StudentLessonProgress.objects.get(
            student_profile=self.student_profile, lesson=self.lesson
        )
        # Aula com 1 exercício → completar exercício completa aula
        self.assertEqual(lesson_progress.progress_status, ProgressStatus.COMPLETED)
        self.assertIsNotNone(lesson_progress.completed_at)

    def test_submission_cascades_to_module_progress(self):
        """Submissão cria StudentModuleProgress na cascata."""
        self.authenticate(self.student_user)
        self.client.post(
            URL, self._make_payload(self.exercise, passed=True), format="json"
        )

        module_progress = StudentModuleProgress.objects.get(
            student_profile=self.student_profile, module=self.module
        )
        # Módulo com 1 aula/1 exercício → completar tudo completa módulo
        self.assertEqual(module_progress.progress_status, ProgressStatus.COMPLETED)
        self.assertIsNotNone(module_progress.completed_at)

    def test_submission_cascades_to_learning_status(self):
        """Submissão cascata completa altera learning_status do StudentProfile."""
        self.authenticate(self.student_user)
        self.client.post(
            URL, self._make_payload(self.exercise, passed=True), format="json"
        )

        self.student_profile.refresh_from_db()
        self.assertEqual(self.student_profile.learning_status, LearningStatus.COMPLETED)

    def test_partial_cascade_does_not_complete_module(self):
        """Dois exercícios — aprovando 1 não completa o módulo."""
        exercise2 = ExerciseFactory(
            lesson=self.lesson, publication_status=ContentStatus.PUBLISHED
        )

        self.authenticate(self.student_user)
        self.client.post(
            URL, self._make_payload(self.exercise, passed=True), format="json"
        )

        # Exercício 1 completo, exercício 2 não
        lesson_progress = StudentLessonProgress.objects.get(
            student_profile=self.student_profile, lesson=self.lesson
        )
        self.assertEqual(lesson_progress.progress_status, ProgressStatus.IN_PROGRESS)

        module_progress = StudentModuleProgress.objects.get(
            student_profile=self.student_profile, module=self.module
        )
        self.assertEqual(module_progress.progress_status, ProgressStatus.IN_PROGRESS)

        self.student_profile.refresh_from_db()
        self.assertEqual(
            self.student_profile.learning_status, LearningStatus.IN_PROGRESS
        )

        # Agora aprovando exercício 2
        self.client.post(URL, self._make_payload(exercise2, passed=True), format="json")

        lesson_progress.refresh_from_db()
        self.assertEqual(lesson_progress.progress_status, ProgressStatus.COMPLETED)

        module_progress.refresh_from_db()
        self.assertEqual(module_progress.progress_status, ProgressStatus.COMPLETED)

        self.student_profile.refresh_from_db()
        self.assertEqual(self.student_profile.learning_status, LearningStatus.COMPLETED)

    def test_completed_exercise_does_not_regress_via_api(self):
        """Exercício COMPLETED não regride com submissão reprovada via API."""
        self.authenticate(self.student_user)

        # Primeiro: aprovado
        self.client.post(
            URL, self._make_payload(self.exercise, passed=True), format="json"
        )
        progress = StudentExerciseProgress.objects.get(
            student_profile=self.student_profile, exercise=self.exercise
        )
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)

        # Depois: reprovado
        self.client.post(
            URL, self._make_payload(self.exercise, passed=False), format="json"
        )
        progress.refresh_from_db()
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)
        self.assertEqual(progress.attempts_count, 2)

    def test_br017_submission_does_not_affect_other_student_progress(self):
        """BR-017: Submissão de um aluno não afeta progresso de outro."""
        other_user = UserFactory(role=UserRole.STUDENT)
        other_profile = StudentProfileFactory(user=other_user)

        self.authenticate(self.student_user)
        self.client.post(
            URL, self._make_payload(self.exercise, passed=True), format="json"
        )

        # O outro aluno não deve ter nenhum progresso
        self.assertFalse(
            StudentExerciseProgress.objects.filter(
                student_profile=other_profile, exercise=self.exercise
            ).exists()
        )

    def test_multiple_modules_cascade_learning_status(self):
        """Trilha com 2 módulos: learning_status COMPLETED só quando ambos completos."""
        module2 = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        lesson2 = LessonFactory(
            module=module2, publication_status=ContentStatus.PUBLISHED
        )
        exercise2 = ExerciseFactory(
            lesson=lesson2, publication_status=ContentStatus.PUBLISHED
        )

        self.authenticate(self.student_user)

        # Completar módulo 1
        self.client.post(
            URL, self._make_payload(self.exercise, passed=True), format="json"
        )
        self.student_profile.refresh_from_db()
        self.assertEqual(
            self.student_profile.learning_status, LearningStatus.IN_PROGRESS
        )

        # Completar módulo 2
        self.client.post(URL, self._make_payload(exercise2, passed=True), format="json")
        self.student_profile.refresh_from_db()
        self.assertEqual(self.student_profile.learning_status, LearningStatus.COMPLETED)

    def test_submission_count_persisted_correctly(self):
        """Múltiplas submissões via API persistem todas no banco."""
        self.authenticate(self.student_user)

        for _ in range(3):
            self.client.post(
                URL, self._make_payload(self.exercise, passed=False), format="json"
            )

        self.assertEqual(
            Submission.objects.filter(
                student_profile=self.student_profile, exercise=self.exercise
            ).count(),
            3,
        )
