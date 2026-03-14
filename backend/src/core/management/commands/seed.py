"""Seed management command — popula o banco com dados iniciais."""

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Popula o banco de dados com dados iniciais para desenvolvimento."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Limpa os dados existentes antes de popular.",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write(self.style.WARNING("Limpando dados existentes..."))
            self._clear_data()

        self.stdout.write("Populando banco de dados...")
        self._seed_users()
        # Adicione chamadas para outros seeds aqui:
        # self._seed_<entidade>()
        self.stdout.write(self.style.SUCCESS("Banco populado com sucesso!"))

    def _clear_data(self):
        """Limpa dados de desenvolvimento (preserva superusuários)."""
        from src.accounts.models import User

        User.objects.filter(is_superuser=False).delete()
        self.stdout.write("  Dados limpos.")

    def _seed_users(self):
        """Cria usuários de desenvolvimento."""
        from src.accounts.models import User

        # Admin
        if not User.objects.filter(email="admin@hub.dev").exists():
            User.objects.create_superuser(
                email="admin@hub.dev",
                username="admin",
                password="admin123",
                first_name="Admin",
                last_name="Hub",
            )
            self.stdout.write("  ✓ Superusuário criado: admin@hub.dev / admin123")
        else:
            self.stdout.write("  - Superusuário já existe.")

        # Usuário comum
        if not User.objects.filter(email="user@hub.dev").exists():
            User.objects.create_user(
                email="user@hub.dev",
                username="user",
                password="user123",
                first_name="Usuário",
                last_name="Teste",
            )
            self.stdout.write("  ✓ Usuário criado: user@hub.dev / user123")
        else:
            self.stdout.write("  - Usuário já existe.")
