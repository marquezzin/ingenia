"""Accounts tests — Auth endpoints."""

import jwt
from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import AccountStatus, UserRole

from .factories import AdminProfileFactory, TeacherProfileFactory, UserFactory


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
        self.assertEqual(response.data["detail"], "Este e-mail já está cadastrado.")

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

    def test_login_returns_jwt_with_role_in_payload(self):
        response = self.client.post(
            "/api/auth/login/",
            {"email": "test@example.com", "password": "testpass123"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        access_token = response.data["access"]
        payload = jwt.decode(access_token, options={"verify_signature": False})
        self.assertIn("role", payload)
        self.assertEqual(payload["role"], self.user.role)

    def test_login_with_inactive_account_returns_400(self):
        self.user.is_active = False
        self.user.save()
        response = self.client.post(
            "/api/auth/login/",
            {"email": "test@example.com", "password": "testpass123"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_suspended_account_returns_400(self):
        self.user.account_status = AccountStatus.SUSPENDED
        self.user.save()
        response = self.client.post(
            "/api/auth/login/",
            {"email": "test@example.com", "password": "testpass123"},
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

    def test_me_returns_teacher_profile_info(self):
        teacher_profile = TeacherProfileFactory()
        self.authenticate(teacher_profile.user)
        response = self.client.get("/api/auth/me/")
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["role"], UserRole.TEACHER)
        self.assertIsNotNone(response.data["profile_info"])

    def test_me_returns_admin_profile_info(self):
        admin_profile = AdminProfileFactory()
        self.authenticate(admin_profile.user)
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["role"], UserRole.ADMIN)
        self.assertIsNotNone(response.data["profile_info"])


class ForgotPasswordViewTest(APITestCase):
    def test_forgot_password_returns_200_for_existing_email(self):
        UserFactory(email="exists@example.com")
        response = self.client.post(
            "/api/auth/forgot-password/",
            {"email": "exists@example.com"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("detail", response.data)

    def test_forgot_password_returns_200_for_nonexistent_email(self):
        response = self.client.post(
            "/api/auth/forgot-password/",
            {"email": "nonexistent@example.com"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("detail", response.data)

    def test_forgot_password_does_not_leak_email_existence(self):
        UserFactory(email="exists@example.com")
        response_exists = self.client.post(
            "/api/auth/forgot-password/",
            {"email": "exists@example.com"},
        )
        response_missing = self.client.post(
            "/api/auth/forgot-password/",
            {"email": "missing@example.com"},
        )
        self.assertEqual(
            response_exists.data["detail"], response_missing.data["detail"]
        )


class ResetPasswordViewTest(APITestCase):
    def setUp(self):
        import uuid

        from django.utils import timezone

        from src.accounts.models import PasswordResetToken

        self.user = UserFactory(email="resetview@example.com")
        self.user.set_password("oldpass123")
        self.user.save()

        self.token = uuid.uuid4().hex
        PasswordResetToken.objects.create(
            user=self.user,
            token=self.token,
            expires_at=timezone.now() + timezone.timedelta(hours=24),
        )

    def test_reset_password_returns_200_with_valid_token(self):
        response = self.client.post(
            "/api/auth/reset-password/",
            {
                "token": self.token,
                "new_password": "newpass123",
                "new_password_confirm": "newpass123",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("newpass123"))

    def test_reset_password_returns_400_with_invalid_token(self):
        response = self.client.post(
            "/api/auth/reset-password/",
            {
                "token": "invalidtoken",
                "new_password": "newpass123",
                "new_password_confirm": "newpass123",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reset_password_returns_400_with_expired_token(self):
        import uuid

        from django.utils import timezone

        from src.accounts.models import PasswordResetToken

        expired_token = uuid.uuid4().hex
        PasswordResetToken.objects.create(
            user=self.user,
            token=expired_token,
            expires_at=timezone.now() - timezone.timedelta(hours=1),
        )

        response = self.client.post(
            "/api/auth/reset-password/",
            {
                "token": expired_token,
                "new_password": "newpass123",
                "new_password_confirm": "newpass123",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reset_password_returns_400_with_weak_password(self):
        response = self.client.post(
            "/api/auth/reset-password/",
            {
                "token": self.token,
                "new_password": "nodigits",
                "new_password_confirm": "nodigits",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reset_password_returns_400_with_mismatched_passwords(self):
        response = self.client.post(
            "/api/auth/reset-password/",
            {
                "token": self.token,
                "new_password": "newpass123",
                "new_password_confirm": "differentpass123",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reset_password_returns_400_with_used_token(self):
        import uuid

        from django.utils import timezone

        from src.accounts.models import PasswordResetToken

        used_token = uuid.uuid4().hex
        PasswordResetToken.objects.create(
            user=self.user,
            token=used_token,
            expires_at=timezone.now() + timezone.timedelta(hours=24),
            used=True,
        )

        response = self.client.post(
            "/api/auth/reset-password/",
            {
                "token": used_token,
                "new_password": "newpass123",
                "new_password_confirm": "newpass123",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
