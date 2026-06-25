# API Reference

REST API for the Integra-te backend (Django + Django REST Framework). All endpoints are served under the `/api` prefix.

drf-spectacular generates a live OpenAPI schema from the actual code, so it's worth keeping a tab open on it instead of trusting this file blindly: schema at `GET /api/schema/`, Swagger UI at `GET /api/docs/`. If the two ever disagree, the schema is right and this file is stale — ping whoever's reading this and fix it.

## Conventions

Base URL in dev is `http://localhost:<port>/api` (check `compose.dev.yaml` for the mapped port); the frontend picks it up from `VITE_API_BASE_URL`, defaulting to `/api`. Requests are JSON unless they're uploading a file, in which case use `multipart/form-data` — those endpoints are marked below. Every primary key is a UUID, not an integer.

Auth doesn't use bearer headers — the access and refresh tokens live in `httponly` cookies (`access_token`, `refresh_token`), so requests need `credentials: "include"`, not an `Authorization` header. Errors come back as `{"detail": "<message>"}` on non-2xx responses (or DRF's usual per-field shape for validation errors).

## Authentication

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/login` | none | Authenticate with username/password, sets `access_token` + `refresh_token` cookies |
| `POST` | `/api/v1/refresh` | refresh cookie | Issues a new `access_token` cookie from the `refresh_token` cookie |
| `POST` | `/api/v1/logout` | none | Blacklists the refresh token and clears both cookies |
| `GET` | `/api/v1/me` | access cookie | Returns the current authenticated user |
| `POST` | `/api/auth/refresh/` | refresh token | Alternate `simplejwt` token-refresh endpoint (request body, not cookies) |

### `POST /api/v1/login`

Rate-limited to **5 requests/hour per IP**.

Request body:
```json
{ "username": "string", "password": "string" }
```

Responses:
- `200` — `{"detail": "Login bem-sucedido"}`, sets cookies (`access_token` 15 min TTL, `refresh_token` 24 h TTL)
- `401` — `{"detail": "Credenciais inválidas"}`

### `POST /api/v1/refresh`

No body required (reads `refresh_token` cookie).

Responses:
- `200` — `{"detail": "Token renovado com sucesso"}`, refreshes `access_token` cookie
- `401` — `{"detail": "Sem token de renovação"}` or `{"detail": "Token de renovação expirado ou inválido"}`

### `POST /api/v1/logout`

Responses:
- `200` — `{"detail": "Logged out com sucesso."}`, clears both cookies

### `GET /api/v1/me`

Requires a valid `access_token` cookie.

Response `200`:
```json
{ "username": "string", "is_staff": true }
```

## Content catalog

All resources below are registered via a DRF `DefaultRouter` under `/api/`, so each supports the standard list/detail routes:

| Resource | Base path | Detail path | ViewSet | Lookup |
|---|---|---|---|---|
| Disciplinas | `/api/disciplinas/` | `/api/disciplinas/{slug}/` | read-only | `slug` |
| Temas | `/api/temas/` | `/api/temas/{slug}/` | read-only | `slug` |
| Jogos | `/api/jogos/` | `/api/jogos/{id}/` | full CRUD | `id` (UUID) |
| Livros | `/api/livros/` | `/api/livros/{id}/` | full CRUD | `id` (UUID) |
| Exercícios | `/api/exercicios/` | `/api/exercicios/{id}/` | full CRUD | `id` (UUID) |
| Aulas | `/api/aulas/` | `/api/aulas/{id}/` | full CRUD | `id` (UUID) |
| Descarregar (PDFs) | `/api/descarregar/` | `/api/descarregar/{id}/` | full CRUD | `id` (UUID) |
| Vídeos | `/api/videos/` | `/api/videos/{id}/` | full CRUD | `id` (UUID) |

"Full CRUD" is the usual list/retrieve/create/update/destroy set.

Reads (`list`/`retrieve`) are public; writes (`create`/`update`/`destroy`) require a logged-in session (`IsAuthenticatedOrReadOnly`) — anonymous POST/PUT/PATCH/DELETE against any of these now gets a `401`.

`publicado` is also enforced server-side now: an anonymous request only ever sees rows where `publicado=True`. A logged-in user (any authenticated session, not just staff) sees everything, drafts included, so the dashboard can show editors their own unpublished work. Disciplinas and Temas have no `publicado` field and stay fully public regardless.

Creates and updates also stamp `createdBy`/`updatedBy` (the requesting user's username, read-only) on Jogos, Livros, Exercícios, Aulas, Descarregar, and Vídeos — see the field tables below.

The upload-capable ones (Jogos, Livros, Exercícios, Aulas, Descarregar, Vídeos) take either JSON or `multipart/form-data`.

### Disciplinas

Read-only — there's no create/update/delete here, only list and retrieve.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | |
| `nome` | string | |
| `slug` | string | lookup key |
| `desc` | string | |

### Temas

Also read-only.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | |
| `titulo` | string | |
| `slug` | string | lookup key |
| `desc` | string | |
| `ano_escolar` | string | one of `1º Ano`…`6º Ano` |
| `seccao` | string | one of `aprender`, `resolver`, `ler` |
| `disciplina` | UUID | FK to Disciplina |
| `disciplina_nome` | string | read-only, denormalized |

### Jogos

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | read-only |
| `disciplina` | UUID | nullable FK |
| `titulo` | string | |
| `descricao` | string | |
| `faixa_etaria` | string | optional |
| `subjectId` | string | maps to `subject_id` |
| `level` | int | nullable |
| `thumbnailUrl` | string | read-only, resolves uploaded `thumbnail` or `thumbnailUrlInput` |
| `thumbnailUrlInput` | string | write-only, external thumbnail URL |
| `thumbnail` | file | write-only image upload |
| `videoUrl` | string (URL) | maps to `video_url` |
| `url_externa` | string (URL) | optional, external game link |
| `ficheiro` | file | write-only upload |
| `ficheiro_url` | string | read-only, resolves uploaded `ficheiro` or `url_externa` |
| `publicado` | bool | |
| `criado_em` | datetime | read-only |
| `disciplina_nome`, `disciplina_slug` | string | read-only, denormalized |
| `createdBy`, `updatedBy` | string or `null` | read-only, username of whoever created/last updated it |

### Livros

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | read-only |
| `titulo` | string | |
| `autor` | string | optional |
| `faixa_etaria` | string | |
| `resumo` | string | optional |
| `temas` | string | optional, free text |
| `capa` | file | write-only cover image upload |
| `capa_url` | string | read-only |
| `ficheiro` | file | write-only |
| `ficheiro_url` | string | read-only |
| `publicado` | bool | |
| `criado_em` | datetime | read-only |
| `createdBy`, `updatedBy` | string or `null` | read-only |

### Exercícios

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | read-only |
| `title` | string | |
| `level` | int | required |
| `subjectId` | string | maps to `subject_id`, required |
| `titleColor` | string | optional, maps to `title_color` |
| `iconImg` | string | optional, maps to `icon_img` |
| `path` | string | optional |
| `description` | string | optional |
| `pdfUrl` | string (URL) | maps to `pdf_url` |
| `thumbnailUrl` | string | read-only |
| `thumbnailUrlInput` | string | write-only |
| `thumbnail` | file | write-only |
| `videoUrl` | string (URL) | maps to `video_url` |
| `ficheiro` | file | write-only |
| `ficheiro_url` | string | read-only |
| `publicado` | bool | |
| `createdBy`, `updatedBy` | string or `null` | read-only |

### Aulas

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | read-only |
| `title` | string | |
| `subjectId` | string | maps to `subject_id`, required |
| `level` | int | required |
| `description` | string | optional |
| `videoUrl` | string (URL) | maps to `video_url` |
| `thumbnailUrl` | string | read-only |
| `thumbnailUrlInput` | string | write-only |
| `thumbnail` | file | write-only |
| `ficheiro` | file | write-only |
| `ficheiro_url` | string | read-only |
| `createdAt` | datetime | read-only, maps to `created_at` |
| `publicado` | bool | |
| `createdBy`, `updatedBy` | string or `null` | read-only |

### Descarregar / Vídeos

Same underlying `Conteudo` model for both — Descarregar is just `Conteudo` filtered to `tipo="pdf"`, Vídeos to `tipo="video"`. Don't bother sending `tipo` on create/update, the viewset sets it for you (and for Descarregar it also forces `descarregavel` to `true`, since that's the whole point of that endpoint).

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | read-only |
| `tema` | UUID | FK to Tema |
| `titulo` | string | |
| `tipo` | string | server-managed; `pdf` or `video` |
| `corpo` | string | optional |
| `dificuldade` | string | optional, one of `basico`, `intermedio`, `avancado` |
| `url_externa` | string (URL) | optional |
| `descarregavel` | bool | forced `true` for Descarregar |
| `publicado` | bool | |
| `criado_em` | datetime | read-only |
| `ficheiro` | file | write-only |
| `ficheiro_url` | string | read-only |
| `thumbnail` | file | write-only |
| `thumbnail_url` | string | read-only |
| `disciplina_slug`, `disciplina_nome`, `tema_titulo` | string | read-only, denormalized via `tema` |
| `createdBy`, `updatedBy` | string or `null` | read-only |

## Voice search

Mounted under `/api/v1/voice/`, also all `AllowAny` — same caveat as above.

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/voice/transcribe/` | Transcribe an uploaded audio clip to Portuguese text (Whisper) |
| `POST` | `/api/v1/voice/reroute/` | Map a transcript to an in-app route, by keyword rules then semantic similarity |
| `GET` | `/api/v1/voice/search/` | Free-text search across the content catalog (rate-limited) |

### `POST /api/v1/voice/transcribe/`

`multipart/form-data` with an `audio` file field (webm-compatible audio).

Response `200`:
```json
{ "transcript": "string" }
```
Response `400`: `{"error": "No audio file."}`

### `POST /api/v1/voice/reroute/`

Body:
```json
{ "transcript": "string" }
```
Query params: `top` (1–10, default 1) — number of candidate matches to return when falling back to semantic search.

Routing first checks fixed keyword rules (e.g. "jogo" → `/jogos`, "exercício" → `/resolver`, optionally appending `?subject=<id>` when a subject keyword like "matemática" is detected). If no keyword matches, it falls back to cosine-similarity search over precomputed route embeddings (`pgvector`).

Response `200`:
```json
{
  "route": "/jogos",
  "results": [
    { "route": "/jogos", "label": "string", "distance": 0 }
  ]
}
```
Response `400`: `{"error": "No transcript."}`

### `GET /api/v1/voice/search/`

Rate-limited to **20 requests/minute per IP**.

Query params: `q` (required, min length 2), `top` (1–20, default 8).

Case-insensitive substring search across Disciplinas, Temas, and published Jogos/Livros/Exercícios/Aulas, merged and truncated to `top`.

Response `200`:
```json
{ "results": [ { "label": "string", "route": "string" } ] }
```
Response `200` (query too short): `{"results": []}`
Response `429`: `{"detail": "Request was throttled. Expected available in <n> second(s)."}`
