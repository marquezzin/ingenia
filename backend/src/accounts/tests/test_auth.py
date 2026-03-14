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
        self.assertEqual(response.data["user"]["email"], "new@example.com")

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

    def test_me_without_auth_returns_401(self):
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
