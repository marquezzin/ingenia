from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any


@dataclass
class AIRequest:
    model: str
    messages: list[dict]
    json_schema: dict | None = None
    temperature: float = 0.7
    max_tokens: int | None = None
    extra_params: dict = field(default_factory=dict)


@dataclass
class AIResponse:
    content: str
    parsed: dict | None
    model: str
    usage: dict
    raw: dict


class BaseAIProvider(ABC):
    @abstractmethod
    def complete(self, request: AIRequest) -> AIResponse:
        pass

    @abstractmethod
    def complete_batch(self, requests: list[AIRequest]) -> list[AIResponse]:
        pass
