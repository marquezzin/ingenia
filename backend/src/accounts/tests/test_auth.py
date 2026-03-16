"""Accounts tests — Auth endpoints."""

from rest_framework import status

from core.testing import APITestCase

from .factories import UserFactory


class RegisterViewTest(APITestCase):
    def test_register_with_valid_data_returns_201(self):
        payload = {
            "email": "new@example.com",
            "username": "newuser",
            "password": "securepass123",
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

    def test_register_with_duplicate_email_returns_400(self):
        UserFactory(email="existing@example.com")
        payload = {
            "email": "existing@example.com",
            "username": "anotheruser",
            "password": "securepass123",
        }
        response = self.client.post("/api/auth/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


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
