from rest_framework import serializers

from .models import AIJob


class AIJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIJob
        fields = [
            "id",
            "provider",
            "model",
            "status",
            "result",
            "error",
            "usage",
            "duration_ms",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class CreateAIJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIJob
        fields = [
            "provider",
            "model",
            "messages",
            "json_schema",
            "extra_params",
        ]

    def validate_provider(self, value):
        valid_providers = ["openrouter", "openai"]
        if value not in valid_providers:
            raise serializers.ValidationError(f"Provider inválido. Opções: {valid_providers}")
        return value


class CreateAIBatchSerializer(serializers.Serializer):
    jobs = CreateAIJobSerializer(many=True)
