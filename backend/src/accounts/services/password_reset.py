"""Accounts services — Password Reset UseCases."""

import logging
import uuid
from dataclasses import dataclass

from django.conf import settings
from django.utils import timezone

from core.errors import ApplicationError

from ..models import PasswordResetToken, User

logger = logging.getLogger(__name__)


@dataclass
class ForgotPasswordInput:
    email: str


class ForgotPasswordUseCase:
    def execute(self, *, input: ForgotPasswordInput) -> None:
        user = User.objects.filter(email=input.email).first()
        if user is None:
            # Silently return — never expose if email exists
            return

        expiry_hours = getattr(settings, "PASSWORD_RESET_TOKEN_EXPIRY_HOURS", 24)
        token = uuid.uuid4().hex
        expires_at = timezone.now() + timezone.timedelta(hours=expiry_hours)

        PasswordResetToken.objects.create(
            user=user,
            token=token,
            expires_at=expires_at,
        )

        logger.info(
            "Password reset token for %s: %s (expires at %s)",
            user.email,
            token,
            expires_at,
        )

        frontend_domain = getattr(
            settings, "CORS_ALLOWED_ORIGINS", ["http://localhost:5173"]
        )[0]
        reset_link = f"{frontend_domain}/reset-password?token={token}"

        from core.services.email import SendEmailInput, SendEmailUseCase

        SendEmailUseCase().execute(
            input=SendEmailInput(
                subject="Recuperação de Senha - Ingenia",
                template_name="emails/reset_password.html",
                context={
                    "user": user,
                    "reset_link": reset_link,
                },
                to=[user.email],
            )
        )


@dataclass
class ResetPasswordInput:
    token: str
    new_password: str


class ResetPasswordUseCase:
    def execute(self, *, input: ResetPasswordInput) -> None:
        reset_token = PasswordResetToken.objects.filter(token=input.token).first()

        if reset_token is None:
            raise ApplicationError("Token inválido ou expirado.")

        if reset_token.used:
            raise ApplicationError("Token inválido ou expirado.")

        if reset_token.expires_at < timezone.now():
            raise ApplicationError("Token inválido ou expirado.")

        user = reset_token.user
        user.set_password(input.new_password)
        user.save()

        reset_token.used = True
        reset_token.save(update_fields=["used"])
