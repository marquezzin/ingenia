import time

from celery import shared_task

from src.ai.models import AIJob
from src.ai.providers import get_provider
from src.ai.providers.base import AIRequest


@shared_task(bind=True, max_retries=3, backoff_factor=2)
def run_ai_job(self, job_id: str):
    """Executa um AIJob de forma assíncrona."""
    try:
        job = AIJob.objects.get(id=job_id)
    except AIJob.DoesNotExist:
        return {"error": "Job not found"}

    if job.status in ["success", "failed"]:
        return {"status": job.status, "message": "Already processed"}

    job.status = "running"
    job.save(update_fields=["status"])

    start_time = time.time()
    try:
        provider = get_provider(job.provider)

        request = AIRequest(
            model=job.model,
            messages=job.messages,
            json_schema=job.json_schema,
            extra_params=job.extra_params,
        )

        response = provider.complete(request)

        job.result = response.parsed if response.parsed else response.content
        job.raw_response = response.raw
        job.usage = response.usage
        job.status = "success"
        job.error = None

    except Exception as e:
        job.status = "failed"
        job.error = str(e)
        # Re-raise para o Celery tentar novamente se config permitir
        # mas salvamos o erro no banco para tracking
        raise e
    finally:
        job.duration_ms = int((time.time() - start_time) * 1000)
        job.save()

    return {"status": job.status, "id": job.id}


@shared_task
def run_ai_jobs_batch(job_ids: list[str]):
    """
    Executa múltiplos jobs.
    Nota: Para paralelismo real, ideal seria disparar N tasks `run_ai_job`.
    Este task pode servir para orquestração ou para providers que suportam batch nativo (futuro).

    Por enquanto, vamos disparar sub-tasks para garantir paralelismo.
    """
    from celery import group

    job_group = group(run_ai_job.s(job_id) for job_id in job_ids)
    result = job_group.apply_async()
    return {"group_id": result.id, "count": len(job_ids)}
