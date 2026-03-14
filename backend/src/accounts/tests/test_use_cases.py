from django.test import TestCase

from core.errors import ApplicationError
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
            email="test@example.com",
            username="testuser",
            password="securepassword123",
            first_name="Test",
            last_name="User",
        )
        result = RegisterUserUseCase().execute(input=input_data)

        self.assertEqual(result.user.email, "test@example.com")
        self.assertEqual(result.user.username, "testuser")
        self.assertTrue(result.user.check_password("securepassword123"))

    def test_register_raises_error_for_duplicate_email(self):
        UserFactory(email="existing@example.com")
        input_data = RegisterUserInput(
            email="existing@example.com",
            username="newuser",
            password="securepassword123",
        )

        with self.assertRaises(ApplicationError) as context:
            RegisterUserUseCase().execute(input=input_data)

        self.assertEqual(str(context.exception), "Este e-mail já está em uso.")

    def test_register_raises_error_for_duplicate_username(self):
        UserFactory(username="existinguser")
        input_data = RegisterUserInput(
            email="new@example.com",
            username="existinguser",
            password="securepassword123",
        )

        with self.assertRaises(ApplicationError) as context:
            RegisterUserUseCase().execute(input=input_data)

        self.assertEqual(str(context.exception), "Este nome de usuário já está em uso.")


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

        self.assertEqual(str(context.exception), "Conta desativada.")
