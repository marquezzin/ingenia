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
        self._seed_curriculum()
        self.stdout.write(self.style.SUCCESS("Banco de teste populado com sucesso!"))

    def _clear_all(self):
        """Limpa TODOS os dados do banco de teste para garantir idempotência."""
        from src.accounts.models import User
        from src.curriculum.models import (
            Exercise,
            ExerciseTestCase,
            Lesson,
            Module,
            VideoLesson,
        )
        from src.progress.models import (
            StudentExerciseProgress,
            StudentLessonProgress,
            StudentModuleProgress,
        )
        from src.submissions.models import Submission, SubmissionResult

        # Limpar na ordem inversa de dependências
        SubmissionResult.objects.all().delete()
        Submission.objects.all().delete()
        StudentExerciseProgress.objects.all().delete()
        StudentLessonProgress.objects.all().delete()
        StudentModuleProgress.objects.all().delete()
        ExerciseTestCase.objects.all().delete()
        Exercise.objects.all().delete()
        VideoLesson.objects.all().delete()
        Lesson.objects.all().delete()
        Module.objects.all().delete()
        User.objects.all().delete()
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

    def _seed_curriculum(self):
        """Cria conteúdo curricular determinístico para testes E2E do aluno."""
        from src.curriculum.enums import ContentStatus
        from src.curriculum.models import (
            Exercise,
            ExerciseTestCase,
            Lesson,
            Module,
            VideoLesson,
        )

        # ── Módulo 1: Introdução ao Python ───────────────────────────────
        module = Module.objects.create(
            title="Introdução ao Python",
            description="Aprenda os fundamentos da linguagem Python: como exibir mensagens, usar variáveis e escrever seus primeiros programas.",
            sequence_order=1,
            publication_status=ContentStatus.PUBLISHED,
        )
        self.stdout.write(f"  ✓ Module: {module.title}")

        # ── Aula 1: Olá Mundo (com vídeo + exercício) ────────────────────
        lesson1 = Lesson.objects.create(
            module=module,
            title="Olá Mundo",
            written_content=(
                "# Olá Mundo!\n\n"
                "Nesta aula, você vai aprender a exibir mensagens na tela usando o comando `print()`.\n\n"
                "## O comando print\n\n"
                "O `print()` é uma **função** do Python que exibe texto no terminal.\n\n"
                "```python\n"
                'print("Hello")\n'
                "```\n\n"
                "Experimente escrever seu primeiro programa no exercício abaixo!"
            ),
            sequence_order=1,
            publication_status=ContentStatus.PUBLISHED,
        )
        self.stdout.write(f"  ✓ Lesson: {lesson1.title}")

        VideoLesson.objects.create(
            lesson=lesson1,
            title="Introdução ao print()",
            video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration_seconds=300,
        )
        self.stdout.write("  ✓ VideoLesson: Introdução ao print()")

        # ── Exercício 1: Primeiro Programa ────────────────────────────────
        exercise = Exercise.objects.create(
            lesson=lesson1,
            title="Primeiro Programa",
            statement=(
                "Escreva um programa em Python que imprima a palavra **Hello** na tela.\n\n"
                "Use o comando `print()` para exibir a mensagem."
            ),
            support_message=(
                '**Dica**: Use o comando `print("Hello")` para exibir a mensagem.'
            ),
            sequence_order=1,
            publication_status=ContentStatus.PUBLISHED,
        )
        self.stdout.write(f"  ✓ Exercise: {exercise.title}")

        # Test case visível
        ExerciseTestCase.objects.create(
            exercise=exercise,
            name="Imprime Hello",
            input_data="",
            expected_output="Hello",
            sequence_order=1,
            is_hidden=False,
        )
        self.stdout.write("  ✓ TestCase: Imprime Hello (visível)")

        # Test case oculto (para garantir robustez)
        ExerciseTestCase.objects.create(
            exercise=exercise,
            name="Imprime Hello (hidden)",
            input_data="",
            expected_output="Hello",
            sequence_order=2,
            is_hidden=True,
        )
        self.stdout.write("  ✓ TestCase: Imprime Hello (oculto)")

        # ── Aula 2: Variáveis (sem exercício — para testar "Concluir aula") ─
        lesson2 = Lesson.objects.create(
            module=module,
            title="Variáveis",
            written_content=(
                "# Variáveis\n\n"
                "Variáveis são como **caixas** que guardam informações no computador.\n\n"
                "## Criando variáveis\n\n"
                "```python\n"
                'nome = "Maria"\n'
                "idade = 14\n"
                "print(nome)\n"
                "print(idade)\n"
                "```\n\n"
                "Na próxima aula, você vai praticar com exercícios!"
            ),
            sequence_order=2,
            publication_status=ContentStatus.PUBLISHED,
        )
        self.stdout.write(f"  ✓ Lesson: {lesson2.title}")

        self.stdout.write("  ✓ Currículo de teste criado com sucesso!")
