from unittest.mock import patch

from django.urls import reverse
from rest_framework import status

from core.testing import APITestCase
from src.accounts.tests.factories import UserFactory
from src.ai.models import AIJob
from src.ai.providers.base import AIResponse


class AIJobFlowTest(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.authenticate(self.user)
        self.url = reverse("ai-jobs-list")

    @patch("src.ai.tasks.get_provider")
    def test_create_job_triggers_task(self, mock_get_provider):
        # Mock do provider para não chamar API real
        mock_provider = mock_get_provider.return_value
        mock_provider.complete.return_value = AIResponse(
            content="Hello!",
            parsed=None,
            model="test-model",
            usage={"total_tokens": 10},
            raw={},
        )

        payload = {
            "model": "openai/gpt-4o-mini",
            "provider": "openrouter",
            "messages": [{"role": "user", "content": "Hi"}],
        }

        # 1. Cria o job via API
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        job_id = response.data["id"]

        # 2. Verifica se o job foi criado no banco
        job = AIJob.objects.get(id=job_id)
        self.assertEqual(job.status, "pending")
        self.assertEqual(job.created_by, self.user)

        # 3. Executa a task sincronicamente (simulando Celery)
        from src.ai.tasks import run_ai_job

        run_ai_job(job_id)

        # 4. Verifica se o job foi atualizado
        job.refresh_from_db()
        self.assertEqual(job.status, "success")
        self.assertEqual(job.result, "Hello!")
        self.assertIsNotNone(job.duration_ms)

    def test_list_jobs_filters_by_user(self):
        # Cria jobs para este usuário
        AIJob.objects.create(
            model="gpt-4", messages=[], created_by=self.user, status="pending"
        )
        # Cria job para outro usuário
        other_user = UserFactory()
        AIJob.objects.create(
            model="gpt-4", messages=[], created_by=other_user, status="pending"
        )

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
