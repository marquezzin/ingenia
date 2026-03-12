from .base import AIRequest, AIResponse, BaseAIProvider
from .openai import OpenAIProvider
from .openrouter import OpenRouterProvider


def get_provider(name: str = "openrouter") -> BaseAIProvider:
    providers = {
        "openrouter": OpenRouterProvider,
        "openai": OpenAIProvider,
    }
    cls = providers.get(name)
    if not cls:
        raise ValueError(f"Provider '{name}' não encontrado.")
    return cls()
