"""Accounts tests — Auth endpoints."""

from rest_framework import status

from core.testing import APITestCase

from .factories import UserFactory


class RegisterViewTest(APITestCase):
    def test_register_with_valid_data_returns_201(self):
        payload = {
            "full_name": "Test User",
            "email": "new@example.com",
            "password": "securepass123",
            "password_confirm": "securepass123",
        }
        response = self.client.post("/api/auth/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        user_data = response.data["user"]
        self.assertEqual(user_data["email"], "new@example.com")
        self.assertEqual(user_data["role"], "STUDENT")
        self.assertEqual(user_data["account_status"], "ACTIVE")
        self.assertIn("full_name", user_data)
        self.assertIn("profile_info", user_data)

    def test_register_creates_student_profile(self):
        payload = {
            "full_name": "Profile Test",
            "email": "profile@example.com",
            "password": "securepass123",
            "password_confirm": "securepass123",
        }
        response = self.client.post("/api/auth/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data["user"]["profile_info"])

    def test_register_with_duplicate_email_returns_400_generic_message(self):
        UserFactory(email="existing@example.com")
        payload = {
            "full_name": "Another User",
            "email": "existing@example.com",
            "password": "securepass123",
            "password_confirm": "securepass123",
        }
        response = self.client.post("/api/auth/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Não foi possível criar a conta.")

    def test_register_with_mismatched_passwords_returns_400(self):
        payload = {
            "full_name": "Test User",
            "email": "mismatch@example.com",
            "password": "securepass123",
            "password_confirm": "differentpass123",
        }
        response = self.client.post("/api/auth/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password_confirm", response.data)

    def test_register_with_weak_password_returns_400(self):
        payload = {
            "full_name": "Test User",
            "email": "weak@example.com",
            "password": "nodigitshere",
            "password_confirm": "nodigitshere",
        }
        response = self.client.post("/api/auth/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_register_with_short_password_returns_400(self):
        payload = {
            "full_name": "Test User",
            "email": "short@example.com",
            "password": "abc1",
            "password_confirm": "abc1",
        }
        response = self.client.post("/api/auth/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)


class LoginViewTest(APITestCase):
    def setUp(self):
        self.user = UserFactory(email="test@example.com")
        self.user.set_password("testpass123")
        self.user.save()

    def test_login_with_valid_credentials_returns_200(self):
        response = self.client.post(
            "/api/auth/login/",
            {"email": "test@example.com", "password": "testpass123"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        user_data = response.data["user"]
        self.assertEqual(user_data["email"], "test@example.com")
        self.assertIn("role", user_data)
        self.assertIn("account_status", user_data)
        self.assertIn("full_name", user_data)
        self.assertIn("profile_info", user_data)

    def test_login_with_invalid_password_returns_400(self):
        response = self.client.post(
            "/api/auth/login/",
            {"email": "test@example.com", "password": "wrongpassword"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class MeViewTest(APITestCase):
    def test_me_returns_authenticated_user(self):
        user = UserFactory()
        self.authenticate(user)
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], user.email)
        self.assertIn("role", response.data)
        self.assertIn("profile_info", response.data)
        self.assertIn("full_name", response.data)

    def test_me_without_auth_returns_401(self):
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
