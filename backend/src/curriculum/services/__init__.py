"""Curriculum app — Services (UseCases)."""

from .lesson import (
    CreateLessonInput,
    CreateLessonUseCase,
    DeleteLessonInput,
    DeleteLessonUseCase,
    UpdateLessonInput,
    UpdateLessonUseCase,
    VideoLessonInput,
)
from .module import (
    CreateModuleInput,
    CreateModuleUseCase,
    DeleteModuleInput,
    DeleteModuleUseCase,
    UpdateModuleInput,
    UpdateModuleUseCase,
)

__all__ = [
    "CreateLessonInput",
    "CreateLessonUseCase",
    "CreateModuleInput",
    "CreateModuleUseCase",
    "DeleteLessonInput",
    "DeleteLessonUseCase",
    "DeleteModuleInput",
    "DeleteModuleUseCase",
    "UpdateLessonInput",
    "UpdateLessonUseCase",
    "UpdateModuleInput",
    "UpdateModuleUseCase",
    "VideoLessonInput",
]
