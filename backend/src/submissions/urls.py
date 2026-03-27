"""Submissions app — URLs."""

from django.urls import path

from .views import StudentSubmissionView

urlpatterns = [
    path(
        "student/submissions/",
        StudentSubmissionView.as_view(),
        name="student-submissions",
    ),
]
