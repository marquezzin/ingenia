"""Classes app — URLs."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ClassEnrollmentTeacherViewSet,
    ClassGroupAdminViewSet,
    ClassGroupTeacherViewSet,
)

router = DefaultRouter()
router.register("admin/classes", ClassGroupAdminViewSet, basename="admin-classes")
router.register("teacher/classes", ClassGroupTeacherViewSet, basename="teacher-classes")

enrollment_router = DefaultRouter()
enrollment_router.register(
    "enrollments",
    ClassEnrollmentTeacherViewSet,
    basename="teacher-class-enrollments",
)

urlpatterns = router.urls + [
    path(
        "teacher/classes/<uuid:class_pk>/",
        include(enrollment_router.urls),
    ),
]
