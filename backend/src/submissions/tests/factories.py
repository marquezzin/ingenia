"""Submissions tests — Factories."""

import factory
from django.utils import timezone
from factory.django import DjangoModelFactory

from src.accounts.tests.factories import StudentProfileFactory
from src.curriculum.tests.factories import ExerciseFactory
from src.submissions.enums import ResultStatus, SubmissionStatus
from src.submissions.models import Submission, SubmissionResult


class SubmissionFactory(DjangoModelFactory):
    class Meta:
        model = Submission

    exercise = factory.SubFactory(ExerciseFactory)
    student_profile = factory.SubFactory(StudentProfileFactory)
    source_code = factory.Faker("text", max_nb_chars=200)
    evaluation_status = SubmissionStatus.PENDING
    score_percentage = None
    submitted_at = factory.LazyFunction(timezone.now)


class SubmissionResultFactory(DjangoModelFactory):
    class Meta:
        model = SubmissionResult

    submission = factory.SubFactory(SubmissionFactory)
    passed_tests_count = factory.Faker("random_int", min=0, max=10)
    failed_tests_count = factory.Faker("random_int", min=0, max=10)
    feedback_message = factory.Faker("paragraph", locale="pt_BR")
    result_status = ResultStatus.PASSED
