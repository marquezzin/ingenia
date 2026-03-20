"""Classes tests — Admin Class Group List & Detail (ISSUE-010-E)."""

from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import UserRole
from src.accounts.tests.factories import UserFactory
from src.classes.enums import ClassStatus
from src.classes.tests.factories import ClassEnrollmentFactory, ClassGroupFactory

CLASSES_URL = "/api/v1/admin/classes/"


def detail_url(class_group_id: str) -> str:
    return f"{CLASSES_URL}{class_group_id}/"


class ClassGroupAdminListTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)

    def test_list_returns_200_with_class_groups(self):
        cg = ClassGroupFactory()
        # 2 active enrollments + 1 removed (should not count)
        ClassEnrollmentFactory.create_batch(2, class_group=cg)
        ClassEnrollmentFactory(class_group=cg, enrollment_status="REMOVED")

        response = self.client.get(CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

        item = response.data["results"][0]
        self.assertEqual(item["name"], cg.name)
        self.assertEqual(item["class_status"], ClassStatus.ACTIVE)
        self.assertEqual(item["student_count"], 2)
        self.assertIn("teacher_name", item)
        self.assertIn("created_at", item)

    def test_list_empty_returns_empty_results(self):
        response = self.client.get(CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)
        self.assertEqual(response.data["results"], [])

    def test_filter_by_class_status(self):
        ClassGroupFactory(class_status=ClassStatus.ACTIVE)
        ClassGroupFactory(class_status=ClassStatus.ARCHIVED)

        response = self.client.get(CLASSES_URL, {"class_status": "ACTIVE"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["class_status"], "ACTIVE")

    def test_search_by_name(self):
        ClassGroupFactory(name="Turma Python Avançado")
        ClassGroupFactory(name="Turma JavaScript")

        response = self.client.get(CLASSES_URL, {"search": "Python"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["name"], "Turma Python Avançado")

    def test_teacher_name_from_teacher_profile(self):
        cg = ClassGroupFactory()
        expected_name = cg.teacher_profile.user.full_name

        response = self.client.get(CLASSES_URL)
        self.assertEqual(response.data["results"][0]["teacher_name"], expected_name)


class ClassGroupAdminDetailTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)

    def test_detail_returns_200_with_students(self):
        cg = ClassGroupFactory(description="Uma turma de teste")
        enrollment = ClassEnrollmentFactory(class_group=cg)

        response = self.client.get(detail_url(str(cg.id)))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], cg.name)
        self.assertEqual(response.data["description"], "Uma turma de teste")
        self.assertIn("teacher_name", response.data)
        self.assertIn("teacher_email", response.data)
        self.assertIn("students", response.data)
        self.assertEqual(len(response.data["students"]), 1)

        student = response.data["students"][0]
        self.assertEqual(
            student["student_name"],
            enrollment.student_profile.user.full_name,
        )
        self.assertEqual(
            student["student_email"],
            enrollment.student_profile.user.email,
        )
        self.assertEqual(student["enrollment_status"], "ACTIVE")
        self.assertIn("enrolled_at", student)

    def test_detail_with_no_students_returns_empty_list(self):
        cg = ClassGroupFactory()
        response = self.client.get(detail_url(str(cg.id)))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["students"], [])

    def test_detail_nonexistent_returns_404(self):
        import uuid

        response = self.client.get(detail_url(str(uuid.uuid4())))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ClassGroupAdminPermissionTest(APITestCase):
    def test_unauthenticated_returns_401(self):
        response = self.client.get(CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_student_returns_403(self):
        student = UserFactory(role=UserRole.STUDENT)
        self.authenticate(student)
        response = self.client.get(CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_teacher_returns_403(self):
        teacher = UserFactory(role=UserRole.TEACHER)
        self.authenticate(teacher)
        response = self.client.get(CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_cannot_access_detail(self):
        cg = ClassGroupFactory()
        student = UserFactory(role=UserRole.STUDENT)
        self.authenticate(student)
        response = self.client.get(detail_url(str(cg.id)))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
