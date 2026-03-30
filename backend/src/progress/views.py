"""Progress app — Views."""

from rest_framework import status as http_status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.errors import ApplicationError, NotFoundError
from core.permissions import IsStudent
from src.curriculum.enums import ContentStatus
from src.curriculum.models import Lesson, Module

from .selectors import (
    count_completed_exercises_for_module,
    count_completed_lessons_for_module,
    count_published_exercises_for_module,
    count_published_lessons_for_module,
    get_module_progress_for_student,
    list_exercise_progress_for_module,
    list_lesson_progress_for_module,
    list_module_progress_for_student,
)
from .serializers import ModuleProgressDetailSerializer, ModuleProgressListSerializer
from .services import (
    MarkLessonCompletedInput,
    MarkLessonCompletedUseCase,
    MarkLessonStartedInput,
    MarkLessonStartedUseCase,
)


class StudentProgressListView(ListAPIView):
    """Progresso consolidado do aluno por módulo.

    GET /api/v1/student/progress/
    BR-017: Retorna apenas progresso do próprio aluno.
    """

    permission_classes = [IsAuthenticated, IsStudent]
    serializer_class = ModuleProgressListSerializer

    def get_queryset(self):
        return list_module_progress_for_student(
            student_profile_id=str(self.request.user.student_profile.id),
        )

    def list(self, request, *args, **kwargs):
        """Override list to inject computed counts into each progress item."""
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        items = page if page is not None else queryset

        student_profile_id = str(request.user.student_profile.id)
        data = []
        for progress in items:
            module_id = str(progress.module_id)
            item_data = {
                "module": progress.module,
                "progress_status": progress.progress_status,
                "started_at": progress.started_at,
                "completed_at": progress.completed_at,
                "total_lessons": count_published_lessons_for_module(
                    module_id=module_id
                ),
                "completed_lessons": count_completed_lessons_for_module(
                    student_profile_id=student_profile_id,
                    module_id=module_id,
                ),
                "total_exercises": count_published_exercises_for_module(
                    module_id=module_id
                ),
                "completed_exercises": count_completed_exercises_for_module(
                    student_profile_id=student_profile_id,
                    module_id=module_id,
                ),
            }
            data.append(item_data)

        serializer = self.get_serializer(data, many=True)
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)


class StudentProgressModuleDetailView(APIView):
    """Progresso detalhado de um módulo para o aluno.

    GET /api/v1/student/progress/modules/<uuid:pk>/
    Exercícios aninhados dentro de cada aula.
    BR-017: Retorna apenas progresso do próprio aluno.
    """

    permission_classes = [IsAuthenticated, IsStudent]
    serializer_class = ModuleProgressDetailSerializer

    def get(self, request, pk):
        # Validar que o módulo existe e está publicado
        if not Module.objects.filter(
            id=pk, publication_status=ContentStatus.PUBLISHED
        ).exists():
            raise NotFoundError("Módulo não encontrado.")

        student_profile_id = str(request.user.student_profile.id)
        module_id = str(pk)

        module = Module.objects.get(id=pk)

        # Progresso no módulo (pode não existir se aluno nunca iniciou)
        module_progress = get_module_progress_for_student(
            student_profile_id=student_profile_id,
            module_id=module_id,
        )

        # Progresso de aulas — indexar por lesson_id
        lesson_progress_qs = list_lesson_progress_for_module(
            student_profile_id=student_profile_id,
            module_id=module_id,
        )
        lesson_progress_map = {str(lp.lesson_id): lp for lp in lesson_progress_qs}

        # Progresso de exercícios — agrupar por lesson_id
        exercise_progress_qs = list_exercise_progress_for_module(
            student_profile_id=student_profile_id,
            module_id=module_id,
        )
        exercises_by_lesson: dict[str, list] = {}
        for ep in exercise_progress_qs:
            lid = str(ep.exercise.lesson_id)
            exercises_by_lesson.setdefault(lid, []).append(ep)

        # Aulas publicadas do módulo
        published_lessons = Lesson.objects.filter(
            module_id=module_id,
            publication_status=ContentStatus.PUBLISHED,
        ).order_by("sequence_order")

        # Montar lista nested: cada aula com seus exercícios
        lessons_data = []
        for lesson in published_lessons:
            lid = str(lesson.id)
            lp = lesson_progress_map.get(lid)
            lessons_data.append(
                {
                    "lesson_id": lesson.id,
                    "lesson_title": lesson.title,
                    "progress_status": lp.progress_status if lp else "NOT_STARTED",
                    "started_at": lp.started_at if lp else None,
                    "completed_at": lp.completed_at if lp else None,
                    "exercises": exercises_by_lesson.get(lid, []),
                }
            )

        detail_data = {
            "module_id": module.id,
            "module_title": module.title,
            "progress_status": (
                module_progress.progress_status if module_progress else "NOT_STARTED"
            ),
            "started_at": module_progress.started_at if module_progress else None,
            "completed_at": module_progress.completed_at if module_progress else None,
            "total_lessons": count_published_lessons_for_module(
                module_id=module_id,
            ),
            "completed_lessons": count_completed_lessons_for_module(
                student_profile_id=student_profile_id,
                module_id=module_id,
            ),
            "total_exercises": count_published_exercises_for_module(
                module_id=module_id,
            ),
            "completed_exercises": count_completed_exercises_for_module(
                student_profile_id=student_profile_id,
                module_id=module_id,
            ),
            "lessons": lessons_data,
        }

        serializer = ModuleProgressDetailSerializer(detail_data)
        return Response(serializer.data)


# ─── Lesson Progress by Access (ISSUE-011-F) ─────────────────────────────────


class MarkLessonStartedView(APIView):
    """Marca aula como IN_PROGRESS ao acessar.

    POST /api/v1/student/lessons/<uuid:pk>/mark-started/
    ISSUE-011-F: Registra progresso de aula independente de submissão.
    """

    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request, pk):
        try:
            MarkLessonStartedUseCase().execute(
                input=MarkLessonStartedInput(
                    student_profile_id=str(request.user.student_profile.id),
                    lesson_id=str(pk),
                )
            )
        except NotFoundError as e:
            return Response({"detail": str(e)}, status=http_status.HTTP_404_NOT_FOUND)

        return Response(
            {"detail": "Aula marcada como iniciada."},
            status=http_status.HTTP_200_OK,
        )


class MarkLessonCompletedView(APIView):
    """Marca aula como COMPLETED — apenas aulas sem exercícios publicados.

    POST /api/v1/student/lessons/<uuid:pk>/mark-completed/
    ISSUE-011-F: Permite conclusão explícita pelo aluno.
    """

    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request, pk):
        try:
            MarkLessonCompletedUseCase().execute(
                input=MarkLessonCompletedInput(
                    student_profile_id=str(request.user.student_profile.id),
                    lesson_id=str(pk),
                )
            )
        except NotFoundError as e:
            return Response({"detail": str(e)}, status=http_status.HTTP_404_NOT_FOUND)
        except ApplicationError as e:
            return Response({"detail": str(e)}, status=http_status.HTTP_400_BAD_REQUEST)

        return Response(
            {"detail": "Aula marcada como concluída."},
            status=http_status.HTTP_200_OK,
        )
