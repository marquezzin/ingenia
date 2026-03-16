"""Accounts services — Auth UseCases."""

from dataclasses import dataclass

from django.contrib.auth import authenticate
from django.db import transaction

from core.errors import ApplicationError

from ..enums import UserRole
from ..models import StudentProfile, User


@dataclass
class RegisterUserInput:
    full_name: str
    email: str
    password: str


@dataclass
class RegisterUserResult:
    user: User


class RegisterUserUseCase:
    def execute(self, *, input: RegisterUserInput) -> RegisterUserResult:
        if User.objects.filter(email=input.email).exists():
            raise ApplicationError("Não foi possível criar a conta.")

        first_name, _, last_name = input.full_name.partition(" ")
        username = self._generate_unique_username(input.email)

        with transaction.atomic():
            user = User.objects.create_user(
                email=input.email,
                username=username,
                password=input.password,
                first_name=first_name,
                last_name=last_name,
                role=UserRole.STUDENT,
            )
            StudentProfile.objects.create(user=user)

        return RegisterUserResult(user=user)

    @staticmethod
    def _generate_unique_username(email: str) -> str:
        """Gera um username único a partir do email."""
        base_username = email.split("@")[0]
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        return username


@dataclass
class LoginUserInput:
    email: str
    password: str


@dataclass
class LoginUserResult:
    user: User


class LoginUserUseCase:
    def execute(self, *, input: LoginUserInput) -> LoginUserResult:
        user = authenticate(username=input.email, password=input.password)

        if user is not None:
            from ..enums import AccountStatus

            if user.account_status != AccountStatus.ACTIVE:
                raise ApplicationError("Conta inativa ou suspensa.")
            return LoginUserResult(user=user)

        if user is None:
            # Verifica se falhou pois o usuário está inativo
            existing_user = User.objects.filter(email=input.email).first()
            if existing_user and existing_user.check_password(input.password):
                from ..enums import AccountStatus

                if (
                    not existing_user.is_active
                    or existing_user.account_status != AccountStatus.ACTIVE
                ):
                    raise ApplicationError("Conta inativa ou suspensa.")

            raise ApplicationError("E-mail ou senha inválidos.")

        return LoginUserResult(user=user)
