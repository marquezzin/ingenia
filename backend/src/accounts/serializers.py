"""Accounts serializers."""

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .enums import UserRole
from .models import AdminProfile, StudentProfile, TeacherProfile, User


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        return token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "role",
            "account_status",
            "date_joined",
        ]
        read_only_fields = ["id", "role", "account_status", "date_joined"]


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ["learning_status", "first_started_at"]


class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = []


class AdminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminProfile
        fields = []


class UserMeSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="get_full_name", read_only=True)
    profile_info = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "full_name",
            "role",
            "account_status",
            "date_joined",
            "profile_info",
        ]
        read_only_fields = ["id", "full_name", "role", "account_status", "date_joined"]

    def get_profile_info(self, obj):
        if obj.role == UserRole.STUDENT and hasattr(obj, "student_profile"):
            return StudentProfileSerializer(obj.student_profile).data
        elif obj.role == UserRole.TEACHER and hasattr(obj, "teacher_profile"):
            return TeacherProfileSerializer(obj.teacher_profile).data
        elif obj.role == UserRole.ADMIN and hasattr(obj, "admin_profile"):
            return AdminProfileSerializer(obj.admin_profile).data
        return None


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=300)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    def validate_password(self, value):
        """Senha deve conter ao menos um número."""
        if not any(c.isdigit() for c in value):
            raise serializers.ValidationError("A senha deve conter ao menos um número.")
        return value

    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "As senhas não coincidem."}
            )
        return data


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
