"""Progress app — URLs."""

from django.urls import path

from .views import (
    MarkLessonCompletedView,
    MarkLessonStartedView,
    StudentProgressListView,
    StudentProgressModuleDetailView,
)

urlpatterns = [
    path(
        "student/progress/",
        StudentProgressListView.as_view(),
        name="student-progress-list",
    ),
    path(
        "student/progress/modules/<uuid:pk>/",
        StudentProgressModuleDetailView.as_view(),
        name="student-progress-module-detail",
    ),
    # ─── Lesson Progress by Access (ISSUE-011-F) ─────────────────────────
    path(
        "student/lessons/<uuid:pk>/mark-started/",
        MarkLessonStartedView.as_view(),
        name="student-lesson-mark-started",
    ),
    path(
        "student/lessons/<uuid:pk>/mark-completed/",
        MarkLessonCompletedView.as_view(),
        name="student-lesson-mark-completed",
    ),
]
