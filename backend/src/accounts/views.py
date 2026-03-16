"""Accounts views — Auth endpoints."""

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.errors import ApplicationError

from .schemas import (
    forgot_password_schema,
    login_schema,
    me_schema,
    register_schema,
    reset_password_schema,
)
from .serializers import (
    CustomTokenObtainPairSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UserMeSerializer,
)
from .services.auth import (
    LoginUserInput,
    LoginUserUseCase,
    RegisterUserInput,
    RegisterUserUseCase,
)
from .services.password_reset import (
    ForgotPasswordInput,
    ForgotPasswordUseCase,
    ResetPasswordInput,
    ResetPasswordUseCase,
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
                    full_name=data["full_name"],
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


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ForgotPasswordSerializer

    @forgot_password_schema
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ForgotPasswordUseCase().execute(
            input=ForgotPasswordInput(email=serializer.validated_data["email"])
        )
        return Response(
            {"detail": "Se o e-mail estiver cadastrado, as instruções serão enviadas."}
        )


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordSerializer

    @reset_password_schema
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        try:
            ResetPasswordUseCase().execute(
                input=ResetPasswordInput(
                    token=data["token"],
                    new_password=data["new_password"],
                )
            )
        except ApplicationError as e:
            return Response({"detail": e.message}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Senha redefinida com sucesso."})
