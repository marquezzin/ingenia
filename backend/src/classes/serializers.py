"""Classes app — Serializers."""

from rest_framework import serializers

from .models import ClassEnrollment, ClassGroup


class ClassGroupListSerializer(serializers.ModelSerializer):
    """Serializer para listagem de turmas (read-only, admin)."""

    teacher_name = serializers.SerializerMethodField()
    student_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = ClassGroup
        fields = [
            "id",
            "name",
            "class_status",
            "teacher_name",
            "student_count",
            "created_at",
        ]

    def get_teacher_name(self, obj: ClassGroup) -> str:
        return obj.teacher_profile.user.full_name


class EnrolledStudentSerializer(serializers.ModelSerializer):
    """Serializer para aluno matriculado dentro de uma turma."""

    student_name = serializers.SerializerMethodField()
    student_email = serializers.SerializerMethodField()

    class Meta:
        model = ClassEnrollment
        fields = [
            "id",
            "student_name",
            "student_email",
            "enrollment_status",
            "enrolled_at",
        ]

    def get_student_name(self, obj: ClassEnrollment) -> str:
        return obj.student_profile.user.full_name

    def get_student_email(self, obj: ClassEnrollment) -> str:
        return obj.student_profile.user.email


class ClassGroupDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalhe de turma com lista de alunos."""

    teacher_name = serializers.SerializerMethodField()
    teacher_email = serializers.SerializerMethodField()
    students = serializers.SerializerMethodField()

    class Meta:
        model = ClassGroup
        fields = [
            "id",
            "name",
            "description",
            "class_status",
            "teacher_name",
            "teacher_email",
            "students",
            "created_at",
            "updated_at",
        ]

    def get_teacher_name(self, obj: ClassGroup) -> str:
        return obj.teacher_profile.user.full_name

    def get_teacher_email(self, obj: ClassGroup) -> str:
        return obj.teacher_profile.user.email

    def get_students(self, obj: ClassGroup) -> list:
        from .selectors import list_enrollments_for_class_group

        enrollments = list_enrollments_for_class_group(class_group_id=str(obj.id))
        return EnrolledStudentSerializer(enrollments, many=True).data


class ClassGroupCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer de escrita para professor criar/editar turmas."""

    class Meta:
        model = ClassGroup
        fields = [
            "name",
            "description",
            "class_status",
        ]
        extra_kwargs = {
            "class_status": {"required": False},
        }


class TeacherClassGroupDetailSerializer(serializers.ModelSerializer):
    """Serializer de detalhe de turma para o professor."""

    student_count = serializers.IntegerField(read_only=True)
    students = serializers.SerializerMethodField()

    class Meta:
        model = ClassGroup
        fields = [
            "id",
            "name",
            "description",
            "class_status",
            "student_count",
            "students",
            "created_at",
            "updated_at",
        ]

    def get_students(self, obj: ClassGroup) -> list:
        from .selectors import list_enrollments_for_class_group

        enrollments = list_enrollments_for_class_group(class_group_id=str(obj.id))
        return EnrolledStudentSerializer(enrollments, many=True).data


class EnrollStudentSerializer(serializers.Serializer):
    """Serializer de escrita para associar aluno a uma turma."""

    student_profile_id = serializers.UUIDField()


class StudentSearchSerializer(serializers.Serializer):
    """Serializer de leitura para busca de alunos (usado pelo professor)."""

    student_profile_id = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()

    def get_student_profile_id(self, obj) -> str:
        return str(obj.id)

    def get_full_name(self, obj) -> str:
        return obj.user.full_name

    def get_email(self, obj) -> str:
        return obj.user.email
