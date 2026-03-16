"""Accounts views — Auth endpoints."""

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.errors import ApplicationError

from .schemas import login_schema, me_schema, register_schema
from .serializers import (
    CustomTokenObtainPairSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserMeSerializer,
)
from .services.auth import (
    LoginUserInput,
    LoginUserUseCase,
    RegisterUserInput,
    RegisterUserUseCase,
)


class RegisterView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    @register_schema
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        try:
            result = RegisterUserUseCase().execute(
                input=RegisterUserInput(
                    email=data["email"],
                    username=data["username"],
                    password=data["password"],
                    first_name=data.get("first_name", ""),
                    last_name=data.get("last_name", ""),
                )
            )
        except ApplicationError as e:
            return Response({"detail": e.message}, status=status.HTTP_400_BAD_REQUEST)

        refresh = CustomTokenObtainPairSerializer.get_token(result.user)
        return Response(
            {
                "user": UserMeSerializer(result.user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    @login_schema
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        try:
            result = LoginUserUseCase().execute(
                input=LoginUserInput(
                    email=data["email"],
                    password=data["password"],
                )
            )
        except ApplicationError as e:
            return Response({"detail": e.message}, status=status.HTTP_400_BAD_REQUEST)

        refresh = CustomTokenObtainPairSerializer.get_token(result.user)
        return Response(
            {
                "user": UserMeSerializer(result.user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserMeSerializer

    @me_schema
    def get(self, request):
        return Response(UserMeSerializer(request.user).data)
