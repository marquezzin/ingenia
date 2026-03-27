"""Submissions app — Views."""

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsStudent

from .selectors import list_submissions_for_student
from .serializers import (
    SubmissionCreateSerializer,
    SubmissionListSerializer,
    SubmissionResponseSerializer,
)
from .services import CreateSubmissionInput, CreateSubmissionUseCase


class StudentSubmissionView(APIView):
    """Endpoint de submissões do aluno.

    GET  /api/v1/student/submissions/ — Histórico com filtros e paginação
    POST /api/v1/student/submissions/ — Cria nova submissão (Skulpt)
    """

    permission_classes = [IsAuthenticated, IsStudent]
    serializer_class = SubmissionCreateSerializer

    def get(self, request):
        student_profile_id = str(request.user.student_profile.id)
        exercise_id = request.query_params.get("exercise_id")
        evaluation_status = request.query_params.get("evaluation_status")

        queryset = list_submissions_for_student(
            student_profile_id=student_profile_id,
            exercise_id=exercise_id,
            evaluation_status=evaluation_status,
        )

        # Manual pagination using StandardPagination
        from core.pagination import StandardPagination

        paginator = StandardPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = SubmissionListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = SubmissionListSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SubmissionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        result = CreateSubmissionUseCase().execute(
            input=CreateSubmissionInput(
                exercise_id=str(data["exercise_id"]),
                student_profile_id=str(request.user.student_profile.id),
                source_code=data["source_code"],
                score_percentage=data["score_percentage"],
                passed_tests_count=data["passed_tests_count"],
                failed_tests_count=data["failed_tests_count"],
                result_status=data["result_status"],
                feedback_message=data["feedback_message"],
            )
        )

        response_serializer = SubmissionResponseSerializer(result.instance)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
