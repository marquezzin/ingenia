"""Classes tests — Teacher Student Search (ISSUE-015-B)."""

from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import UserRole
from src.accounts.tests.factories import (
    StudentProfileFactory,
    TeacherProfileFactory,
    UserFactory,
)

SEARCH_URL = "/api/v1/teacher/students/search/"


class StudentSearchTest(APITestCase):
    def setUp(self):
        self.teacher = TeacherProfileFactory().user
        self.authenticate(self.teacher)

    def test_search_returns_200(self):
        StudentProfileFactory(user__first_name="Maria", user__email="maria@test.com")

        response = self.client.get(SEARCH_URL, {"search": "Maria"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertTrue(response.data["results"][0]["full_name"].startswith("Maria"))

    def test_search_by_email(self):
        StudentProfileFactory(user__email="joao@escola.com")

        response = self.client.get(SEARCH_URL, {"search": "joao@escola"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(response.data["count"], 1)

    def test_search_no_results(self):
        response = self.client.get(SEARCH_URL, {"search": "inexistente"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)

    def test_search_without_query_returns_all_students(self):
        StudentProfileFactory()
        StudentProfileFactory()

        response = self.client.get(SEARCH_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(response.data["count"], 2)


class StudentSearchPermissionTest(APITestCase):
    def test_unauthenticated_returns_401(self):
        response = self.client.get(SEARCH_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_student_returns_403(self):
        student = UserFactory(role=UserRole.STUDENT)
        self.authenticate(student)
        response = self.client.get(SEARCH_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
