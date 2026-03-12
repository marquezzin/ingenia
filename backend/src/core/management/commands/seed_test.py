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
        from src.accounts.models import User

        # Admin de teste
        User.objects.create_superuser(
            email="admin@test.dev",
            username="admin_test",
            password="Test@123456",
            first_name="Admin",
            last_name="Test",
        )
        self.stdout.write("  ✓ Admin: admin@test.dev / Test@123456")

        # Usuário comum de teste
        User.objects.create_user(
            email="user@test.dev",
            username="user_test",
            password="Test@123456",
            first_name="User",
            last_name="Test",
        )
        self.stdout.write("  ✓ User:  user@test.dev / Test@123456")

        # Adicione mais usuários de teste conforme necessário:
        # User.objects.create_user(
        #     email="viewer@test.dev",
        #     username="viewer_test",
        #     password="Test@123456",
        # )
