# Convenções de API

## URLs

```
GET    /api/<recurso>/          # list
POST   /api/<recurso>/          # create
GET    /api/<recurso>/<id>/     # retrieve
PUT    /api/<recurso>/<id>/     # update (completo)
PATCH  /api/<recurso>/<id>/     # partial_update
DELETE /api/<recurso>/<id>/     # destroy
```

- Use kebab-case nas URLs: `/api/my-entities/`
- IDs são UUIDs: `/api/my-entities/550e8400-e29b-41d4-a716-446655440000/`

## Paginação

Todas as listagens são paginadas:

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/my-entities/?page=2",
  "previous": null,
  "results": [...]
}
```

Parâmetros: `?page=<n>&page_size=<n>` (máximo: 100)

## Erros

```json
// 400 Bad Request (ApplicationError)
{ "detail": "Mensagem de erro de negócio" }

// 404 Not Found
{ "detail": "Recurso não encontrado." }

// 401 Unauthorized
{ "detail": "Authentication credentials were not provided." }

// 422 Validation Error (DRF)
{ "field_name": ["Mensagem de erro de validação"] }
```

## Autenticação

- Header: `Authorization: Bearer <access_token>`
- Obter tokens: `POST /api/auth/login/`
- Renovar: `POST /api/auth/refresh/`
- Dados do usuário: `GET /api/auth/me/`

## Documentação Automática

- Swagger UI: `GET /api/docs/`
- Schema OpenAPI: `GET /api/schema/`
