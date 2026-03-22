"""Accounts services — Admin UseCases para Users."""

from dataclasses import dataclass

from django.db import transaction

from core.errors import ApplicationError

from ..enums import AccountStatus, UserRole
from ..models import AdminProfile, StudentProfile, TeacherProfile, User


@dataclass
class CreateUserAdminInput:
    full_name: str
    email: str
    password: str
    role: str


@dataclass
class CreateUserAdminResult:
    user: User


class CreateUserAdminUseCase:
    """Cria um usuário via painel admin, inicializando o profile correspondente."""

    def execute(self, *, input: CreateUserAdminInput) -> CreateUserAdminResult:
        if User.objects.filter(email=input.email).exists():
            raise ApplicationError("Este e-mail já está cadastrado.")

        if input.role not in UserRole.values:
            raise ApplicationError("Papel (role) inválido.")

        first_name, _, last_name = input.full_name.partition(" ")

        with transaction.atomic():
            user = User.objects.create_user(
                email=input.email,
                password=input.password,
                first_name=first_name,
                last_name=last_name,
                role=input.role,
                account_status=AccountStatus.ACTIVE,
            )

            if input.role == UserRole.STUDENT:
                StudentProfile.objects.create(user=user)
            elif input.role == UserRole.TEACHER:
                TeacherProfile.objects.create(user=user)
            elif input.role == UserRole.ADMIN:
                AdminProfile.objects.create(user=user)

        return CreateUserAdminResult(user=user)


@dataclass
class UpdateUserAdminInput:
    id: str
    full_name: str
    email: str
    account_status: str


@dataclass
class UpdateUserAdminResult:
    user: User


class UpdateUserAdminUseCase:
    """Atualiza dados do usuário via admin. A alteração de 'role' não é permitida."""

    def execute(self, *, input: UpdateUserAdminInput) -> UpdateUserAdminResult:
        user = User.objects.filter(id=input.id).first()
        if not user:
            raise ApplicationError("Usuário não encontrado.")

        if input.account_status not in AccountStatus.values:
            raise ApplicationError("Status de conta inválido.")

        if input.email != user.email:
            if User.objects.filter(email=input.email).exists():
                raise ApplicationError("Este e-mail já está cadastrado.")

        first_name, _, last_name = input.full_name.partition(" ")

        with transaction.atomic():
            user.first_name = first_name
            user.last_name = last_name
            user.email = input.email
            user.account_status = input.account_status
            user.save()

        return UpdateUserAdminResult(user=user)
