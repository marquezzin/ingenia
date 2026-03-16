"""Classes admin."""

from django.contrib import admin

from .models import ClassEnrollment, ClassGroup


class ClassEnrollmentInline(admin.TabularInline):
    model = ClassEnrollment
    extra = 0
    verbose_name = "Matrícula"
    verbose_name_plural = "Matrículas"
    readonly_fields = ["created_at"]


@admin.register(ClassGroup)
class ClassGroupAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "teacher_profile",
        "class_status",
        "created_at",
    ]
    list_filter = ["class_status"]
    search_fields = [
        "name",
        "teacher_profile__user__email",
        "teacher_profile__user__first_name",
        "teacher_profile__user__last_name",
    ]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [ClassEnrollmentInline]


@admin.register(ClassEnrollment)
class ClassEnrollmentAdmin(admin.ModelAdmin):
    list_display = [
        "student_profile",
        "class_group",
        "enrollment_status",
        "enrolled_at",
        "created_at",
    ]
    list_filter = ["enrollment_status"]
    search_fields = [
        "student_profile__user__email",
        "student_profile__user__first_name",
        "class_group__name",
    ]
    readonly_fields = ["created_at", "updated_at"]
