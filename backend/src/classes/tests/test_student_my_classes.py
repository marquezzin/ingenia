"""Classes tests — Student My Classes (ISSUE-015-B)."""

from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import UserRole
from src.accounts.tests.factories import (
    StudentProfileFactory,
    TeacherProfileFactory,
    UserFactory,
)
from src.classes.tests.factories import ClassEnrollmentFactory, ClassGroupFactory

MY_CLASSES_URL = "/api/v1/student/my-classes/"


class StudentMyClassesTest(APITestCase):
    def setUp(self):
        self.student_profile = StudentProfileFactory()
        self.student = self.student_profile.user
        self.authenticate(self.student)

    def test_list_my_classes_empty(self):
        response = self.client.get(MY_CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_list_my_classes_returns_enrolled(self):
        class_group = ClassGroupFactory()
        ClassEnrollmentFactory(
            class_group=class_group,
            student_profile=self.student_profile,
        )

        response = self.client.get(MY_CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["class_name"], class_group.name)
        self.assertEqual(
            response.data[0]["teacher_name"],
            class_group.teacher_profile.user.full_name,
        )

    def test_does_not_return_other_student_classes(self):
        """Aluno só vê suas próprias turmas."""
        ClassEnrollmentFactory()  # outro aluno

        response = self.client.get(MY_CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)


class StudentMyClassesPermissionTest(APITestCase):
    def test_unauthenticated_returns_401(self):
        response = self.client.get(MY_CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_teacher_returns_403(self):
        teacher = TeacherProfileFactory().user
        self.authenticate(teacher)
        response = self.client.get(MY_CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_returns_403(self):
        admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(admin)
        response = self.client.get(MY_CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
