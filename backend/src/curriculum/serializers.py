"""Curriculum app — Serializers."""

from rest_framework import serializers

from core.serializers import BaseModelSerializer

from .models import Exercise, ExerciseTestCase, Lesson, Module, VideoLesson

# ─── Module Serializers ───────────────────────────────────────────────────────


class ModuleListSerializer(BaseModelSerializer):
    """Campos resumidos para listagem de módulos."""

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
        ]


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


# ─── Exercise Serializers ────────────────────────────────────────────────────


class ExerciseListSerializer(BaseModelSerializer):
    """Campos resumidos para listagem de exercícios."""

    test_cases_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Exercise
        fields = [
            "id",
            "title",
            "sequence_order",
            "publication_status",
            "test_cases_count",
        ]


class ExerciseDetailSerializer(BaseModelSerializer):
    """Todos os campos + contagem de test cases para detalhe do exercício."""

    test_cases_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Exercise
        fields = [
            "id",
            "title",
            "statement",
            "support_message",
            "sequence_order",
            "publication_status",
            "test_cases_count",
            "created_at",
            "updated_at",
        ]


class ExerciseCreateUpdateSerializer(serializers.Serializer):
    """Serializer de escrita para criação/edição de exercícios."""

    title = serializers.CharField(max_length=255)
    statement = serializers.CharField()
    support_message = serializers.CharField(
        required=False, allow_null=True, allow_blank=True, default=None
    )
    sequence_order = serializers.IntegerField(min_value=1)
    publication_status = serializers.ChoiceField(
        choices=["DRAFT", "PUBLISHED", "ARCHIVED"],
        default="DRAFT",
    )


# ─── ExerciseTestCase Serializers ────────────────────────────────────────────


class ExerciseTestCaseListSerializer(BaseModelSerializer):
    """Campos resumidos para listagem de test cases."""

    class Meta:
        model = ExerciseTestCase
        fields = ["id", "name", "sequence_order", "is_hidden"]


class ExerciseTestCaseDetailSerializer(BaseModelSerializer):
    """Todos os campos para detalhe do test case."""

    class Meta:
        model = ExerciseTestCase
        fields = [
            "id",
            "name",
            "input_data",
            "expected_output",
            "sequence_order",
            "is_hidden",
            "created_at",
            "updated_at",
        ]


class ExerciseTestCaseCreateUpdateSerializer(serializers.Serializer):
    """Serializer de escrita para criação/edição de test cases."""

    name = serializers.CharField(max_length=255)
    input_data = serializers.CharField(
        required=False, allow_null=True, allow_blank=True, default=None
    )
    expected_output = serializers.CharField()
    sequence_order = serializers.IntegerField(min_value=1)
    is_hidden = serializers.BooleanField(default=False)


# ─── Admin Dashboard Stats ──────────────────────────────────────────────────


class AdminDashboardStatsSerializer(serializers.Serializer):
    """Estatísticas agregadas para o dashboard admin."""

    total_modules = serializers.IntegerField()
    total_lessons = serializers.IntegerField()
    total_exercises = serializers.IntegerField()
    total_users = serializers.IntegerField()


# ─── Student Serializers (conteúdo publicado + progresso) ─────────────────────


class StudentModuleProgressSerializer(serializers.Serializer):
    """Progresso do aluno em um módulo."""

    progress_status = serializers.CharField()
    started_at = serializers.DateTimeField()
    completed_at = serializers.DateTimeField()


class StudentLessonProgressSerializer(serializers.Serializer):
    """Progresso do aluno em uma aula."""

    progress_status = serializers.CharField()
    started_at = serializers.DateTimeField()
    completed_at = serializers.DateTimeField()


class StudentExerciseProgressSerializer(serializers.Serializer):
    """Progresso do aluno em um exercício."""

    progress_status = serializers.CharField()
    attempts_count = serializers.IntegerField()
    first_attempt_at = serializers.DateTimeField()
    completed_at = serializers.DateTimeField()


def _get_student_progress(obj, serializer_class):
    """Helper para extrair progresso do prefetch to_attr."""
    progress_list = getattr(obj, "student_progress_list", [])
    if progress_list:
        return serializer_class(progress_list[0]).data
    return None


class StudentExerciseListSerializer(BaseModelSerializer):
    """Resumo de exercício para listagem do aluno (sem test cases)."""

    progress = serializers.SerializerMethodField()

    class Meta:
        model = Exercise
        fields = ["id", "title", "sequence_order", "progress"]

    def get_progress(self, obj):
        return _get_student_progress(obj, StudentExerciseProgressSerializer)


class StudentTestCaseSerializer(BaseModelSerializer):
    """Test case para avaliação Skulpt no frontend do aluno.

    Retorna todos os campos necessários para avaliação client-side,
    incluindo expected_output (necessário para comparação no Skulpt).
    O campo is_hidden indica ao frontend que os detalhes (input/expected)
    devem ser ocultados na UI, mas os dados são enviados para avaliação.
    """

    class Meta:
        model = ExerciseTestCase
        fields = [
            "id",
            "name",
            "input_data",
            "expected_output",
            "sequence_order",
            "is_hidden",
        ]


class LastSubmissionResultSerializer(serializers.Serializer):
    """Resultado aninhado da última submissão aprovada."""

    result_status = serializers.CharField()
    passed_tests_count = serializers.IntegerField()
    failed_tests_count = serializers.IntegerField()
    feedback_message = serializers.CharField()


class LastSubmissionSerializer(serializers.Serializer):
    """Última submissão aprovada do aluno para exibir código submetido."""

    source_code = serializers.CharField()
    score_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    submitted_at = serializers.DateTimeField()
    result = serializers.SerializerMethodField()

    def get_result(self, obj) -> dict | None:
        result = getattr(obj, "result", None)
        if result is not None:
            return LastSubmissionResultSerializer(result).data
        return None


class StudentExerciseDetailSerializer(BaseModelSerializer):
    """Detalhe do exercício para aluno (com test cases para avaliação Skulpt e progresso)."""

    progress = serializers.SerializerMethodField()
    test_cases = serializers.SerializerMethodField()
    last_submission = serializers.SerializerMethodField()

    class Meta:
        model = Exercise
        fields = [
            "id",
            "title",
            "statement",
            "support_message",
            "sequence_order",
            "test_cases",
            "progress",
            "last_submission",
        ]

    def get_test_cases(self, obj):
        """Retorna test cases do exercício (prefetched na view)."""
        test_cases = getattr(obj, "published_test_cases", obj.test_cases.all())
        return StudentTestCaseSerializer(test_cases, many=True).data

    def get_progress(self, obj):
        return _get_student_progress(obj, StudentExerciseProgressSerializer)

    def get_last_submission(self, obj) -> dict | None:
        """Retorna a última submissão aprovada (PASSED), se existir."""
        submission = getattr(obj, "_last_submission", None)
        if submission is not None:
            return LastSubmissionSerializer(submission).data
        return None


class StudentLessonListSerializer(BaseModelSerializer):
    """Resumo de aula para listagem do aluno."""

    has_video = serializers.SerializerMethodField()
    exercise_count = serializers.IntegerField(read_only=True)
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "sequence_order",
            "has_video",
            "exercise_count",
            "progress",
        ]

    def get_has_video(self, obj: Lesson) -> bool:
        return hasattr(obj, "video") and obj.video is not None

    def get_progress(self, obj):
        return _get_student_progress(obj, StudentLessonProgressSerializer)


class StudentLessonDetailSerializer(BaseModelSerializer):
    """Detalhe da aula para aluno (com vídeo, exercícios publicados e progresso)."""

    video = VideoLessonSerializer(read_only=True)
    exercises = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "written_content",
            "sequence_order",
            "video",
            "exercises",
            "progress",
        ]

    def get_exercises(self, obj):
        """Retorna exercícios publicados com progresso (prefetched no view)."""
        exercises = getattr(obj, "published_exercises", [])
        return StudentExerciseListSerializer(exercises, many=True).data

    def get_progress(self, obj):
        return _get_student_progress(obj, StudentLessonProgressSerializer)


class StudentModuleListSerializer(BaseModelSerializer):
    """Resumo de módulo para listagem do aluno."""

    lesson_count = serializers.IntegerField(read_only=True)
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = [
            "id",
            "title",
            "description",
            "sequence_order",
            "lesson_count",
            "progress",
        ]

    def get_progress(self, obj):
        return _get_student_progress(obj, StudentModuleProgressSerializer)


class StudentModuleDetailSerializer(BaseModelSerializer):
    """Detalhe do módulo para aluno (com aulas publicadas e progresso)."""

    lesson_count = serializers.IntegerField(read_only=True)
    lessons = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = [
            "id",
            "title",
            "description",
            "sequence_order",
            "lesson_count",
            "lessons",
            "progress",
        ]

    def get_lessons(self, obj):
        """Retorna aulas publicadas com progresso (prefetched no view)."""
        lessons = getattr(obj, "published_lessons", [])
        return StudentLessonListSerializer(lessons, many=True).data

    def get_progress(self, obj):
        return _get_student_progress(obj, StudentModuleProgressSerializer)
