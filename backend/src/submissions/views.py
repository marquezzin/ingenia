"""Submissions app — Views."""

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsStudent

from .serializers import SubmissionCreateSerializer, SubmissionResponseSerializer
from .services import CreateSubmissionInput, CreateSubmissionUseCase


class StudentSubmissionCreateView(APIView):
    """Endpoint de submissão de código pelo aluno.

    POST /api/v1/student/submissions/
    Recebe o código e resultado já avaliado pelo Skulpt.
    """

    permission_classes = [IsAuthenticated, IsStudent]
    serializer_class = SubmissionCreateSerializer

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
