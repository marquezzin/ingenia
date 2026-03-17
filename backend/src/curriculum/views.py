"""Curriculum app — Views."""

from django.db.models import Count
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import IsAdmin

from .selectors import list_modules
from .serializers import (
    ModuleCreateUpdateSerializer,
    ModuleDetailSerializer,
    ModuleListSerializer,
)
from .services import (
    CreateModuleInput,
    CreateModuleUseCase,
    DeleteModuleInput,
    DeleteModuleUseCase,
    UpdateModuleInput,
    UpdateModuleUseCase,
)


class ModuleViewSet(viewsets.ModelViewSet):
    """CRUD de módulos — acessível apenas por administradores."""

    permission_classes = [IsAuthenticated, IsAdmin]
    filterset_fields = [
        "publication_status"
    ]  # permite filtrar por status com ?publication_status=DRAFT por exemplo
    search_fields = ["title"]  # permite buscar por titulo com ?search=titulo
    ordering_fields = [
        "sequence_order"
    ]  # permite ordenar por ordem com ?ordering=sequence_order
    ordering = ["sequence_order"]  # ordem padrão

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
