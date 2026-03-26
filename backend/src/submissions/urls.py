"""Submissions app — URLs."""

from django.urls import path

from .views import StudentSubmissionCreateView

urlpatterns = [
    path(
        "student/submissions/",
        StudentSubmissionCreateView.as_view(),
        name="student-submission-create",
    ),
]
