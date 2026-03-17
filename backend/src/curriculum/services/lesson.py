"""Curriculum services — Lesson UseCases."""

from dataclasses import dataclass

from core.errors import ApplicationError, NotFoundError

from ..models import Lesson, Module, VideoLesson
from ..selectors import get_lesson_by_id, get_module_by_id

# ─── Inputs ───────────────────────────────────────────────────────────────────


@dataclass
class VideoLessonInput:
    title: str
    video_url: str
    duration_seconds: int | None = None


@dataclass
class CreateLessonInput:
    module_id: str
    title: str
    written_content: str
    sequence_order: int
    publication_status: str = "DRAFT"
    video_lesson: VideoLessonInput | None = None


@dataclass
class UpdateLessonInput:
    id: str
    title: str
    written_content: str
    sequence_order: int
    publication_status: str
    video_lesson: VideoLessonInput | None = None


@dataclass
class DeleteLessonInput:
    id: str


# ─── UseCases ─────────────────────────────────────────────────────────────────


class CreateLessonUseCase:
    def execute(self, *, input: CreateLessonInput) -> Lesson:
        # Validar que o módulo existe
        try:
            get_module_by_id(id=input.module_id)
        except Module.DoesNotExist:
            raise NotFoundError("Módulo não encontrado.")

        # Validar sequence_order único no módulo
        if Lesson.objects.filter(
            module_id=input.module_id,
            sequence_order=input.sequence_order,
        ).exists():
            raise ApplicationError(
                f"Já existe uma aula com sequence_order={input.sequence_order} "
                f"neste módulo."
            )

        lesson = Lesson.objects.create(
            module_id=input.module_id,
            title=input.title,
            written_content=input.written_content,
            sequence_order=input.sequence_order,
            publication_status=input.publication_status,
        )

        # Criar VideoLesson inline se fornecido
        if input.video_lesson:
            VideoLesson.objects.create(
                lesson=lesson,
                title=input.video_lesson.title,
                video_url=input.video_lesson.video_url,
                duration_seconds=input.video_lesson.duration_seconds,
            )

        return lesson


class UpdateLessonUseCase:
    def execute(self, *, input: UpdateLessonInput) -> Lesson:
        try:
            lesson = get_lesson_by_id(id=input.id)
        except Lesson.DoesNotExist:
            raise NotFoundError("Aula não encontrada.")

        # Validar sequence_order único no módulo (excluindo a própria)
        if (
            Lesson.objects.filter(
                module_id=lesson.module_id,
                sequence_order=input.sequence_order,
            )
            .exclude(id=input.id)
            .exists()
        ):
            raise ApplicationError(
                f"Já existe uma aula com sequence_order={input.sequence_order} "
                f"neste módulo."
            )

        lesson.title = input.title
        lesson.written_content = input.written_content
        lesson.sequence_order = input.sequence_order
        lesson.publication_status = input.publication_status
        lesson.save()

        # Gerenciar VideoLesson inline
        if input.video_lesson is not None:
            # Atualizar ou criar VideoLesson
            video, created = VideoLesson.objects.update_or_create(
                lesson=lesson,
                defaults={
                    "title": input.video_lesson.title,
                    "video_url": input.video_lesson.video_url,
                    "duration_seconds": input.video_lesson.duration_seconds,
                },
            )
        else:
            # Se video_lesson é None, remover VideoLesson existente
            VideoLesson.objects.filter(lesson=lesson).delete()

        return lesson


class DeleteLessonUseCase:
    def execute(self, *, input: DeleteLessonInput) -> None:
        try:
            lesson = get_lesson_by_id(id=input.id)
        except Lesson.DoesNotExist:
            raise NotFoundError("Aula não encontrada.")

        lesson.delete()
