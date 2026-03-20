"""Accounts tests — User Admin CRUD (ISSUE-009-F)."""

from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import AccountStatus, UserRole
from src.accounts.models import AdminProfile, StudentProfile, TeacherProfile
from src.accounts.tests.factories import UserFactory

BASE_URL = "/api/auth/admin/users/"


class UserAdminListTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)

    def test_list_returns_200(self):
        UserFactory.create_batch(3)
        response = self.client.get(BASE_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # admin (self) + 3 created = 4
        self.assertEqual(response.data["count"], 4)

    def test_list_filter_by_role(self):
        UserFactory(role=UserRole.TEACHER)
        UserFactory(role=UserRole.STUDENT)
        response = self.client.get(BASE_URL, {"role": "TEACHER"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_list_filter_by_account_status(self):
        UserFactory(account_status=AccountStatus.SUSPENDED)
        response = self.client.get(BASE_URL, {"account_status": "SUSPENDED"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_list_search_by_email(self):
        UserFactory(email="searchable@example.com")
        response = self.client.get(BASE_URL, {"search": "searchable"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_list_search_by_name(self):
        UserFactory(first_name="UnicoNome")
        response = self.client.get(BASE_URL, {"search": "UnicoNome"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)


class UserAdminCreateTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)

    def test_create_student_returns_201_with_profile(self):
        payload = {
            "full_name": "Aluno Teste",
            "email": "aluno@example.com",
            "password": "securepass123",
            "role": "STUDENT",
        }
        response = self.client.post(BASE_URL, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["role"], "STUDENT")
        self.assertTrue(
            StudentProfile.objects.filter(user__email="aluno@example.com").exists()
        )

    def test_create_teacher_returns_201_with_profile(self):
        payload = {
            "full_name": "Professor Teste",
            "email": "professor@example.com",
            "password": "securepass123",
            "role": "TEACHER",
        }
        response = self.client.post(BASE_URL, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["role"], "TEACHER")
        self.assertTrue(
            TeacherProfile.objects.filter(user__email="professor@example.com").exists()
        )

    def test_create_admin_returns_201_with_profile(self):
        payload = {
            "full_name": "Admin Teste",
            "email": "admin2@example.com",
            "password": "securepass123",
            "role": "ADMIN",
        }
        response = self.client.post(BASE_URL, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["role"], "ADMIN")
        self.assertTrue(
            AdminProfile.objects.filter(user__email="admin2@example.com").exists()
        )

    def test_create_with_duplicate_email_returns_400(self):
        UserFactory(email="existing@example.com")
        payload = {
            "full_name": "Outro User",
            "email": "existing@example.com",
            "password": "securepass123",
            "role": "STUDENT",
        }
        response = self.client.post(BASE_URL, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_with_weak_password_returns_400(self):
        payload = {
            "full_name": "Fraco",
            "email": "fraco@example.com",
            "password": "nodigits",
            "role": "STUDENT",
        }
        response = self.client.post(BASE_URL, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserAdminRetrieveTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)

    def test_retrieve_returns_200_with_profile_info(self):
        user = UserFactory(role=UserRole.STUDENT)
        StudentProfile.objects.create(user=user)
        response = self.client.get(f"{BASE_URL}{user.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], user.email)
        self.assertIn("profile_info", response.data)
        self.assertIn("date_joined", response.data)
        self.assertIn("full_name", response.data)


class UserAdminUpdateTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)

    def test_update_returns_200(self):
        user = UserFactory(
            first_name="Original",
            last_name="Name",
            email="original@example.com",
        )
        payload = {
            "full_name": "Novo Nome",
            "email": "novo@example.com",
            "account_status": "ACTIVE",
        }
        response = self.client.put(f"{BASE_URL}{user.id}/", payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["full_name"], "Novo Nome")
        self.assertEqual(response.data["email"], "novo@example.com")

    def test_update_does_not_change_role(self):
        """Role não aparece no serializer de update, então não pode ser alterado."""
        user = UserFactory(role=UserRole.STUDENT)
        payload = {
            "full_name": "Mesmo",
            "email": user.email,
            "account_status": "ACTIVE",
        }
        response = self.client.put(f"{BASE_URL}{user.id}/", payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["role"], "STUDENT")

    def test_update_can_suspend_account(self):
        user = UserFactory()
        payload = {
            "full_name": "User",
            "email": user.email,
            "account_status": "SUSPENDED",
        }
        response = self.client.put(f"{BASE_URL}{user.id}/", payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["account_status"], "SUSPENDED")

    def test_update_with_duplicate_email_returns_400(self):
        UserFactory(email="taken@example.com")
        user = UserFactory(email="mine@example.com")
        payload = {
            "full_name": "User",
            "email": "taken@example.com",
            "account_status": "ACTIVE",
        }
        response = self.client.put(f"{BASE_URL}{user.id}/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserAdminDeleteTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)

    def test_delete_returns_405(self):
        user = UserFactory()
        response = self.client.delete(f"{BASE_URL}{user.id}/")
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class UserAdminPermissionTest(APITestCase):
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
