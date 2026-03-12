import json

import httpx
from decouple import config
from tenacity import retry, stop_after_attempt, wait_exponential

from core.errors import ApplicationError

from .base import AIRequest, AIResponse, BaseAIProvider


class OpenRouterProvider(BaseAIProvider):
    def __init__(self):
        self.api_key = config("OPENROUTER_API_KEY")
        self.base_url = config("OPENROUTER_BASE_URL", default="https://openrouter.ai/api/v1")
        self.timeout = config("AI_REQUEST_TIMEOUT", default=60, cast=int)
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "https://ingenia.dev",  # Ajuste conforme necessário
            "X-Title": "ingenia",
        }

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    def complete(self, request: AIRequest) -> AIResponse:
        payload = self._build_payload(request)

        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.post(
                    f"{self.base_url}/chat/completions",
                    json=payload,
                    headers=self.headers,
                )
                response.raise_for_status()
                data = response.json()
        except httpx.HTTPError as e:
            raise ApplicationError(f"Erro na comunicação com OpenRouter: {str(e)}")

        return self._parse_response(data, request)

    def complete_batch(self, requests: list[AIRequest]) -> list[AIResponse]:
        # OpenRouter não tem endpoint de batch nativo igual OpenAI (ainda),
        # então fazemos sequencial ou paralelo aqui.
        # Idealmente o Celery cuida do paralelismo, mas implementamos um loop simples.
        return [self.complete(req) for req in requests]

    def _build_payload(self, request: AIRequest) -> dict:
        payload = {
            "model": request.model,
            "messages": request.messages,
            "temperature": request.temperature,
            **request.extra_params,
        }

        if request.max_tokens:
            payload["max_tokens"] = request.max_tokens

        if request.json_schema:
            # OpenRouter suporta response_format compatível com OpenAI
            payload["response_format"] = {
                "type": "json_schema",
                "json_schema": {
                    "name": "output_schema",
                    "strict": True,
                    "schema": request.json_schema,
                },
            }

        return payload

    def _parse_response(self, data: dict, request: AIRequest) -> AIResponse:
        choice = data["choices"][0]
        content = choice["message"]["content"]
        parsed = None

        if request.json_schema:
            try:
                parsed = json.loads(content)
            except json.JSONDecodeError:
                raise ApplicationError("OpenRouter não retornou um JSON válido.")

        return AIResponse(
            content=content,
            parsed=parsed,
            model=data.get("model", request.model),
            usage=data.get("usage", {}),
            raw=data,
        )
