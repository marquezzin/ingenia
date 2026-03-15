"""Curriculum admin."""

from django.contrib import admin

from .models import Exercise, ExerciseTestCase, Lesson, Module, VideoLesson


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0
    fields = ["title", "sequence_order", "publication_status"]
    ordering = ["sequence_order"]


class VideoLessonInline(admin.StackedInline):
    model = VideoLesson
    extra = 0
    can_delete = True


class ExerciseInline(admin.TabularInline):
    model = Exercise
    extra = 0
    fields = ["title", "sequence_order", "publication_status"]
    ordering = ["sequence_order"]


class ExerciseTestCaseInline(admin.TabularInline):
    model = ExerciseTestCase
    extra = 0
    fields = ["name", "input_data", "expected_output", "sequence_order", "is_hidden"]
    ordering = ["sequence_order"]


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ["title", "sequence_order", "publication_status", "created_at"]
    list_filter = ["publication_status"]
    search_fields = ["title", "description"]
    ordering = ["sequence_order"]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "module",
        "sequence_order",
        "publication_status",
        "created_at",
    ]
    list_filter = ["publication_status", "module"]
    search_fields = ["title", "written_content"]
    ordering = ["module__sequence_order", "sequence_order"]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [VideoLessonInline, ExerciseInline]


@admin.register(VideoLesson)
class VideoLessonAdmin(admin.ModelAdmin):
    list_display = ["title", "lesson", "duration_seconds", "created_at"]
    search_fields = ["title", "lesson__title"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "lesson",
        "sequence_order",
        "publication_status",
        "created_at",
    ]
    list_filter = ["publication_status"]
    search_fields = ["title", "statement"]
    ordering = [
        "lesson__module__sequence_order",
        "lesson__sequence_order",
        "sequence_order",
    ]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [ExerciseTestCaseInline]


@admin.register(ExerciseTestCase)
class ExerciseTestCaseAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "exercise",
        "sequence_order",
        "is_hidden",
        "created_at",
    ]
    list_filter = ["is_hidden"]
    search_fields = ["name", "exercise__title"]
    ordering = ["exercise__lesson__sequence_order", "sequence_order"]
    readonly_fields = ["created_at", "updated_at"]
