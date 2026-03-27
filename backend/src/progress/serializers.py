"""Progress app — Serializers."""

from rest_framework import serializers


class ExerciseProgressSerializer(serializers.Serializer):
    """Progresso do aluno em um exercício."""

    exercise_id = serializers.UUIDField(source="exercise.id")
    exercise_title = serializers.CharField(source="exercise.title")
    progress_status = serializers.CharField()
    attempts_count = serializers.IntegerField()
    first_attempt_at = serializers.DateTimeField()
    completed_at = serializers.DateTimeField()


class LessonProgressSerializer(serializers.Serializer):
    """Progresso do aluno em uma aula (sem exercícios nested)."""

    lesson_id = serializers.UUIDField(source="lesson.id")
    lesson_title = serializers.CharField(source="lesson.title")
    progress_status = serializers.CharField()
    started_at = serializers.DateTimeField()
    completed_at = serializers.DateTimeField()


class LessonProgressDetailSerializer(serializers.Serializer):
    """Progresso do aluno em uma aula com exercícios nested."""

    lesson_id = serializers.UUIDField()
    lesson_title = serializers.CharField()
    progress_status = serializers.CharField()
    started_at = serializers.DateTimeField()
    completed_at = serializers.DateTimeField()
    exercises = ExerciseProgressSerializer(many=True)


class ModuleProgressListSerializer(serializers.Serializer):
    """Progresso consolidado por módulo — visão resumida."""

    module_id = serializers.UUIDField(source="module.id")
    module_title = serializers.CharField(source="module.title")
    progress_status = serializers.CharField()
    started_at = serializers.DateTimeField()
    completed_at = serializers.DateTimeField()
    total_lessons = serializers.IntegerField()
    completed_lessons = serializers.IntegerField()
    total_exercises = serializers.IntegerField()
    completed_exercises = serializers.IntegerField()


class ModuleProgressDetailSerializer(serializers.Serializer):
    """Progresso detalhado de um módulo — exercícios aninhados nas aulas."""

    module_id = serializers.UUIDField()
    module_title = serializers.CharField()
    progress_status = serializers.CharField()
    started_at = serializers.DateTimeField()
    completed_at = serializers.DateTimeField()
    total_lessons = serializers.IntegerField()
    completed_lessons = serializers.IntegerField()
    total_exercises = serializers.IntegerField()
    completed_exercises = serializers.IntegerField()
    lessons = LessonProgressDetailSerializer(many=True)
