"""Curriculum tests — Exercise + TestCase Admin CRUD (ISSUE-009-F)."""

from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import UserRole
from src.accounts.tests.factories import UserFactory
from src.curriculum.tests.factories import (
    ExerciseFactory,
    ExerciseTestCaseFactory,
    LessonFactory,
    ModuleFactory,
)


def _exercise_url(module_id, lesson_id, exercise_id=None):
    base = f"/api/v1/modules/{module_id}/lessons/{lesson_id}/exercises/"
    if exercise_id:
        return f"{base}{exercise_id}/"
    return base


def _test_case_url(module_id, lesson_id, exercise_id, tc_id=None):
    base = (
        f"/api/v1/modules/{module_id}/lessons/{lesson_id}"
        f"/exercises/{exercise_id}/test-cases/"
    )
    if tc_id:
        return f"{base}{tc_id}/"
    return base


# ─── Exercise CRUD ───────────────────────────────────────────────────────────


class ExerciseAdminListTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()
        self.lesson = LessonFactory(module=self.module)

    def test_list_returns_200(self):
        ExerciseFactory.create_batch(2, lesson=self.lesson)
        response = self.client.get(_exercise_url(self.module.id, self.lesson.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)

    def test_list_scoped_to_lesson(self):
        other_lesson = LessonFactory(module=self.module, sequence_order=99)
        ExerciseFactory(lesson=self.lesson, sequence_order=1)
        ExerciseFactory(lesson=other_lesson, sequence_order=1)
        response = self.client.get(_exercise_url(self.module.id, self.lesson.id))
        self.assertEqual(response.data["count"], 1)

    def test_list_with_nonexistent_module_returns_404(self):
        import uuid

        response = self.client.get(_exercise_url(uuid.uuid4(), self.lesson.id))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_list_with_nonexistent_lesson_returns_404(self):
        import uuid

        response = self.client.get(_exercise_url(self.module.id, uuid.uuid4()))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ExerciseAdminCreateTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()
        self.lesson = LessonFactory(module=self.module)

    def test_create_returns_201(self):
        payload = {
            "title": "Exercício 1",
            "statement": "Resolva o problema",
            "sequence_order": 1,
        }
        response = self.client.post(
            _exercise_url(self.module.id, self.lesson.id), payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Exercício 1")
        self.assertEqual(response.data["publication_status"], "DRAFT")
        self.assertIn("test_cases_count", response.data)

    def test_create_with_duplicate_sequence_order_returns_400(self):
        ExerciseFactory(lesson=self.lesson, sequence_order=1)
        payload = {
            "title": "Exercício 2",
            "statement": "Resolva",
            "sequence_order": 1,
        }
        response = self.client.post(
            _exercise_url(self.module.id, self.lesson.id), payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ExerciseAdminRetrieveTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()
        self.lesson = LessonFactory(module=self.module)

    def test_retrieve_returns_200(self):
        exercise = ExerciseFactory(lesson=self.lesson)
        response = self.client.get(
            _exercise_url(self.module.id, self.lesson.id, exercise.id)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], str(exercise.id))
        self.assertIn("statement", response.data)
        self.assertIn("test_cases_count", response.data)


class ExerciseAdminUpdateTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()
        self.lesson = LessonFactory(module=self.module)

    def test_update_returns_200(self):
        exercise = ExerciseFactory(lesson=self.lesson, sequence_order=1)
        payload = {
            "title": "Atualizado",
            "statement": "Nova descrição",
            "sequence_order": 1,
            "publication_status": "DRAFT",
        }
        response = self.client.put(
            _exercise_url(self.module.id, self.lesson.id, exercise.id),
            payload,
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Atualizado")

    def test_update_with_duplicate_sequence_order_returns_400(self):
        ExerciseFactory(lesson=self.lesson, sequence_order=1)
        exercise = ExerciseFactory(lesson=self.lesson, sequence_order=2)
        payload = {
            "title": "Ex",
            "statement": "St",
            "sequence_order": 1,
            "publication_status": "DRAFT",
        }
        response = self.client.put(
            _exercise_url(self.module.id, self.lesson.id, exercise.id),
            payload,
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ExerciseAdminDeleteTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()
        self.lesson = LessonFactory(module=self.module)

    def test_delete_returns_204(self):
        exercise = ExerciseFactory(lesson=self.lesson)
        response = self.client.delete(
            _exercise_url(self.module.id, self.lesson.id, exercise.id)
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


# ─── ExerciseTestCase CRUD ───────────────────────────────────────────────────


class TestCaseAdminListTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()
        self.lesson = LessonFactory(module=self.module)
        self.exercise = ExerciseFactory(lesson=self.lesson)

    def test_list_returns_200(self):
        ExerciseTestCaseFactory.create_batch(2, exercise=self.exercise)
        response = self.client.get(
            _test_case_url(self.module.id, self.lesson.id, self.exercise.id)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)


class TestCaseAdminCreateTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()
        self.lesson = LessonFactory(module=self.module)
        self.exercise = ExerciseFactory(lesson=self.lesson)

    def test_create_returns_201(self):
        payload = {
            "name": "test_soma",
            "input_data": "2 3",
            "expected_output": "5",
            "sequence_order": 1,
        }
        response = self.client.post(
            _test_case_url(self.module.id, self.lesson.id, self.exercise.id),
            payload,
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "test_soma")
        self.assertIn("expected_output", response.data)

    def test_create_with_duplicate_sequence_order_returns_400(self):
        ExerciseTestCaseFactory(exercise=self.exercise, sequence_order=1)
        payload = {
            "name": "test_outro",
            "expected_output": "10",
            "sequence_order": 1,
        }
        response = self.client.post(
            _test_case_url(self.module.id, self.lesson.id, self.exercise.id),
            payload,
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestCaseAdminRetrieveTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()
        self.lesson = LessonFactory(module=self.module)
        self.exercise = ExerciseFactory(lesson=self.lesson)

    def test_retrieve_returns_200(self):
        tc = ExerciseTestCaseFactory(exercise=self.exercise)
        response = self.client.get(
            _test_case_url(self.module.id, self.lesson.id, self.exercise.id, tc.id)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], str(tc.id))
        self.assertIn("input_data", response.data)
        self.assertIn("expected_output", response.data)


class TestCaseAdminUpdateTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()
        self.lesson = LessonFactory(module=self.module)
        self.exercise = ExerciseFactory(lesson=self.lesson)

    def test_update_returns_200(self):
        tc = ExerciseTestCaseFactory(exercise=self.exercise, sequence_order=1)
        payload = {
            "name": "test_atualizado",
            "expected_output": "42",
            "sequence_order": 1,
        }
        response = self.client.put(
            _test_case_url(self.module.id, self.lesson.id, self.exercise.id, tc.id),
            payload,
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "test_atualizado")


class TestCaseAdminDeleteTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)
        self.module = ModuleFactory()
        self.lesson = LessonFactory(module=self.module)
        self.exercise = ExerciseFactory(lesson=self.lesson)

    def test_delete_returns_204(self):
        tc = ExerciseTestCaseFactory(exercise=self.exercise)
        response = self.client.delete(
            _test_case_url(self.module.id, self.lesson.id, self.exercise.id, tc.id)
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


# ─── Permissions ─────────────────────────────────────────────────────────────


class ExercisePermissionTest(APITestCase):
    def test_student_cannot_access_exercises(self):
        student = UserFactory(role=UserRole.STUDENT)
        self.authenticate(student)
        module = ModuleFactory()
        lesson = LessonFactory(module=module)
        response = self.client.get(_exercise_url(module.id, lesson.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_cannot_access_test_cases(self):
        student = UserFactory(role=UserRole.STUDENT)
        self.authenticate(student)
        module = ModuleFactory()
        lesson = LessonFactory(module=module)
        exercise = ExerciseFactory(lesson=lesson)
        response = self.client.get(_test_case_url(module.id, lesson.id, exercise.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
