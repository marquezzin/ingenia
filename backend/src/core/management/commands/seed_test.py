"""
Seed de teste — popula o banco com dados determinísticos para E2E.

Este comando cria SEMPRE os mesmos dados, independente do estado do banco.
Ideal para rodar antes de testes E2E, garantindo um estado conhecido.

Uso:
    # Via Makefile
    make test-seed

    # Direto
    docker compose -f docker/compose.yml -f docker/compose.test.yml exec backend \
        uv run python manage.py seed_test
"""

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Popula o banco de teste com dados determinísticos para E2E."

    def handle(self, *args, **options):
        self.stdout.write("Populando banco de teste...")
        self._clear_all()
        self._seed_users()
        # Adicione chamadas para outros seeds aqui:
        # self._seed_<entidade>()
        self.stdout.write(self.style.SUCCESS("Banco de teste populado com sucesso!"))

    def _clear_all(self):
        """Limpa TODOS os dados do banco de teste para garantir idempotência."""
        from src.accounts.models import User

        User.objects.all().delete()
        # Adicione deletes de outros models aqui (na ordem inversa de dependências):
        # MyModel.objects.all().delete()
        self.stdout.write("  ✓ Banco limpo.")

    def _seed_users(self):
        """Cria usuários de teste com credenciais determinísticas."""
        from src.accounts.enums import AccountStatus, UserRole
        from src.accounts.models import (
            AdminProfile,
            StudentProfile,
            TeacherProfile,
            User,
        )

        password = "Test@123456"

        # ── Aluno ativo ──────────────────────────────────────────────────
        student = User.objects.create_user(
            email="student@test.dev",
            password=password,
            first_name="Aluno",
            last_name="Teste",
            role=UserRole.STUDENT,
        )
        StudentProfile.objects.create(user=student)
        self.stdout.write(f"  ✓ Student: {student.email} / {password}")

        # ── Professor ativo ──────────────────────────────────────────────
        teacher = User.objects.create_user(
            email="teacher@test.dev",
            password=password,
            first_name="Professor",
            last_name="Teste",
            role=UserRole.TEACHER,
        )
        TeacherProfile.objects.create(user=teacher)
        self.stdout.write(f"  ✓ Teacher: {teacher.email} / {password}")

        # ── Admin ────────────────────────────────────────────────────────
        admin = User.objects.create_superuser(
            email="admin@test.dev",
            password=password,
            first_name="Admin",
            last_name="Teste",
            role=UserRole.ADMIN,
        )
        AdminProfile.objects.create(user=admin)
        self.stdout.write(f"  ✓ Admin:   {admin.email} / {password}")

        # ── Aluno inativo (para testar bloqueio de login) ────────────────
        inactive = User.objects.create_user(
            email="inactive@test.dev",
            password=password,
            first_name="Inativo",
            last_name="Teste",
            role=UserRole.STUDENT,
            account_status=AccountStatus.INACTIVE,
        )
        StudentProfile.objects.create(user=inactive)
        self.stdout.write(f"  ✓ Inactive: {inactive.email} / {password}")
