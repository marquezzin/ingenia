"""Accounts app — Selectors."""

from django.db.models import QuerySet

from .models import User


def list_users() -> QuerySet[User]:
    """Lista todos os usuários ordenados pela data de entrada."""
    return User.objects.all().order_by("-date_joined")
