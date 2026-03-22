"""Classes app — Views."""

from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

from core.errors import NotFoundError
from core.permissions import IsAdmin

from .models import ClassGroup
from .selectors import get_class_group_by_id, list_class_groups
from .serializers import ClassGroupDetailSerializer, ClassGroupListSerializer


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
