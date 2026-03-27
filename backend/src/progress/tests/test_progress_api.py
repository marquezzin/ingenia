"""Progress tests — API de progresso consolidado."""

import uuid

from django.utils import timezone
from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import UserRole
from src.accounts.tests.factories import (
    StudentProfileFactory,
    UserFactory,
)
from src.curriculum.enums import ContentStatus
from src.curriculum.tests.factories import ExerciseFactory, LessonFactory, ModuleFactory
from src.progress.enums import ProgressStatus
from src.progress.tests.factories import (
    StudentExerciseProgressFactory,
    StudentLessonProgressFactory,
    StudentModuleProgressFactory,
)

PROGRESS_URL = "/api/v1/student/progress/"


def module_detail_url(module_id: str) -> str:
    return f"/api/v1/student/progress/modules/{module_id}/"


class StudentProgressListViewTest(APITestCase):
    """Testes do endpoint GET /api/v1/student/progress/."""

    def setUp(self):
        self.student_user = UserFactory(role=UserRole.STUDENT)
        self.student_profile = StudentProfileFactory(user=self.student_user)
        self.now = timezone.now()

        # Criar módulos publicados
        self.module1 = ModuleFactory(
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )
        self.module2 = ModuleFactory(
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=2,
        )

        # Criar progresso para o aluno
        self.progress1 = StudentModuleProgressFactory(
            student_profile=self.student_profile,
            module=self.module1,
            progress_status=ProgressStatus.IN_PROGRESS,
            started_at=self.now,
        )
        self.progress2 = StudentModuleProgressFactory(
            student_profile=self.student_profile,
            module=self.module2,
            progress_status=ProgressStatus.COMPLETED,
            started_at=self.now,
            completed_at=self.now,
        )

    def test_list_progress_returns_200(self):
        """GET retorna 200 com lista de progresso por módulo."""
        self.authenticate(self.student_user)
        response = self.client.get(PROGRESS_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        self.assertEqual(len(response.data["results"]), 2)

    def test_list_progress_includes_module_info(self):
        """Cada item inclui informações do módulo."""
        self.authenticate(self.student_user)
        response = self.client.get(PROGRESS_URL)

        item = response.data["results"][0]
        self.assertIn("module_id", item)
        self.assertIn("module_title", item)
        self.assertIn("progress_status", item)
        self.assertIn("started_at", item)
        self.assertIn("completed_at", item)

    def test_list_progress_includes_counts(self):
        """Cada item inclui contagens de aulas/exercícios."""
        # Criar aulas e exercícios publicados
        lesson = LessonFactory(
            module=self.module1,
            publication_status=ContentStatus.PUBLISHED,
        )
        ExerciseFactory(
            lesson=lesson,
            publication_status=ContentStatus.PUBLISHED,
        )
        StudentLessonProgressFactory(
            student_profile=self.student_profile,
            lesson=lesson,
            progress_status=ProgressStatus.COMPLETED,
            started_at=self.now,
            completed_at=self.now,
        )

        self.authenticate(self.student_user)
        response = self.client.get(PROGRESS_URL)

        # Encontrar o item do module1
        item = next(
            i
            for i in response.data["results"]
            if i["module_id"] == str(self.module1.id)
        )
        self.assertEqual(item["total_lessons"], 1)
        self.assertEqual(item["completed_lessons"], 1)
        self.assertEqual(item["total_exercises"], 1)
        self.assertEqual(item["completed_exercises"], 0)

    def test_only_published_modules(self):
        """Apenas módulos publicados aparecem na lista."""
        draft_module = ModuleFactory(publication_status=ContentStatus.DRAFT)
        StudentModuleProgressFactory(
            student_profile=self.student_profile,
            module=draft_module,
            progress_status=ProgressStatus.IN_PROGRESS,
            started_at=self.now,
        )

        self.authenticate(self.student_user)
        response = self.client.get(PROGRESS_URL)

        module_ids = {item["module_id"] for item in response.data["results"]}
        self.assertNotIn(str(draft_module.id), module_ids)

    def test_br017_only_own_progress(self):
        """BR-017: Aluno vê apenas seu próprio progresso."""
        other_user = UserFactory(role=UserRole.STUDENT)
        other_profile = StudentProfileFactory(user=other_user)
        other_progress = StudentModuleProgressFactory(
            student_profile=other_profile,
            module=ModuleFactory(publication_status=ContentStatus.PUBLISHED),
            progress_status=ProgressStatus.IN_PROGRESS,
            started_at=self.now,
        )

        self.authenticate(self.student_user)
        response = self.client.get(PROGRESS_URL)

        module_ids = {item["module_id"] for item in response.data["results"]}
        self.assertNotIn(str(other_progress.module_id), module_ids)
        self.assertEqual(len(response.data["results"]), 2)

    def test_unauthenticated_returns_401(self):
        """Requisição sem autenticação retorna 401."""
        response = self.client.get(PROGRESS_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_teacher_returns_403(self):
        """Professor não pode acessar progresso de aluno."""
        teacher = UserFactory(role=UserRole.TEACHER)
        self.authenticate(teacher)
        response = self.client.get(PROGRESS_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_returns_403(self):
        """Admin não pode acessar progresso de aluno."""
        admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(admin)
        response = self.client.get(PROGRESS_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class StudentProgressModuleDetailViewTest(APITestCase):
    """Testes do endpoint GET /api/v1/student/progress/modules/<id>/."""

    def setUp(self):
        self.student_user = UserFactory(role=UserRole.STUDENT)
        self.student_profile = StudentProfileFactory(user=self.student_user)
        self.now = timezone.now()

        # Módulo publicado com aulas e exercícios
        self.module = ModuleFactory(
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )
        self.lesson1 = LessonFactory(
            module=self.module,
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )
        self.lesson2 = LessonFactory(
            module=self.module,
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=2,
        )
        self.exercise1 = ExerciseFactory(
            lesson=self.lesson1,
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=1,
        )

        # Progresso do aluno
        self.module_progress = StudentModuleProgressFactory(
            student_profile=self.student_profile,
            module=self.module,
            progress_status=ProgressStatus.IN_PROGRESS,
            started_at=self.now,
        )
        self.lesson_progress1 = StudentLessonProgressFactory(
            student_profile=self.student_profile,
            lesson=self.lesson1,
            progress_status=ProgressStatus.COMPLETED,
            started_at=self.now,
            completed_at=self.now,
        )
        self.exercise_progress1 = StudentExerciseProgressFactory(
            student_profile=self.student_profile,
            exercise=self.exercise1,
            progress_status=ProgressStatus.COMPLETED,
            attempts_count=3,
            first_attempt_at=self.now,
            completed_at=self.now,
        )

    def test_detail_returns_200(self):
        """GET retorna 200 com detalhe do progresso."""
        self.authenticate(self.student_user)
        url = module_detail_url(str(self.module.id))
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_detail_includes_module_info(self):
        """Detalhe inclui informações do módulo e progresso."""
        self.authenticate(self.student_user)
        url = module_detail_url(str(self.module.id))
        response = self.client.get(url)

        self.assertEqual(response.data["module_id"], str(self.module.id))
        self.assertEqual(response.data["module_title"], self.module.title)
        self.assertEqual(response.data["progress_status"], ProgressStatus.IN_PROGRESS)

    def test_detail_includes_counts(self):
        """Detalhe inclui contagens corretas."""
        self.authenticate(self.student_user)
        url = module_detail_url(str(self.module.id))
        response = self.client.get(url)

        self.assertEqual(response.data["total_lessons"], 2)
        self.assertEqual(response.data["completed_lessons"], 1)
        self.assertEqual(response.data["total_exercises"], 1)
        self.assertEqual(response.data["completed_exercises"], 1)

    def test_detail_includes_all_published_lessons(self):
        """Detalhe inclui todas as aulas publicadas (mesmo sem progresso)."""
        self.authenticate(self.student_user)
        url = module_detail_url(str(self.module.id))
        response = self.client.get(url)

        self.assertIn("lessons", response.data)
        self.assertEqual(len(response.data["lessons"]), 2)  # ambas publicadas

        # lesson1 tem progresso COMPLETED
        lesson1_data = response.data["lessons"][0]
        self.assertEqual(lesson1_data["lesson_id"], str(self.lesson1.id))
        self.assertEqual(lesson1_data["progress_status"], ProgressStatus.COMPLETED)

        # lesson2 sem progresso = NOT_STARTED
        lesson2_data = response.data["lessons"][1]
        self.assertEqual(lesson2_data["lesson_id"], str(self.lesson2.id))
        self.assertEqual(lesson2_data["progress_status"], "NOT_STARTED")

    def test_exercises_nested_inside_lessons(self):
        """Exercícios aninhados dentro da aula correspondente."""
        self.authenticate(self.student_user)
        url = module_detail_url(str(self.module.id))
        response = self.client.get(url)

        # lesson1 tem exercise1 com progresso
        lesson1_data = response.data["lessons"][0]
        self.assertIn("exercises", lesson1_data)
        self.assertEqual(len(lesson1_data["exercises"]), 1)
        exercise = lesson1_data["exercises"][0]
        self.assertEqual(exercise["exercise_id"], str(self.exercise1.id))
        self.assertEqual(exercise["attempts_count"], 3)

        # lesson2 sem exercícios com progresso
        lesson2_data = response.data["lessons"][1]
        self.assertEqual(len(lesson2_data["exercises"]), 0)

    def test_module_without_progress_returns_not_started(self):
        """Módulo sem progresso retorna NOT_STARTED."""
        new_module = ModuleFactory(
            publication_status=ContentStatus.PUBLISHED,
            sequence_order=10,
        )
        self.authenticate(self.student_user)
        url = module_detail_url(str(new_module.id))
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["progress_status"], "NOT_STARTED")
        self.assertIsNone(response.data["started_at"])
        self.assertIsNone(response.data["completed_at"])

    def test_nonexistent_module_returns_404(self):
        """Módulo inexistente retorna 404."""
        self.authenticate(self.student_user)
        url = module_detail_url(str(uuid.uuid4()))
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_draft_module_returns_404(self):
        """Módulo DRAFT retorna 404."""
        draft_module = ModuleFactory(publication_status=ContentStatus.DRAFT)
        self.authenticate(self.student_user)
        url = module_detail_url(str(draft_module.id))
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_br017_only_own_progress(self):
        """BR-017: Aluno vê apenas seu próprio progresso no detalhe."""
        other_user = UserFactory(role=UserRole.STUDENT)
        other_profile = StudentProfileFactory(user=other_user)

        # Outro aluno com progresso no mesmo módulo
        StudentLessonProgressFactory(
            student_profile=other_profile,
            lesson=self.lesson2,
            progress_status=ProgressStatus.COMPLETED,
            started_at=self.now,
            completed_at=self.now,
        )

        self.authenticate(self.student_user)
        url = module_detail_url(str(self.module.id))
        response = self.client.get(url)

        # Todas aulas publicadas aparecem, mas progresso é só do aluno autenticado
        self.assertEqual(len(response.data["lessons"]), 2)
        self.assertEqual(response.data["completed_lessons"], 1)

        # lesson2 mostra NOT_STARTED para o aluno autenticado (não o progresso do outro)
        lesson2_data = next(
            lesson_item
            for lesson_item in response.data["lessons"]
            if lesson_item["lesson_id"] == str(self.lesson2.id)
        )
        self.assertEqual(lesson2_data["progress_status"], "NOT_STARTED")

    def test_unauthenticated_returns_401(self):
        """Requisição sem autenticação retorna 401."""
        url = module_detail_url(str(self.module.id))
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_teacher_returns_403(self):
        """Professor não pode acessar detalhe de progresso."""
        teacher = UserFactory(role=UserRole.TEACHER)
        self.authenticate(teacher)
        url = module_detail_url(str(self.module.id))
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
