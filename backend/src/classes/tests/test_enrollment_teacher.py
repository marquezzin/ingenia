"""Classes tests — Teacher Enrollment CRUD (ISSUE-014-B)."""

import uuid

from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import UserRole
from src.accounts.tests.factories import (
    StudentProfileFactory,
    TeacherProfileFactory,
    UserFactory,
)
from src.classes.enums import EnrollmentStatus
from src.classes.tests.factories import ClassEnrollmentFactory, ClassGroupFactory


def enrollments_url(class_group_id: str) -> str:
    return f"/api/v1/teacher/classes/{class_group_id}/enrollments/"


def enrollment_detail_url(class_group_id: str, enrollment_id: str) -> str:
    return f"/api/v1/teacher/classes/{class_group_id}/enrollments/{enrollment_id}/"


class EnrollmentTeacherListTest(APITestCase):
    def setUp(self):
        self.teacher_profile = TeacherProfileFactory()
        self.teacher = self.teacher_profile.user
        self.class_group = ClassGroupFactory(teacher_profile=self.teacher_profile)
        self.authenticate(self.teacher)

    def test_list_enrollments_returns_200(self):
        enrollment = ClassEnrollmentFactory(class_group=self.class_group)

        response = self.client.get(enrollments_url(str(self.class_group.id)))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(
            response.data["results"][0]["student_name"],
            enrollment.student_profile.user.full_name,
        )

    def test_list_enrollments_empty(self):
        response = self.client.get(enrollments_url(str(self.class_group.id)))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)

    def test_list_enrollments_other_teacher_returns_404(self):
        """BR-004: Professor não lista alunos de turma alheia."""
        other_cg = ClassGroupFactory()

        response = self.client.get(enrollments_url(str(other_cg.id)))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_list_enrollments_nonexistent_class_returns_404(self):
        response = self.client.get(enrollments_url(str(uuid.uuid4())))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class EnrollmentTeacherCreateTest(APITestCase):
    def setUp(self):
        self.teacher_profile = TeacherProfileFactory()
        self.teacher = self.teacher_profile.user
        self.class_group = ClassGroupFactory(teacher_profile=self.teacher_profile)
        self.authenticate(self.teacher)

    def test_enroll_student_returns_201(self):
        student_profile = StudentProfileFactory()
        data = {"student_profile_id": str(student_profile.id)}

        response = self.client.post(enrollments_url(str(self.class_group.id)), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data["student_name"],
            student_profile.user.full_name,
        )
        self.assertEqual(
            response.data["enrollment_status"],
            EnrollmentStatus.ACTIVE,
        )

    def test_enroll_duplicate_student_returns_400(self):
        """BR-005: Matrícula duplicada impedida."""
        student_profile = StudentProfileFactory()
        ClassEnrollmentFactory(
            class_group=self.class_group,
            student_profile=student_profile,
            enrollment_status=EnrollmentStatus.ACTIVE,
        )
        data = {"student_profile_id": str(student_profile.id)}

        response = self.client.post(enrollments_url(str(self.class_group.id)), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_enroll_removed_student_reactivates(self):
        """Re-matrícula de aluno removido deve reativar."""
        student_profile = StudentProfileFactory()
        enrollment = ClassEnrollmentFactory(
            class_group=self.class_group,
            student_profile=student_profile,
            enrollment_status=EnrollmentStatus.REMOVED,
        )
        data = {"student_profile_id": str(student_profile.id)}

        response = self.client.post(enrollments_url(str(self.class_group.id)), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data["enrollment_status"],
            EnrollmentStatus.ACTIVE,
        )
        # Verify same enrollment was reactivated (same ID)
        self.assertEqual(response.data["id"], str(enrollment.id))

    def test_enroll_in_other_teacher_class_returns_403(self):
        """BR-004: Professor não gerencia alunos de outra turma."""
        other_cg = ClassGroupFactory()
        student_profile = StudentProfileFactory()
        data = {"student_profile_id": str(student_profile.id)}

        response = self.client.post(enrollments_url(str(other_cg.id)), data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_enroll_without_student_id_returns_400(self):
        response = self.client.post(enrollments_url(str(self.class_group.id)), {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class EnrollmentTeacherDeleteTest(APITestCase):
    def setUp(self):
        self.teacher_profile = TeacherProfileFactory()
        self.teacher = self.teacher_profile.user
        self.class_group = ClassGroupFactory(teacher_profile=self.teacher_profile)
        self.authenticate(self.teacher)

    def test_remove_student_returns_204(self):
        enrollment = ClassEnrollmentFactory(class_group=self.class_group)

        response = self.client.delete(
            enrollment_detail_url(str(self.class_group.id), str(enrollment.id))
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Verify soft-delete (status changed to REMOVED)
        enrollment.refresh_from_db()
        self.assertEqual(enrollment.enrollment_status, EnrollmentStatus.REMOVED)

    def test_remove_nonexistent_enrollment_returns_404(self):
        response = self.client.delete(
            enrollment_detail_url(str(self.class_group.id), str(uuid.uuid4()))
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_remove_enrollment_from_other_teacher_class_returns_403(self):
        """BR-004: Professor não remove aluno de turma alheia."""
        other_cg = ClassGroupFactory()
        enrollment = ClassEnrollmentFactory(class_group=other_cg)

        response = self.client.delete(
            enrollment_detail_url(str(other_cg.id), str(enrollment.id))
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class EnrollmentTeacherPermissionTest(APITestCase):
    def setUp(self):
        self.class_group = ClassGroupFactory()

    def test_unauthenticated_returns_401(self):
        response = self.client.get(enrollments_url(str(self.class_group.id)))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_student_returns_403(self):
        student = UserFactory(role=UserRole.STUDENT)
        self.authenticate(student)
        response = self.client.get(enrollments_url(str(self.class_group.id)))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_returns_403(self):
        admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(admin)
        response = self.client.get(enrollments_url(str(self.class_group.id)))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
