"""Curriculum app — Serializers."""

from rest_framework import serializers

from core.serializers import BaseModelSerializer

from .models import Lesson, Module, VideoLesson

# ─── Module Serializers ───────────────────────────────────────────────────────


class ModuleListSerializer(BaseModelSerializer):
    """Campos resumidos para listagem de módulos."""

    class Meta:
        model = Module
        fields = ["id", "title", "sequence_order", "publication_status"]


class ModuleDetailSerializer(BaseModelSerializer):
    """Todos os campos + contagem de aulas para detalhe do módulo."""

    lesson_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Module
        fields = [
            "id",
            "title",
            "description",
            "sequence_order",
            "publication_status",
            "lesson_count",
            "created_at",
            "updated_at",
        ]


class ModuleCreateUpdateSerializer(serializers.Serializer):
    """Serializer de escrita para criação/edição de módulos."""

    title = serializers.CharField(max_length=255)
    description = serializers.CharField()
    sequence_order = serializers.IntegerField(min_value=1)
    publication_status = serializers.ChoiceField(
        choices=["DRAFT", "PUBLISHED", "ARCHIVED"],
        default="DRAFT",
    )


# ─── VideoLesson Serializers ─────────────────────────────────────────────────


class VideoLessonSerializer(BaseModelSerializer):
    """Serializer de leitura para VideoLesson."""

    class Meta:
        model = VideoLesson
        fields = ["id", "title", "video_url", "duration_seconds"]


class VideoLessonInputSerializer(serializers.Serializer):
    """Serializer de escrita para VideoLesson inline."""

    title = serializers.CharField(max_length=255)
    video_url = serializers.URLField()
    duration_seconds = serializers.IntegerField(
        min_value=1, required=False, allow_null=True, default=None
    )


# ─── Lesson Serializers ──────────────────────────────────────────────────────


class LessonListSerializer(BaseModelSerializer):
    """Campos resumidos para listagem de aulas."""

    has_video = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "sequence_order",
            "publication_status",
            "has_video",
        ]

    def get_has_video(self, obj: Lesson) -> bool:
        return hasattr(obj, "video")


class LessonDetailSerializer(BaseModelSerializer):
    """Todos os campos + vídeo nested + contagem de exercícios."""

    video = VideoLessonSerializer(read_only=True)
    exercise_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "written_content",
            "sequence_order",
            "publication_status",
            "video",
            "exercise_count",
            "created_at",
            "updated_at",
        ]


class LessonCreateUpdateSerializer(serializers.Serializer):
    """Serializer de escrita para criação/edição de aulas."""

    title = serializers.CharField(max_length=255)
    written_content = serializers.CharField()
    sequence_order = serializers.IntegerField(min_value=1)
    publication_status = serializers.ChoiceField(
        choices=["DRAFT", "PUBLISHED", "ARCHIVED"],
        default="DRAFT",
    )
    video_lesson = VideoLessonInputSerializer(required=False, allow_null=True)
