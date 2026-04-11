"""Progress tests — Teacher Progress Endpoints (ISSUE-014-C)."""

import uuid

from django.utils import timezone
from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import LearningStatus, UserRole
from src.accounts.tests.factories import (
    StudentProfileFactory,
    TeacherProfileFactory,
    UserFactory,
)
from src.classes.tests.factories import ClassEnrollmentFactory, ClassGroupFactory
from src.curriculum.enums import ContentStatus
from src.curriculum.tests.factories import (
    ExerciseFactory,
    LessonFactory,
    ModuleFactory,
)
from src.progress.enums import ProgressStatus
from src.progress.tests.factories import (
    StudentExerciseProgressFactory,
    StudentLessonProgressFactory,
    StudentModuleProgressFactory,
)


def class_progress_url(class_group_id: str) -> str:
    return f"/api/v1/teacher/classes/{class_group_id}/progress/"


def student_progress_url(class_group_id: str, student_profile_id: str) -> str:
    return f"/api/v1/teacher/classes/{class_group_id}/students/{student_profile_id}/progress/"


# ─── Collective Progress Tests ───────────────────────────────────────────────


class TeacherClassProgressViewTest(APITestCase):
    """GET /api/v1/teacher/classes/:id/progress/"""

    def setUp(self):
        self.teacher_profile = TeacherProfileFactory()
        self.teacher = self.teacher_profile.user
        self.class_group = ClassGroupFactory(teacher_profile=self.teacher_profile)
        self.authenticate(self.teacher)

    def test_collective_progress_returns_200(self):
        response = self.client.get(class_progress_url(str(self.class_group.id)))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_collective_progress_empty_class(self):
        """Turma sem alunos retorna indicadores zerados."""
        response = self.client.get(class_progress_url(str(self.class_group.id)))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_students"], 0)
        self.assertEqual(response.data["students_started"], 0)
        self.assertEqual(response.data["students_completed"], 0)
        self.assertEqual(response.data["students"], [])

    def test_collective_progress_with_students(self):
        """Turma com alunos retorna indicadores agregados corretos."""
        # Aluno 1 — IN_PROGRESS
        sp1 = StudentProfileFactory(learning_status=LearningStatus.IN_PROGRESS)
        ClassEnrollmentFactory(class_group=self.class_group, student_profile=sp1)

        # Aluno 2 — COMPLETED
        sp2 = StudentProfileFactory(learning_status=LearningStatus.COMPLETED)
        ClassEnrollmentFactory(class_group=self.class_group, student_profile=sp2)

        # Aluno 3 — NOT_STARTED
        sp3 = StudentProfileFactory(learning_status=LearningStatus.NOT_STARTED)
        ClassEnrollmentFactory(class_group=self.class_group, student_profile=sp3)

        response = self.client.get(class_progress_url(str(self.class_group.id)))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_students"], 3)
        self.assertEqual(response.data["students_started"], 2)  # sp1 + sp2
        self.assertEqual(response.data["students_completed"], 1)  # sp2 only
        self.assertEqual(len(response.data["students"]), 3)

    def test_collective_progress_includes_module_and_exercise_counts(self):
        """Resumo de cada aluno inclui módulos e exercícios concluídos."""
        sp = StudentProfileFactory()
        ClassEnrollmentFactory(class_group=self.class_group, student_profile=sp)

        module = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        lesson = LessonFactory(
            module=module, publication_status=ContentStatus.PUBLISHED
        )
        exercise = ExerciseFactory(
            lesson=lesson, publication_status=ContentStatus.PUBLISHED
        )

        StudentModuleProgressFactory(
            student_profile=sp,
            module=module,
            progress_status=ProgressStatus.COMPLETED,
            started_at=timezone.now(),
            completed_at=timezone.now(),
        )
        StudentExerciseProgressFactory(
            student_profile=sp,
            exercise=exercise,
            progress_status=ProgressStatus.COMPLETED,
            attempts_count=2,
            completed_at=timezone.now(),
        )

        response = self.client.get(class_progress_url(str(self.class_group.id)))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        student = response.data["students"][0]
        self.assertEqual(student["modules_completed"], 1)
        self.assertEqual(student["exercises_completed"], 1)

    def test_collective_progress_class_info(self):
        """Resposta inclui informações da turma."""
        response = self.client.get(class_progress_url(str(self.class_group.id)))
        self.assertEqual(response.data["class_group_id"], str(self.class_group.id))
        self.assertEqual(response.data["class_name"], self.class_group.name)

    def test_br016_other_teacher_returns_404(self):
        """BR-016: Professor não vê progresso da turma de outro professor."""
        other_cg = ClassGroupFactory()
        response = self.client.get(class_progress_url(str(other_cg.id)))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_nonexistent_class_returns_404(self):
        response = self.client.get(class_progress_url(str(uuid.uuid4())))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_returns_401(self):
        self.deauthenticate()
        response = self.client.get(class_progress_url(str(self.class_group.id)))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_student_returns_403(self):
        student = UserFactory(role=UserRole.STUDENT)
        self.authenticate(student)
        response = self.client.get(class_progress_url(str(self.class_group.id)))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_returns_403(self):
        admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(admin)
        response = self.client.get(class_progress_url(str(self.class_group.id)))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_only_active_enrollments_counted(self):
        """Alunos com matrícula REMOVED não aparecem no progresso coletivo."""
        sp_active = StudentProfileFactory()
        ClassEnrollmentFactory(class_group=self.class_group, student_profile=sp_active)

        sp_removed = StudentProfileFactory()
        ClassEnrollmentFactory(
            class_group=self.class_group,
            student_profile=sp_removed,
            enrollment_status="REMOVED",
        )

        response = self.client.get(class_progress_url(str(self.class_group.id)))
        self.assertEqual(response.data["total_students"], 1)


# ─── Individual Student Progress Tests ────────────────────────────────────────


class TeacherStudentProgressViewTest(APITestCase):
    """GET /api/v1/teacher/classes/:id/students/:id/progress/"""

    def setUp(self):
        self.teacher_profile = TeacherProfileFactory()
        self.teacher = self.teacher_profile.user
        self.class_group = ClassGroupFactory(teacher_profile=self.teacher_profile)

        self.student_profile = StudentProfileFactory(
            learning_status=LearningStatus.IN_PROGRESS
        )
        self.enrollment = ClassEnrollmentFactory(
            class_group=self.class_group,
            student_profile=self.student_profile,
        )
        self.authenticate(self.teacher)

    def test_individual_progress_returns_200(self):
        response = self.client.get(
            student_progress_url(str(self.class_group.id), str(self.student_profile.id))
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_individual_progress_student_info(self):
        """Resposta inclui dados do aluno."""
        response = self.client.get(
            student_progress_url(str(self.class_group.id), str(self.student_profile.id))
        )
        self.assertEqual(
            response.data["student_name"],
            self.student_profile.user.full_name,
        )
        self.assertEqual(
            response.data["student_email"],
            self.student_profile.user.email,
        )
        self.assertEqual(
            response.data["learning_status"],
            LearningStatus.IN_PROGRESS,
        )

    def test_individual_progress_module_detail(self):
        """Progresso detalhado inclui módulos com lições e exercícios."""
        module = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        lesson = LessonFactory(
            module=module, publication_status=ContentStatus.PUBLISHED
        )
        exercise = ExerciseFactory(
            lesson=lesson, publication_status=ContentStatus.PUBLISHED
        )

        StudentModuleProgressFactory(
            student_profile=self.student_profile,
            module=module,
            progress_status=ProgressStatus.IN_PROGRESS,
            started_at=timezone.now(),
        )
        StudentLessonProgressFactory(
            student_profile=self.student_profile,
            lesson=lesson,
            progress_status=ProgressStatus.COMPLETED,
            started_at=timezone.now(),
            completed_at=timezone.now(),
        )
        StudentExerciseProgressFactory(
            student_profile=self.student_profile,
            exercise=exercise,
            progress_status=ProgressStatus.COMPLETED,
            attempts_count=3,
            completed_at=timezone.now(),
        )

        response = self.client.get(
            student_progress_url(str(self.class_group.id), str(self.student_profile.id))
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        modules = response.data["modules"]
        self.assertEqual(len(modules), 1)

        mod = modules[0]
        self.assertEqual(mod["module_title"], module.title)
        self.assertEqual(mod["progress_status"], ProgressStatus.IN_PROGRESS)
        self.assertEqual(mod["total_lessons"], 1)
        self.assertEqual(mod["completed_lessons"], 1)
        self.assertEqual(mod["total_exercises"], 1)
        self.assertEqual(mod["completed_exercises"], 1)

        # Lesson nested inside module
        self.assertEqual(len(mod["lessons"]), 1)
        les = mod["lessons"][0]
        self.assertEqual(les["lesson_title"], lesson.title)
        self.assertEqual(les["progress_status"], ProgressStatus.COMPLETED)

        # Exercise nested inside lesson
        self.assertEqual(len(les["exercises"]), 1)
        ex = les["exercises"][0]
        self.assertEqual(ex["exercise_title"], exercise.title)
        self.assertEqual(ex["progress_status"], ProgressStatus.COMPLETED)
        self.assertEqual(ex["attempts_count"], 3)

    def test_individual_progress_no_progress_records(self):
        """Aluno sem progresso retorna módulos com NOT_STARTED."""
        ModuleFactory(publication_status=ContentStatus.PUBLISHED)

        response = self.client.get(
            student_progress_url(str(self.class_group.id), str(self.student_profile.id))
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        modules = response.data["modules"]
        self.assertEqual(len(modules), 1)
        self.assertEqual(modules[0]["progress_status"], ProgressStatus.NOT_STARTED)

    def test_br016_other_teacher_class_returns_404(self):
        """BR-016: Professor não vê progresso de aluno em turma alheia."""
        other_cg = ClassGroupFactory()
        student_profile = StudentProfileFactory()
        ClassEnrollmentFactory(class_group=other_cg, student_profile=student_profile)

        response = self.client.get(
            student_progress_url(str(other_cg.id), str(student_profile.id))
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_student_not_in_class_returns_404(self):
        """Aluno não matriculado na turma retorna 404."""
        other_sp = StudentProfileFactory()

        response = self.client.get(
            student_progress_url(str(self.class_group.id), str(other_sp.id))
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_nonexistent_class_returns_404(self):
        response = self.client.get(
            student_progress_url(str(uuid.uuid4()), str(self.student_profile.id))
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_nonexistent_student_returns_404(self):
        response = self.client.get(
            student_progress_url(str(self.class_group.id), str(uuid.uuid4()))
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_returns_401(self):
        self.deauthenticate()
        response = self.client.get(
            student_progress_url(str(self.class_group.id), str(self.student_profile.id))
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_student_returns_403(self):
        student = UserFactory(role=UserRole.STUDENT)
        self.authenticate(student)
        response = self.client.get(
            student_progress_url(str(self.class_group.id), str(self.student_profile.id))
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_returns_403(self):
        admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(admin)
        response = self.client.get(
            student_progress_url(str(self.class_group.id), str(self.student_profile.id))
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_draft_modules_excluded(self):
        """Módulos não publicados não aparecem no progresso individual."""
        ModuleFactory(publication_status=ContentStatus.DRAFT)
        ModuleFactory(publication_status=ContentStatus.PUBLISHED)

        response = self.client.get(
            student_progress_url(str(self.class_group.id), str(self.student_profile.id))
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["modules"]), 1)

    def test_removed_enrollment_returns_404(self):
        """Aluno com matrícula REMOVED não é acessível."""
        sp = StudentProfileFactory()
        ClassEnrollmentFactory(
            class_group=self.class_group,
            student_profile=sp,
            enrollment_status="REMOVED",
        )

        response = self.client.get(
            student_progress_url(str(self.class_group.id), str(sp.id))
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
