"""Curriculum app — Views."""

from django.db.models import Count
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.errors import NotFoundError
from core.permissions import IsAdmin

from .models import Exercise, Lesson, Module
from .selectors import (
    list_exercises_for_lesson,
    list_lessons_for_module,
    list_modules,
    list_test_cases_for_exercise,
)
from .serializers import (
    AdminDashboardStatsSerializer,
    ExerciseCreateUpdateSerializer,
    ExerciseDetailSerializer,
    ExerciseListSerializer,
    ExerciseTestCaseCreateUpdateSerializer,
    ExerciseTestCaseDetailSerializer,
    ExerciseTestCaseListSerializer,
    LessonCreateUpdateSerializer,
    LessonDetailSerializer,
    LessonListSerializer,
    ModuleCreateUpdateSerializer,
    ModuleDetailSerializer,
    ModuleListSerializer,
)
from .services import (
    CreateExerciseInput,
    CreateExerciseTestCaseInput,
    CreateExerciseTestCaseUseCase,
    CreateExerciseUseCase,
    CreateLessonInput,
    CreateLessonUseCase,
    CreateModuleInput,
    CreateModuleUseCase,
    DeleteExerciseInput,
    DeleteExerciseTestCaseInput,
    DeleteExerciseTestCaseUseCase,
    DeleteExerciseUseCase,
    DeleteLessonInput,
    DeleteLessonUseCase,
    DeleteModuleInput,
    DeleteModuleUseCase,
    UpdateExerciseInput,
    UpdateExerciseTestCaseInput,
    UpdateExerciseTestCaseUseCase,
    UpdateExerciseUseCase,
    UpdateLessonInput,
    UpdateLessonUseCase,
    UpdateModuleInput,
    UpdateModuleUseCase,
    VideoLessonInput,
)


class ModuleViewSet(viewsets.ModelViewSet):
    """CRUD de módulos — acessível apenas por administradores."""

    permission_classes = [IsAuthenticated, IsAdmin]
    filterset_fields = [
        "publication_status"
    ]  # permite filtrar por status com ?publication_status=DRAFT por exemplo
    search_fields = [
        "title"
    ]  # permite buscar por titulo com ?search=titulo , busca por like no BD
    ordering_fields = [
        "sequence_order"
    ]  # permite ordenar por ordem com ?ordering=sequence_order
    ordering = ["sequence_order"]  # ordem padrão na resposta

    def get_queryset(self):
        return list_modules().annotate(lesson_count=Count("lessons"))

    def get_serializer_class(self):
        if self.action == "list":
            return ModuleListSerializer
        if self.action == "retrieve":
            return ModuleDetailSerializer
        return ModuleCreateUpdateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        module = CreateModuleUseCase().execute(
            input=CreateModuleInput(
                title=data["title"],
                description=data["description"],
                sequence_order=data["sequence_order"],
                publication_status=data.get("publication_status", "DRAFT"),
            )
        )

        return Response(
            ModuleDetailSerializer(self.get_queryset().get(id=module.id)).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        module = UpdateModuleUseCase().execute(
            input=UpdateModuleInput(
                id=str(instance.id),
                title=data["title"],
                description=data["description"],
                sequence_order=data["sequence_order"],
                publication_status=data["publication_status"],
            )
        )

        return Response(
            ModuleDetailSerializer(self.get_queryset().get(id=module.id)).data,
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        DeleteModuleUseCase().execute(input=DeleteModuleInput(id=str(instance.id)))
        return Response(status=status.HTTP_204_NO_CONTENT)


class LessonViewSet(viewsets.ModelViewSet):
    """CRUD de aulas nested sob módulo — acessível apenas por administradores."""

    permission_classes = [IsAuthenticated, IsAdmin]
    filterset_fields = ["publication_status"]
    ordering = ["sequence_order"]

    # pega da própria url
    def _get_module_id(self) -> str:
        return str(self.kwargs["module_pk"])

    def _validate_module_exists(self) -> None:
        """Valida que o módulo da URL existe, lança 404 se não."""
        module_id = self._get_module_id()
        if not Module.objects.filter(id=module_id).exists():
            raise NotFoundError("Módulo não encontrado.")

    def get_queryset(self):
        module_id = self._get_module_id()
        qs = list_lessons_for_module(module_id=module_id)
        return qs.select_related("video").annotate(exercise_count=Count("exercises"))

    def get_serializer_class(self):
        if self.action == "list":
            return LessonListSerializer
        if self.action == "retrieve":
            return LessonDetailSerializer
        return LessonCreateUpdateSerializer

    def list(self, request, *args, **kwargs):
        self._validate_module_exists()
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        self._validate_module_exists()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        video_data = data.get("video_lesson")
        video_input = None
        if video_data:
            video_input = VideoLessonInput(
                title=video_data["title"],
                video_url=video_data["video_url"],
                duration_seconds=video_data.get("duration_seconds"),
            )

        lesson = CreateLessonUseCase().execute(
            input=CreateLessonInput(
                module_id=self._get_module_id(),
                title=data["title"],
                written_content=data["written_content"],
                sequence_order=data["sequence_order"],
                publication_status=data.get("publication_status", "DRAFT"),
                video_lesson=video_input,
            )
        )

        return Response(
            LessonDetailSerializer(self.get_queryset().get(id=lesson.id)).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        self._validate_module_exists()
        instance = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        video_data = data.get("video_lesson")
        video_input = None
        if video_data:
            video_input = VideoLessonInput(
                title=video_data["title"],
                video_url=video_data["video_url"],
                duration_seconds=video_data.get("duration_seconds"),
            )

        lesson = UpdateLessonUseCase().execute(
            input=UpdateLessonInput(
                id=str(instance.id),
                title=data["title"],
                written_content=data["written_content"],
                sequence_order=data["sequence_order"],
                publication_status=data["publication_status"],
                video_lesson=video_input,
            )
        )

        return Response(
            LessonDetailSerializer(self.get_queryset().get(id=lesson.id)).data,
        )

    def destroy(self, request, *args, **kwargs):
        self._validate_module_exists()
        instance = self.get_object()
        DeleteLessonUseCase().execute(input=DeleteLessonInput(id=str(instance.id)))
        return Response(status=status.HTTP_204_NO_CONTENT)


class ExerciseViewSet(viewsets.ModelViewSet):
    """CRUD de exercícios nested sob aula — acessível apenas por administradores."""

    permission_classes = [IsAuthenticated, IsAdmin]
    filterset_fields = ["publication_status"]
    ordering = ["sequence_order"]

    def _get_module_id(self) -> str:
        return str(self.kwargs["module_pk"])

    def _get_lesson_id(self) -> str:
        return str(self.kwargs["lesson_pk"])

    def _validate_parents_exist(self) -> None:
        """Valida que o módulo e a aula da URL existem."""
        module_id = self._get_module_id()
        if not Module.objects.filter(id=module_id).exists():
            raise NotFoundError("Módulo não encontrado.")

        lesson_id = self._get_lesson_id()
        if not Lesson.objects.filter(id=lesson_id, module_id=module_id).exists():
            raise NotFoundError("Aula não encontrada.")

    def get_queryset(self):
        lesson_id = self._get_lesson_id()
        return list_exercises_for_lesson(lesson_id=lesson_id).annotate(
            test_cases_count=Count("test_cases")
        )

    def get_serializer_class(self):
        if self.action == "list":
            return ExerciseListSerializer
        if self.action == "retrieve":
            return ExerciseDetailSerializer
        return ExerciseCreateUpdateSerializer

    def list(self, request, *args, **kwargs):
        self._validate_parents_exist()
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        self._validate_parents_exist()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        exercise = CreateExerciseUseCase().execute(
            input=CreateExerciseInput(
                lesson_id=self._get_lesson_id(),
                title=data["title"],
                statement=data["statement"],
                support_message=data.get("support_message"),
                sequence_order=data["sequence_order"],
                publication_status=data.get("publication_status", "DRAFT"),
            )
        )

        return Response(
            ExerciseDetailSerializer(self.get_queryset().get(id=exercise.id)).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        self._validate_parents_exist()
        instance = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        exercise = UpdateExerciseUseCase().execute(
            input=UpdateExerciseInput(
                id=str(instance.id),
                title=data["title"],
                statement=data["statement"],
                support_message=data.get("support_message"),
                sequence_order=data["sequence_order"],
                publication_status=data["publication_status"],
            )
        )

        return Response(
            ExerciseDetailSerializer(self.get_queryset().get(id=exercise.id)).data,
        )

    def destroy(self, request, *args, **kwargs):
        self._validate_parents_exist()
        instance = self.get_object()
        DeleteExerciseUseCase().execute(input=DeleteExerciseInput(id=str(instance.id)))
        return Response(status=status.HTTP_204_NO_CONTENT)


class ExerciseTestCaseViewSet(viewsets.ModelViewSet):
    """CRUD de test cases nested sob exercício — acessível apenas por administradores."""

    permission_classes = [IsAuthenticated, IsAdmin]
    ordering = ["sequence_order"]

    def _get_module_id(self) -> str:
        return str(self.kwargs["module_pk"])

    def _get_lesson_id(self) -> str:
        return str(self.kwargs["lesson_pk"])

    def _get_exercise_id(self) -> str:
        return str(self.kwargs["exercise_pk"])

    def _validate_parents_exist(self) -> None:
        """Valida que módulo, aula e exercício da URL existem."""
        module_id = self._get_module_id()
        if not Module.objects.filter(id=module_id).exists():
            raise NotFoundError("Módulo não encontrado.")

        lesson_id = self._get_lesson_id()
        if not Lesson.objects.filter(id=lesson_id, module_id=module_id).exists():
            raise NotFoundError("Aula não encontrada.")

        exercise_id = self._get_exercise_id()
        if not Exercise.objects.filter(id=exercise_id, lesson_id=lesson_id).exists():
            raise NotFoundError("Exercício não encontrado.")

    def get_queryset(self):
        exercise_id = self._get_exercise_id()
        return list_test_cases_for_exercise(exercise_id=exercise_id)

    def get_serializer_class(self):
        if self.action == "list":
            return ExerciseTestCaseListSerializer
        if self.action == "retrieve":
            return ExerciseTestCaseDetailSerializer
        return ExerciseTestCaseCreateUpdateSerializer

    def list(self, request, *args, **kwargs):
        self._validate_parents_exist()
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        self._validate_parents_exist()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        test_case = CreateExerciseTestCaseUseCase().execute(
            input=CreateExerciseTestCaseInput(
                exercise_id=self._get_exercise_id(),
                name=data["name"],
                input_data=data.get("input_data"),
                expected_output=data["expected_output"],
                sequence_order=data["sequence_order"],
                is_hidden=data.get("is_hidden", False),
            )
        )

        return Response(
            ExerciseTestCaseDetailSerializer(
                self.get_queryset().get(id=test_case.id)
            ).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        self._validate_parents_exist()
        instance = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        test_case = UpdateExerciseTestCaseUseCase().execute(
            input=UpdateExerciseTestCaseInput(
                id=str(instance.id),
                name=data["name"],
                input_data=data.get("input_data"),
                expected_output=data["expected_output"],
                sequence_order=data["sequence_order"],
                is_hidden=data.get("is_hidden", False),
            )
        )

        return Response(
            ExerciseTestCaseDetailSerializer(
                self.get_queryset().get(id=test_case.id)
            ).data,
        )

    def destroy(self, request, *args, **kwargs):
        self._validate_parents_exist()
        instance = self.get_object()
        DeleteExerciseTestCaseUseCase().execute(
            input=DeleteExerciseTestCaseInput(id=str(instance.id))
        )
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminDashboardStatsView(APIView):
    """Estatísticas agregadas para o dashboard admin."""

    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = AdminDashboardStatsSerializer

    def get(self, request):
        from src.accounts.models import User

        stats = {
            "total_modules": Module.objects.count(),
            "total_lessons": Lesson.objects.count(),
            "total_exercises": Exercise.objects.count(),
            "total_users": User.objects.count(),
        }
        serializer = AdminDashboardStatsSerializer(stats)
        return Response(serializer.data)
