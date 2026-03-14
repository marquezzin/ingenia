"""
Core Permissions — Permissões base do projeto.
"""

from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """
    Permite acesso apenas ao dono do objeto.
    O objeto deve ter um campo `owner` ou `user` que aponta para o usuário.
    """

    def has_object_permission(self, request, view, obj):
        owner = getattr(obj, "owner", None) or getattr(obj, "user", None)
        return owner == request.user
