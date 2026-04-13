"""Classes app — Views."""

from rest_framework import generics, status, viewsets
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from core.errors import NotFoundError
from core.permissions import IsAdmin, IsStudent, IsTeacher
from src.accounts.selectors import list_student_profiles

from .models import ClassEnrollment, ClassGroup
from .selectors import (
    get_class_group_by_id,
    get_class_group_for_teacher,
    list_class_groups,
    list_class_groups_for_teacher,
    list_enrollments_for_class_group,
    list_enrollments_for_student,
)
from .serializers import (
    ClassGroupCreateUpdateSerializer,
    ClassGroupDetailSerializer,
    ClassGroupListSerializer,
    EnrolledStudentSerializer,
    EnrollStudentSerializer,
    StudentMyClassSerializer,
    StudentSearchSerializer,
    TeacherClassGroupDetailSerializer,
)
from .services import (
    CreateClassGroupInput,
    CreateClassGroupUseCase,
    EnrollStudentInput,
    EnrollStudentUseCase,
    RemoveStudentInput,
    RemoveStudentUseCase,
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


class ClassEnrollmentTeacherViewSet(
    ListModelMixin, CreateModelMixin, DestroyModelMixin, GenericViewSet
):
    """
    Gestão de matrículas (enrollment) de alunos em uma turma do professor.
    BR-004: Professor só gerencia alunos das próprias turmas.
    BR-005: Sem matrícula duplicada.

    Nested sob /teacher/classes/:class_pk/enrollments/
    """

    permission_classes = [IsAuthenticated, IsTeacher]
    serializer_class = EnrolledStudentSerializer

    def _get_teacher_profile_id(self) -> str:
        return str(self.request.user.teacher_profile.id)

    def _get_class_group_id(self) -> str:
        return self.kwargs["class_pk"]

    def _verify_class_ownership(self) -> None:
        """Verifica se a turma pertence ao professor autenticado."""
        try:
            get_class_group_for_teacher(
                class_group_id=self._get_class_group_id(),
                teacher_profile_id=self._get_teacher_profile_id(),
            )
        except ClassGroup.DoesNotExist:
            raise NotFoundError("Turma não encontrada.")

    def get_queryset(self):
        return list_enrollments_for_class_group(
            class_group_id=self._get_class_group_id()
        )

    def get_serializer_class(self):
        if self.action == "create":
            return EnrollStudentSerializer
        return EnrolledStudentSerializer

    def list(self, request, *args, **kwargs):
        self._verify_class_ownership()
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = EnrollStudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        enrollment = EnrollStudentUseCase().execute(
            input=EnrollStudentInput(
                class_group_id=self._get_class_group_id(),
                teacher_profile_id=self._get_teacher_profile_id(),
                student_profile_id=str(serializer.validated_data["student_profile_id"]),
            )
        )

        # Re-fetch with select_related for serialization
        enrollment = ClassEnrollment.objects.select_related(
            "student_profile__user"
        ).get(id=enrollment.id)

        return Response(
            EnrolledStudentSerializer(enrollment).data,
            status=status.HTTP_201_CREATED,
        )

    def destroy(self, request, *args, **kwargs):
        RemoveStudentUseCase().execute(
            input=RemoveStudentInput(
                enrollment_id=self.kwargs["pk"],
                class_group_id=self._get_class_group_id(),
                teacher_profile_id=self._get_teacher_profile_id(),
            )
        )

        return Response(status=status.HTTP_204_NO_CONTENT)


class StudentSearchView(generics.ListAPIView):
    """
    Busca de alunos para o professor matricular em turmas.
    GET /api/v1/teacher/students/search/?search=<nome_ou_email>
    Retorna apenas alunos ativos com dados mínimos.
    """

    permission_classes = [IsAuthenticated, IsTeacher]
    serializer_class = StudentSearchSerializer
    search_fields = ["user__first_name", "user__last_name", "user__email"]

    def get_queryset(self):
        search = self.request.query_params.get("search", "").strip()
        return list_student_profiles(search=search or None)


class StudentMyClassesView(generics.ListAPIView):
    """
    Lista as turmas em que o aluno está matriculado.
    GET /api/v1/student/my-classes/
    """

    permission_classes = [IsAuthenticated, IsStudent]
    serializer_class = StudentMyClassSerializer
    pagination_class = None  # Aluno geralmente tem poucas turmas

    def get_queryset(self):
        student_profile_id = str(self.request.user.student_profile.id)
        return list_enrollments_for_student(student_profile_id=student_profile_id)
