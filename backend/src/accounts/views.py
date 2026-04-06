"""Accounts views — Auth endpoints."""

from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.errors import ApplicationError
from core.permissions import IsAdmin

from .schemas import (
    forgot_password_schema,
    login_schema,
    me_schema,
    register_schema,
    reset_password_schema,
)
from .selectors import list_users
from .serializers import (
    CustomTokenObtainPairSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UserAdminCreateSerializer,
    UserAdminDetailSerializer,
    UserAdminListSerializer,
    UserAdminUpdateSerializer,
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
from .services.user_admin import (
    CreateUserAdminInput,
    CreateUserAdminUseCase,
    UpdateUserAdminInput,
    UpdateUserAdminUseCase,
)


class RegisterView(APIView):
    authentication_classes = ()
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
    authentication_classes = ()
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
    authentication_classes = ()
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
    authentication_classes = ()
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


class UserAdminViewSet(viewsets.ModelViewSet):
    """CRUD de Users para admin."""

    permission_classes = [IsAuthenticated, IsAdmin]
    filterset_fields = ["role", "account_status"]
    search_fields = ["first_name", "last_name", "email"]
    ordering = ["-date_joined"]

    def get_queryset(self):
        return list_users()

    def get_serializer_class(self):
        if self.action == "list":
            return UserAdminListSerializer
        if self.action == "retrieve":
            return UserAdminDetailSerializer
        if self.action in ["update", "partial_update"]:
            return UserAdminUpdateSerializer
        return UserAdminCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            result = CreateUserAdminUseCase().execute(
                input=CreateUserAdminInput(
                    full_name=data["full_name"],
                    email=data["email"],
                    password=data["password"],
                    role=data["role"],
                )
            )
        except ApplicationError as e:
            return Response({"detail": e.message}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            UserAdminDetailSerializer(self.get_queryset().get(id=result.user.id)).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            result = UpdateUserAdminUseCase().execute(
                input=UpdateUserAdminInput(
                    id=str(instance.id),
                    full_name=data["full_name"],
                    email=data["email"],
                    account_status=data["account_status"],
                )
            )
        except ApplicationError as e:
            return Response({"detail": e.message}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            UserAdminDetailSerializer(self.get_queryset().get(id=result.user.id)).data,
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        return Response(
            {
                "detail": "Exclusão não permitida. Altere o status da conta para inativo."
            },
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )
