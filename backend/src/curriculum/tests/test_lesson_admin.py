"""Curriculum tests — Lesson Admin CRUD (ISSUE-009-F)."""

from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import UserRole
from src.accounts.tests.factories import UserFactory
from src.curriculum.tests.factories import (
    LessonFactory,
    ModuleFactory,
    VideoLessonFactory,
)


def _lesson_url(module_id, lesson_id=None):
    base = f"/api/v1/modules/{module_id}/lessons/"
    if lesson_id:
        return f"{base}{lesson_id}/"
    return base


class LessonAdminListTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()

    def test_list_returns_200(self):
        LessonFactory.create_batch(3, module=self.module)
        response = self.client.get(_lesson_url(self.module.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 3)

    def test_list_scoped_to_module(self):
        other_module = ModuleFactory(sequence_order=99)
        LessonFactory(module=self.module, sequence_order=1)
        LessonFactory(module=other_module, sequence_order=1)
        response = self.client.get(_lesson_url(self.module.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_list_with_nonexistent_module_returns_404(self):
        import uuid

        response = self.client.get(_lesson_url(uuid.uuid4()))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_list_filter_by_publication_status(self):
        LessonFactory(module=self.module, publication_status="DRAFT", sequence_order=1)
        LessonFactory(
            module=self.module, publication_status="PUBLISHED", sequence_order=2
        )
        response = self.client.get(
            _lesson_url(self.module.id), {"publication_status": "DRAFT"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)


class LessonAdminCreateTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()

    def test_create_with_valid_data_returns_201(self):
        payload = {
            "title": "Nova Aula",
            "written_content": "Conteúdo da aula",
            "sequence_order": 1,
        }
        response = self.client.post(_lesson_url(self.module.id), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Nova Aula")
        self.assertEqual(response.data["publication_status"], "DRAFT")

    def test_create_with_video_lesson_inline(self):
        payload = {
            "title": "Aula com Vídeo",
            "written_content": "Conteúdo",
            "sequence_order": 1,
            "video_lesson": {
                "title": "Vídeo da Aula",
                "video_url": "https://youtube.com/watch?v=abc123",
                "duration_seconds": 600,
            },
        }
        response = self.client.post(_lesson_url(self.module.id), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data["video"])
        self.assertEqual(response.data["video"]["title"], "Vídeo da Aula")

    def test_create_with_duplicate_sequence_order_returns_400(self):
        LessonFactory(module=self.module, sequence_order=1)
        payload = {
            "title": "Outra Aula",
            "written_content": "Conteúdo",
            "sequence_order": 1,
        }
        response = self.client.post(_lesson_url(self.module.id), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LessonAdminRetrieveTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()

    def test_retrieve_returns_200_with_detail_fields(self):
        lesson = LessonFactory(module=self.module)
        VideoLessonFactory(lesson=lesson)
        response = self.client.get(_lesson_url(self.module.id, lesson.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("video", response.data)
        self.assertIn("exercise_count", response.data)
        self.assertIn("written_content", response.data)

    def test_retrieve_lesson_without_video(self):
        lesson = LessonFactory(module=self.module)
        response = self.client.get(_lesson_url(self.module.id, lesson.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data["video"])


class LessonAdminUpdateTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()

    def test_update_returns_200(self):
        lesson = LessonFactory(module=self.module, sequence_order=1)
        payload = {
            "title": "Aula Atualizada",
            "written_content": "Novo conteúdo",
            "sequence_order": 1,
            "publication_status": "DRAFT",
        }
        response = self.client.put(
            _lesson_url(self.module.id, lesson.id), payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Aula Atualizada")

    def test_update_adds_video_inline(self):
        lesson = LessonFactory(module=self.module, sequence_order=1)
        payload = {
            "title": lesson.title,
            "written_content": lesson.written_content,
            "sequence_order": 1,
            "publication_status": "DRAFT",
            "video_lesson": {
                "title": "Novo Vídeo",
                "video_url": "https://youtube.com/watch?v=xyz",
            },
        }
        response = self.client.put(
            _lesson_url(self.module.id, lesson.id), payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data["video"])

    def test_update_removes_video_when_null(self):
        lesson = LessonFactory(module=self.module, sequence_order=1)
        VideoLessonFactory(lesson=lesson)
        payload = {
            "title": lesson.title,
            "written_content": lesson.written_content,
            "sequence_order": 1,
            "publication_status": "DRAFT",
            "video_lesson": None,
        }
        response = self.client.put(
            _lesson_url(self.module.id, lesson.id), payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data["video"])

    def test_update_with_duplicate_sequence_order_returns_400(self):
        LessonFactory(module=self.module, sequence_order=1)
        lesson = LessonFactory(module=self.module, sequence_order=2)
        payload = {
            "title": "Aula",
            "written_content": "Conteúdo",
            "sequence_order": 1,
            "publication_status": "DRAFT",
        }
        response = self.client.put(
            _lesson_url(self.module.id, lesson.id), payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LessonAdminDeleteTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()

    def test_delete_returns_204(self):
        lesson = LessonFactory(module=self.module)
        response = self.client.delete(_lesson_url(self.module.id, lesson.id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        from src.curriculum.models import Lesson

        self.assertFalse(Lesson.objects.filter(id=lesson.id).exists())


class LessonAdminPermissionTest(APITestCase):
    def test_unauthenticated_returns_401(self):
        module = ModuleFactory()
        response = self.client.get(_lesson_url(module.id))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_student_returns_403(self):
        student = UserFactory(role=UserRole.STUDENT)
        self.authenticate(student)
        module = ModuleFactory()
        response = self.client.get(_lesson_url(module.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
