"""Curriculum tests — Student Read Endpoints (ISSUE-011-A)."""

import uuid

from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import UserRole
from src.accounts.tests.factories import StudentProfileFactory, UserFactory
from src.curriculum.enums import ContentStatus
from src.curriculum.tests.factories import (
    ExerciseFactory,
    LessonFactory,
    ModuleFactory,
    VideoLessonFactory,
)
from src.progress.enums import ProgressStatus
from src.progress.tests.factories import (
    StudentExerciseProgressFactory,
    StudentLessonProgressFactory,
    StudentModuleProgressFactory,
)

BASE_URL = "/api/v1/student/modules/"


class StudentModuleListTest(APITestCase):
    def setUp(self):
        self.profile = StudentProfileFactory()
        self.student = self.profile.user
        self.authenticate(self.student)

    def test_list_returns_only_published_modules(self):
        ModuleFactory(publication_status=ContentStatus.PUBLISHED, sequence_order=1)
        ModuleFactory(publication_status=ContentStatus.PUBLISHED, sequence_order=2)
        ModuleFactory(publication_status=ContentStatus.DRAFT, sequence_order=3)
        ModuleFactory(publication_status=ContentStatus.ARCHIVED, sequence_order=4)

        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)

    def test_list_ordered_by_sequence_order(self):
        ModuleFactory(
            title="Second", publication_status=ContentStatus.PUBLISHED, sequence_order=2
        )
        ModuleFactory(
            title="First", publication_status=ContentStatus.PUBLISHED, sequence_order=1
        )

        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [m["title"] for m in response.data["results"]]
        self.assertEqual(titles, ["First", "Second"])

    def test_list_includes_lesson_count(self):
        module = ModuleFactory(
            publication_status=ContentStatus.PUBLISHED, sequence_order=1
        )
        LessonFactory(
            module=module, publication_status=ContentStatus.PUBLISHED, sequence_order=1
        )
        LessonFactory(
            module=module, publication_status=ContentStatus.DRAFT, sequence_order=2
        )

        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # lesson_count counts all lessons (not just published) - it's an annotation
        self.assertEqual(response.data["results"][0]["lesson_count"], 2)

    def test_list_includes_progress_when_exists(self):
        module = ModuleFactory(
            publication_status=ContentStatus.PUBLISHED, sequence_order=1
        )
        StudentModuleProgressFactory(
            student_profile=self.profile,
            module=module,
            progress_status=ProgressStatus.IN_PROGRESS,
        )

        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        progress = response.data["results"][0]["progress"]
        self.assertIsNotNone(progress)
        self.assertEqual(progress["progress_status"], "IN_PROGRESS")

    def test_list_progress_is_null_when_not_exists(self):
        ModuleFactory(publication_status=ContentStatus.PUBLISHED, sequence_order=1)

        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data["results"][0]["progress"])

    def test_list_shows_only_own_progress(self):
        module = ModuleFactory(
            publication_status=ContentStatus.PUBLISHED, sequence_order=1
        )
        other_profile = StudentProfileFactory()
        StudentModuleProgressFactory(
            student_profile=other_profile,
            module=module,
            progress_status=ProgressStatus.COMPLETED,
        )

        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data["results"][0]["progress"])


class StudentModuleDetailTest(APITestCase):
    def setUp(self):
        self.profile = StudentProfileFactory()
        self.student = self.profile.user
        self.authenticate(self.student)

    def test_retrieve_published_module_returns_200(self):
        module = ModuleFactory(
            publication_status=ContentStatus.PUBLISHED, sequence_order=1
        )
        response = self.client.get(f"{BASE_URL}{module.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], str(module.id))
        self.assertIn("lessons", response.data)
        self.assertIn("progress", response.data)

    def test_retrieve_draft_module_returns_404(self):
        module = ModuleFactory(publication_status=ContentStatus.DRAFT, sequence_order=1)
        response = self.client.get(f"{BASE_URL}{module.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_archived_module_returns_404(self):
        module = ModuleFactory(
            publication_status=ContentStatus.ARCHIVED, sequence_order=1
        )
        response = self.client.get(f"{BASE_URL}{module.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_includes_only_published_lessons(self):
        module = ModuleFactory(
            publication_status=ContentStatus.PUBLISHED, sequence_order=1
        )
        LessonFactory(
            module=module,
            title="Published Lesson",
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )
        LessonFactory(
            module=module,
            title="Draft Lesson",
            publication_status=ContentStatus.DRAFT,
            sequence_order=2,
        )

        response = self.client.get(f"{BASE_URL}{module.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        lessons = response.data["lessons"]
        self.assertEqual(len(lessons), 1)
        self.assertEqual(lessons[0]["title"], "Published Lesson")

    def test_retrieve_nonexistent_returns_404(self):
        response = self.client.get(f"{BASE_URL}{uuid.uuid4()}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class StudentLessonDetailTest(APITestCase):
    def setUp(self):
        self.profile = StudentProfileFactory()
        self.student = self.profile.user
        self.authenticate(self.student)
        self.module = ModuleFactory(
            publication_status=ContentStatus.PUBLISHED, sequence_order=1
        )

    def test_list_published_lessons_for_module(self):
        LessonFactory(
            module=self.module,
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )
        LessonFactory(
            module=self.module,
            publication_status=ContentStatus.DRAFT,
            sequence_order=2,
        )

        url = f"{BASE_URL}{self.module.id}/lessons/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_retrieve_published_lesson_returns_200(self):
        lesson = LessonFactory(
            module=self.module,
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )
        VideoLessonFactory(lesson=lesson)

        url = f"{BASE_URL}{self.module.id}/lessons/{lesson.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], str(lesson.id))
        self.assertIn("video", response.data)
        self.assertIn("exercises", response.data)
        self.assertIn("written_content", response.data)

    def test_retrieve_lesson_includes_only_published_exercises(self):
        lesson = LessonFactory(
            module=self.module,
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )
        ExerciseFactory(
            lesson=lesson,
            title="Published Exercise",
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )
        ExerciseFactory(
            lesson=lesson,
            title="Draft Exercise",
            publication_status=ContentStatus.DRAFT,
            sequence_order=2,
        )

        url = f"{BASE_URL}{self.module.id}/lessons/{lesson.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        exercises = response.data["exercises"]
        self.assertEqual(len(exercises), 1)
        self.assertEqual(exercises[0]["title"], "Published Exercise")

    def test_retrieve_lesson_includes_progress(self):
        lesson = LessonFactory(
            module=self.module,
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )
        StudentLessonProgressFactory(
            student_profile=self.profile,
            lesson=lesson,
            progress_status=ProgressStatus.IN_PROGRESS,
        )

        url = f"{BASE_URL}{self.module.id}/lessons/{lesson.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data["progress"])
        self.assertEqual(response.data["progress"]["progress_status"], "IN_PROGRESS")

    def test_lesson_under_draft_module_returns_404(self):
        draft_module = ModuleFactory(
            publication_status=ContentStatus.DRAFT, sequence_order=2
        )
        lesson = LessonFactory(
            module=draft_module,
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )

        url = f"{BASE_URL}{draft_module.id}/lessons/{lesson.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class StudentExerciseDetailTest(APITestCase):
    def setUp(self):
        self.profile = StudentProfileFactory()
        self.student = self.profile.user
        self.authenticate(self.student)
        self.module = ModuleFactory(
            publication_status=ContentStatus.PUBLISHED, sequence_order=1
        )
        self.lesson = LessonFactory(
            module=self.module,
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )

    def test_list_published_exercises_for_lesson(self):
        ExerciseFactory(
            lesson=self.lesson,
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )
        ExerciseFactory(
            lesson=self.lesson,
            publication_status=ContentStatus.DRAFT,
            sequence_order=2,
        )

        url = f"{BASE_URL}{self.module.id}/lessons/{self.lesson.id}/exercises/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_retrieve_published_exercise_returns_200(self):
        exercise = ExerciseFactory(
            lesson=self.lesson,
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )

        url = f"{BASE_URL}{self.module.id}/lessons/{self.lesson.id}/exercises/{exercise.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], str(exercise.id))
        self.assertIn("statement", response.data)
        self.assertIn("support_message", response.data)

    def test_retrieve_exercise_does_not_include_test_cases(self):
        from src.curriculum.tests.factories import ExerciseTestCaseFactory

        exercise = ExerciseFactory(
            lesson=self.lesson,
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )
        ExerciseTestCaseFactory(exercise=exercise, sequence_order=1)

        url = f"{BASE_URL}{self.module.id}/lessons/{self.lesson.id}/exercises/{exercise.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn("test_cases", response.data)
        self.assertNotIn("test_cases_count", response.data)

    def test_retrieve_exercise_includes_progress(self):
        exercise = ExerciseFactory(
            lesson=self.lesson,
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )
        StudentExerciseProgressFactory(
            student_profile=self.profile,
            exercise=exercise,
            progress_status=ProgressStatus.IN_PROGRESS,
            attempts_count=3,
        )

        url = f"{BASE_URL}{self.module.id}/lessons/{self.lesson.id}/exercises/{exercise.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        progress = response.data["progress"]
        self.assertIsNotNone(progress)
        self.assertEqual(progress["progress_status"], "IN_PROGRESS")
        self.assertEqual(progress["attempts_count"], 3)

    def test_exercise_under_draft_lesson_returns_404(self):
        draft_lesson = LessonFactory(
            module=self.module,
            publication_status=ContentStatus.DRAFT,
            sequence_order=2,
        )
        exercise = ExerciseFactory(
            lesson=draft_lesson,
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )

        url = f"{BASE_URL}{self.module.id}/lessons/{draft_lesson.id}/exercises/{exercise.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class StudentEndpointPermissionTest(APITestCase):
    """Testa que endpoints student são protegidos por IsStudent."""

    def test_unauthenticated_returns_401(self):
        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_returns_403(self):
        admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(admin)
        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_teacher_returns_403(self):
        teacher = UserFactory(role=UserRole.TEACHER)
        self.authenticate(teacher)
        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_returns_200(self):
        profile = StudentProfileFactory()
        self.authenticate(profile.user)
        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_student_cannot_write(self):
        """Student endpoints são read-only — POST/PUT/DELETE devem retornar 405."""
        profile = StudentProfileFactory()
        self.authenticate(profile.user)

        response = self.client.post(BASE_URL, {"title": "Hack"})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
