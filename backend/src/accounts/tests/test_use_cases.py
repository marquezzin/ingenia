from django.test import TestCase

from core.errors import ApplicationError
from src.accounts.models import StudentProfile
from src.accounts.services.auth import (
    LoginUserInput,
    LoginUserUseCase,
    RegisterUserInput,
    RegisterUserUseCase,
)
from src.accounts.tests.factories import UserFactory


class RegisterUserUseCaseTest(TestCase):
    def test_register_creates_user_successfully(self):
        input_data = RegisterUserInput(
            full_name="Test User",
            email="test@example.com",
            password="securepassword123",
        )
        result = RegisterUserUseCase().execute(input=input_data)

        self.assertEqual(result.user.email, "test@example.com")
        self.assertEqual(result.user.first_name, "Test")
        self.assertEqual(result.user.last_name, "User")
        self.assertTrue(result.user.check_password("securepassword123"))

    def test_register_sets_role_as_student(self):
        input_data = RegisterUserInput(
            full_name="Test User",
            email="student@example.com",
            password="securepassword123",
        )
        result = RegisterUserUseCase().execute(input=input_data)

        self.assertEqual(result.user.role, "STUDENT")

    def test_register_creates_student_profile(self):
        input_data = RegisterUserInput(
            full_name="Test User",
            email="profile@example.com",
            password="securepassword123",
        )
        result = RegisterUserUseCase().execute(input=input_data)

        self.assertTrue(StudentProfile.objects.filter(user=result.user).exists())

    def test_register_generates_username_from_email(self):
        input_data = RegisterUserInput(
            full_name="Test User",
            email="myuser@example.com",
            password="securepassword123",
        )
        result = RegisterUserUseCase().execute(input=input_data)

        self.assertEqual(result.user.username, "myuser")

    def test_register_generates_unique_username_on_conflict(self):
        UserFactory(username="existing")
        input_data = RegisterUserInput(
            full_name="Test User",
            email="existing@example.com",
            password="securepassword123",
        )
        result = RegisterUserUseCase().execute(input=input_data)

        self.assertEqual(result.user.username, "existing1")

    def test_register_raises_generic_error_for_duplicate_email(self):
        UserFactory(email="existing@example.com")
        input_data = RegisterUserInput(
            full_name="New User",
            email="existing@example.com",
            password="securepassword123",
        )

        with self.assertRaises(ApplicationError) as context:
            RegisterUserUseCase().execute(input=input_data)

        self.assertEqual(str(context.exception), "Este e-mail já está cadastrado.")

    def test_register_splits_full_name_correctly(self):
        input_data = RegisterUserInput(
            full_name="Ana Maria Silva",
            email="ana@example.com",
            password="securepassword123",
        )
        result = RegisterUserUseCase().execute(input=input_data)

        self.assertEqual(result.user.first_name, "Ana")
        self.assertEqual(result.user.last_name, "Maria Silva")

    def test_register_handles_single_name(self):
        input_data = RegisterUserInput(
            full_name="Ikaro",
            email="ikaro@example.com",
            password="securepassword123",
        )
        result = RegisterUserUseCase().execute(input=input_data)

        self.assertEqual(result.user.first_name, "Ikaro")
        self.assertEqual(result.user.last_name, "")


class LoginUserUseCaseTest(TestCase):
    def setUp(self):
        self.password = "securepassword123"
        self.user = UserFactory(email="login@example.com")
        self.user.set_password(self.password)
        self.user.save()

    def test_login_returns_user_with_valid_credentials(self):
        input_data = LoginUserInput(
            email="login@example.com",
            password=self.password,
        )
        result = LoginUserUseCase().execute(input=input_data)

        self.assertEqual(result.user, self.user)

    def test_login_raises_error_with_invalid_credentials(self):
        input_data = LoginUserInput(
            email="login@example.com",
            password="wrongpassword",
        )

        with self.assertRaises(ApplicationError) as context:
            LoginUserUseCase().execute(input=input_data)

        self.assertEqual(str(context.exception), "E-mail ou senha inválidos.")

    def test_login_raises_error_for_inactive_user(self):
        self.user.is_active = False
        self.user.save()

        input_data = LoginUserInput(
            email="login@example.com",
            password=self.password,
        )

        with self.assertRaises(ApplicationError) as context:
            LoginUserUseCase().execute(input=input_data)

        self.assertEqual(str(context.exception), "Conta inativa ou suspensa.")

    def test_login_raises_error_for_suspended_account(self):
        from src.accounts.enums import AccountStatus

        self.user.account_status = AccountStatus.SUSPENDED
        self.user.save()

        input_data = LoginUserInput(
            email="login@example.com",
            password=self.password,
        )

        with self.assertRaises(ApplicationError) as context:
            LoginUserUseCase().execute(input=input_data)

        self.assertEqual(str(context.exception), "Conta inativa ou suspensa.")


class ForgotPasswordUseCaseTest(TestCase):
    def setUp(self):
        self.user = UserFactory(email="forgot@example.com")

    def test_forgot_creates_token_for_existing_user(self):
        from src.accounts.models import PasswordResetToken
        from src.accounts.services.password_reset import (
            ForgotPasswordInput,
            ForgotPasswordUseCase,
        )

        ForgotPasswordUseCase().execute(
            input=ForgotPasswordInput(email="forgot@example.com")
        )

        tokens = PasswordResetToken.objects.filter(user=self.user)
        self.assertEqual(tokens.count(), 1)
        token = tokens.first()
        self.assertFalse(token.used)
        self.assertIsNotNone(token.expires_at)

    def test_forgot_does_not_raise_for_nonexistent_email(self):
        from src.accounts.services.password_reset import (
            ForgotPasswordInput,
            ForgotPasswordUseCase,
        )

        # Should not raise any exception
        ForgotPasswordUseCase().execute(
            input=ForgotPasswordInput(email="nonexistent@example.com")
        )

    def test_forgot_does_not_create_token_for_nonexistent_email(self):
        from src.accounts.models import PasswordResetToken
        from src.accounts.services.password_reset import (
            ForgotPasswordInput,
            ForgotPasswordUseCase,
        )

        ForgotPasswordUseCase().execute(
            input=ForgotPasswordInput(email="nonexistent@example.com")
        )

        self.assertEqual(PasswordResetToken.objects.count(), 0)


class ResetPasswordUseCaseTest(TestCase):
    def setUp(self):
        self.user = UserFactory(email="reset@example.com")
        self.user.set_password("oldpassword123")
        self.user.save()

    def _create_token(self, *, used=False, expired=False):
        import uuid

        from django.utils import timezone

        from src.accounts.models import PasswordResetToken

        token = uuid.uuid4().hex
        if expired:
            expires_at = timezone.now() - timezone.timedelta(hours=1)
        else:
            expires_at = timezone.now() + timezone.timedelta(hours=24)

        return PasswordResetToken.objects.create(
            user=self.user,
            token=token,
            expires_at=expires_at,
            used=used,
        )

    def test_reset_updates_password_with_valid_token(self):
        from src.accounts.services.password_reset import (
            ResetPasswordInput,
            ResetPasswordUseCase,
        )

        reset_token = self._create_token()

        ResetPasswordUseCase().execute(
            input=ResetPasswordInput(
                token=reset_token.token,
                new_password="newpassword123",
            )
        )

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("newpassword123"))
        reset_token.refresh_from_db()
        self.assertTrue(reset_token.used)

    def test_reset_raises_error_for_invalid_token(self):
        from src.accounts.services.password_reset import (
            ResetPasswordInput,
            ResetPasswordUseCase,
        )

        with self.assertRaises(ApplicationError) as context:
            ResetPasswordUseCase().execute(
                input=ResetPasswordInput(
                    token="invalidtoken",
                    new_password="newpassword123",
                )
            )

        self.assertEqual(str(context.exception), "Token inválido ou expirado.")

    def test_reset_raises_error_for_expired_token(self):
        from src.accounts.services.password_reset import (
            ResetPasswordInput,
            ResetPasswordUseCase,
        )

        reset_token = self._create_token(expired=True)

        with self.assertRaises(ApplicationError) as context:
            ResetPasswordUseCase().execute(
                input=ResetPasswordInput(
                    token=reset_token.token,
                    new_password="newpassword123",
                )
            )

        self.assertEqual(str(context.exception), "Token inválido ou expirado.")

    def test_reset_raises_error_for_used_token(self):
        from src.accounts.services.password_reset import (
            ResetPasswordInput,
            ResetPasswordUseCase,
        )

        reset_token = self._create_token(used=True)

        with self.assertRaises(ApplicationError) as context:
            ResetPasswordUseCase().execute(
                input=ResetPasswordInput(
                    token=reset_token.token,
                    new_password="newpassword123",
                )
            )

        self.assertEqual(str(context.exception), "Token inválido ou expirado.")
