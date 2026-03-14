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
        """Cria usuários de desenvolvimento com roles e profiles."""
        from src.accounts.enums import AccountStatus, UserRole
        from src.accounts.models import AdminProfile, StudentProfile, User

        # Admin
        admin, created = User.objects.get_or_create(
            email="admin@hub.dev",
            defaults={
                "username": "admin",
                "first_name": "Admin",
                "last_name": "Hub",
                "role": UserRole.ADMIN,
                "account_status": AccountStatus.ACTIVE,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if created:
            admin.set_password("admin123")
            admin.save()
            self.stdout.write("  ✓ Superusuário criado: admin@hub.dev / admin123")
        else:
            # Atualiza role caso já exista sem o role correto
            if admin.role != UserRole.ADMIN:
                admin.role = UserRole.ADMIN
                admin.save(update_fields=["role"])
            self.stdout.write("  - Superusuário já existe.")

        AdminProfile.objects.get_or_create(user=admin)

        # Usuário comum (aluno)
        student, created = User.objects.get_or_create(
            email="user@hub.dev",
            defaults={
                "username": "user",
                "first_name": "Usuário",
                "last_name": "Teste",
                "role": UserRole.STUDENT,
                "account_status": AccountStatus.ACTIVE,
            },
        )
        if created:
            student.set_password("user123")
            student.save()
            self.stdout.write("  ✓ Aluno criado: user@hub.dev / user123")
        else:
            self.stdout.write("  - Aluno já existe.")

        StudentProfile.objects.get_or_create(user=student)
