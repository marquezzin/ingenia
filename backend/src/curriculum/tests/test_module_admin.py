"""Curriculum tests — Module Admin CRUD (ISSUE-009-F)."""

from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import UserRole
from src.accounts.tests.factories import UserFactory
from src.curriculum.tests.factories import ModuleFactory

BASE_URL = "/api/v1/modules/"


class ModuleAdminListTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        # 2. Pega esse usuário, gera os tokens de acesso dele e injeta
        #    dentro do self.client para que a partir desse ponto
        #    todas as requisições simulem estar sendo feitas por ele
        self.authenticate(self.admin)

    def test_list_returns_200(self):
        ModuleFactory.create_batch(3)
        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 3)

    def test_list_filter_by_publication_status(self):
        ModuleFactory(publication_status="DRAFT")
        ModuleFactory(publication_status="PUBLISHED")
        ModuleFactory(publication_status="PUBLISHED")
        # GET /api/v1/modules/?publication_status=PUBLISHED
        response = self.client.get(BASE_URL, {"publication_status": "PUBLISHED"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)

    def test_list_search_by_title(self):
        ModuleFactory(title="Python Basics")
        ModuleFactory(title="Advanced Python")
        ModuleFactory(title="JavaScript 101")
        response = self.client.get(BASE_URL, {"search": "Python"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)

    def test_list_ordered_by_sequence_order(self):
        ModuleFactory(title="Third", sequence_order=3)
        ModuleFactory(title="First", sequence_order=1)
        ModuleFactory(title="Second", sequence_order=2)
        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [m["title"] for m in response.data["results"]]
        self.assertEqual(titles, ["First", "Second", "Third"])


class ModuleAdminCreateTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)

    def test_create_with_valid_data_returns_201(self):
        payload = {
            "title": "Novo Módulo",
            "description": "Descrição do módulo",
            "sequence_order": 1,
        }
        response = self.client.post(BASE_URL, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Novo Módulo")
        self.assertEqual(response.data["publication_status"], "DRAFT")
        self.assertIn("lesson_count", response.data)

    def test_create_with_duplicate_sequence_order_returns_400(self):
        ModuleFactory(sequence_order=1)
        payload = {
            "title": "Outro Módulo",
            "description": "Descrição",
            "sequence_order": 1,
        }
        response = self.client.post(BASE_URL, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_with_missing_title_returns_400(self):
        payload = {"description": "Desc", "sequence_order": 1}
        response = self.client.post(BASE_URL, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ModuleAdminRetrieveTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)

    def test_retrieve_returns_200_with_detail_fields(self):
        module = ModuleFactory()
        response = self.client.get(f"{BASE_URL}{module.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], str(module.id))
        self.assertIn("description", response.data)
        self.assertIn("lesson_count", response.data)
        self.assertIn("created_at", response.data)
        self.assertIn("updated_at", response.data)

    def test_retrieve_nonexistent_returns_404(self):
        import uuid

        response = self.client.get(f"{BASE_URL}{uuid.uuid4()}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ModuleAdminUpdateTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)

    def test_update_with_valid_data_returns_200(self):
        module = ModuleFactory(title="Original", sequence_order=1)
        payload = {
            "title": "Atualizado",
            "description": "Nova descrição",
            "sequence_order": 1,
            "publication_status": "PUBLISHED",
        }
        response = self.client.put(f"{BASE_URL}{module.id}/", payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Atualizado")
        self.assertEqual(response.data["publication_status"], "PUBLISHED")

    def test_update_with_duplicate_sequence_order_returns_400(self):
        ModuleFactory(sequence_order=1)
        module = ModuleFactory(sequence_order=2)
        payload = {
            "title": "Módulo",
            "description": "Desc",
            "sequence_order": 1,
            "publication_status": "DRAFT",
        }
        response = self.client.put(f"{BASE_URL}{module.id}/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_keeps_own_sequence_order(self):
        module = ModuleFactory(sequence_order=5)
        payload = {
            "title": "Mesmo",
            "description": "Desc",
            "sequence_order": 5,
            "publication_status": "DRAFT",
        }
        response = self.client.put(f"{BASE_URL}{module.id}/", payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ModuleAdminDeleteTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)

    def test_delete_returns_204(self):
        module = ModuleFactory()
        response = self.client.delete(f"{BASE_URL}{module.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        from src.curriculum.models import Module

        self.assertFalse(Module.objects.filter(id=module.id).exists())


class ModuleAdminPermissionTest(APITestCase):
    def test_unauthenticated_returns_401(self):
        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_student_returns_403(self):
        student = UserFactory(role=UserRole.STUDENT)
        self.authenticate(student)
        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_teacher_returns_403(self):
        teacher = UserFactory(role=UserRole.TEACHER)
        self.authenticate(teacher)
        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
