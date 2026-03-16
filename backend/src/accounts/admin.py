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
    max_num = 1


class TeacherProfileInline(admin.StackedInline):
    model = TeacherProfile
    can_delete = False
    verbose_name = "Perfil de Professor"
    verbose_name_plural = "Perfil de Professor"
    extra = 0
    max_num = 1


class AdminProfileInline(admin.StackedInline):
    model = AdminProfile
    can_delete = False
    verbose_name = "Perfil de Administrador"
    verbose_name_plural = "Perfil de Administrador"
    extra = 0
    max_num = 1


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

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return []

        from .enums import UserRole

        inline_instances = []
        for inline_class in self.inlines:
            if inline_class == StudentProfileInline and obj.role == UserRole.STUDENT:
                inline_instances.append(inline_class(self.model, self.admin_site))
            elif inline_class == TeacherProfileInline and obj.role == UserRole.TEACHER:
                inline_instances.append(inline_class(self.model, self.admin_site))
            elif inline_class == AdminProfileInline and obj.role == UserRole.ADMIN:
                inline_instances.append(inline_class(self.model, self.admin_site))

        return inline_instances


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
