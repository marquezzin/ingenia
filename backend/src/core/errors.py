"""
Core Errors — Exceções customizadas e handler de exceções do DRF.
"""

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


class ApplicationError(Exception):
    """Erro de regra de negócio — retorna 400 Bad Request."""

    def __init__(self, message: str, extra: dict | None = None):
        self.message = message
        self.extra = extra or {}
        super().__init__(message)


class NotFoundError(Exception):
    """Recurso não encontrado — retorna 404 Not Found."""

    def __init__(self, message: str = "Recurso não encontrado."):
        self.message = message
        super().__init__(message)


class PermissionDeniedError(Exception):
    """Acesso negado — retorna 403 Forbidden."""

    def __init__(self, message: str = "Acesso negado."):
        self.message = message
        super().__init__(message)


def custom_exception_handler(exc, context):
    """
    Handler customizado de exceções para o DRF.
    Trata ApplicationError, NotFoundError e PermissionDeniedError.
    """
    if isinstance(exc, ApplicationError):
        return Response(
            {"detail": exc.message, **exc.extra},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if isinstance(exc, NotFoundError):
        return Response(
            {"detail": exc.message},
            status=status.HTTP_404_NOT_FOUND,
        )

    if isinstance(exc, PermissionDeniedError):
        return Response(
            {"detail": exc.message},
            status=status.HTTP_403_FORBIDDEN,
        )

    # Fallback para o handler padrão do DRF
    return exception_handler(exc, context)
