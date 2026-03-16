"""Core tests — Permission classes."""

from django.test import TestCase
from rest_framework.test import APIRequestFactory

from src.accounts.enums import AccountStatus, UserRole
from src.accounts.tests.factories import UserFactory
from src.core.permissions import IsActiveAccount, IsAdmin, IsStudent, IsTeacher

factory = APIRequestFactory()


def _make_request(user=None):
    """Cria um request GET fake com o usuário fornecido."""
    request = factory.get("/fake/")
    request.user = user
    return request


# ─── IsStudent ────────────────────────────────────────────────────────────────


class IsStudentPermissionTest(TestCase):
    def setUp(self):
        self.permission = IsStudent()

    def test_allows_student(self):
        user = UserFactory(role=UserRole.STUDENT)
        request = _make_request(user)
        self.assertTrue(self.permission.has_permission(request, None))

    def test_denies_teacher(self):
        user = UserFactory(role=UserRole.TEACHER)
        request = _make_request(user)
        self.assertFalse(self.permission.has_permission(request, None))

    def test_denies_admin(self):
        user = UserFactory(role=UserRole.ADMIN)
        request = _make_request(user)
        self.assertFalse(self.permission.has_permission(request, None))

    def test_denies_anonymous(self):
        from django.contrib.auth.models import AnonymousUser

        request = _make_request(AnonymousUser())
        self.assertFalse(self.permission.has_permission(request, None))


# ─── IsTeacher ────────────────────────────────────────────────────────────────


class IsTeacherPermissionTest(TestCase):
    def setUp(self):
        self.permission = IsTeacher()

    def test_allows_teacher(self):
        user = UserFactory(role=UserRole.TEACHER)
        request = _make_request(user)
        self.assertTrue(self.permission.has_permission(request, None))

    def test_denies_student(self):
        user = UserFactory(role=UserRole.STUDENT)
        request = _make_request(user)
        self.assertFalse(self.permission.has_permission(request, None))

    def test_denies_admin(self):
        user = UserFactory(role=UserRole.ADMIN)
        request = _make_request(user)
        self.assertFalse(self.permission.has_permission(request, None))

    def test_denies_anonymous(self):
        from django.contrib.auth.models import AnonymousUser

        request = _make_request(AnonymousUser())
        self.assertFalse(self.permission.has_permission(request, None))


# ─── IsAdmin ──────────────────────────────────────────────────────────────────


class IsAdminPermissionTest(TestCase):
    def setUp(self):
        self.permission = IsAdmin()

    def test_allows_admin(self):
        user = UserFactory(role=UserRole.ADMIN)
        request = _make_request(user)
        self.assertTrue(self.permission.has_permission(request, None))

    def test_denies_student(self):
        user = UserFactory(role=UserRole.STUDENT)
        request = _make_request(user)
        self.assertFalse(self.permission.has_permission(request, None))

    def test_denies_teacher(self):
        user = UserFactory(role=UserRole.TEACHER)
        request = _make_request(user)
        self.assertFalse(self.permission.has_permission(request, None))

    def test_denies_anonymous(self):
        from django.contrib.auth.models import AnonymousUser

        request = _make_request(AnonymousUser())
        self.assertFalse(self.permission.has_permission(request, None))


# ─── IsActiveAccount ─────────────────────────────────────────────────────────


class IsActiveAccountPermissionTest(TestCase):
    def setUp(self):
        self.permission = IsActiveAccount()

    def test_allows_active_account(self):
        user = UserFactory(account_status=AccountStatus.ACTIVE)
        request = _make_request(user)
        self.assertTrue(self.permission.has_permission(request, None))

    def test_denies_inactive_account(self):
        user = UserFactory(account_status=AccountStatus.INACTIVE)
        request = _make_request(user)
        self.assertFalse(self.permission.has_permission(request, None))

    def test_denies_suspended_account(self):
        user = UserFactory(account_status=AccountStatus.SUSPENDED)
        request = _make_request(user)
        self.assertFalse(self.permission.has_permission(request, None))

    def test_denies_anonymous(self):
        from django.contrib.auth.models import AnonymousUser

        request = _make_request(AnonymousUser())
        self.assertFalse(self.permission.has_permission(request, None))


# ─── Composição ───────────────────────────────────────────────────────────────


class PermissionCompositionTest(TestCase):
    """Testa que as permissions são composíveis com operadores & e |."""

    def test_admin_or_teacher_allows_teacher(self):
        composed = IsAdmin | IsTeacher
        permission = composed()
        user = UserFactory(role=UserRole.TEACHER)
        request = _make_request(user)
        self.assertTrue(permission.has_permission(request, None))

    def test_admin_or_teacher_allows_admin(self):
        composed = IsAdmin | IsTeacher
        permission = composed()
        user = UserFactory(role=UserRole.ADMIN)
        request = _make_request(user)
        self.assertTrue(permission.has_permission(request, None))

    def test_admin_or_teacher_denies_student(self):
        composed = IsAdmin | IsTeacher
        permission = composed()
        user = UserFactory(role=UserRole.STUDENT)
        request = _make_request(user)
        self.assertFalse(permission.has_permission(request, None))
