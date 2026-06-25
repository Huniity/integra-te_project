# Architecture — Fase 3

This replaces `ARCHITECTURE.md` as the reference for what the system actually looks like at this point. The original was drawn during Fase 2, before most of this was built, and it's drifted enough from reality (extra fields that don't exist, endpoints that were never built, a CMS surface that's described as "future" when it's actually shipped) that it was doing more harm than good. Everything below was checked against the current models, urls, settings, compose files, and frontend routes rather than carried over from the old diagram.

`ARCHITECTURE.md` stays in the repo for the Fase 2 deliverable link in `DELIVERABLES_FASE_2.md` — don't delete it, just don't trust it for anything current.

## Data model

Pulled out into its own file since it's a separate Fase 3 deliverable — see `DATA_MODEL_FASE3.md` for the ER diagram and the gotchas in how the models actually relate to each other (subject tagging being inconsistent across Jogo/Exercicio/Aula, etc.).

## Two ways content gets in

This is the part the Fase 2 diagram got wrong: it drew Django Admin as *the* CMS. What actually exists today is a custom React dashboard at `/dashboard`, gated by `RequireAuth`, with one panel per content type (Aulas, Exercícios, Livros, Jogos, Ficheiros/Descarregar, Vídeos) — each panel just calls the same DRF endpoints documented in `API_REFERENCE.md`. Django Admin is also wired up now (`integrate/admin.py` registers Disciplina, Tema, Conteudo, Jogo, Livro, Exercicio, Aula), mainly as a developer/debug surface; the dashboard remains the one editors actually use day to day.

`publicado` is enforced server-side: anonymous requests to the catalog only ever get `publicado=True` rows, and only authenticated users (write access requires login too) see drafts. Detail in `WORKFLOW_FASE3.md` section 4.

```mermaid
flowchart TD

  subgraph BROWSER["Browser"]
    SPA["React 19 SPA — Vite + Tailwind\nPublic pages: Home · Aprender · Resolver · Jogos · Ler · Descarregar · Vídeos · Sobre · FAQ · Privacidade · RGPD · Contactar"]
    DASH["/dashboard — RequireAuth\nPanels: Overview · Aulas · Exercícios · Livros · Jogos · Ficheiros · Vídeos"]
    VOICE["MediaRecorder — mic capture, recorded client-side\nsent to backend for transcription (not the Web Speech API)"]
  end

  subgraph DJANGO["Django 6 Application"]
    AUTH["Auth views\nPOST /api/v1/login, /logout, /refresh\nGET /api/v1/me"]
    CATALOG["DRF router — /api/\ndisciplinas · temas · jogos · livros\nexercicios · aulas · descarregar · videos"]
    VOICEAPI["/api/v1/voice/\ntranscribe · reroute · search"]
    DOCS["drf-spectacular\n/api/schema/ · /api/docs/"]
    ADMINSTUB["/admin/ — Django Admin\n(content models registered; debug/dev use)"]
  end

  subgraph ML["ML, in-process"]
    WHISPER["Whisper (base)\naudio to pt transcript"]
    EMBED["sentence-transformers\nparaphrase-multilingual-MiniLM-L12-v2"]
  end

  subgraph STORAGE["Storage"]
    PG[("PostgreSQL 18 + pgvector\ncontent tables + ObjectVector")]
    MEDIA["MEDIA_ROOT volume\nuploaded PDFs, images, files"]
  end

  subgraph EXTERNAL["External"]
    WEB3["Web3Forms API\ncontact form, browser POSTs directly"]
    YT["YouTube (nocookie embeds)"]
  end

  SPA -->|fetch, credentials: include| AUTH
  SPA -->|fetch, credentials: include| CATALOG
  SPA --> YT
  SPA -->|POST access_key + form data| WEB3
  DASH -->|JWT cookie required| CATALOG
  DASH --> AUTH
  VOICE --> VOICEAPI

  VOICEAPI --> WHISPER
  VOICEAPI --> EMBED
  VOICEAPI --> PG

  AUTH -->|sets/reads access_token, refresh_token cookies| PG
  CATALOG --> PG
  CATALOG --> MEDIA
  ADMINSTUB --> PG
```

## Auth, concretely

There isn't one auth system, there are two, and they don't talk to each other:

- **The API** (everything under `/api/`, including what the dashboard calls) uses JWT access/refresh tokens stored as `httponly` cookies — 15-minute access token, 24-hour refresh, rotated on use. Reads are public; writes now require an authenticated session (`IsAuthenticatedOrReadOnly`) on every catalog endpoint. Full detail is in `API_REFERENCE.md`.
- **Django Admin** uses Django's own session cookie, defaulting to a ~2-week lifetime, completely separate from the JWT cookies above. Now that content models are registered there too, it's a second real way to log in and edit — just not the one editors are trained on.

## Deployment topology

```mermaid
flowchart LR

  subgraph DEV["docker compose — dev"]
    DDB["db\npgvector/pgvector:pg18"]
    DAD["adminer\n:8088"]
    DBE["backend\nDjango runserver :8050"]
    DFE["frontend\nVite dev server :5178"]
  end

  subgraph PROD["docker compose — prod"]
    PDB["db\npgvector/pgvector:pg18"]
    PBE["backend\ngunicorn :8000\nserves built frontend + collectstatic"]
    PNX["nginx :80\nstatic/media/SPA + reverse proxy"]
  end

  DFE --> DBE
  DBE --> DDB
  DAD --> DDB

  PNX -->|"/api/, /admin/"| PBE
  PNX -->|"/, /static/, /media/"| PNX
  PBE --> PDB
```

Two things worth keeping in sync if either file changes:

- **Prod Postgres matches dev**: both run `pgvector/pgvector:pg18`, which the voice-search migration needs (`CREATE EXTENSION IF NOT EXISTS vector;`). CI's test database uses the same image.
- **`ops/nginx/nginx.conf` proxies `/api/` and `/admin/` to `backend:8000`**, matching what the prod backend container actually exposes (`gunicorn ... --bind 0.0.0.0:8000`).

## What changed since Fase 2

For anyone comparing against the old diagram: Exercício and Aula didn't exist yet, there was no auth system at all (Django Admin was assumed to be the entire CMS), there was no voice search / pgvector / Whisper, no drf-spectacular docs, and no React dashboard. The `/materiais/` and `/pesquisa/` endpoints drawn in the old diagram were never built — the real equivalents are the per-type catalog endpoints (`/api/jogos/`, `/api/livros/`, etc.) and `/api/v1/voice/search/`.
