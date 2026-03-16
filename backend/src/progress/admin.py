"""Progress admin."""

from django.contrib import admin

from .models import (
    StudentExerciseProgress,
    StudentLessonProgress,
    StudentModuleProgress,
)


@admin.register(StudentModuleProgress)
class StudentModuleProgressAdmin(admin.ModelAdmin):
    list_display = [
        "student_profile",
        "module",
        "progress_status",
        "started_at",
        "completed_at",
        "created_at",
    ]
    list_filter = ["progress_status"]
    search_fields = [
        "student_profile__user__email",
        "student_profile__user__first_name",
        "module__title",
    ]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(StudentLessonProgress)
class StudentLessonProgressAdmin(admin.ModelAdmin):
    list_display = [
        "student_profile",
        "lesson",
        "progress_status",
        "started_at",
        "completed_at",
        "created_at",
    ]
    list_filter = ["progress_status"]
    search_fields = [
        "student_profile__user__email",
        "student_profile__user__first_name",
        "lesson__title",
    ]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(StudentExerciseProgress)
class StudentExerciseProgressAdmin(admin.ModelAdmin):
    list_display = [
        "student_profile",
        "exercise",
        "progress_status",
        "attempts_count",
        "first_attempt_at",
        "completed_at",
        "created_at",
    ]
    list_filter = ["progress_status"]
    search_fields = [
        "student_profile__user__email",
        "student_profile__user__first_name",
        "exercise__title",
    ]
    readonly_fields = ["created_at", "updated_at"]
