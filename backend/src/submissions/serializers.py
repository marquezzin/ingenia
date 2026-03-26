"""Submissions app — Serializers."""

from rest_framework import serializers

from .enums import ResultStatus


class SubmissionCreateSerializer(serializers.Serializer):
    """Serializer de entrada para criação de submissão.

    Recebe o resultado já avaliado pelo frontend (Skulpt).
    """

    exercise_id = serializers.UUIDField()
    source_code = serializers.CharField(max_length=50_000)
    score_percentage = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        min_value=0,
        max_value=100,
    )
    passed_tests_count = serializers.IntegerField(min_value=0)
    failed_tests_count = serializers.IntegerField(min_value=0)
    result_status = serializers.ChoiceField(choices=ResultStatus.choices)
    feedback_message = serializers.CharField()


class SubmissionResponseSerializer(serializers.Serializer):
    """Serializer de saída após criação de submissão."""

    id = serializers.UUIDField()
    evaluation_status = serializers.CharField()
    score_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    submitted_at = serializers.DateTimeField()
