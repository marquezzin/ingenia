"""Accounts services — Auth UseCases."""
from dataclasses import dataclass

from django.contrib.auth import authenticate

from core.errors import ApplicationError

from ..models import User


@dataclass
class RegisterUserInput:
    email: str
    username: str
    password: str
    first_name: str = ""
    last_name: str = ""


@dataclass
class RegisterUserResult:
    user: User


class RegisterUserUseCase:
    def execute(self, *, input: RegisterUserInput) -> RegisterUserResult:
        if User.objects.filter(email=input.email).exists():
            raise ApplicationError("Este e-mail já está em uso.")
        if User.objects.filter(username=input.username).exists():
            raise ApplicationError("Este nome de usuário já está em uso.")

        user = User.objects.create_user(
            email=input.email,
            username=input.username,
            password=input.password,
            first_name=input.first_name,
            last_name=input.last_name,
        )
        return RegisterUserResult(user=user)


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
        if user is None:
            # Verifica se falhou pois o usuário está inativo
            existing_user = User.objects.filter(email=input.email).first()
            if existing_user and existing_user.check_password(input.password) and not existing_user.is_active:
                raise ApplicationError("Conta desativada.")

            raise ApplicationError("E-mail ou senha inválidos.")
        
        return LoginUserResult(user=user)
