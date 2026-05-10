# App: core

## Propósito
Utilitários compartilhados entre todos os apps. Não tem views/endpoints próprios.

## Módulos

### `errors.py` — Exception handler customizado do DRF
- `ApplicationError` → 400 (regra de negócio)
- `NotFoundError` → 404
- `PermissionDeniedError` → 403
- `custom_exception_handler()` — registrado em `REST_FRAMEWORK['EXCEPTION_HANDLER']`

### `pagination.py` — `StandardPagination`
- 20 itens/página, max 100
- Query params: `?page=N&page_size=N`
- Registrado globalmente em `REST_FRAMEWORK`

### `permissions.py` — Permission classes
- `IsOwner` — Verifica se `obj.owner` ou `obj.user` == `request.user`
- `IsStudent` — Verifica `request.user.role == STUDENT`
- `IsTeacher` — Verifica `request.user.role == TEACHER`
- `IsAdmin` — Verifica `request.user.role == ADMIN`
- `IsActiveAccount` — Verifica `request.user.account_status == ACTIVE`
- Composíveis com `&` e `|` do DRF

### `testing.py` — `APITestCase`
- Classe base para testes, com `authenticate(user)` e `deauthenticate()`

### `serializers.py`
- Serializers base compartilhados

### `services/email.py` — `SendEmailUseCase`
- Envio de email HTML via SMTP (`EmailMultiAlternatives`) com fallback automático em texto puro (via `strip_tags`)
- Suporta imagens inline anexadas via `Content-ID` (param `inline_images: dict[cid, file_path]`)
- Lê config (`EMAIL_BACKEND`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USE_TLS`, `EMAIL_USE_SSL`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `DEFAULT_FROM_EMAIL`) do settings — todas vêm de env vars
- Erros de envio são **logados, não propagados** — falha de SMTP não derruba a request
- Input via `SendEmailInput(subject, to, template_name, context, from_email?, inline_images?)`

### Management Commands
- **`seed`** — Popula banco com dados de dev (`admin@hub.dev` + `user@hub.dev`)
  - `--clear` limpa dados (preserva superusuários)

## Dependências
- Nenhuma — é importado por todos os outros apps

## Frontend Correspondente
- Equivale a `frontend/src/shared/` (HTTP client, auth guards, UI components)
