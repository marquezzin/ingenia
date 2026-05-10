import logging
import os
from dataclasses import dataclass
from email.mime.image import MIMEImage
from typing import Any

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)


@dataclass
class SendEmailInput:
    subject: str
    to: list[str]
    template_name: str
    context: dict[str, Any]
    from_email: str | None = None
    inline_images: dict[str, str] | None = None


class SendEmailUseCase:
    """UseCase para envio de emails em formato HTML com fallback para texto."""

    def execute(self, *, input: SendEmailInput) -> None:
        try:
            html_content = render_to_string(input.template_name, input.context)
            plain_content = strip_tags(html_content)

            from_email = input.from_email or getattr(
                settings, "DEFAULT_FROM_EMAIL", "noreply@ingenia.com"
            )

            msg = EmailMultiAlternatives(
                subject=input.subject,
                body=plain_content,
                from_email=from_email,
                to=input.to,
            )
            msg.attach_alternative(html_content, "text/html")

            if input.inline_images:
                for cid, file_path in input.inline_images.items():
                    try:
                        with open(file_path, "rb") as f:
                            img = MIMEImage(f.read())
                            img.add_header("Content-ID", f"<{cid}>")
                            img.add_header(
                                "Content-Disposition",
                                "inline",
                                filename=os.path.basename(file_path),
                            )
                            msg.attach(img)
                    except Exception as img_exc:
                        logger.warning(
                            f"Não foi possível anexar a imagem inline {cid}: {img_exc}"
                        )

            msg.send()

            logger.info(f"Email '{input.subject}' enviado com sucesso para {input.to}")

        except Exception as e:
            logger.error(
                f"Erro ao enviar email '{input.subject}' para {input.to}: {e}",
                exc_info=True,
            )
