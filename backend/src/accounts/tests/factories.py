"""Accounts tests — Factories."""

import factory
from factory.django import DjangoModelFactory

from src.accounts.enums import AccountStatus, LearningStatus, UserRole
from src.accounts.models import AdminProfile, StudentProfile, TeacherProfile, User


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
        skip_postgeneration_save = True

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    is_active = True
    role = UserRole.STUDENT
    account_status = AccountStatus.ACTIVE

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            self.set_password(extracted)
        else:
            self.set_password("testpass123")
        self.save()


class StudentProfileFactory(DjangoModelFactory):
    class Meta:
        model = StudentProfile

    user = factory.SubFactory(UserFactory, role=UserRole.STUDENT)
    learning_status = LearningStatus.NOT_STARTED


class TeacherProfileFactory(DjangoModelFactory):
    class Meta:
        model = TeacherProfile

    user = factory.SubFactory(UserFactory, role=UserRole.TEACHER)


class AdminProfileFactory(DjangoModelFactory):
    class Meta:
        model = AdminProfile

    user = factory.SubFactory(UserFactory, role=UserRole.ADMIN)
