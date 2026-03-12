import uuid

from django.conf import settings
from django.db import models


class AIJob(models.Model):
    """Registra cada execução de IA para rastreamento e debug."""

    STATUS_CHOICES = [
        ("pending", "Pendente"),
        ("running", "Executando"),
        ("success", "Sucesso"),
        ("failed", "Falhou"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.CharField(max_length=50, default="openrouter")
    model = models.CharField(max_length=100)
    
    # Input
    messages = models.JSONField()
    json_schema = models.JSONField(null=True, blank=True)
    extra_params = models.JSONField(default=dict, blank=True)

    # Output
    result = models.JSONField(null=True, blank=True)  # parsed result
    raw_response = models.JSONField(null=True, blank=True)  # full provider response
    error = models.TextField(null=True, blank=True)
    usage = models.JSONField(null=True, blank=True)

    # Meta
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    duration_ms = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name="ai_jobs"
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "AI Job"
        verbose_name_plural = "AI Jobs"

    def __str__(self):
        return f"{self.provider}/{self.model} - {self.status} ({self.id})"
