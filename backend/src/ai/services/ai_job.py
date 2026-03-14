from dataclasses import dataclass
from typing import Any

from src.ai.models import AIJob
from src.ai.tasks import run_ai_job, run_ai_jobs_batch


@dataclass
class CreateAIJobInput:
    model: str
    messages: list[dict]
    provider: str = "openrouter"
    json_schema: dict | None = None
    extra_params: dict | None = None
    user: Any | None = None


@dataclass
class CreateAIJobResult:
    job: AIJob


class CreateAIJobUseCase:
    def execute(self, *, input: CreateAIJobInput) -> CreateAIJobResult:
        job = AIJob.objects.create(
            provider=input.provider,
            model=input.model,
            messages=input.messages,
            json_schema=input.json_schema,
            extra_params=input.extra_params or {},
            created_by=input.user,
            status="pending",
        )

        # Dispara task do Celery
        run_ai_job.delay(str(job.id))

        return CreateAIJobResult(job=job)


@dataclass
class CreateBatchAIJobsInput:
    jobs: list[CreateAIJobInput]


@dataclass
class CreateBatchAIJobsResult:
    jobs: list[AIJob]


class CreateBatchAIJobsUseCase:
    def execute(self, *, input: CreateBatchAIJobsInput) -> CreateBatchAIJobsResult:
        jobs_to_create = []
        for job_input in input.jobs:
            jobs_to_create.append(
                AIJob(
                    provider=job_input.provider,
                    model=job_input.model,
                    messages=job_input.messages,
                    json_schema=job_input.json_schema,
                    extra_params=job_input.extra_params or {},
                    created_by=job_input.user,
                    status="pending",
                )
            )

        # Bulk create é mais eficiente
        created_jobs = AIJob.objects.bulk_create(jobs_to_create)

        # Dispara batch task (que vai paralelizar)
        job_ids = [str(job.id) for job in created_jobs]
        run_ai_jobs_batch.delay(job_ids)

        return CreateBatchAIJobsResult(jobs=created_jobs)
