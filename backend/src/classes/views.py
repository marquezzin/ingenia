"""Classes app — Views."""

from rest_framework import status, viewsets
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from core.errors import NotFoundError
from core.permissions import IsAdmin, IsTeacher

from .models import ClassGroup
from .selectors import (
    get_class_group_by_id,
    get_class_group_for_teacher,
    list_class_groups,
    list_class_groups_for_teacher,
)
from .serializers import (
    ClassGroupCreateUpdateSerializer,
    ClassGroupDetailSerializer,
    ClassGroupListSerializer,
    TeacherClassGroupDetailSerializer,
)
from .services import (
    CreateClassGroupInput,
    CreateClassGroupUseCase,
    UpdateClassGroupInput,
    UpdateClassGroupUseCase,
)


class ClassGroupAdminViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    """
    Viewset read-only de turmas para o painel admin.
    list: lista com contagem de alunos
    retrieve: detalhe com lista completa de alunos
    """

    permission_classes = [IsAuthenticated, IsAdmin]
    filterset_fields = ["class_status"]
    search_fields = ["name"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return list_class_groups()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ClassGroupDetailSerializer
        return ClassGroupListSerializer

    def get_object(self):
        pk = self.kwargs["pk"]
        try:
            obj = get_class_group_by_id(class_group_id=pk)
        except ClassGroup.DoesNotExist:
            raise NotFoundError("Turma não encontrada.")
        self.check_object_permissions(self.request, obj)
        return obj


class ClassGroupTeacherViewSet(viewsets.ModelViewSet):
    """
    CRUD de turmas para o professor autenticado.
    BR-004: Professor só vê/edita suas próprias turmas.
    Ações disponíveis: list, create, retrieve, update.
    """

    permission_classes = [IsAuthenticated, IsTeacher]
    filterset_fields = ["class_status"]
    search_fields = ["name"]
    ordering = ["-created_at"]
    http_method_names = ["get", "post", "put", "head", "options"]

    def _get_teacher_profile_id(self) -> str:
        return str(self.request.user.teacher_profile.id)

    def get_queryset(self):
        return list_class_groups_for_teacher(
            teacher_profile_id=self._get_teacher_profile_id()
        )

    def get_serializer_class(self):
        if self.action in ("create", "update"):
            return ClassGroupCreateUpdateSerializer
        if self.action == "retrieve":
            return TeacherClassGroupDetailSerializer
        return ClassGroupListSerializer

    def get_object(self):
        pk = self.kwargs["pk"]
        try:
            obj = get_class_group_for_teacher(
                class_group_id=pk,
                teacher_profile_id=self._get_teacher_profile_id(),
            )
        except ClassGroup.DoesNotExist:
            raise NotFoundError("Turma não encontrada.")
        self.check_object_permissions(self.request, obj)
        return obj

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        class_group = CreateClassGroupUseCase().execute(
            input=CreateClassGroupInput(
                teacher_profile_id=self._get_teacher_profile_id(),
                name=data["name"],
                description=data.get("description"),
            )
        )

        return Response(
            TeacherClassGroupDetailSerializer(
                self.get_queryset().get(id=class_group.id)
            ).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        class_group = UpdateClassGroupUseCase().execute(
            input=UpdateClassGroupInput(
                id=str(instance.id),
                teacher_profile_id=self._get_teacher_profile_id(),
                name=data["name"],
                description=data.get("description"),
                class_status=data.get("class_status", instance.class_status),
            )
        )

        return Response(
            TeacherClassGroupDetailSerializer(
                self.get_queryset().get(id=class_group.id)
            ).data,
        )
