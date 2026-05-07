"""Submissions app — Serializers."""

from rest_framework import serializers

from .enums import ResultStatus, SubmissionStatus


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


# ─── Submission History Serializers ──────────────────────────────────────────


class SubmissionResultSerializer(serializers.Serializer):
    """Serializer do resultado da avaliação (nested em submissão)."""

    result_status = serializers.CharField()
    passed_tests_count = serializers.IntegerField()
    failed_tests_count = serializers.IntegerField()
    feedback_message = serializers.CharField()


class SubmissionListSerializer(serializers.Serializer):
    """Serializer de listagem de submissões do aluno."""

    id = serializers.UUIDField()
    exercise_id = serializers.UUIDField()
    exercise_title = serializers.SerializerMethodField()
    lesson_id = serializers.SerializerMethodField()
    lesson_title = serializers.SerializerMethodField()
    module_id = serializers.SerializerMethodField()
    module_title = serializers.SerializerMethodField()
    source_code = serializers.CharField()
    evaluation_status = serializers.ChoiceField(choices=SubmissionStatus.choices)
    score_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    submitted_at = serializers.DateTimeField()
    result = serializers.SerializerMethodField()

    def get_exercise_title(self, obj) -> str:
        return obj.exercise.title

    def get_lesson_id(self, obj) -> str:
        return str(obj.exercise.lesson_id)

    def get_lesson_title(self, obj) -> str:
        return obj.exercise.lesson.title

    def get_module_id(self, obj) -> str:
        return str(obj.exercise.lesson.module_id)

    def get_module_title(self, obj) -> str:
        return obj.exercise.lesson.module.title

    def get_result(self, obj) -> dict | None:
        result = getattr(obj, "result", None)
        if result is not None:
            return SubmissionResultSerializer(result).data
        return None
