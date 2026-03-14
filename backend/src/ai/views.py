from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from src.ai.models import AIJob
from src.ai.serializers import (
    AIJobSerializer,
    CreateAIBatchSerializer,
    CreateAIJobSerializer,
)
from src.ai.services.ai_job import (
    CreateAIJobInput,
    CreateAIJobUseCase,
    CreateBatchAIJobsInput,
    CreateBatchAIJobsUseCase,
)


class AIJobViewSet(ReadOnlyModelViewSet):
    queryset = AIJob.objects.all()
    serializer_class = AIJobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Usuários veem apenas seus jobs, admin vê tudo
        user = self.request.user
        if user.is_staff:
            return AIJob.objects.all()
        return AIJob.objects.filter(created_by=user)

    def create(self, request):
        serializer = CreateAIJobSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        result = CreateAIJobUseCase().execute(
            input=CreateAIJobInput(
                provider=data["provider"],
                model=data["model"],
                messages=data["messages"],
                json_schema=data.get("json_schema"),
                extra_params=data.get("extra_params"),
                user=request.user,
            )
        )

        return Response(
            AIJobSerializer(result.job).data, status=status.HTTP_202_ACCEPTED
        )

    @action(detail=False, methods=["post"], url_path="batch")
    def create_batch(self, request):
        serializer = CreateAIBatchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        jobs_input = []
        for job_data in serializer.validated_data["jobs"]:
            jobs_input.append(
                CreateAIJobInput(
                    provider=job_data["provider"],
                    model=job_data["model"],
                    messages=job_data["messages"],
                    json_schema=job_data.get("json_schema"),
                    extra_params=job_data.get("extra_params"),
                    user=request.user,
                )
            )

        result = CreateBatchAIJobsUseCase().execute(
            input=CreateBatchAIJobsInput(jobs=jobs_input)
        )

        return Response(
            AIJobSerializer(result.jobs, many=True).data,
            status=status.HTTP_202_ACCEPTED,
        )
