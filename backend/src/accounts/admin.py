"""Accounts admin."""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import AdminProfile, StudentProfile, TeacherProfile, User


class StudentProfileInline(admin.StackedInline):
    model = StudentProfile
    can_delete = False
    verbose_name = "Perfil de Aluno"
    verbose_name_plural = "Perfil de Aluno"
    extra = 0


class TeacherProfileInline(admin.StackedInline):
    model = TeacherProfile
    can_delete = False
    verbose_name = "Perfil de Professor"
    verbose_name_plural = "Perfil de Professor"
    extra = 0


class AdminProfileInline(admin.StackedInline):
    model = AdminProfile
    can_delete = False
    verbose_name = "Perfil de Administrador"
    verbose_name_plural = "Perfil de Administrador"
    extra = 0


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = [
        "email",
        "username",
        "first_name",
        "last_name",
        "role",
        "account_status",
        "is_staff",
        "date_joined",
    ]
    list_filter = ["role", "account_status", "is_staff", "is_active"]
    search_fields = ["email", "username", "first_name", "last_name"]
    ordering = ["-date_joined"]
    inlines = [StudentProfileInline, TeacherProfileInline, AdminProfileInline]
    fieldsets = BaseUserAdmin.fieldsets + (
        (
            "Informações adicionais",
            {"fields": ("role", "account_status", "last_login_at")},
        ),
    )
    readonly_fields = ["last_login_at"]


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "learning_status", "first_started_at", "created_at"]
    list_filter = ["learning_status"]
    search_fields = ["user__email", "user__first_name", "user__last_name"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "created_at"]
    search_fields = ["user__email", "user__first_name", "user__last_name"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "created_at"]
    search_fields = ["user__email", "user__first_name", "user__last_name"]
    readonly_fields = ["created_at", "updated_at"]
