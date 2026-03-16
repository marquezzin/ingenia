"""
Core Permissions — Permissões base do projeto.

Permission classes para controle de acesso por papel (role) e status da conta.
Composíveis com operadores ``&`` e ``|`` do DRF::

    permission_classes = [IsAuthenticated, IsAdmin]
    permission_classes = [IsAuthenticated, IsStudent, IsActiveAccount]
    permission_classes = [IsAuthenticated, IsAdmin | IsTeacher]
"""

from rest_framework.permissions import BasePermission

from src.accounts.enums import AccountStatus, UserRole


class IsOwner(BasePermission):
    """
    Permite acesso apenas ao dono do objeto.
    O objeto deve ter um campo `owner` ou `user` que aponta para o usuário.
    """

    def has_object_permission(self, request, view, obj):
        owner = getattr(obj, "owner", None) or getattr(obj, "user", None)
        return owner == request.user


class IsStudent(BasePermission):
    """Permite acesso apenas a usuários com papel de Aluno."""

    message = "Acesso permitido apenas para alunos."

    def has_permission(self, request, view) -> bool:
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.STUDENT
        )


class IsTeacher(BasePermission):
    """Permite acesso apenas a usuários com papel de Professor."""

    message = "Acesso permitido apenas para professores."

    def has_permission(self, request, view) -> bool:
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.TEACHER
        )


class IsAdmin(BasePermission):
    """Permite acesso apenas a usuários com papel de Administrador."""

    message = "Acesso permitido apenas para administradores."

    def has_permission(self, request, view) -> bool:
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.ADMIN
        )


class IsActiveAccount(BasePermission):
    """Permite acesso apenas a contas com status ativo."""

    message = "Sua conta não está ativa. Entre em contato com o suporte."

    def has_permission(self, request, view) -> bool:
        return (
            request.user
            and request.user.is_authenticated
            and request.user.account_status == AccountStatus.ACTIVE
        )
