"""Classes tests — Factories."""

import factory
from django.utils import timezone
from factory.django import DjangoModelFactory

from src.accounts.tests.factories import StudentProfileFactory, TeacherProfileFactory
from src.classes.enums import ClassStatus, EnrollmentStatus
from src.classes.models import ClassEnrollment, ClassGroup


class ClassGroupFactory(DjangoModelFactory):
    class Meta:
        model = ClassGroup

    teacher_profile = factory.SubFactory(TeacherProfileFactory)
    name = factory.Sequence(lambda n: f"Turma {n + 1}")
    description = factory.Faker("paragraph", locale="pt_BR")
    class_status = ClassStatus.ACTIVE


class ClassEnrollmentFactory(DjangoModelFactory):
    class Meta:
        model = ClassEnrollment

    class_group = factory.SubFactory(ClassGroupFactory)
    student_profile = factory.SubFactory(StudentProfileFactory)
    enrolled_at = factory.LazyFunction(timezone.now)
    enrollment_status = EnrollmentStatus.ACTIVE
