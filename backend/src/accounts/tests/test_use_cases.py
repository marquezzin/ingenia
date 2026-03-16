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

        self.assertEqual(str(context.exception), "Não foi possível criar a conta.")

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
