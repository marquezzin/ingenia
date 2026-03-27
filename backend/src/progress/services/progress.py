"""Progress services — UseCases de progresso automático em cascata.

ISSUE-011-C: Atualização automática de progresso do aluno.
Cascata: exercise → lesson → module → student_profile.
"""

from dataclasses import dataclass

from django.utils import timezone


@dataclass
class UpdateExerciseProgressInput:
    student_profile_id: str
    exercise_id: str
    is_passed: bool


@dataclass
class UpdateExerciseProgressResult:
    was_already_completed: bool
    is_now_completed: bool
    attempts_count: int


class UpdateExerciseProgressUseCase:
    """Atualiza progresso do aluno em um exercício após submissão.

    BR-014: Exercício concluído apenas com submissão aprovada.
    BR-020: attempts_count incrementado a cada submissão.
    """

    def execute(
        self, *, input: UpdateExerciseProgressInput
    ) -> UpdateExerciseProgressResult:
        from src.progress.enums import ProgressStatus
        from src.progress.models import StudentExerciseProgress

        now = timezone.now()

        # get_or_create retorna uma tupla (instance, created)
        # instance — o objeto do model (seja o existente encontrado ou o recém-criado)
        # created — bool → True se o objeto foi criado agora, False se já existia e foi apenas recuperado
        # Os campos fora de defaults são usados como filtro do GET.
        # O dicionário defaults só é aplicado no CREATE (quando o registro não existe).

        progress, created = StudentExerciseProgress.objects.get_or_create(
            student_profile_id=input.student_profile_id,
            exercise_id=input.exercise_id,
            defaults={
                "progress_status": ProgressStatus.IN_PROGRESS,
                "attempts_count": 1,
                "first_attempt_at": now,
            },
        )

        was_already_completed = progress.progress_status == ProgressStatus.COMPLETED

        if not created:
            progress.attempts_count += 1

            if progress.progress_status == ProgressStatus.NOT_STARTED:
                progress.progress_status = ProgressStatus.IN_PROGRESS
                progress.first_attempt_at = now

            # Se a submissão foi aprovada e o exercício ainda não estava completo, marca como completo
            if input.is_passed and not was_already_completed:
                progress.progress_status = ProgressStatus.COMPLETED
                progress.completed_at = now

            progress.save()

        elif created and input.is_passed:
            progress.progress_status = ProgressStatus.COMPLETED
            progress.completed_at = now
            progress.save()

        is_now_completed = progress.progress_status == ProgressStatus.COMPLETED

        # Cascata: atualizar progresso da lesson
        exercise = self._get_exercise(input.exercise_id)
        UpdateLessonProgressUseCase().execute(
            input=UpdateLessonProgressInput(
                student_profile_id=input.student_profile_id,
                lesson_id=str(exercise.lesson_id),
            )
        )

        return UpdateExerciseProgressResult(
            was_already_completed=was_already_completed,
            is_now_completed=is_now_completed,
            attempts_count=progress.attempts_count,
        )

    def _get_exercise(self, exercise_id: str):
        from src.curriculum.models import Exercise

        return Exercise.objects.get(id=exercise_id)


@dataclass
class UpdateLessonProgressInput:
    student_profile_id: str
    lesson_id: str


class UpdateLessonProgressUseCase:
    """Atualiza progresso do aluno em uma aula.

    Marca IN_PROGRESS na primeira vez.
    Marca COMPLETED quando todos exercícios publicados da aula estão COMPLETED.
    """

    def execute(self, *, input: UpdateLessonProgressInput) -> None:
        from src.curriculum.enums import ContentStatus
        from src.curriculum.models import Exercise
        from src.progress.enums import ProgressStatus
        from src.progress.models import StudentExerciseProgress, StudentLessonProgress

        now = timezone.now()

        progress, created = StudentLessonProgress.objects.get_or_create(
            student_profile_id=input.student_profile_id,
            lesson_id=input.lesson_id,
            defaults={
                "progress_status": ProgressStatus.IN_PROGRESS,
                "started_at": now,
            },
        )

        if not created and progress.progress_status == ProgressStatus.NOT_STARTED:
            progress.progress_status = ProgressStatus.IN_PROGRESS
            progress.started_at = now
            progress.save()

        # Verificar se todos exercícios publicados da aula estão completos
        published_exercise_ids = list(
            Exercise.objects.filter(
                lesson_id=input.lesson_id,
                publication_status=ContentStatus.PUBLISHED,
            ).values_list("id", flat=True)
        )

        if published_exercise_ids:
            completed_count = StudentExerciseProgress.objects.filter(
                student_profile_id=input.student_profile_id,
                exercise_id__in=published_exercise_ids,
                progress_status=ProgressStatus.COMPLETED,
            ).count()

            all_exercises_completed = completed_count == len(published_exercise_ids)
        else:
            # Aula sem exercícios publicados: não marca como completa automaticamente
            all_exercises_completed = False

        if (
            all_exercises_completed
            and progress.progress_status != ProgressStatus.COMPLETED
        ):
            progress.progress_status = ProgressStatus.COMPLETED
            progress.completed_at = now
            progress.save()

        # Cascata: atualizar progresso do módulo
        lesson = self._get_lesson(input.lesson_id)
        UpdateModuleProgressUseCase().execute(
            input=UpdateModuleProgressInput(
                student_profile_id=input.student_profile_id,
                module_id=str(lesson.module_id),
            )
        )

    def _get_lesson(self, lesson_id: str):
        from src.curriculum.models import Lesson

        return Lesson.objects.get(id=lesson_id)


@dataclass
class UpdateModuleProgressInput:
    student_profile_id: str
    module_id: str


class UpdateModuleProgressUseCase:
    """Atualiza progresso do aluno em um módulo.

    BR-015: Módulo concluído quando todas aulas e exercícios concluídos.
    """

    def execute(self, *, input: UpdateModuleProgressInput) -> None:
        from src.curriculum.enums import ContentStatus
        from src.curriculum.models import Exercise, Lesson
        from src.progress.enums import ProgressStatus
        from src.progress.models import (
            StudentExerciseProgress,
            StudentLessonProgress,
            StudentModuleProgress,
        )

        now = timezone.now()

        # get_or_create retorna uma tupla
        # (instance, created)
        # instance — o objeto do model (seja o existente encontrado ou o recém-criado)
        # created — bool → True se o objeto foi criado agora, False se já existia e foi apenas recuperado

        # Os campos fora de defaults são usados como filtro do GET.
        # O dicionário defaults só é aplicado no CREATE (quando o registro não existe).
        progress, created = StudentModuleProgress.objects.get_or_create(
            student_profile_id=input.student_profile_id,
            module_id=input.module_id,
            defaults={
                "progress_status": ProgressStatus.IN_PROGRESS,
                "started_at": now,
            },
        )

        if not created and progress.progress_status == ProgressStatus.NOT_STARTED:
            progress.progress_status = ProgressStatus.IN_PROGRESS
            progress.started_at = now
            progress.save()

        # Verificar se todas aulas publicadas do módulo estão completas
        published_lesson_ids = list(
            Lesson.objects.filter(
                module_id=input.module_id,
                publication_status=ContentStatus.PUBLISHED,
            ).values_list("id", flat=True)
        )

        all_lessons_completed = False
        if published_lesson_ids:
            completed_lessons = StudentLessonProgress.objects.filter(
                student_profile_id=input.student_profile_id,
                lesson_id__in=published_lesson_ids,
                progress_status=ProgressStatus.COMPLETED,
            ).count()
            all_lessons_completed = completed_lessons == len(published_lesson_ids)

        # Verificar se todos exercícios publicados do módulo estão completos
        published_exercise_ids = list(
            Exercise.objects.filter(
                lesson__module_id=input.module_id,
                publication_status=ContentStatus.PUBLISHED,
            ).values_list("id", flat=True)
        )

        all_exercises_completed = False
        if published_exercise_ids:
            completed_exercises = StudentExerciseProgress.objects.filter(
                student_profile_id=input.student_profile_id,
                exercise_id__in=published_exercise_ids,
                progress_status=ProgressStatus.COMPLETED,
            ).count()
            all_exercises_completed = completed_exercises == len(published_exercise_ids)
        else:
            # Módulo sem exercícios: depende apenas das aulas
            all_exercises_completed = True

        module_completed = all_lessons_completed and all_exercises_completed

        # O módulo precisa ter pelo menos algum conteúdo publicado
        if not published_lesson_ids and not published_exercise_ids:
            module_completed = False

        if module_completed and progress.progress_status != ProgressStatus.COMPLETED:
            progress.progress_status = ProgressStatus.COMPLETED
            progress.completed_at = now
            progress.save()

        # Cascata: atualizar learning_status do perfil
        UpdateStudentLearningStatusUseCase().execute(
            input=UpdateStudentLearningStatusInput(
                student_profile_id=input.student_profile_id,
            )
        )


@dataclass
class UpdateStudentLearningStatusInput:
    student_profile_id: str


class UpdateStudentLearningStatusUseCase:
    """Atualiza learning_status do StudentProfile.

    IN_PROGRESS ao iniciar primeiro módulo.
    COMPLETED quando todos módulos publicados estão concluídos.
    """

    def execute(self, *, input: UpdateStudentLearningStatusInput) -> None:
        from src.accounts.enums import LearningStatus
        from src.accounts.models import StudentProfile
        from src.curriculum.enums import ContentStatus
        from src.curriculum.models import Module
        from src.progress.enums import ProgressStatus
        from src.progress.models import StudentModuleProgress

        now = timezone.now()

        profile = StudentProfile.objects.get(id=input.student_profile_id)

        if profile.learning_status == LearningStatus.NOT_STARTED:
            profile.learning_status = LearningStatus.IN_PROGRESS
            profile.first_started_at = now
            profile.save()

        # Verificar se todos módulos publicados estão completos
        published_module_ids = list(
            Module.objects.filter(
                publication_status=ContentStatus.PUBLISHED,
            ).values_list("id", flat=True)
        )

        if not published_module_ids:
            return

        completed_modules = StudentModuleProgress.objects.filter(
            student_profile_id=input.student_profile_id,
            module_id__in=published_module_ids,
            progress_status=ProgressStatus.COMPLETED,
        ).count()

        if (
            completed_modules == len(published_module_ids)
            and profile.learning_status != LearningStatus.COMPLETED
        ):
            profile.learning_status = LearningStatus.COMPLETED
            profile.save()
