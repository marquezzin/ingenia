"""Curriculum app — Serializers."""

from rest_framework import serializers

from core.serializers import BaseModelSerializer

from .models import Module


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
