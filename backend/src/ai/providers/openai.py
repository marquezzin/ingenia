import json

from decouple import config
from openai import OpenAI, OpenAIError
from tenacity import retry, stop_after_attempt, wait_exponential

from core.errors import ApplicationError

from .base import AIRequest, AIResponse, BaseAIProvider


class OpenAIProvider(BaseAIProvider):
    def __init__(self):
        self.api_key = config("OPENAI_API_KEY", default="")
        self.client = OpenAI(api_key=self.api_key)

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    def complete(self, request: AIRequest) -> AIResponse:
        kwargs = {
            "model": request.model,
            "messages": request.messages,
            "temperature": request.temperature,
            **request.extra_params,
        }

        if request.max_tokens:
            kwargs["max_tokens"] = request.max_tokens

        if request.json_schema:
            kwargs["response_format"] = {
                "type": "json_schema",
                "json_schema": {
                    "name": "output_schema",
                    "strict": True,
                    "schema": request.json_schema,
                },
            }

        try:
            response = self.client.chat.completions.create(**kwargs)
        except OpenAIError as e:
            raise ApplicationError(f"Erro na comunicação com OpenAI: {str(e)}")

        return self._parse_response(response, request)

    def complete_batch(self, requests: list[AIRequest]) -> list[AIResponse]:
        return [self.complete(req) for req in requests]

    def _parse_response(self, response, request: AIRequest) -> AIResponse:
        choice = response.choices[0]
        content = choice.message.content
        parsed = None

        if request.json_schema:
            try:
                parsed = json.loads(content)
            except json.JSONDecodeError:
                raise ApplicationError("OpenAI não retornou um JSON válido.")

        return AIResponse(
            content=content,
            parsed=parsed,
            model=response.model,
            usage=response.usage.model_dump(),
            raw=response.model_dump(),
        )
