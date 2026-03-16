"""Submissions admin."""

from django.contrib import admin

from .models import Submission, SubmissionResult


class SubmissionResultInline(admin.StackedInline):
    model = SubmissionResult
    extra = 0
    verbose_name = "Resultado"
    verbose_name_plural = "Resultado"
    readonly_fields = ["created_at"]


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = [
        "student_profile",
        "exercise",
        "evaluation_status",
        "score_percentage",
        "submitted_at",
        "created_at",
    ]
    list_filter = ["evaluation_status"]
    search_fields = [
        "student_profile__user__email",
        "student_profile__user__first_name",
        "exercise__title",
    ]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [SubmissionResultInline]


@admin.register(SubmissionResult)
class SubmissionResultAdmin(admin.ModelAdmin):
    list_display = [
        "submission",
        "result_status",
        "passed_tests_count",
        "failed_tests_count",
        "created_at",
    ]
    list_filter = ["result_status"]
    search_fields = [
        "submission__student_profile__user__email",
        "submission__exercise__title",
    ]
    readonly_fields = ["created_at", "updated_at"]
