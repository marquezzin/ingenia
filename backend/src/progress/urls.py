"""Progress app — URLs."""

from django.urls import path

from .views import StudentProgressListView, StudentProgressModuleDetailView

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
]
