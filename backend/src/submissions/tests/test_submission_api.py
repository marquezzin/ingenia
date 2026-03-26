"""Submissions tests — API de submissão."""

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
from src.submissions.models import Submission, SubmissionResult

URL = "/api/v1/student/submissions/"


class StudentSubmissionCreateViewTest(APITestCase):
    """Testes do endpoint POST /api/v1/student/submissions/."""

    def setUp(self):
        self.student_user = UserFactory(role=UserRole.STUDENT)
        self.student_profile = StudentProfileFactory(user=self.student_user)
        self.exercise = ExerciseFactory(publication_status=ContentStatus.PUBLISHED)
        self.valid_payload = {
            "exercise_id": str(self.exercise.id),
            "source_code": 'print("Hello, World!")',
            "score_percentage": "100.00",
            "passed_tests_count": 3,
            "failed_tests_count": 0,
            "result_status": ResultStatus.PASSED,
            "feedback_message": "3 de 3 testes passaram. Parabéns!",
        }

    def test_create_submission_returns_201(self):
        """POST com payload válido retorna 201 e cria registros."""
        self.authenticate(self.student_user)
        response = self.client.post(URL, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("id", response.data)
        self.assertEqual(response.data["evaluation_status"], SubmissionStatus.EVALUATED)
        self.assertEqual(Decimal(response.data["score_percentage"]), Decimal("100.00"))
        self.assertIn("submitted_at", response.data)

    def test_create_submission_persists_records(self):
        """Submission + SubmissionResult persistidos no banco."""
        self.authenticate(self.student_user)
        self.client.post(URL, self.valid_payload, format="json")

        self.assertEqual(Submission.objects.count(), 1)
        self.assertEqual(SubmissionResult.objects.count(), 1)

        submission = Submission.objects.first()
        self.assertEqual(submission.student_profile, self.student_profile)
        self.assertEqual(submission.exercise, self.exercise)

    def test_unauthenticated_returns_401(self):
        """Requisição sem autenticação retorna 401."""
        response = self.client.post(URL, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_teacher_returns_403(self):
        """Usuário professor não pode submeter."""
        teacher = UserFactory(role=UserRole.TEACHER)
        self.authenticate(teacher)
        response = self.client.post(URL, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_returns_403(self):
        """Usuário admin não pode submeter."""
        admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(admin)
        response = self.client.post(URL, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_nonexistent_exercise_returns_400(self):
        """Exercício inexistente retorna 400."""
        import uuid

        self.authenticate(self.student_user)
        payload = {**self.valid_payload, "exercise_id": str(uuid.uuid4())}
        response = self.client.post(URL, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("não encontrado", response.data["detail"])

    def test_draft_exercise_returns_400(self):
        """Exercício DRAFT retorna 400 (BR-011)."""
        draft_exercise = ExerciseFactory(publication_status=ContentStatus.DRAFT)
        self.authenticate(self.student_user)
        payload = {**self.valid_payload, "exercise_id": str(draft_exercise.id)}
        response = self.client.post(URL, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("publicados", response.data["detail"])

    def test_invalid_score_returns_400(self):
        """Score fora do range retorna 400."""
        self.authenticate(self.student_user)
        payload = {**self.valid_payload, "score_percentage": "150.00"}
        response = self.client.post(URL, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_empty_source_code_returns_400(self):
        """source_code vazio retorna 400."""
        self.authenticate(self.student_user)
        payload = {**self.valid_payload, "source_code": ""}
        response = self.client.post(URL, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_required_field_returns_400(self):
        """Campo obrigatório ausente retorna 400."""
        self.authenticate(self.student_user)
        payload = {**self.valid_payload}
        del payload["result_status"]
        response = self.client.post(URL, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
