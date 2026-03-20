"""Curriculum tests — Business Rules BR-008, BR-010 (ISSUE-009-F)."""

from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import UserRole
from src.accounts.tests.factories import UserFactory
from src.curriculum.tests.factories import (
    ExerciseFactory,
    ExerciseTestCaseFactory,
    LessonFactory,
    ModuleFactory,
    VideoLessonFactory,
)


class BR008LessonPublishTest(APITestCase):
    """BR-008: Aula só pode ser publicada se tiver vídeo E conteúdo escrito."""

    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()

    def _lesson_url(self, lesson_id=None):
        base = f"/api/v1/modules/{self.module.id}/lessons/"
        if lesson_id:
            return f"{base}{lesson_id}/"
        return base

    # ─── Create ────────────────────────────────────────────────────────

    def test_create_published_without_video_returns_400(self):
        payload = {
            "title": "Aula Sem Vídeo",
            "written_content": "Conteúdo presente",
            "sequence_order": 1,
            "publication_status": "PUBLISHED",
        }
        response = self.client.post(self._lesson_url(), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_published_without_content_returns_400(self):
        payload = {
            "title": "Aula Sem Conteúdo",
            "written_content": "   ",
            "sequence_order": 1,
            "publication_status": "PUBLISHED",
            "video_lesson": {
                "title": "Vídeo",
                "video_url": "https://youtube.com/watch?v=abc",
            },
        }
        response = self.client.post(self._lesson_url(), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_published_with_video_and_content_returns_201(self):
        payload = {
            "title": "Aula Completa",
            "written_content": "Conteúdo escrito da aula",
            "sequence_order": 1,
            "publication_status": "PUBLISHED",
            "video_lesson": {
                "title": "Vídeo da Aula",
                "video_url": "https://youtube.com/watch?v=abc",
            },
        }
        response = self.client.post(self._lesson_url(), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # ─── Update ────────────────────────────────────────────────────────

    def test_update_to_published_without_video_returns_400(self):
        lesson = LessonFactory(
            module=self.module,
            sequence_order=1,
            publication_status="DRAFT",
        )
        payload = {
            "title": lesson.title,
            "written_content": lesson.written_content,
            "sequence_order": 1,
            "publication_status": "PUBLISHED",
            "video_lesson": None,
        }
        response = self.client.put(self._lesson_url(lesson.id), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_to_published_with_existing_video_returns_200(self):
        lesson = LessonFactory(
            module=self.module,
            sequence_order=1,
            publication_status="DRAFT",
            written_content="Conteúdo escrito",
        )
        VideoLessonFactory(lesson=lesson)
        payload = {
            "title": lesson.title,
            "written_content": lesson.written_content,
            "sequence_order": 1,
            "publication_status": "PUBLISHED",
        }
        response = self.client.put(self._lesson_url(lesson.id), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class BR010ExercisePublishTest(APITestCase):
    """BR-010: Exercício só pode ser publicado com ao menos um test case."""

    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()
        self.lesson = LessonFactory(module=self.module)

    def _exercise_url(self, exercise_id=None):
        base = f"/api/v1/modules/{self.module.id}/lessons/{self.lesson.id}/exercises/"
        if exercise_id:
            return f"{base}{exercise_id}/"
        return base

    def test_create_published_exercise_returns_400(self):
        payload = {
            "title": "Exercício",
            "statement": "Enunciado",
            "sequence_order": 1,
            "publication_status": "PUBLISHED",
        }
        response = self.client.post(self._exercise_url(), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_to_published_without_test_cases_returns_400(self):
        exercise = ExerciseFactory(
            lesson=self.lesson,
            sequence_order=1,
            publication_status="DRAFT",
        )
        payload = {
            "title": exercise.title,
            "statement": exercise.statement,
            "sequence_order": 1,
            "publication_status": "PUBLISHED",
        }
        response = self.client.put(
            self._exercise_url(exercise.id), payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_to_published_with_test_cases_returns_200(self):
        exercise = ExerciseFactory(
            lesson=self.lesson,
            sequence_order=1,
            publication_status="DRAFT",
        )
        ExerciseTestCaseFactory(exercise=exercise)
        payload = {
            "title": exercise.title,
            "statement": exercise.statement,
            "sequence_order": 1,
            "publication_status": "PUBLISHED",
        }
        response = self.client.put(
            self._exercise_url(exercise.id), payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["publication_status"], "PUBLISHED")
