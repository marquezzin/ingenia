"""Progress tests — Factories."""

import factory
from factory.django import DjangoModelFactory

from src.accounts.tests.factories import StudentProfileFactory
from src.curriculum.tests.factories import ExerciseFactory, LessonFactory, ModuleFactory
from src.progress.enums import ProgressStatus
from src.progress.models import (
    StudentExerciseProgress,
    StudentLessonProgress,
    StudentModuleProgress,
)


class StudentModuleProgressFactory(DjangoModelFactory):
    class Meta:
        model = StudentModuleProgress

    student_profile = factory.SubFactory(StudentProfileFactory)
    module = factory.SubFactory(ModuleFactory)
    progress_status = ProgressStatus.NOT_STARTED
    started_at = None
    completed_at = None


class StudentLessonProgressFactory(DjangoModelFactory):
    class Meta:
        model = StudentLessonProgress

    student_profile = factory.SubFactory(StudentProfileFactory)
    lesson = factory.SubFactory(LessonFactory)
    progress_status = ProgressStatus.NOT_STARTED
    started_at = None
    completed_at = None


class StudentExerciseProgressFactory(DjangoModelFactory):
    class Meta:
        model = StudentExerciseProgress

    student_profile = factory.SubFactory(StudentProfileFactory)
    exercise = factory.SubFactory(ExerciseFactory)
    progress_status = ProgressStatus.NOT_STARTED
    attempts_count = 0
    first_attempt_at = None
    completed_at = None
