"""Curriculum app — URL configuration."""

from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import LessonViewSet, ModuleViewSet

router = DefaultRouter()
router.register(r"modules", ModuleViewSet, basename="module")

lesson_list = LessonViewSet.as_view({"get": "list", "post": "create"})
lesson_detail = LessonViewSet.as_view(
    {"get": "retrieve", "put": "update", "delete": "destroy"}
)

urlpatterns = router.urls + [
    path(
        "modules/<uuid:module_pk>/lessons/",
        lesson_list,
        name="module-lesson-list",
    ),
    path(
        "modules/<uuid:module_pk>/lessons/<uuid:pk>/",
        lesson_detail,
        name="module-lesson-detail",
    ),
]
