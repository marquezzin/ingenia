"""Submissions tests — API de histórico de submissões."""

from decimal import Decimal

from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import UserRole
from src.accounts.tests.factories import (
    StudentProfileFactory,
    UserFactory,
)
from src.curriculum.enums import ContentStatus
from src.curriculum.tests.factories import ExerciseFactory
from src.submissions.enums import ResultStatus, SubmissionStatus
from src.submissions.tests.factories import SubmissionFactory, SubmissionResultFactory

URL = "/api/v1/student/submissions/"


class StudentSubmissionListViewTest(APITestCase):
    """Testes do endpoint GET /api/v1/student/submissions/."""

    def setUp(self):
        self.student_user = UserFactory(role=UserRole.STUDENT)
        self.student_profile = StudentProfileFactory(user=self.student_user)
        self.exercise = ExerciseFactory(publication_status=ContentStatus.PUBLISHED)

        # Criar submissões com resultado
        self.submission1 = SubmissionFactory(
            student_profile=self.student_profile,
            exercise=self.exercise,
            evaluation_status=SubmissionStatus.EVALUATED,
            score_percentage=Decimal("100.00"),
        )
        self.result1 = SubmissionResultFactory(
            submission=self.submission1,
            result_status=ResultStatus.PASSED,
            passed_tests_count=3,
            failed_tests_count=0,
            feedback_message="Todos os testes passaram!",
        )

        self.submission2 = SubmissionFactory(
            student_profile=self.student_profile,
            exercise=self.exercise,
            evaluation_status=SubmissionStatus.EVALUATED,
            score_percentage=Decimal("66.67"),
        )
        self.result2 = SubmissionResultFactory(
            submission=self.submission2,
            result_status=ResultStatus.FAILED,
            passed_tests_count=2,
            failed_tests_count=1,
            feedback_message="1 teste falhou.",
        )

    def test_list_submissions_returns_200(self):
        """GET retorna 200 com lista de submissões."""
        self.authenticate(self.student_user)
        response = self.client.get(URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        self.assertEqual(len(response.data["results"]), 2)

    def test_list_submissions_includes_result(self):
        """Resultado da avaliação incluído em cada submissão."""
        self.authenticate(self.student_user)
        response = self.client.get(URL)

        submission_data = response.data["results"][0]
        self.assertIn("result", submission_data)
        self.assertIsNotNone(submission_data["result"])
        self.assertIn("result_status", submission_data["result"])
        self.assertIn("passed_tests_count", submission_data["result"])
        self.assertIn("failed_tests_count", submission_data["result"])
        self.assertIn("feedback_message", submission_data["result"])

    def test_list_submissions_includes_exercise_title(self):
        """exercise_title presente em cada submissão."""
        self.authenticate(self.student_user)
        response = self.client.get(URL)

        submission_data = response.data["results"][0]
        self.assertIn("exercise_title", submission_data)
        self.assertEqual(submission_data["exercise_title"], self.exercise.title)

    def test_filter_by_exercise_id(self):
        """Filtro por exercise_id retorna apenas submissões do exercício."""
        other_exercise = ExerciseFactory(publication_status=ContentStatus.PUBLISHED)
        other_sub = SubmissionFactory(
            student_profile=self.student_profile,
            exercise=other_exercise,
            evaluation_status=SubmissionStatus.EVALUATED,
        )
        SubmissionResultFactory(submission=other_sub)

        self.authenticate(self.student_user)
        response = self.client.get(URL, {"exercise_id": str(self.exercise.id)})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

        response2 = self.client.get(URL, {"exercise_id": str(other_exercise.id)})
        self.assertEqual(len(response2.data["results"]), 1)

    def test_filter_by_evaluation_status(self):
        """Filtro por evaluation_status funciona."""
        SubmissionFactory(
            student_profile=self.student_profile,
            exercise=self.exercise,
            evaluation_status=SubmissionStatus.PENDING,
        )

        self.authenticate(self.student_user)
        response = self.client.get(
            URL, {"evaluation_status": SubmissionStatus.EVALUATED}
        )
        self.assertEqual(len(response.data["results"]), 2)

        response2 = self.client.get(
            URL, {"evaluation_status": SubmissionStatus.PENDING}
        )
        self.assertEqual(len(response2.data["results"]), 1)

    def test_br017_only_own_submissions(self):
        """BR-017: Aluno vê apenas suas próprias submissões."""
        other_user = UserFactory(role=UserRole.STUDENT)
        other_profile = StudentProfileFactory(user=other_user)
        other_sub = SubmissionFactory(
            student_profile=other_profile,
            exercise=self.exercise,
            evaluation_status=SubmissionStatus.EVALUATED,
        )
        SubmissionResultFactory(submission=other_sub)

        self.authenticate(self.student_user)
        response = self.client.get(URL)

        # Deve retornar apenas as 2 submissões do aluno autenticado
        self.assertEqual(len(response.data["results"]), 2)

        # Verificar que IDs são apenas do aluno autenticado
        ids = {item["id"] for item in response.data["results"]}
        self.assertIn(str(self.submission1.id), ids)
        self.assertIn(str(self.submission2.id), ids)
        self.assertNotIn(str(other_sub.id), ids)

    def test_pagination_present(self):
        """Resposta inclui campos de paginação."""
        self.authenticate(self.student_user)
        response = self.client.get(URL)

        self.assertIn("count", response.data)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)
        self.assertIn("results", response.data)
        self.assertEqual(response.data["count"], 2)

    def test_unauthenticated_returns_401(self):
        """Requisição sem autenticação retorna 401."""
        response = self.client.get(URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_teacher_returns_403(self):
        """Usuário professor não pode listar submissões de aluno."""
        teacher = UserFactory(role=UserRole.TEACHER)
        self.authenticate(teacher)
        response = self.client.get(URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_returns_403(self):
        """Usuário admin não pode listar submissões de aluno."""
        admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(admin)
        response = self.client.get(URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
