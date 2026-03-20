"""Curriculum tests — Admin Dashboard Stats (ISSUE-009-G)."""

from rest_framework import status

from core.testing import APITestCase
from src.accounts.enums import UserRole
from src.accounts.tests.factories import UserFactory
from src.curriculum.tests.factories import ExerciseFactory, LessonFactory, ModuleFactory

STATS_URL = "/api/v1/admin/stats/"


class AdminDashboardStatsTest(APITestCase):
    def setUp(self):
        self.admin = UserFactory(role=UserRole.ADMIN)
        self.authenticate(self.admin)

    def test_returns_200_with_correct_counts(self):
        # 3 modules standalone
        modules = ModuleFactory.create_batch(3)
        # 2 lessons under module[0] (no extra modules created)
        LessonFactory.create_batch(2, module=modules[0])
        # 4 exercises under a new lesson under module[1]
        lesson = LessonFactory(module=modules[1])
        ExerciseFactory.create_batch(4, lesson=lesson)
        # Totals: 3 modules, 3 lessons, 4 exercises, 1 user (admin)
        response = self.client.get(STATS_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_modules"], 3)
        self.assertEqual(response.data["total_lessons"], 3)
        self.assertEqual(response.data["total_exercises"], 4)
        self.assertEqual(response.data["total_users"], 1)

    def test_returns_zeros_when_empty(self):
        response = self.client.get(STATS_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_modules"], 0)
        self.assertEqual(response.data["total_lessons"], 0)
        self.assertEqual(response.data["total_exercises"], 0)
        # 1 user = o admin autenticado
        self.assertEqual(response.data["total_users"], 1)


class AdminDashboardStatsPermissionTest(APITestCase):
    def test_unauthenticated_returns_401(self):
        response = self.client.get(STATS_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_student_returns_403(self):
        student = UserFactory(role=UserRole.STUDENT)
        self.authenticate(student)
        response = self.client.get(STATS_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_teacher_returns_403(self):
        teacher = UserFactory(role=UserRole.TEACHER)
        self.authenticate(teacher)
        response = self.client.get(STATS_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
