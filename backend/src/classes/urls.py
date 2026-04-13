"""Classes app — URLs."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from src.progress.views import TeacherClassProgressView, TeacherStudentProgressView

from .views import (
    ClassEnrollmentTeacherViewSet,
    ClassGroupAdminViewSet,
    ClassGroupTeacherViewSet,
    StudentSearchView,
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
    # ─── Teacher Progress (ISSUE-014-C) ───────────────────────────────────
    path(
        "teacher/classes/<uuid:class_pk>/progress/",
        TeacherClassProgressView.as_view(),
        name="teacher-class-progress",
    ),
    path(
        "teacher/classes/<uuid:class_pk>/students/<uuid:student_pk>/progress/",
        TeacherStudentProgressView.as_view(),
        name="teacher-student-progress",
    ),
    # ─── Teacher Student Search (ISSUE-015-B) ─────────────────────────────
    path(
        "teacher/students/search/",
        StudentSearchView.as_view(),
        name="teacher-student-search",
    ),
]
