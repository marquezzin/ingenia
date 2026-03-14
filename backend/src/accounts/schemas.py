"""Accounts — OpenAPI schemas para drf-spectacular."""

from drf_spectacular.utils import extend_schema

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer

register_schema = extend_schema(
    request=RegisterSerializer,
    responses={201: UserSerializer},
    summary="Registrar novo usuário",
    description="Cria um novo usuário e retorna JWT tokens.",
)

login_schema = extend_schema(
    request=LoginSerializer,
    responses={200: UserSerializer},
    summary="Login",
    description="Autentica o usuário por email e senha e retorna JWT tokens.",
)

me_schema = extend_schema(
    responses={200: UserSerializer},
    summary="Dados do usuário logado",
    description="Retorna os dados do usuário autenticado.",
)
