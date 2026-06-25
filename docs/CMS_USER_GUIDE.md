@authored by @cstriker421
# CMS User Guide — INTEGRA-TE

Project II · Web Programming · ETIC_Algarve · 2025/26
Client: Fundação António Aleixo · Group A

Maintainers: Giulio (docs), Adrien (DEVOps/CMS), Diogo (CMS/admin config), Cristian (backend models & admin)

---

## Contents

1. [Introduction](#1-introduction)
2. [Getting the project running](#2-getting-the-project-running)
3. [Administrative onboarding](#3-administrative-onboarding)
4. [Database records — adding, editing, removing](#4-database-records--adding-editing-removing)
5. [Uploads](#5-uploads)
6. [Asset controls](#6-asset-controls)
7. [Content workflows](#7-content-workflows)
8. [Verification controls](#8-verification-controls)
9. [Glossary](#9-glossary)
10. [Common errors](#10-common-errors)
11. [Who to ask](#11-who-to-ask)

---

## 1. Introduction

This is the operating manual for whoever is keeping content on INTEGRA-TE up to date — adding a Disciplina, uploading a worksheet, swapping a logo, fixing a typo in a Tema description, that kind of thing. It's written for the foundation's content team, not for developers. No terminal, no SQL — except section 2, which is for whoever needs to get the project running locally in the first place.

If you're a developer working on the platform itself, you want `README.md`, `ARCHITECTURE_FASE3.md`, `DATA_MODEL_FASE3.md`, `WORKFLOW_FASE3.md`, or `CONTRIBUTORS.md` instead.

---

## 2. Getting the project running

Everything below assumes the project is already running somewhere (dev server, staging, production). If you need to get it running locally from scratch — a fresh clone, a new machine, after a long break — this is the short version.

### The one command

```bash
make start-dev
```

This single command does the entire dev setup for you:

1. Confirms twice that you actually want to do this (it **clears the database** and replaces it with sample data — see the warning below).
2. Installs dependencies (frontend + backend) and sets up the `.env` file if it doesn't exist yet.
3. Builds and starts all the Docker containers (Postgres with pgvector, Django backend, Vite frontend, Adminer).
4. Waits until the backend is actually able to respond before continuing — no racing migrations against a database that isn't ready yet.
5. Runs migrations.
6. Prompts you interactively to create a superuser (your own admin login).
7. Seeds the database with realistic sample content (`scripts/seed_db2.py`) — real Disciplinas/Temas, lessons, exercises, books, games, and the search index for voice search.
8. Attaches you to the live container logs, so you immediately see if anything's wrong.

Once it finishes (or once you see `Watching for file changes with StatReloader` in the logs), the site is at `http://localhost:5178`, the API at `http://localhost:8050/api/`, and Django Admin at `http://localhost:8050/admin/`.

**The two confirmation prompts are not decorative.** `make start-dev` wipes whatever is currently in the dev database every time you run it. If you've been editing content through the dashboard and don't want to lose it, don't run this — use `make up-dev` instead (starts the existing containers without touching the database) or `make restart` (restarts containers, also doesn't touch data).

### If you only need one piece of it

| You want to... | Run |
|---|---|
| Start containers without wiping anything | `make up-dev` |
| Just re-seed the sample content (still wipes data) | `make populate-dev` |
| Rebuild the search index after seeding | `make embed` |
| Create another admin account | `make superuser-dev` |
| See backend logs | `make logs-backend-dev` |
| Stop everything | `docker compose -f compose.dev.yaml down` (or `Ctrl+C` then `make restart` next time) |

`make help` lists every target with a one-line description if you need something not covered here.

### What you need installed first

Docker and Docker Compose. That's genuinely it for running the project — `make start-dev` installs everything else (Node packages, Python dependencies via `uv`) inside containers or via `make sync-dev`. If `make sync-dev` fails because `uv` or `npm` aren't on your machine, install those two first; the README has the exact versions.

---

## 3. Administrative onboarding

### Access levels

| Level | Django flags | Can do |
|---|---|---|
| Editor | `is_staff` | Add/edit/unpublish content, upload files |
| Admin | `is_staff` + `is_superuser` | All of the above, plus create/delete accounts, edit the Disciplina taxonomy |
| Developer | full system access | Everything, plus code/migrations/server |

Most people should be Editors. Keep Admin to one or two people who actually need it.

### Creating the first account

If you ran `make start-dev`, you already have one — it prompts for this automatically. To create another one later:

```bash
make superuser-dev      # development
make superuser-prod     # production
```

It prompts for username, email, password. There's also `make superuser-auto-dev`, which creates a default superuser straight from your `.env` without the prompts — handy for scripting a fresh dev environment, not something you'd want to run in production.

### Creating everyone else

Once that first account exists, do it from the browser:

1. Log in to `/admin/` with an Admin account.
2. **Authentication and Authorization → Users → Add user.**
3. Pick a username — the convention so far is `firstname.lastname`.
4. Set a password (Django Admin can generate one for you).
5. Save, then on the next screen fill in name/email and tick **Staff status**. Tick **Superuser status** too if this is meant to be an Admin account, otherwise leave it off.
6. Save again, and pass the username + temporary password to the new editor through some channel that isn't plain email.

### First login and forgotten passwords

There's no self-service "forgot password" flow in Django Admin. If someone's locked out, an Admin has to reset it for them: open their user record, click the small "this form" link next to the password field, set something temporary, save, and tell them in person or over a secure channel to change it immediately after logging in.

### Offboarding

When someone leaves, uncheck **Active** on their account rather than deleting it — their past edits stay attributed to them, they just can't log in anymore. If there's ever a hard requirement to erase someone's data entirely (a GDPR request, say), that's handled outside this guide — see the `/rgpd` page and the contact form on the public site, and loop in whoever owns privacy/compliance.

### Who did what

For account changes (creating/disabling editors), Django Admin logs every change automatically — top right **History** on any user, or **Recent actions** in the sidebar.

For content, Jogo/Livro/Exercício/Aula/Conteúdo carry `createdBy`/`updatedBy` — the dashboard shows whoever created or last touched a record. Disciplina and Tema don't have that field, since there's no write path to them outside Django Admin anyway — Admin's own History view covers those two. There's still no full change history (who changed what, when, what it used to say) for any content type — just the most recent editor's name.

### A note on sessions, because the two systems are different

Django Admin logins are a normal Django session — by default that's roughly two weeks before you're logged out. The dashboard is a *different* auth system: short-lived JWTs in cookies (15-minute access token, 24-hour refresh, auto-renewed quietly in the background while you work, so you shouldn't notice it). The two behave differently if you're ever logged into both — Admin keeps you in much longer than the dashboard would.

---

## 4. Database records — adding, editing, removing

### Two ways in

Both surfaces work, but they're not equally meant for editors day to day:

| | Custom dashboard | Django Admin |
|---|---|---|
| URL | `/dashboard` | `/admin/` |
| Language | Portuguese | English |
| Status | **Live — this is what you use** | Also live, content models registered |
| Good for | Everything in this section | A developer/debug escape hatch, and managing editor accounts (section 3) |

The dashboard is a real React app with one panel per content type (Aulas, Exercícios, Livros, Jogos, Ficheiros, Vídeos), gated behind a login. It calls the same API documented in `API_REFERENCE.md`.

Django Admin also shows Disciplina, Tema, Conteúdo, Jogo, Livro, Exercício, and Aula (`srcs/backend/integrate/admin.py` registers all of them). It works, but it's in English and it's not the workflow editors are trained on — and since both surfaces read and write the same database, don't enter the same record twice.

### How it fits together

```
Disciplina ── Tema ── Conteúdo
Jogo, Livro, Exercício, Aula  (mostly standalone)
```

A Disciplina is a subject (Português, Matemática, Estudo do Meio / Ciências Naturais). A Tema is a topic inside a subject, tied to a specific school year and site section. Conteúdo is the actual material inside a Tema — a video, an article, a PDF. Jogo, Livro, Exercício and Aula are largely independent of that tree.

Two things to keep in your head for all of it:

- **`publicado` is the single switch controlling visibility, enforced server-side for every content type.** Unchecking it on a draft Aula, Exercício, Jogo, or Livro hides it from anonymous visitors and from the API itself, not just from whichever page you're looking at.
- **Deleting a parent deletes its children.** Delete a Disciplina and every Tema under it goes too, and every Conteúdo under those Temas. Django will show you the full list of what's about to disappear before you confirm — read it.

### Disciplina

This is the fixed taxonomy: Português, Matemática, Ciências Naturais (the public site groups this one under the "Estudo do Meio" label). Don't add a fourth one on a whim — it changes the homepage and navigation everywhere, so that's an Admin decision, ideally after checking with Adrien. **There's no dashboard panel for Disciplinas** — Django Admin only, for now.

Fields: `nome` (display name), `slug` (lowercase, hyphens, no accents — used in URLs), `desc` (short description shown on the subject page). All three are required. Avoid changing `slug` once a Disciplina is live; every link to it breaks.

### Tema

A topic inside a Disciplina, scoped to a school year (`1º Ano`–`6º Ano`) and a site section (`aprender`, `resolver`, `ler`). The same topic title can legitimately exist multiple times — once per section, once per year — because the database enforces uniqueness on the combination of Disciplina + slug + section, not on the title.

If you get an "already exists" error saving a Tema, that combination is taken. Either it's a genuine duplicate, or you need a different slug.

Fields: `disciplina`, `titulo`, `slug`, `desc`, `ano_escolar`, `seccao` — all required. **Like Disciplina, there's no dashboard panel for Temas** — the dashboard only ever *reads* the Tema list (to populate the Tema dropdown when creating a Ficheiro or Vídeo). Creating a new Tema means Django Admin.

### Conteúdo

This is where Vídeos and Ficheiros (Descarregar) live — one record per video, article, image, or PDF, tied to a Tema.

| Field | Required? | Notes |
|---|---|---|
| `tema` | yes | parent topic |
| `tipo` | yes | `texto`, `imagem`, `video`, `pdf` — for Vídeos/Ficheiros the dashboard sets this for you |
| `titulo` | yes | |
| `corpo` | yes | the article text, a caption, or a description — always required regardless of `tipo` |
| `ficheiro` | depends on `tipo` | the actual file for `pdf`/`imagem` |
| `url_externa` | depends on `tipo` | for `video`, normally a YouTube link; also works as an external PDF link instead of uploading |
| `thumbnail` | optional, but do it anyway | card image — videos and PDFs look bad without one |
| `dificuldade` | optional | `basico`, `intermedio`, `avancado` |
| `descarregavel` | yes | adds a download button on the public side, PDFs only — the dashboard's Ficheiros panel sets this automatically |
| `publicado` | yes | the visibility switch |

Roughly: text needs `corpo` and nothing else, images and PDFs need `ficheiro` or `url_externa`, videos need `url_externa` or `ficheiro`. None of this is enforced by the form — it'll happily let you save a `video` Conteúdo with no link and no thumbnail, it'll just look broken on the public site. Get used to checking the live page after publishing.

### Jogo

Either an external game (a link) or one the foundation made (an upload). The dashboard's Jogos panel now covers every field on the model:

| Field | Required? | Notes |
|---|---|---|
| `titulo`, `descricao` | yes | |
| `subjectId` | yes | `matematica` / `portugues` / `estudo-do-meio` — picked from a dropdown |
| `disciplina` | optional | the real Disciplina link, separate from `subjectId` — leave blank for cross-discipline games |
| `level` | yes | 1–3 |
| `faixa_etaria` | optional | controls the age filter (`4-6` / `6-9` / `9-12`) on the public Jogos page — leaving it blank means the game only shows up under "Todos", never under a specific age filter |
| `url_externa` | optional | for a recommended game with no file of its own |
| `ficheiro` | optional | upload for a project-made game |
| `thumbnail` / `thumbnailUrl` | optional | upload or paste a URL |
| `videoUrl` | optional | a trailer/demo video link |
| `publicado` | yes | |

One thing worth flagging rather than pretending it's tidy: Jogo has **two different ways to indicate subject** — the real `disciplina` foreign key, and the `subjectId` dropdown, which is free text under the hood (`matematica`/`portugues`/`estudo-do-meio`). They're not kept in sync automatically; if you set one, set the other too if it's relevant.

### Livro

Standalone book recommendation, no Disciplina link. `titulo`, `autor`, `faixa_etaria`, `resumo` are required; `temas` is a free-text field (not a real relation to Tema, just a string you can put keywords in) and is optional, as are the cover (`capa`) and the file (`ficheiro`). The dashboard's Livros panel covers all of these.

### Exercício

`title`, `level`, and `subjectId` are required (same `subjectId`/`disciplina` caveat as Jogo applies here, except Exercício has no `disciplina` field at all — only the free-text subject). `description`, `videoUrl`, and the worksheet are all optional — the worksheet can be either an uploaded `ficheiro` or a `pdfUrl` pointing at an already-existing PDF (the dashboard form supports both; picking one clears the other).

There are also `title_color`, `icon_img`, and `path` fields on the model. These are real and the frontend uses them, but they're **not exposed in the dashboard form on purpose** — they're presentation/routing details, not editorial content. Leave them alone unless you're coordinating directly with whoever's working on that page.

### Aula

`title`, `subjectId`, and `level` are required. `description`, `videoUrl`, thumbnail, and `ficheiro` are optional — and yes, an Aula can have both a video link and an uploaded PDF at the same time; the dashboard form supports attaching both to the same lesson.

### Registering models in Django Admin (for reference)

`srcs/backend/integrate/admin.py` registers Disciplina, Tema, Conteúdo, Jogo, Livro, Exercício, and Aula — this already exists, nothing to do here unless a new model gets added later. `settings.py` still has `LANGUAGE_CODE = "en-us"` and `TIME_ZONE = "UTC"`; switching those to `"pt-pt"` and `"Europe/Lisbon"` would make Django Admin's labels and dates match what editors actually expect — a cheap win for whoever's next in that file.

---

## 5. Uploads

### What goes where

| Model | Field | What it is |
|---|---|---|
| Conteúdo | `ficheiro` | the PDF/image/video file |
| Conteúdo | `thumbnail` | card preview image |
| Jogo | `ficheiro` | game download |
| Jogo | `thumbnail` | card preview image |
| Livro | `capa` | book cover |
| Livro | `ficheiro` | book PDF |
| Exercício | `ficheiro`, `thumbnail` | worksheet + preview |
| Aula | `ficheiro`, `thumbnail` | lesson file + preview |

### No guardrails yet

Worth knowing before you upload something questionable: there's currently no file-type restriction, no size cap beyond Django's default in-memory threshold, and no virus scanning. The server will accept whatever you give it. So: check the file yourself before you save the record, and don't go above ~25 MB per file as a rule of thumb — anything bigger should probably be compressed or split. If this becomes a real problem, ask Cristian about adding `FileExtensionValidator` and a proper `DATA_UPLOAD_MAX_MEMORY_SIZE` — it's a small change, just hasn't been prioritized.

### Where files actually land

Everything goes under `MEDIA_ROOT`, served publicly under `/media/`. Each model writes into its own subfolder — you don't choose this, Django does it based on the field. If a filename collides with something already there, Django just appends a random suffix; you'll see the new name reflected once you save.

### Deleted records leave their files behind

This one catches people out: deleting a record (or clearing a file field) removes the database reference but **not** the file on disk. Over time that's wasted storage, nothing more — it's not a security issue, just clutter. There's no automated cleanup for this right now; if it ever gets big enough to matter, the fix is a small Django management command (or the `django-cleanup` package) that diffs the media folder against what's still referenced in the database.

### When an upload goes wrong

- **Save hangs** — usually a large file timing out. Compress it.
- **"Permission denied" on save** — a server/volume issue, not something you can fix from the browser. Flag it to a developer.
- **File link is broken after publishing** — try a hard refresh (Ctrl+F5) before assuming it's actually broken; the frontend caches more aggressively than you'd expect.
- **Image looks rotated** — that's EXIF orientation not being respected on display. Re-export the image with the rotation baked in.
- **PDF won't open** — check it isn't password-protected; that's the most common cause.

---

## 6. Asset controls

**Branding assets** (logos, decorative backgrounds, navbar icons) live in `srcs/frontend/src/assets/` and get baked into the build at deploy time. Changing one means swapping the file, rebuilding, redeploying — a developer task (`make convert` for WebP conversion, `make rebuild` to deploy it). **CMS-managed media** (a book cover, a worksheet PDF) is whatever an editor uploads through the dashboard and lives in `MEDIA_ROOT` — see section 5.

### The EU/funding logos in the footer

The footer carries the Fundação António Aleixo logo, the EU/FSE flag, the Algarve 2030 signature bar, and the Loulé municipality logo. These are a funding-visibility requirement, not a design choice — they need to stay legible, unmodified, and present on every public page. If a new page gets added without the shared `Footer` component, or someone restyles it into illegibility, raise it immediately — Giulio owns this area and it's part of the foundation's compliance obligations toward the funder.

### Backups

Daily backups of the Postgres database and the media volume are a developer responsibility, not something editors need to think about day-to-day.

---

## 7. Content workflows

This section is a first pass, not a finished policy — the foundation's team should weigh in on tone and age-appropriateness specifics before it's treated as final.

**Voice.** Material is for 6–12 year-olds and their parents/teachers reading alongside them. Write directly, short sentences, European Portuguese spelling and conventions (not Brazilian). When in doubt about register, read it out loud — if it sounds like a textbook, simplify it.

**Sourcing.** If a video or book is someone else's work, it has to either be openly licensed, or you have to have an actual basis to believe redistribution/linking is fine (linking to a public YouTube video is fine; re-uploading someone else's PDF generally isn't, unless you have explicit permission). When unsure, link instead of hosting a copy.

**Naming files before upload.** There's no enforced convention, but for your own sanity name files something like `matematica-3ano-fracoes-01.pdf` rather than `Documento1.pdf`.

**Difficulty tagging.** `basico` / `intermedio` / `avancado` is a judgment call, not a formula. Roughly: basico introduces the concept, intermedio practices it, avancado combines it with something else or pushes past the year's normal expectations.

**Section assignment.** `aprender` is for material that teaches a concept. `resolver` is for practice. `ler` is for reading material. If something straddles two, pick the one it's *primarily* for.

**Marking something ready for review.** There's no "submitted for review" flag in the system right now — that's a real gap. Until it exists, the working approach: leave the content unpublished, and tell whoever's reviewing directly that it's ready to look at. Don't flip `publicado` yourself until you hear back.

---

## 8. Verification controls

Also a first draft. Before flipping `publicado` to true on anything, somebody other than the person who created it should check:

- Spelling, grammar, and that it's actually European Portuguese.
- The fields match what the content type needs (section 4).
- There's a thumbnail, and it isn't stretched or pixelated.
- The difficulty tag feels right for the year group it's tagged for.
- The file actually opens — click it, don't assume. For PDFs: opens cleanly, isn't password-protected, text is selectable rather than a flat scanned image.
- For embedded videos: comes from a source we'd be comfortable being associated with, no autoplaying ads, ideally `youtube-nocookie.com`.
- Images have alt text where the platform supports it.
- The page it lives on still shows the footer with the funding logos intact.

If something fails, unpublish or hold off publishing and say why. If something inappropriate slips through and goes public: uncheck `publicado` immediately, don't wait for a meeting first, then talk about what happened afterward.

Worth checking back on older published content occasionally too — YouTube videos go private, external PDFs move or disappear, and nothing currently tells you when that happens. There's no automated link-checking yet; for now it's a manual spot-check.

---

## 9. Glossary

- **Disciplina** — a school subject (Português, Matemática, Ciências Naturais / Estudo do Meio).
- **Tema** — a topic inside a Disciplina, tied to a school year and a section.
- **Conteúdo** — one piece of material: a video, article, image, or PDF.
- **Aprender / Resolver / Ler** — the three public sections (learn / practice / read).
- **Publicado** — the checkbox controlling whether something is visible publicly.
- **Slug** — the URL-safe identifier (lowercase, hyphens, no accents).
- **Foreign key** — a link from one record to another, e.g. Tema points at a Disciplina.

## 10. Common errors

| Message | What it means | What to do |
|---|---|---|
| "This field is required" | A required field is empty | Check the field table for that model in section 4 |
| "already exists" on a Tema | The Disciplina + slug + section combination is taken | Change the slug, or check it isn't a genuine duplicate |
| "Upload a valid image" | File isn't a real/valid image, or got corrupted in transfer | Re-export as JPG or PNG and try again |
| Content saved but not visible publicly | `publicado` is still unchecked, or the public page is cached | Check the checkbox first, then hard-refresh (Ctrl+F5) |
| `401` when saving from outside the dashboard | Catalog writes require a logged-in session | Make sure you're actually logged in (check `/api/v1/me`); expected if scripting against the API directly |
| Save times out on a big file | Upload too large for the current limits | Compress the file before retrying |
| `make start-dev` hangs at "Backend not ready yet..." | Containers still building, or the backend crashed on startup | Give it another minute; if it keeps looping, check `make logs-backend-dev` for the actual error |

## 11. Who to ask

- CMS / "how do I do X" questions — Giulio
- Something in the CMS is actually broken — Adrien
- A model field looks wrong or you need a new one — Cristian
- A static logo/asset needs swapping — Diogo

---

*Last updated: 2026-06-25.*
