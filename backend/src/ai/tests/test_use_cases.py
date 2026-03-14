from unittest.mock import patch

from django.test import TestCase

from src.accounts.tests.factories import UserFactory
from src.ai.services.ai_job import (
    CreateAIJobInput,
    CreateAIJobUseCase,
    CreateBatchAIJobsInput,
    CreateBatchAIJobsUseCase,
)


class CreateAIJobUseCaseTest(TestCase):
    def setUp(self):
        self.user = UserFactory()

    @patch("src.ai.services.ai_job.run_ai_job.delay")
    def test_create_ai_job_successfully(self, mock_run_job):
        input_data = CreateAIJobInput(
            model="gpt-4",
            messages=[{"role": "user", "content": "Hello"}],
            user=self.user,
        )

        result = CreateAIJobUseCase().execute(input=input_data)

        self.assertEqual(result.job.model, "gpt-4")
        self.assertEqual(result.job.status, "pending")
        self.assertEqual(result.job.created_by, self.user)

        # Verifica se a task do Celery foi chamada corretamente
        mock_run_job.assert_called_once_with(str(result.job.id))


class CreateBatchAIJobsUseCaseTest(TestCase):
    def setUp(self):
        self.user = UserFactory()

    @patch("src.ai.services.ai_job.run_ai_jobs_batch.delay")
    def test_create_batch_ai_jobs_successfully(self, mock_run_batch):
        jobs_input = [
            CreateAIJobInput(
                model="gpt-4",
                messages=[{"role": "user", "content": f"Hello {i}"}],
                user=self.user,
            )
            for i in range(3)
        ]

        input_data = CreateBatchAIJobsInput(jobs=jobs_input)

        result = CreateBatchAIJobsUseCase().execute(input=input_data)

        self.assertEqual(len(result.jobs), 3)
        for job in result.jobs:
            self.assertEqual(job.model, "gpt-4")
            self.assertEqual(job.status, "pending")

        # Verifica se a task de batch foi chamada com a lista de IDs
        job_ids = [str(job.id) for job in result.jobs]
        mock_run_batch.assert_called_once_with(job_ids)
