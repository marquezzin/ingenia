"""Curriculum app — URL configuration."""

from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminDashboardStatsView,
    ExerciseTestCaseViewSet,
    ExerciseViewSet,
    LessonViewSet,
    ModuleViewSet,
    StudentExerciseViewSet,
    StudentLessonViewSet,
    StudentModuleViewSet,
)

router = DefaultRouter()
router.register(r"modules", ModuleViewSet, basename="module")
router.register(r"student/modules", StudentModuleViewSet, basename="student-module")

lesson_list = LessonViewSet.as_view({"get": "list", "post": "create"})
lesson_detail = LessonViewSet.as_view(
    {"get": "retrieve", "put": "update", "delete": "destroy"}
)

exercise_list = ExerciseViewSet.as_view({"get": "list", "post": "create"})
exercise_detail = ExerciseViewSet.as_view(
    {"get": "retrieve", "put": "update", "delete": "destroy"}
)

test_case_list = ExerciseTestCaseViewSet.as_view({"get": "list", "post": "create"})
test_case_detail = ExerciseTestCaseViewSet.as_view(
    {"get": "retrieve", "put": "update", "delete": "destroy"}
)

# ─── Student nested views ────────────────────────────────────────────────────
student_lesson_list = StudentLessonViewSet.as_view({"get": "list"})
student_lesson_detail = StudentLessonViewSet.as_view({"get": "retrieve"})

student_exercise_list = StudentExerciseViewSet.as_view({"get": "list"})
student_exercise_detail = StudentExerciseViewSet.as_view({"get": "retrieve"})

urlpatterns = router.urls + [
    # ─── Lessons nested under Module ─────────────────────────────────────
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
    # ─── Exercises nested under Lesson ───────────────────────────────────
    path(
        "modules/<uuid:module_pk>/lessons/<uuid:lesson_pk>/exercises/",
        exercise_list,
        name="lesson-exercise-list",
    ),
    path(
        "modules/<uuid:module_pk>/lessons/<uuid:lesson_pk>/exercises/<uuid:pk>/",
        exercise_detail,
        name="lesson-exercise-detail",
    ),
    # ─── Test Cases nested under Exercise ────────────────────────────────
    path(
        "modules/<uuid:module_pk>/lessons/<uuid:lesson_pk>/exercises/<uuid:exercise_pk>/test-cases/",
        test_case_list,
        name="exercise-testcase-list",
    ),
    path(
        "modules/<uuid:module_pk>/lessons/<uuid:lesson_pk>/exercises/<uuid:exercise_pk>/test-cases/<uuid:pk>/",
        test_case_detail,
        name="exercise-testcase-detail",
    ),
    # ─── Admin Dashboard Stats ───────────────────────────────────────────
    path(
        "admin/stats/",
        AdminDashboardStatsView.as_view(),
        name="admin-dashboard-stats",
    ),
    # ─── Student: Lessons nested under Module ────────────────────────────
    path(
        "student/modules/<uuid:module_pk>/lessons/",
        student_lesson_list,
        name="student-module-lesson-list",
    ),
    path(
        "student/modules/<uuid:module_pk>/lessons/<uuid:pk>/",
        student_lesson_detail,
        name="student-module-lesson-detail",
    ),
    # ─── Student: Exercises nested under Lesson ──────────────────────────
    path(
        "student/modules/<uuid:module_pk>/lessons/<uuid:lesson_pk>/exercises/",
        student_exercise_list,
        name="student-lesson-exercise-list",
    ),
    path(
        "student/modules/<uuid:module_pk>/lessons/<uuid:lesson_pk>/exercises/<uuid:pk>/",
        student_exercise_detail,
        name="student-lesson-exercise-detail",
    ),
]
