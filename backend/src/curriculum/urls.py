"""Curriculum app — URL configuration."""

from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ExerciseTestCaseViewSet,
    ExerciseViewSet,
    LessonViewSet,
    ModuleViewSet,
)

router = DefaultRouter()
router.register(r"modules", ModuleViewSet, basename="module")

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
]
