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
        self._seed_curriculum()
        self._seed_classes()
        self._seed_progress_and_submissions()
        self.stdout.write(self.style.SUCCESS("Banco populado com sucesso!"))

    def _clear_data(self):
        """Limpa dados de desenvolvimento (preserva superusuários)."""
        from src.accounts.models import User
        from src.classes.models import ClassGroup
        from src.curriculum.models import Module

        # Remove Module e ClassGroup, o que propaga cascata (quando applicavel)
        # e garante evitar erro de UniqueConstraints.
        Module.objects.all().delete()
        ClassGroup.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()
        self.stdout.write("  Dados limpos.")

    def _seed_users(self):
        """Cria usuários de desenvolvimento com roles e profiles."""
        from src.accounts.enums import AccountStatus, UserRole
        from src.accounts.models import (
            AdminProfile,
            StudentProfile,
            TeacherProfile,
            User,
        )

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

        # Professor
        teacher_user, created_teacher = User.objects.get_or_create(
            email="teacher1@hub.dev",
            defaults={
                "username": "teacher1",
                "first_name": "Professor",
                "last_name": "Teste",
                "role": UserRole.TEACHER,
                "account_status": AccountStatus.ACTIVE,
            },
        )
        if created_teacher:
            teacher_user.set_password("teacher123")
            teacher_user.save()
            self.stdout.write("  ✓ Professor criado: teacher1@hub.dev / teacher123")
        else:
            self.stdout.write("  - Professor já existe.")

        TeacherProfile.objects.get_or_create(user=teacher_user)

        # Alunos (1 -> user@hub.dev, mais dois)
        students = [
            ("user@hub.dev", "user", "Usuário"),
            ("student2@hub.dev", "student2", "Aluno 2"),
            ("student3@hub.dev", "student3", "Aluno 3"),
        ]

        for email, username, first_name in students:
            student, student_created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": username,
                    "first_name": first_name,
                    "last_name": "Teste",
                    "role": UserRole.STUDENT,
                    "account_status": AccountStatus.ACTIVE,
                },
            )
            if student_created:
                student.set_password("user123")
                student.save()
                self.stdout.write(f"  ✓ Aluno criado: {email} / user123")
            else:
                self.stdout.write(f"  - Aluno {email} já existe.")

            StudentProfile.objects.get_or_create(user=student)

    def _seed_curriculum(self):
        """Cria módulos, aulas, vídeos e exercícios."""
        from src.curriculum.enums import ContentStatus
        from src.curriculum.models import (
            Exercise,
            ExerciseTestCase,
            Lesson,
            Module,
            VideoLesson,
        )

        self.stdout.write("  Criando currículo...")

        for m_idx in range(1, 3):
            module, _ = Module.objects.get_or_create(
                sequence_order=m_idx,
                defaults={
                    "title": f"Módulo {m_idx} - Fundamentos",
                    "description": f"Descrição do Módulo {m_idx}",
                    "publication_status": ContentStatus.PUBLISHED,
                },
            )

            for l_idx in range(1, 3):
                lesson, _ = Lesson.objects.get_or_create(
                    module=module,
                    sequence_order=l_idx,
                    defaults={
                        "title": f"Aula {m_idx}.{l_idx}",
                        "written_content": f"Conteúdo escrito da aula {m_idx}.{l_idx}.",
                        "publication_status": ContentStatus.PUBLISHED,
                    },
                )

                # 1 Video por aula
                VideoLesson.objects.get_or_create(
                    lesson=lesson,
                    defaults={
                        "title": f"Vídeo da Aula {m_idx}.{l_idx}",
                        "video_url": f"https://example.com/video/{m_idx}-{l_idx}",
                        "duration_seconds": 600,
                    },
                )

                # 2 Exercícios por aula
                for e_idx in range(1, 3):
                    exercise, _ = Exercise.objects.get_or_create(
                        lesson=lesson,
                        sequence_order=e_idx,
                        defaults={
                            "title": f"Exercício {m_idx}.{l_idx}.{e_idx}",
                            "statement": f"Resolva o problema {e_idx} da aula.",
                            "support_message": "Dica: use loops.",
                            "publication_status": ContentStatus.PUBLISHED,
                        },
                    )

                    # 2 Casos de teste por exercício
                    for tc_idx in range(1, 3):
                        ExerciseTestCase.objects.get_or_create(
                            exercise=exercise,
                            sequence_order=tc_idx,
                            defaults={
                                "name": f"Teste {tc_idx}",
                                "input_data": f"input {tc_idx}",
                                "expected_output": f"output {tc_idx}",
                                "is_hidden": tc_idx == 2,  # Um teste visível, um oculto
                            },
                        )

    def _seed_classes(self):
        """Cria turma de exemplo e matricula os alunos."""
        from django.utils import timezone

        from src.accounts.models import StudentProfile, TeacherProfile
        from src.classes.enums import ClassStatus, EnrollmentStatus
        from src.classes.models import ClassEnrollment, ClassGroup

        self.stdout.write("  Criando turmas...")

        teacher_profile = TeacherProfile.objects.first()
        if not teacher_profile:
            return

        class_group, _ = ClassGroup.objects.get_or_create(
            teacher_profile=teacher_profile,
            name="Turma A - 2026",
            defaults={
                "description": "Turma intro",
                "class_status": ClassStatus.ACTIVE,
            },
        )

        students = StudentProfile.objects.all()
        for student in students:
            ClassEnrollment.objects.get_or_create(
                class_group=class_group,
                student_profile=student,
                defaults={
                    "enrolled_at": timezone.now(),
                    "enrollment_status": EnrollmentStatus.ACTIVE,
                },
            )

    def _seed_progress_and_submissions(self):
        """Gera algumas submissões e progresso para o primeiro aluno do seed."""
        from django.utils import timezone

        from src.accounts.models import StudentProfile
        from src.curriculum.models import Exercise, Lesson, Module
        from src.progress.enums import ProgressStatus
        from src.progress.models import (
            StudentExerciseProgress,
            StudentLessonProgress,
            StudentModuleProgress,
        )
        from src.submissions.enums import ResultStatus, SubmissionStatus
        from src.submissions.models import Submission, SubmissionResult

        self.stdout.write("  Criando progresso e submissões...")

        student = StudentProfile.objects.filter(user__email="user@hub.dev").first()
        if not student:
            return

        first_module = Module.objects.first()
        if not first_module:
            return

        # Popula o progresso de módulo
        StudentModuleProgress.objects.get_or_create(
            student_profile=student,
            module=first_module,
            defaults={
                "progress_status": ProgressStatus.IN_PROGRESS,
                "started_at": timezone.now(),
            },
        )

        # Atualiza a primeira aula
        first_lesson = Lesson.objects.filter(module=first_module).first()
        if first_lesson:
            StudentLessonProgress.objects.get_or_create(
                student_profile=student,
                lesson=first_lesson,
                defaults={
                    "progress_status": ProgressStatus.COMPLETED,
                    "started_at": timezone.now(),
                    "completed_at": timezone.now(),
                },
            )

        # Pega uns exercícios da primeira aula para simular sumissao
        exercises = Exercise.objects.filter(lesson=first_lesson)
        for i, exercise in enumerate(exercises):
            # 1 falha, 1 sucesso
            is_success = i % 2 == 0

            sub_status = SubmissionStatus.EVALUATED
            res_status = ResultStatus.PASSED if is_success else ResultStatus.FAILED

            submission = Submission.objects.create(
                exercise=exercise,
                student_profile=student,
                source_code="print('hello')",
                evaluation_status=sub_status,
                score_percentage=100.0 if is_success else 50.0,
                submitted_at=timezone.now(),
            )

            SubmissionResult.objects.create(
                submission=submission,
                passed_tests_count=2 if is_success else 1,
                failed_tests_count=0 if is_success else 1,
                feedback_message="Boa!" if is_success else "Revise a lógica",
                result_status=res_status,
            )

            StudentExerciseProgress.objects.get_or_create(
                student_profile=student,
                exercise=exercise,
                defaults={
                    "progress_status": ProgressStatus.COMPLETED
                    if is_success
                    else ProgressStatus.IN_PROGRESS,
                    "attempts_count": 1,
                    "first_attempt_at": timezone.now(),
                    "completed_at": timezone.now() if is_success else None,
                },
            )
