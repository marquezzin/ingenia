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


# ─── Teacher Progress Serializers (ISSUE-014-C) ──────────────────────────────


class StudentProgressSummarySerializer(serializers.Serializer):
    """Progresso resumido de um aluno — usado na visão coletiva da turma."""

    student_profile_id = serializers.UUIDField()
    student_name = serializers.CharField()
    student_email = serializers.EmailField()
    learning_status = serializers.CharField()
    modules_completed = serializers.IntegerField()
    exercises_completed = serializers.IntegerField()


class ClassProgressSerializer(serializers.Serializer):
    """Progresso coletivo de uma turma — indicadores agregados + lista de alunos."""

    class_group_id = serializers.UUIDField()
    class_name = serializers.CharField()
    total_students = serializers.IntegerField()
    students_started = serializers.IntegerField()
    students_completed = serializers.IntegerField()
    students = StudentProgressSummarySerializer(many=True)


class TeacherExerciseProgressSerializer(serializers.Serializer):
    """Progresso de exercício no contexto do professor."""

    exercise_id = serializers.UUIDField()
    exercise_title = serializers.CharField()
    progress_status = serializers.CharField()
    attempts_count = serializers.IntegerField()
    completed_at = serializers.DateTimeField()


class TeacherLessonProgressSerializer(serializers.Serializer):
    """Progresso de aula no contexto do professor, com exercícios nested."""

    lesson_id = serializers.UUIDField()
    lesson_title = serializers.CharField()
    progress_status = serializers.CharField()
    started_at = serializers.DateTimeField()
    completed_at = serializers.DateTimeField()
    exercises = TeacherExerciseProgressSerializer(many=True)


class TeacherModuleProgressSerializer(serializers.Serializer):
    """Progresso por módulo no contexto do professor — com aulas e exercícios."""

    module_id = serializers.UUIDField()
    module_title = serializers.CharField()
    progress_status = serializers.CharField()
    started_at = serializers.DateTimeField()
    completed_at = serializers.DateTimeField()
    total_lessons = serializers.IntegerField()
    completed_lessons = serializers.IntegerField()
    total_exercises = serializers.IntegerField()
    completed_exercises = serializers.IntegerField()
    lessons = TeacherLessonProgressSerializer(many=True)


class StudentDetailProgressSerializer(serializers.Serializer):
    """Progresso detalhado individual de um aluno — usado pelo professor."""

    student_profile_id = serializers.UUIDField()
    student_name = serializers.CharField()
    student_email = serializers.EmailField()
    learning_status = serializers.CharField()
    modules = TeacherModuleProgressSerializer(many=True)
