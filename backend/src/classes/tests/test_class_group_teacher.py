"""Classes tests — Teacher ClassGroup CRUD (ISSUE-014-A)."""

import uuid

from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import UserRole
from src.accounts.tests.factories import TeacherProfileFactory, UserFactory
from src.classes.enums import ClassStatus
from src.classes.tests.factories import ClassEnrollmentFactory, ClassGroupFactory

TEACHER_CLASSES_URL = "/api/v1/teacher/classes/"


def detail_url(class_group_id: str) -> str:
    return f"{TEACHER_CLASSES_URL}{class_group_id}/"


class ClassGroupTeacherListTest(APITestCase):
    def setUp(self):
        self.teacher_profile = TeacherProfileFactory()
        self.teacher = self.teacher_profile.user
        self.authenticate(self.teacher)

    def test_list_returns_only_own_classes(self):
        """BR-004: Professor só vê suas próprias turmas."""
        own = ClassGroupFactory(teacher_profile=self.teacher_profile)
        ClassGroupFactory()  # outra turma de outro professor

        response = self.client.get(TEACHER_CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], str(own.id))

    def test_list_returns_student_count(self):
        cg = ClassGroupFactory(teacher_profile=self.teacher_profile)
        ClassEnrollmentFactory.create_batch(3, class_group=cg)
        ClassEnrollmentFactory(class_group=cg, enrollment_status="REMOVED")

        response = self.client.get(TEACHER_CLASSES_URL)
        self.assertEqual(response.data["results"][0]["student_count"], 3)

    def test_list_empty(self):
        response = self.client.get(TEACHER_CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)

    def test_filter_by_class_status(self):
        ClassGroupFactory(
            teacher_profile=self.teacher_profile, class_status=ClassStatus.ACTIVE
        )
        ClassGroupFactory(
            teacher_profile=self.teacher_profile, class_status=ClassStatus.ARCHIVED
        )

        response = self.client.get(TEACHER_CLASSES_URL, {"class_status": "ACTIVE"})
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["class_status"], "ACTIVE")

    def test_search_by_name(self):
        ClassGroupFactory(teacher_profile=self.teacher_profile, name="Python Avançado")
        ClassGroupFactory(
            teacher_profile=self.teacher_profile, name="JavaScript Básico"
        )

        response = self.client.get(TEACHER_CLASSES_URL, {"search": "Python"})
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["name"], "Python Avançado")


class ClassGroupTeacherCreateTest(APITestCase):
    def setUp(self):
        self.teacher_profile = TeacherProfileFactory()
        self.teacher = self.teacher_profile.user
        self.authenticate(self.teacher)

    def test_create_returns_201(self):
        data = {"name": "Turma Nova", "description": "Descrição da turma"}

        response = self.client.post(TEACHER_CLASSES_URL, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Turma Nova")
        self.assertEqual(response.data["description"], "Descrição da turma")
        self.assertEqual(response.data["class_status"], "ACTIVE")
        self.assertIn("id", response.data)
        self.assertIn("student_count", response.data)

    def test_create_without_description(self):
        data = {"name": "Turma Sem Descrição"}

        response = self.client.post(TEACHER_CLASSES_URL, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNone(response.data["description"])

    def test_create_duplicate_name_returns_400(self):
        ClassGroupFactory(teacher_profile=self.teacher_profile, name="Turma Existente")
        data = {"name": "Turma Existente"}

        response = self.client.post(TEACHER_CLASSES_URL, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_same_name_different_teacher_allowed(self):
        """Dois professores podem ter turmas com o mesmo nome."""
        ClassGroupFactory(name="Turma Python")  # outro professor
        data = {"name": "Turma Python"}

        response = self.client.post(TEACHER_CLASSES_URL, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_without_name_returns_400(self):
        data = {"description": "Sem nome"}

        response = self.client.post(TEACHER_CLASSES_URL, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ClassGroupTeacherRetrieveTest(APITestCase):
    def setUp(self):
        self.teacher_profile = TeacherProfileFactory()
        self.teacher = self.teacher_profile.user
        self.authenticate(self.teacher)

    def test_retrieve_own_class(self):
        cg = ClassGroupFactory(
            teacher_profile=self.teacher_profile,
            description="Detalhe teste",
        )
        enrollment = ClassEnrollmentFactory(class_group=cg)

        response = self.client.get(detail_url(str(cg.id)))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], cg.name)
        self.assertEqual(response.data["description"], "Detalhe teste")
        self.assertEqual(len(response.data["students"]), 1)
        self.assertEqual(
            response.data["students"][0]["student_name"],
            enrollment.student_profile.user.full_name,
        )

    def test_retrieve_other_teacher_class_returns_404(self):
        """BR-004: Professor não acessa turma de outrem."""
        other_cg = ClassGroupFactory()

        response = self.client.get(detail_url(str(other_cg.id)))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_nonexistent_returns_404(self):
        response = self.client.get(detail_url(str(uuid.uuid4())))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ClassGroupTeacherUpdateTest(APITestCase):
    def setUp(self):
        self.teacher_profile = TeacherProfileFactory()
        self.teacher = self.teacher_profile.user
        self.authenticate(self.teacher)

    def test_update_own_class(self):
        cg = ClassGroupFactory(
            teacher_profile=self.teacher_profile,
            name="Turma Original",
        )
        data = {
            "name": "Turma Atualizada",
            "description": "Nova descrição",
            "class_status": "ACTIVE",
        }

        response = self.client.put(detail_url(str(cg.id)), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Turma Atualizada")
        self.assertEqual(response.data["description"], "Nova descrição")

    def test_update_status_to_archived(self):
        cg = ClassGroupFactory(teacher_profile=self.teacher_profile)
        data = {
            "name": cg.name,
            "class_status": "ARCHIVED",
        }

        response = self.client.put(detail_url(str(cg.id)), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["class_status"], "ARCHIVED")

    def test_update_other_teacher_class_returns_404(self):
        """BR-004: Professor não edita turma alheia."""
        other_cg = ClassGroupFactory()
        data = {"name": "Tentativa"}

        response = self.client.put(detail_url(str(other_cg.id)), data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_duplicate_name_returns_400(self):
        ClassGroupFactory(teacher_profile=self.teacher_profile, name="Nome Existente")
        cg = ClassGroupFactory(teacher_profile=self.teacher_profile, name="Outro Nome")
        data = {"name": "Nome Existente", "class_status": "ACTIVE"}

        response = self.client.put(detail_url(str(cg.id)), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ClassGroupTeacherPermissionTest(APITestCase):
    def test_unauthenticated_returns_401(self):
        response = self.client.get(TEACHER_CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_student_returns_403(self):
        student = UserFactory(role=UserRole.STUDENT)
        self.authenticate(student)
        response = self.client.get(TEACHER_CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_returns_403(self):
        admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(admin)
        response = self.client.get(TEACHER_CLASSES_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_not_allowed(self):
        """Teacher ViewSet does not allow DELETE."""
        teacher_profile = TeacherProfileFactory()
        self.authenticate(teacher_profile.user)
        cg = ClassGroupFactory(teacher_profile=teacher_profile)

        response = self.client.delete(detail_url(str(cg.id)))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
