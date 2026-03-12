from django.contrib import admin

from .models import AIJob


@admin.register(AIJob)
class AIJobAdmin(admin.ModelAdmin):
    list_display = ["id", "provider", "model", "status", "created_at", "duration_ms"]
    list_filter = ["status", "provider", "model", "created_at"]
    search_fields = ["id", "error"]
    readonly_fields = [
        "id", "created_at", "updated_at", "result", "raw_response", 
        "usage", "duration_ms", "error"
    ]
