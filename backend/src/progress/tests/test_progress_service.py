"""Progress tests — UseCases de progresso automático."""

from django.test import TestCase

from src.accounts.enums import LearningStatus
from src.accounts.tests.factories import StudentProfileFactory
from src.curriculum.enums import ContentStatus
from src.curriculum.tests.factories import ExerciseFactory, LessonFactory, ModuleFactory
from src.progress.enums import ProgressStatus
from src.progress.models import (
    StudentExerciseProgress,
    StudentLessonProgress,
    StudentModuleProgress,
)
from src.progress.services import (
    UpdateExerciseProgressInput,
    UpdateExerciseProgressUseCase,
    UpdateLessonProgressInput,
    UpdateLessonProgressUseCase,
    UpdateModuleProgressInput,
    UpdateModuleProgressUseCase,
    UpdateStudentLearningStatusInput,
    UpdateStudentLearningStatusUseCase,
)


class UpdateExerciseProgressUseCaseTest(TestCase):
    """Testes do UpdateExerciseProgressUseCase."""

    def setUp(self):
        self.module = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        self.lesson = LessonFactory(
            module=self.module, publication_status=ContentStatus.PUBLISHED
        )
        self.exercise = ExerciseFactory(
            lesson=self.lesson, publication_status=ContentStatus.PUBLISHED
        )
        self.student = StudentProfileFactory()

    def test_first_submission_creates_progress_in_progress(self):
        """Primeira submissão (não aprovada) cria progresso IN_PROGRESS."""
        result = UpdateExerciseProgressUseCase().execute(
            input=UpdateExerciseProgressInput(
                student_profile_id=str(self.student.id),
                exercise_id=str(self.exercise.id),
                is_passed=False,
            )
        )

        self.assertFalse(result.was_already_completed)
        self.assertFalse(result.is_now_completed)
        self.assertEqual(result.attempts_count, 1)

        progress = StudentExerciseProgress.objects.get(
            student_profile=self.student, exercise=self.exercise
        )
        self.assertEqual(progress.progress_status, ProgressStatus.IN_PROGRESS)
        self.assertIsNotNone(progress.first_attempt_at)
        self.assertIsNone(progress.completed_at)

    def test_br020_attempts_count_increments(self):
        """BR-020: attempts_count incrementado a cada submissão."""
        use_case = UpdateExerciseProgressUseCase()
        inp = UpdateExerciseProgressInput(
            student_profile_id=str(self.student.id),
            exercise_id=str(self.exercise.id),
            is_passed=False,
        )

        result1 = use_case.execute(input=inp)
        self.assertEqual(result1.attempts_count, 1)

        result2 = use_case.execute(input=inp)
        self.assertEqual(result2.attempts_count, 2)

        result3 = use_case.execute(input=inp)
        self.assertEqual(result3.attempts_count, 3)

    def test_br014_passed_marks_completed(self):
        """BR-014: Submissão aprovada marca exercício como COMPLETED."""
        result = UpdateExerciseProgressUseCase().execute(
            input=UpdateExerciseProgressInput(
                student_profile_id=str(self.student.id),
                exercise_id=str(self.exercise.id),
                is_passed=True,
            )
        )

        self.assertFalse(result.was_already_completed)
        self.assertTrue(result.is_now_completed)

        progress = StudentExerciseProgress.objects.get(
            student_profile=self.student, exercise=self.exercise
        )
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)
        self.assertIsNotNone(progress.completed_at)

    def test_completed_exercise_does_not_regress(self):
        """Exercício já COMPLETED não regride com submissão reprovada."""
        use_case = UpdateExerciseProgressUseCase()

        # Primeiro: aprovado
        use_case.execute(
            input=UpdateExerciseProgressInput(
                student_profile_id=str(self.student.id),
                exercise_id=str(self.exercise.id),
                is_passed=True,
            )
        )

        # Depois: reprovado
        result = use_case.execute(
            input=UpdateExerciseProgressInput(
                student_profile_id=str(self.student.id),
                exercise_id=str(self.exercise.id),
                is_passed=False,
            )
        )

        self.assertTrue(result.was_already_completed)
        self.assertTrue(result.is_now_completed)
        self.assertEqual(result.attempts_count, 2)

        progress = StudentExerciseProgress.objects.get(
            student_profile=self.student, exercise=self.exercise
        )
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)

    def test_first_attempt_at_not_overwritten(self):
        """first_attempt_at só é preenchido na primeira tentativa."""
        use_case = UpdateExerciseProgressUseCase()
        inp = UpdateExerciseProgressInput(
            student_profile_id=str(self.student.id),
            exercise_id=str(self.exercise.id),
            is_passed=False,
        )

        use_case.execute(input=inp)
        progress = StudentExerciseProgress.objects.get(
            student_profile=self.student, exercise=self.exercise
        )
        first_time = progress.first_attempt_at

        use_case.execute(input=inp)
        progress.refresh_from_db()
        self.assertEqual(progress.first_attempt_at, first_time)


class UpdateLessonProgressUseCaseTest(TestCase):
    """Testes do UpdateLessonProgressUseCase."""

    def setUp(self):
        self.module = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        self.lesson = LessonFactory(
            module=self.module, publication_status=ContentStatus.PUBLISHED
        )
        self.student = StudentProfileFactory()

    def test_lesson_starts_in_progress(self):
        """Aula marcada IN_PROGRESS na primeira vez."""
        UpdateLessonProgressUseCase().execute(
            input=UpdateLessonProgressInput(
                student_profile_id=str(self.student.id),
                lesson_id=str(self.lesson.id),
            )
        )

        progress = StudentLessonProgress.objects.get(
            student_profile=self.student, lesson=self.lesson
        )
        self.assertEqual(progress.progress_status, ProgressStatus.IN_PROGRESS)
        self.assertIsNotNone(progress.started_at)

    def test_lesson_completed_when_all_exercises_completed(self):
        """Aula COMPLETED quando todos exercícios publicados estão COMPLETED."""
        ex1 = ExerciseFactory(
            lesson=self.lesson, publication_status=ContentStatus.PUBLISHED
        )
        ex2 = ExerciseFactory(
            lesson=self.lesson, publication_status=ContentStatus.PUBLISHED
        )

        # Completar todos exercícios
        StudentExerciseProgress.objects.create(
            student_profile=self.student,
            exercise=ex1,
            progress_status=ProgressStatus.COMPLETED,
            attempts_count=1,
            completed_at="2026-01-01T00:00:00Z",
        )
        StudentExerciseProgress.objects.create(
            student_profile=self.student,
            exercise=ex2,
            progress_status=ProgressStatus.COMPLETED,
            attempts_count=1,
            completed_at="2026-01-01T00:00:00Z",
        )

        UpdateLessonProgressUseCase().execute(
            input=UpdateLessonProgressInput(
                student_profile_id=str(self.student.id),
                lesson_id=str(self.lesson.id),
            )
        )

        progress = StudentLessonProgress.objects.get(
            student_profile=self.student, lesson=self.lesson
        )
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)
        self.assertIsNotNone(progress.completed_at)

    def test_lesson_not_completed_with_partial_exercises(self):
        """Aula não COMPLETED se algum exercício não está completo."""
        ex1 = ExerciseFactory(
            lesson=self.lesson, publication_status=ContentStatus.PUBLISHED
        )
        _ex2 = ExerciseFactory(
            lesson=self.lesson, publication_status=ContentStatus.PUBLISHED
        )

        # Completar apenas 1
        StudentExerciseProgress.objects.create(
            student_profile=self.student,
            exercise=ex1,
            progress_status=ProgressStatus.COMPLETED,
            attempts_count=1,
            completed_at="2026-01-01T00:00:00Z",
        )

        UpdateLessonProgressUseCase().execute(
            input=UpdateLessonProgressInput(
                student_profile_id=str(self.student.id),
                lesson_id=str(self.lesson.id),
            )
        )

        progress = StudentLessonProgress.objects.get(
            student_profile=self.student, lesson=self.lesson
        )
        self.assertEqual(progress.progress_status, ProgressStatus.IN_PROGRESS)

    def test_draft_exercises_ignored_for_completion(self):
        """Exercícios DRAFT não contam para completar a aula."""
        published_ex = ExerciseFactory(
            lesson=self.lesson, publication_status=ContentStatus.PUBLISHED
        )
        ExerciseFactory(lesson=self.lesson, publication_status=ContentStatus.DRAFT)

        StudentExerciseProgress.objects.create(
            student_profile=self.student,
            exercise=published_ex,
            progress_status=ProgressStatus.COMPLETED,
            attempts_count=1,
            completed_at="2026-01-01T00:00:00Z",
        )

        UpdateLessonProgressUseCase().execute(
            input=UpdateLessonProgressInput(
                student_profile_id=str(self.student.id),
                lesson_id=str(self.lesson.id),
            )
        )

        progress = StudentLessonProgress.objects.get(
            student_profile=self.student, lesson=self.lesson
        )
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)


class UpdateModuleProgressUseCaseTest(TestCase):
    """Testes do UpdateModuleProgressUseCase — BR-015."""

    def setUp(self):
        self.module = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        self.student = StudentProfileFactory()

    def test_module_starts_in_progress(self):
        """Módulo marcado IN_PROGRESS na primeira vez."""
        UpdateModuleProgressUseCase().execute(
            input=UpdateModuleProgressInput(
                student_profile_id=str(self.student.id),
                module_id=str(self.module.id),
            )
        )

        progress = StudentModuleProgress.objects.get(
            student_profile=self.student, module=self.module
        )
        self.assertEqual(progress.progress_status, ProgressStatus.IN_PROGRESS)
        self.assertIsNotNone(progress.started_at)

    def test_br015_module_completed_when_all_content_completed(self):
        """BR-015: Módulo COMPLETED quando todas aulas e exercícios publicados estão COMPLETED."""
        lesson = LessonFactory(
            module=self.module, publication_status=ContentStatus.PUBLISHED
        )
        exercise = ExerciseFactory(
            lesson=lesson, publication_status=ContentStatus.PUBLISHED
        )

        # Completar aula e exercício
        StudentLessonProgress.objects.create(
            student_profile=self.student,
            lesson=lesson,
            progress_status=ProgressStatus.COMPLETED,
            started_at="2026-01-01T00:00:00Z",
            completed_at="2026-01-01T00:00:00Z",
        )
        StudentExerciseProgress.objects.create(
            student_profile=self.student,
            exercise=exercise,
            progress_status=ProgressStatus.COMPLETED,
            attempts_count=1,
            completed_at="2026-01-01T00:00:00Z",
        )

        UpdateModuleProgressUseCase().execute(
            input=UpdateModuleProgressInput(
                student_profile_id=str(self.student.id),
                module_id=str(self.module.id),
            )
        )

        progress = StudentModuleProgress.objects.get(
            student_profile=self.student, module=self.module
        )
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)
        self.assertIsNotNone(progress.completed_at)

    def test_module_not_completed_with_incomplete_lessons(self):
        """Módulo não COMPLETED se alguma aula não está completa."""
        lesson1 = LessonFactory(
            module=self.module, publication_status=ContentStatus.PUBLISHED
        )
        _lesson2 = LessonFactory(
            module=self.module, publication_status=ContentStatus.PUBLISHED
        )

        # Completar apenas 1 aula
        StudentLessonProgress.objects.create(
            student_profile=self.student,
            lesson=lesson1,
            progress_status=ProgressStatus.COMPLETED,
            started_at="2026-01-01T00:00:00Z",
            completed_at="2026-01-01T00:00:00Z",
        )

        UpdateModuleProgressUseCase().execute(
            input=UpdateModuleProgressInput(
                student_profile_id=str(self.student.id),
                module_id=str(self.module.id),
            )
        )

        progress = StudentModuleProgress.objects.get(
            student_profile=self.student, module=self.module
        )
        self.assertEqual(progress.progress_status, ProgressStatus.IN_PROGRESS)

    def test_module_not_completed_with_incomplete_exercises(self):
        """Módulo não COMPLETED se um exercício publicado não está completo."""
        lesson = LessonFactory(
            module=self.module, publication_status=ContentStatus.PUBLISHED
        )
        _exercise = ExerciseFactory(
            lesson=lesson, publication_status=ContentStatus.PUBLISHED
        )

        # Completar aula mas não exercício
        StudentLessonProgress.objects.create(
            student_profile=self.student,
            lesson=lesson,
            progress_status=ProgressStatus.COMPLETED,
            started_at="2026-01-01T00:00:00Z",
            completed_at="2026-01-01T00:00:00Z",
        )

        UpdateModuleProgressUseCase().execute(
            input=UpdateModuleProgressInput(
                student_profile_id=str(self.student.id),
                module_id=str(self.module.id),
            )
        )

        progress = StudentModuleProgress.objects.get(
            student_profile=self.student, module=self.module
        )
        self.assertEqual(progress.progress_status, ProgressStatus.IN_PROGRESS)


class UpdateStudentLearningStatusUseCaseTest(TestCase):
    """Testes do UpdateStudentLearningStatusUseCase."""

    def setUp(self):
        self.student = StudentProfileFactory()

    def test_learning_status_in_progress_on_first_call(self):
        """learning_status muda para IN_PROGRESS na primeira chamada."""
        self.assertEqual(self.student.learning_status, LearningStatus.NOT_STARTED)

        UpdateStudentLearningStatusUseCase().execute(
            input=UpdateStudentLearningStatusInput(
                student_profile_id=str(self.student.id),
            )
        )

        self.student.refresh_from_db()
        self.assertEqual(self.student.learning_status, LearningStatus.IN_PROGRESS)
        self.assertIsNotNone(self.student.first_started_at)

    def test_learning_status_completed_when_all_modules_completed(self):
        """Trilha COMPLETED quando todos módulos publicados estão concluídos."""
        module1 = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        module2 = ModuleFactory(publication_status=ContentStatus.PUBLISHED)

        # Completar ambos módulos
        StudentModuleProgress.objects.create(
            student_profile=self.student,
            module=module1,
            progress_status=ProgressStatus.COMPLETED,
            started_at="2026-01-01T00:00:00Z",
            completed_at="2026-01-01T00:00:00Z",
        )
        StudentModuleProgress.objects.create(
            student_profile=self.student,
            module=module2,
            progress_status=ProgressStatus.COMPLETED,
            started_at="2026-01-01T00:00:00Z",
            completed_at="2026-01-01T00:00:00Z",
        )

        UpdateStudentLearningStatusUseCase().execute(
            input=UpdateStudentLearningStatusInput(
                student_profile_id=str(self.student.id),
            )
        )

        self.student.refresh_from_db()
        self.assertEqual(self.student.learning_status, LearningStatus.COMPLETED)

    def test_learning_status_not_completed_with_partial_modules(self):
        """Trilha não COMPLETED se algum módulo publicado não está completo."""
        module1 = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        _module2 = ModuleFactory(publication_status=ContentStatus.PUBLISHED)

        StudentModuleProgress.objects.create(
            student_profile=self.student,
            module=module1,
            progress_status=ProgressStatus.COMPLETED,
            started_at="2026-01-01T00:00:00Z",
            completed_at="2026-01-01T00:00:00Z",
        )

        UpdateStudentLearningStatusUseCase().execute(
            input=UpdateStudentLearningStatusInput(
                student_profile_id=str(self.student.id),
            )
        )

        self.student.refresh_from_db()
        self.assertEqual(self.student.learning_status, LearningStatus.IN_PROGRESS)

    def test_draft_modules_ignored_for_completion(self):
        """Módulos DRAFT não contam para completar a trilha."""
        published_module = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        ModuleFactory(publication_status=ContentStatus.DRAFT)

        StudentModuleProgress.objects.create(
            student_profile=self.student,
            module=published_module,
            progress_status=ProgressStatus.COMPLETED,
            started_at="2026-01-01T00:00:00Z",
            completed_at="2026-01-01T00:00:00Z",
        )

        UpdateStudentLearningStatusUseCase().execute(
            input=UpdateStudentLearningStatusInput(
                student_profile_id=str(self.student.id),
            )
        )

        self.student.refresh_from_db()
        self.assertEqual(self.student.learning_status, LearningStatus.COMPLETED)


class FullCascadeIntegrationTest(TestCase):
    """Teste de integração da cascata completa exercise → lesson → module → profile."""

    def test_full_cascade_single_exercise_module(self):
        """Cascata completa: submissão aprovada completa toda trilha de 1 módulo/1 aula/1 exercício."""
        module = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        lesson = LessonFactory(
            module=module, publication_status=ContentStatus.PUBLISHED
        )
        exercise = ExerciseFactory(
            lesson=lesson, publication_status=ContentStatus.PUBLISHED
        )
        student = StudentProfileFactory()

        # Submissão aprovada
        UpdateExerciseProgressUseCase().execute(
            input=UpdateExerciseProgressInput(
                student_profile_id=str(student.id),
                exercise_id=str(exercise.id),
                is_passed=True,
            )
        )

        # Verificar cascata completa
        ex_progress = StudentExerciseProgress.objects.get(
            student_profile=student, exercise=exercise
        )
        self.assertEqual(ex_progress.progress_status, ProgressStatus.COMPLETED)
        self.assertEqual(ex_progress.attempts_count, 1)

        les_progress = StudentLessonProgress.objects.get(
            student_profile=student, lesson=lesson
        )
        self.assertEqual(les_progress.progress_status, ProgressStatus.COMPLETED)

        mod_progress = StudentModuleProgress.objects.get(
            student_profile=student, module=module
        )
        self.assertEqual(mod_progress.progress_status, ProgressStatus.COMPLETED)

        student.refresh_from_db()
        self.assertEqual(student.learning_status, LearningStatus.COMPLETED)

    def test_cascade_partial_does_not_complete_module(self):
        """Cascata parcial: dois exercícios, só um aprovado → módulo IN_PROGRESS."""
        module = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        lesson = LessonFactory(
            module=module, publication_status=ContentStatus.PUBLISHED
        )
        ex1 = ExerciseFactory(lesson=lesson, publication_status=ContentStatus.PUBLISHED)
        ex2 = ExerciseFactory(lesson=lesson, publication_status=ContentStatus.PUBLISHED)
        student = StudentProfileFactory()

        # Aprovar apenas primeiro exercício
        UpdateExerciseProgressUseCase().execute(
            input=UpdateExerciseProgressInput(
                student_profile_id=str(student.id),
                exercise_id=str(ex1.id),
                is_passed=True,
            )
        )

        les_progress = StudentLessonProgress.objects.get(
            student_profile=student, lesson=lesson
        )
        self.assertEqual(les_progress.progress_status, ProgressStatus.IN_PROGRESS)

        mod_progress = StudentModuleProgress.objects.get(
            student_profile=student, module=module
        )
        self.assertEqual(mod_progress.progress_status, ProgressStatus.IN_PROGRESS)

        # Agora aprovar segundo exercício
        UpdateExerciseProgressUseCase().execute(
            input=UpdateExerciseProgressInput(
                student_profile_id=str(student.id),
                exercise_id=str(ex2.id),
                is_passed=True,
            )
        )

        les_progress.refresh_from_db()
        self.assertEqual(les_progress.progress_status, ProgressStatus.COMPLETED)

        mod_progress.refresh_from_db()
        self.assertEqual(mod_progress.progress_status, ProgressStatus.COMPLETED)

    def test_cascade_multiple_modules(self):
        """Trilha com 2 módulos: COMPLETED apenas quando ambos estão completos."""
        module1 = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        module2 = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        lesson1 = LessonFactory(
            module=module1, publication_status=ContentStatus.PUBLISHED
        )
        lesson2 = LessonFactory(
            module=module2, publication_status=ContentStatus.PUBLISHED
        )
        ex1 = ExerciseFactory(
            lesson=lesson1, publication_status=ContentStatus.PUBLISHED
        )
        ex2 = ExerciseFactory(
            lesson=lesson2, publication_status=ContentStatus.PUBLISHED
        )
        student = StudentProfileFactory()

        # Completar apenas módulo 1
        UpdateExerciseProgressUseCase().execute(
            input=UpdateExerciseProgressInput(
                student_profile_id=str(student.id),
                exercise_id=str(ex1.id),
                is_passed=True,
            )
        )

        student.refresh_from_db()
        self.assertEqual(student.learning_status, LearningStatus.IN_PROGRESS)

        # Completar módulo 2
        UpdateExerciseProgressUseCase().execute(
            input=UpdateExerciseProgressInput(
                student_profile_id=str(student.id),
                exercise_id=str(ex2.id),
                is_passed=True,
            )
        )

        student.refresh_from_db()
        self.assertEqual(student.learning_status, LearningStatus.COMPLETED)

    def test_idempotency_repeated_call_same_data(self):
        """Chamar múltiplas vezes com mesmos dados não corrompe progresso."""
        module = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        lesson = LessonFactory(
            module=module, publication_status=ContentStatus.PUBLISHED
        )
        exercise = ExerciseFactory(
            lesson=lesson, publication_status=ContentStatus.PUBLISHED
        )
        student = StudentProfileFactory()

        use_case = UpdateExerciseProgressUseCase()
        inp = UpdateExerciseProgressInput(
            student_profile_id=str(student.id),
            exercise_id=str(exercise.id),
            is_passed=True,
        )

        # Primeira chamada
        use_case.execute(input=inp)
        # Segunda chamada — idempotente
        result = use_case.execute(input=inp)

        self.assertTrue(result.was_already_completed)
        self.assertTrue(result.is_now_completed)
        self.assertEqual(result.attempts_count, 2)

        # Progresso deve permanecer COMPLETED
        progress = StudentExerciseProgress.objects.get(
            student_profile=student, exercise=exercise
        )
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)


class MarkLessonStartedUseCaseTest(TestCase):
    """Testes do MarkLessonStartedUseCase — ISSUE-011-F."""

    def setUp(self):
        from src.progress.services import (
            MarkLessonStartedInput,
            MarkLessonStartedUseCase,
        )

        self.UseCase = MarkLessonStartedUseCase
        self.Input = MarkLessonStartedInput

        self.module = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        self.lesson = LessonFactory(
            module=self.module, publication_status=ContentStatus.PUBLISHED
        )
        self.student = StudentProfileFactory()

    def test_marks_lesson_in_progress(self):
        """Primeira chamada cria StudentLessonProgress IN_PROGRESS."""
        self.UseCase().execute(
            input=self.Input(
                student_profile_id=str(self.student.id),
                lesson_id=str(self.lesson.id),
            )
        )

        progress = StudentLessonProgress.objects.get(
            student_profile=self.student, lesson=self.lesson
        )
        self.assertEqual(progress.progress_status, ProgressStatus.IN_PROGRESS)
        self.assertIsNotNone(progress.started_at)

    def test_idempotent_does_not_duplicate(self):
        """Chamar duas vezes não duplica progresso."""
        use_case = self.UseCase()
        inp = self.Input(
            student_profile_id=str(self.student.id),
            lesson_id=str(self.lesson.id),
        )

        use_case.execute(input=inp)
        use_case.execute(input=inp)

        count = StudentLessonProgress.objects.filter(
            student_profile=self.student, lesson=self.lesson
        ).count()
        self.assertEqual(count, 1)

    def test_does_not_overwrite_completed(self):
        """Não regride progresso COMPLETED para IN_PROGRESS."""
        from django.utils import timezone

        StudentLessonProgress.objects.create(
            student_profile=self.student,
            lesson=self.lesson,
            progress_status=ProgressStatus.COMPLETED,
            started_at=timezone.now(),
            completed_at=timezone.now(),
        )

        self.UseCase().execute(
            input=self.Input(
                student_profile_id=str(self.student.id),
                lesson_id=str(self.lesson.id),
            )
        )

        progress = StudentLessonProgress.objects.get(
            student_profile=self.student, lesson=self.lesson
        )
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)

    def test_creates_module_progress_in_progress(self):
        """Cascata: cria StudentModuleProgress IN_PROGRESS."""
        self.UseCase().execute(
            input=self.Input(
                student_profile_id=str(self.student.id),
                lesson_id=str(self.lesson.id),
            )
        )

        module_progress = StudentModuleProgress.objects.get(
            student_profile=self.student, module=self.module
        )
        self.assertEqual(module_progress.progress_status, ProgressStatus.IN_PROGRESS)
        self.assertIsNotNone(module_progress.started_at)

    def test_updates_learning_status(self):
        """Cascata: atualiza learning_status para IN_PROGRESS."""
        from src.accounts.enums import LearningStatus

        self.assertEqual(self.student.learning_status, LearningStatus.NOT_STARTED)

        self.UseCase().execute(
            input=self.Input(
                student_profile_id=str(self.student.id),
                lesson_id=str(self.lesson.id),
            )
        )

        self.student.refresh_from_db()
        self.assertEqual(self.student.learning_status, LearningStatus.IN_PROGRESS)

    def test_rejects_draft_lesson(self):
        """BR-019: Aula DRAFT gera NotFoundError."""
        from core.errors import NotFoundError

        draft_lesson = LessonFactory(
            module=self.module, publication_status=ContentStatus.DRAFT
        )

        with self.assertRaises(NotFoundError):
            self.UseCase().execute(
                input=self.Input(
                    student_profile_id=str(self.student.id),
                    lesson_id=str(draft_lesson.id),
                )
            )

    def test_rejects_nonexistent_lesson(self):
        """Aula inexistente gera NotFoundError."""
        import uuid

        from core.errors import NotFoundError

        with self.assertRaises(NotFoundError):
            self.UseCase().execute(
                input=self.Input(
                    student_profile_id=str(self.student.id),
                    lesson_id=str(uuid.uuid4()),
                )
            )


class MarkLessonCompletedUseCaseTest(TestCase):
    """Testes do MarkLessonCompletedUseCase — ISSUE-011-F."""

    def setUp(self):
        from src.progress.services import (
            MarkLessonCompletedInput,
            MarkLessonCompletedUseCase,
        )

        self.UseCase = MarkLessonCompletedUseCase
        self.Input = MarkLessonCompletedInput

        self.module = ModuleFactory(publication_status=ContentStatus.PUBLISHED)
        self.lesson_no_exercises = LessonFactory(
            module=self.module, publication_status=ContentStatus.PUBLISHED
        )
        self.student = StudentProfileFactory()

    def test_marks_lesson_completed(self):
        """Aula sem exercícios pode ser marcada COMPLETED."""
        self.UseCase().execute(
            input=self.Input(
                student_profile_id=str(self.student.id),
                lesson_id=str(self.lesson_no_exercises.id),
            )
        )

        progress = StudentLessonProgress.objects.get(
            student_profile=self.student, lesson=self.lesson_no_exercises
        )
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)
        self.assertIsNotNone(progress.started_at)
        self.assertIsNotNone(progress.completed_at)

    def test_rejects_lesson_with_published_exercises(self):
        """Aula com exercícios publicados gera ApplicationError."""
        from core.errors import ApplicationError
        from src.curriculum.tests.factories import ExerciseFactory

        lesson_with_ex = LessonFactory(
            module=self.module, publication_status=ContentStatus.PUBLISHED
        )
        ExerciseFactory(
            lesson=lesson_with_ex, publication_status=ContentStatus.PUBLISHED
        )

        with self.assertRaises(ApplicationError):
            self.UseCase().execute(
                input=self.Input(
                    student_profile_id=str(self.student.id),
                    lesson_id=str(lesson_with_ex.id),
                )
            )

    def test_allows_lesson_with_only_draft_exercises(self):
        """Aula com exercícios DRAFT (mas nenhum publicado) pode ser completada."""
        from src.curriculum.tests.factories import ExerciseFactory

        lesson_draft_ex = LessonFactory(
            module=self.module, publication_status=ContentStatus.PUBLISHED
        )
        ExerciseFactory(lesson=lesson_draft_ex, publication_status=ContentStatus.DRAFT)

        self.UseCase().execute(
            input=self.Input(
                student_profile_id=str(self.student.id),
                lesson_id=str(lesson_draft_ex.id),
            )
        )

        progress = StudentLessonProgress.objects.get(
            student_profile=self.student, lesson=lesson_draft_ex
        )
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)

    def test_creates_progress_if_not_exists(self):
        """Cria progresso direto como COMPLETED se não existia."""
        count_before = StudentLessonProgress.objects.filter(
            student_profile=self.student, lesson=self.lesson_no_exercises
        ).count()
        self.assertEqual(count_before, 0)

        self.UseCase().execute(
            input=self.Input(
                student_profile_id=str(self.student.id),
                lesson_id=str(self.lesson_no_exercises.id),
            )
        )

        progress = StudentLessonProgress.objects.get(
            student_profile=self.student, lesson=self.lesson_no_exercises
        )
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)

    def test_upgrades_in_progress_to_completed(self):
        """Atualiza IN_PROGRESS para COMPLETED."""
        from django.utils import timezone

        StudentLessonProgress.objects.create(
            student_profile=self.student,
            lesson=self.lesson_no_exercises,
            progress_status=ProgressStatus.IN_PROGRESS,
            started_at=timezone.now(),
        )

        self.UseCase().execute(
            input=self.Input(
                student_profile_id=str(self.student.id),
                lesson_id=str(self.lesson_no_exercises.id),
            )
        )

        progress = StudentLessonProgress.objects.get(
            student_profile=self.student, lesson=self.lesson_no_exercises
        )
        self.assertEqual(progress.progress_status, ProgressStatus.COMPLETED)
        self.assertIsNotNone(progress.completed_at)

    def test_idempotent_for_completed(self):
        """Chamar duas vezes para aula já COMPLETED não causa erro."""
        use_case = self.UseCase()
        inp = self.Input(
            student_profile_id=str(self.student.id),
            lesson_id=str(self.lesson_no_exercises.id),
        )

        use_case.execute(input=inp)
        use_case.execute(input=inp)

        count = StudentLessonProgress.objects.filter(
            student_profile=self.student, lesson=self.lesson_no_exercises
        ).count()
        self.assertEqual(count, 1)

    def test_cascade_updates_module_progress(self):
        """Cascata: atualiza progresso do módulo."""
        self.UseCase().execute(
            input=self.Input(
                student_profile_id=str(self.student.id),
                lesson_id=str(self.lesson_no_exercises.id),
            )
        )

        module_progress = StudentModuleProgress.objects.get(
            student_profile=self.student, module=self.module
        )
        self.assertIn(
            module_progress.progress_status,
            [ProgressStatus.IN_PROGRESS, ProgressStatus.COMPLETED],
        )

    def test_cascade_completes_module_when_only_lesson(self):
        """Se módulo tem apenas essa aula sem exercícios, módulo fica COMPLETED."""
        # O módulo já tem self.lesson_no_exercises como única aula publicada,
        # e não tem exercícios publicados → completar aula deve completar módulo
        self.UseCase().execute(
            input=self.Input(
                student_profile_id=str(self.student.id),
                lesson_id=str(self.lesson_no_exercises.id),
            )
        )

        module_progress = StudentModuleProgress.objects.get(
            student_profile=self.student, module=self.module
        )
        self.assertEqual(module_progress.progress_status, ProgressStatus.COMPLETED)
