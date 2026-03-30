"""Progress tests — API de progresso de aula por acesso (ISSUE-011-F)."""

import uuid

from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import UserRole
from src.accounts.tests.factories import (
    StudentProfileFactory,
    UserFactory,
)
from src.curriculum.enums import ContentStatus
from src.curriculum.tests.factories import ExerciseFactory, LessonFactory, ModuleFactory
from src.progress.enums import ProgressStatus
from src.progress.models import StudentLessonProgress, StudentModuleProgress


def mark_started_url(lesson_id: str) -> str:
    return f"/api/v1/student/lessons/{lesson_id}/mark-started/"


def mark_completed_url(lesson_id: str) -> str:
    return f"/api/v1/student/lessons/{lesson_id}/mark-completed/"


class MarkLessonStartedViewTest(APITestCase):
    """Testes do endpoint POST /api/v1/student/lessons/<id>/mark-started/."""

    def setUp(self):
        self.student_user = UserFactory(role=UserRole.STUDENT)
        self.student_profile = StudentProfileFactory(user=self.student_user)

        self.module = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        self.lesson = LessonFactory(
            module=self.module, publication_status=ContentStatus.PUBLISHED
        )

    def test_mark_started_returns_200(self):
        """POST retorna 200 e cria progresso IN_PROGRESS."""
        self.authenticate(self.student_user)
        url = mark_started_url(str(self.lesson.id))
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["detail"], "Aula marcada como iniciada.")

        progress = StudentLessonProgress.objects.get(
            student_profile=self.student_profile, lesson=self.lesson
        )
        self.assertEqual(progress.progress_status, ProgressStatus.IN_PROGRESS)

    def test_mark_started_idempotent(self):
        """Chamar duas vezes retorna 200 sem duplicar."""
        self.authenticate(self.student_user)
        url = mark_started_url(str(self.lesson.id))

        self.client.post(url)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        count = StudentLessonProgress.objects.filter(
            student_profile=self.student_profile, lesson=self.lesson
        ).count()
        self.assertEqual(count, 1)

    def test_mark_started_creates_module_progress(self):
        """Cascata: cria StudentModuleProgress IN_PROGRESS."""
        self.authenticate(self.student_user)
        url = mark_started_url(str(self.lesson.id))
        self.client.post(url)

        module_progress = StudentModuleProgress.objects.get(
            student_profile=self.student_profile, module=self.module
        )
        self.assertEqual(module_progress.progress_status, ProgressStatus.IN_PROGRESS)

    def test_mark_started_nonexistent_lesson_returns_404(self):
        """Aula inexistente retorna 404."""
        self.authenticate(self.student_user)
        url = mark_started_url(str(uuid.uuid4()))
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mark_started_unauthenticated_returns_401(self):
        """Requisição sem autenticação retorna 401."""
        url = mark_started_url(str(self.lesson.id))
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_mark_started_teacher_returns_403(self):
        """Professor não pode marcar aula como iniciada."""
        teacher = UserFactory(role=UserRole.TEACHER)
        self.authenticate(teacher)
        url = mark_started_url(str(self.lesson.id))
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_mark_started_admin_returns_403(self):
        """Admin não pode marcar aula como iniciada."""
        admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(admin)
        url = mark_started_url(str(self.lesson.id))
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class MarkLessonCompletedViewTest(APITestCase):
    """Testes do endpoint POST /api/v1/student/lessons/<id>/mark-completed/."""

    def setUp(self):
        self.student_user = UserFactory(role=UserRole.STUDENT)
        self.student_profile = StudentProfileFactory(user=self.student_user)

        self.module = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        self.lesson_no_exercises = LessonFactory(
            module=self.module, publication_status=ContentStatus.PUBLISHED
        )

    def test_mark_completed_returns_200(self):
        """POST retorna 200 para aula sem exercícios."""
        self.authenticate(self.student_user)
        url = mark_completed_url(str(self.lesson_no_exercises.id))
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["detail"], "Aula marcada como concluída.")

        progress = StudentLessonProgress.objects.get(
            student_profile=self.student_profile, lesson=self.lesson_no_exercises
        )
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)

    def test_mark_completed_lesson_with_exercises_returns_400(self):
        """Aula com exercícios publicados retorna 400."""
        lesson_with_ex = LessonFactory(
            module=self.module, publication_status=ContentStatus.PUBLISHED
        )
        ExerciseFactory(
            lesson=lesson_with_ex, publication_status=ContentStatus.PUBLISHED
        )

        self.authenticate(self.student_user)
        url = mark_completed_url(str(lesson_with_ex.id))
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_mark_completed_draft_lesson_returns_404(self):
        """Aula DRAFT retorna 404."""
        draft_lesson = LessonFactory(
            module=self.module, publication_status=ContentStatus.DRAFT
        )
        self.authenticate(self.student_user)
        url = mark_completed_url(str(draft_lesson.id))
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mark_completed_nonexistent_lesson_returns_404(self):
        """Aula inexistente retorna 404."""
        self.authenticate(self.student_user)
        url = mark_completed_url(str(uuid.uuid4()))
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mark_completed_idempotent(self):
        """Chamar duas vezes retorna 200 sem erro."""
        self.authenticate(self.student_user)
        url = mark_completed_url(str(self.lesson_no_exercises.id))

        self.client.post(url)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_mark_completed_unauthenticated_returns_401(self):
        """Requisição sem autenticação retorna 401."""
        url = mark_completed_url(str(self.lesson_no_exercises.id))
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_mark_completed_teacher_returns_403(self):
        """Professor não pode marcar aula como concluída."""
        teacher = UserFactory(role=UserRole.TEACHER)
        self.authenticate(teacher)
        url = mark_completed_url(str(self.lesson_no_exercises.id))
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_mark_completed_cascades_module(self):
        """Cascata: completar aula atualiza progresso do módulo."""
        self.authenticate(self.student_user)
        url = mark_completed_url(str(self.lesson_no_exercises.id))
        self.client.post(url)

        module_progress = StudentModuleProgress.objects.get(
            student_profile=self.student_profile, module=self.module
        )
        self.assertIn(
            module_progress.progress_status,
            [ProgressStatus.IN_PROGRESS, ProgressStatus.COMPLETED],
        )

    def test_mark_completed_with_draft_exercises_allowed(self):
        """Aula com exercícios DRAFT (sem publicados) pode ser completada."""
        lesson_draft_ex = LessonFactory(
            module=self.module, publication_status=ContentStatus.PUBLISHED
        )
        ExerciseFactory(lesson=lesson_draft_ex, publication_status=ContentStatus.DRAFT)

        self.authenticate(self.student_user)
        url = mark_completed_url(str(lesson_draft_ex.id))
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
