"""Curriculum tests — Factories."""

import factory
from factory.django import DjangoModelFactory

from src.curriculum.enums import ContentStatus
from src.curriculum.models import (
    Exercise,
    ExerciseTestCase,
    Lesson,
    Module,
    VideoLesson,
)


class ModuleFactory(DjangoModelFactory):
    class Meta:
        model = Module

    title = factory.Sequence(lambda n: f"Módulo {n + 1}")
    description = factory.Faker("paragraph", locale="pt_BR")
    sequence_order = factory.Sequence(lambda n: n + 1)
    publication_status = ContentStatus.DRAFT


class LessonFactory(DjangoModelFactory):
    class Meta:
        model = Lesson

    module = factory.SubFactory(ModuleFactory)
    title = factory.Sequence(lambda n: f"Aula {n + 1}")
    written_content = factory.Faker("text", max_nb_chars=500, locale="pt_BR")
    sequence_order = factory.Sequence(lambda n: n + 1)
    publication_status = ContentStatus.DRAFT


class VideoLessonFactory(DjangoModelFactory):
    class Meta:
        model = VideoLesson

    lesson = factory.SubFactory(LessonFactory)
    title = factory.LazyAttribute(lambda o: f"Vídeo — {o.lesson.title}")
    video_url = factory.Faker("url")
    duration_seconds = factory.Faker("random_int", min=60, max=3600)


class ExerciseFactory(DjangoModelFactory):
    class Meta:
        model = Exercise

    lesson = factory.SubFactory(LessonFactory)
    title = factory.Sequence(lambda n: f"Exercício {n + 1}")
    statement = factory.Faker("paragraph", locale="pt_BR")
    sequence_order = factory.Sequence(lambda n: n + 1)
    publication_status = ContentStatus.DRAFT


class ExerciseTestCaseFactory(DjangoModelFactory):
    class Meta:
        model = ExerciseTestCase

    exercise = factory.SubFactory(ExerciseFactory)
    name = factory.Sequence(lambda n: f"test_case_{n + 1}")
    input_data = factory.Faker("pystr", max_chars=50)
    expected_output = factory.Faker("pystr", max_chars=50)
    sequence_order = factory.Sequence(lambda n: n + 1)
    is_hidden = False
