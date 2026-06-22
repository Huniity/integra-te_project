# CMS User Guide — INTEGRA-TE

> **Project II · Web Programming · ETIC_Algarve · 2025/26**
> Client: **Fundação António Aleixo** · Group A
>
> Maintainers: Giulio (lead documentation), Diogo (CMS configuration), Cristian (backend models & admin)

---

## Table of contents

1. [Introduction](#1-introduction)
2. [Administrative onboarding](#2-administrative-onboarding)
3. [Database records — adding, editing, removing](#3-database-records--adding-editing-removing)
4. [Dynamic upload pipelines](#4-dynamic-upload-pipelines)
5. [Asset controls](#5-asset-controls)
6. [Content workflows](#6-content-workflows) — *stub, see section owner*
7. [Verification controls](#7-verification-controls) — *stub, see section owner*
8. [Appendix A — Glossary](#appendix-a--glossary)
9. [Appendix B — Common errors](#appendix-b--common-errors)
10. [Appendix C — Where to get help](#appendix-c--where-to-get-help)

---

## 1. Introduction

### 1.1 Purpose

This document is the operating manual for the people who keep INTEGRA-TE's content alive. It explains every routine task an administrator will perform: creating accounts, adding or editing a Disciplina/Tema/Conteúdo, uploading a PDF or video thumbnail, swapping a logo, and recovering when something goes wrong. It is written for **non-technical users** — no command lines nor SQLs are needed.

### 1.2 Audience

- **Foundation content editors** at Fundação António Aleixo who add pedagogical material.
- **Foundation administrators** who manage editor accounts.
- **Project leads and reviewers** who need to verify that material is correct before publication.

Developers maintaining the platform should refer instead to `README.md`, `ARCHITECTURE.md`, `CRUD_IMPLEMENTATION_GUIDE.md`, and `DASHBOARD_CRUD_TODO.md`.

### 1.3 Scope

The guide covers all CMS-side operations: account management, content data entry, file uploads, branded asset handling, content workflows, and verification controls. It does **not** cover code changes, server deployment, database backups (handled by the developer team), nor analytics.

### 1.4 The two CMS surfaces

INTEGRA-TE currently exposes **two** routes to manage content. Editors should understand which one they are using before starting any task.

| Surface | URL | Status | Best for |
|---|---|---|---|
| **Django Admin** | `https://<your-domain>/admin/` | Interim. Standard Django interface, in English by default. | Initial seeding, technical edits, recovering from a failed dashboard operation. |
| **Custom dashboard** | `https://<your-domain>/dashboard/` (when live) | Target. Portuguese, mobile-friendly, role-aware. *Currently under construction — see `DASHBOARD_CRUD_TODO.md`.* | Day-to-day editorial work once delivered. |

The dashboard is the long-term home. Until it is feature-complete, content editors use Django Admin. Both surfaces operate on the **same database**, so anything edited in one shows up in the other immediately. **Do not enter the same record twice** in both surfaces — pick one per task.

> **Developer note (Cristian):** `srcs/backend/integrate/admin.py` is currently empty. Django Admin will not show any of our models until each is registered via `admin.site.register(...)`. This must be done before editors can start work in the interim surface. See section 3.10 for the registration checklist.

### 1.5 How to use this document

Each operational section follows the same shape:

1. **What it is** — plain-language description of the task.
2. **When you'd do it** — typical triggers.
3. **Step-by-step** — numbered procedure with screenshots placeholders.
4. **Validation** — how to confirm it worked.
5. **Recovery** — what to do if it didn't.

Sections 6 (Content workflows) and 7 (Verification controls) are stubs awaiting input from the respective leads — see those sections.

---

## 2. Administrative onboarding

This section covers the lifecycle of admin accounts: creating one, granting the right level of access, the first login, password recovery, and offboarding when someone leaves the team.

### 2.1 Account types

The platform recognises three levels of administrative access, mapped to Django's built-in user flags:

| Level | Django flags | Can do | Cannot do |
|---|---|---|---|
| **Editor** | `is_staff=True`, no superuser | Add, edit, and unpublish content. Upload files. Manage their own profile. | Create or delete user accounts. Change Disciplinas (the fixed taxonomy). Access server settings. |
| **Admin** | `is_staff=True`, `is_superuser=True` | Everything an Editor can do, plus: create/delete Editor accounts, edit Disciplinas, view all logs. | (none, within the CMS) |
| **Developer** | `is_staff=True`, `is_superuser=True`, system access | Everything an Admin can do, plus: change code, run migrations, access the database directly. | — |

Most foundation staff should be Editors. Reserve Admin for one or two trusted users.

### 2.2 Creating the first administrator

The first administrator must be created from the command line, before any user exists in the system. This is a one-time bootstrap step, normally performed by a developer at install time:

```bash
make superuser-dev      # development
make superuser-prod     # production
```

You will be prompted for username, email, and a password. Use a strong password (12+ characters, mix of letters/numbers/symbols).

### 2.3 Creating subsequent accounts (Django Admin)

Once the first administrator exists, all further accounts are created through the browser:

1. Navigate to `https://<your-domain>/admin/`.
2. Log in with an Admin-level account.
3. In the left sidebar, expand **Authentication and Authorization → Users**.
4. Click **Add user** (top right).
5. Fill in:
   - **Username** — unique, lowercase, no spaces. The team convention is `firstname.lastname` (e.g. `maria.silva`).
   - **Password** — generated by Django Admin (you'll see a "generate" link) OR entered manually. The user will be required to change it on first login.
6. Click **Save and continue editing**.
7. On the next page, fill in:
   - First name, last name, email — for identification and password recovery.
   - **Staff status** ✓ — required for all CMS users.
   - **Superuser status** — only for Admin-level. Leave unchecked for Editors.
   - **Groups** — leave empty for now; group permissions are a future enhancement.
8. Click **Save**.
9. Send the new user their username, the URL, and instructions to change their password at first login.

### 2.4 Creating subsequent accounts (custom dashboard)

> *Pending dashboard delivery — section to be filled in when the user management view is live.*

### 2.5 First login

New editors should be told to:

1. Visit `https://<your-domain>/admin/` (or `/dashboard/` once live).
2. Enter the username and temporary password provided.
3. Change the password immediately via **top-right menu → Change password**.
4. Verify their email address is correct under **My profile**.

### 2.6 Password recovery

The interim Django Admin has **no self-service password reset** flow. If an editor forgets their password, an Admin must:

1. Log in to Django Admin.
2. Navigate to **Users**, click the affected username.
3. Click the **"this form"** link next to the password field.
4. Set a new temporary password.
5. Click Save.
6. Communicate the new temporary password through a secure channel (in person, encrypted message — *not* plain email).
7. Instruct the user to change it on next login.

A proper self-service reset (email-based) will be added with the custom dashboard. Until then, this manual reset is the only route.

### 2.7 Offboarding

When a team member leaves, an Admin must **disable** their account (rather than delete it, so historical edits keep their attribution):

1. Log in to Django Admin.
2. Navigate to **Users**, click the leaving member's username.
3. Uncheck **Active**.
4. Save.

The user can no longer log in. Their past edits remain in the database with their username attached. If full removal is later required (GDPR right-to-erasure request), follow the process documented in section 7.4 of `Privacy.tsx`'s reference policy (handled by the privacy lead, not Editors).

### 2.8 Audit log

Django Admin logs every administrative action automatically. To view the log:

1. Log in as Admin.
2. Top-right menu → **History** (per object) or sidebar → **Recent actions**.

For broader queries (who created which user, when), filter the **Log entries** table. The custom dashboard will expose this same data in a friendlier UI.

---

## 3. Database records — adding, editing, removing

This section walks through each content type the CMS manages, in the order an editor typically encounters them. For each: what the type represents, what its fields mean, the rules to obey, and the step-by-step procedure.

### 3.1 Data model overview

INTEGRA-TE's content hierarchy:

```
Disciplina ──┬── Tema ── Conteúdo
             ├── Jogo (optional FK)
             └── (Exercício, Aula — under reorganisation)

Livro            (standalone, no Disciplina FK)
```

| Model | What it represents | Lifecycle |
|---|---|---|
| **Disciplina** | A school subject — Português, Matemática, Estudo do Meio. | Created once, rarely edited. |
| **Tema** | A topic *within* a Disciplina, scoped to a school year and a site section. | Steady, occasional additions. |
| **Conteúdo** | A piece of material *inside* a Tema: a video, a text article, an image, a PDF. | High volume — most editorial work happens here. |
| **Jogo** | A recommended or original game, optionally linked to a Disciplina. | Occasional additions. |
| **Livro** | A book recommendation. Independent of Disciplina. | Occasional additions. |
| **Exercício** | A practice activity. *Field names being renormalised — see `DASHBOARD_CRUD_TODO.md`.* | High volume once stable. |
| **Aula** | A lesson video. *Same renormalisation work in progress.* | High volume once stable. |

> Three notes editors should know:
> 1. **Nothing is visible to the public until `publicado = True`.** This is the single gating switch across every content type.
> 2. **Foreign keys are protective.** A Tema cannot exist without a Disciplina, a Conteúdo cannot exist without a Tema. Delete a parent and Django cascades — meaning child records are deleted too. Always think about children before deleting a parent.
> 3. **Slugs must be URL-safe and unique within scope.** Lowercase letters, numbers, and hyphens only. No accents, no spaces.

### 3.2 Disciplina

#### What it is

The top-level subject taxonomy. Three Disciplinas exist by design: Português, Matemática, and Estudo do Meio. **Editors should not normally add or remove Disciplinas** — doing so changes the homepage and the navigation everywhere. This is reserved for Admin-level users in consultation with the project lead.

#### Fields

| Field | Type | Required | Rules |
|---|---|---|---|
| `nome` | text, max 200 | yes | Human-readable name. Title-case. e.g. `Português`. |
| `slug` | text, max 500 | yes | URL fragment. Lowercase, hyphens, no accents. e.g. `portugues`. |
| `desc` | text, max 500 | yes | One-paragraph description shown on the discipline page. |

#### To add

1. **Admin only.** Log in to Django Admin.
2. Sidebar → **Integrate → Disciplinas → Add**.
3. Fill in `nome`, `slug`, `desc`.
4. Save.

#### To edit

1. Same path as above, click the Disciplina to edit.
2. Change fields. **Avoid editing `slug` once a Disciplina is live** — it breaks every existing URL.
3. Save.

#### To remove

1. Same path, click the Disciplina, click **Delete** at the bottom.
2. **Read the confirmation page carefully.** It will list every Tema, Conteúdo, and Jogo that will be cascade-deleted. If the list is wrong or surprising, cancel.
3. If correct, confirm.

### 3.3 Tema

#### What it is

A topic within a Disciplina, scoped to a specific **school year** (1º–6º) and a specific **site section** (Aprender, Resolver, or Ler). The same topic can therefore exist as separate Tema records for different years and sections.

#### Fields

| Field | Type | Required | Rules |
|---|---|---|---|
| `disciplina` | FK → Disciplina | yes | Pick from dropdown. |
| `titulo` | text, max 200 | yes | Topic name, e.g. `Substantivos`. |
| `slug` | text, max 500 | yes | URL fragment. Must be **unique within (disciplina, seccao)**. |
| `desc` | long text | yes | Description shown at the top of the topic page. |
| `ano_escolar` | choice | yes | One of `1º Ano`–`6º Ano`. |
| `seccao` | choice | yes | `aprender`, `resolver`, or `ler`. |

#### To add

1. Log in. Sidebar → **Integrate → Temas → Add**.
2. Pick the Disciplina from the dropdown.
3. Fill in `titulo`, `slug`, `desc`, `ano_escolar`, `seccao`.
4. Save.

> **Important constraint:** the combination `(disciplina, slug, seccao)` must be unique. If you get a "already exists" error on save, change the slug or check that the topic doesn't already exist in that section. The same topic in a different section (e.g. one in Aprender and one in Resolver) is fine.

#### To edit

Same as above, click the Tema. Slug edits break URLs — avoid once live.

#### To remove

Delete will cascade to every Conteúdo under this Tema. Confirm carefully.

### 3.4 Conteúdo

#### What it is

The atomic unit of pedagogical material — a single video, article, image, or PDF inside a Tema. This is where editors spend most of their time.

#### Fields

| Field | Type | Required | Rules |
|---|---|---|---|
| `tema` | FK → Tema | yes | Pick from dropdown. |
| `tipo` | choice | yes | One of `texto`, `imagem`, `video`, `pdf`. |
| `titulo` | text, max 200 | yes | Display title. |
| `corpo` | long text | yes | Article body OR caption OR description. |
| `ficheiro` | file upload | conditional | Required when `tipo` is `pdf` or `imagem` and no `url_externa` is provided. |
| `url_externa` | URL | conditional | Required when `tipo` is `video` and no `ficheiro` is provided. Typically a YouTube embed URL. |
| `thumbnail` | image upload | optional | Card thumbnail. Strongly recommended for `video` and `pdf`. |
| `dificuldade` | choice | optional | `basico`, `intermedio`, or `avancado`. |
| `descarregavel` | boolean | yes | If checked, the public site shows a download button. PDFs only. |
| `publicado` | boolean | yes | **Must be checked for the item to appear publicly.** |

#### Per-type field requirements

| `tipo` | Needs `corpo` | Needs `ficheiro` | Needs `url_externa` | Needs `thumbnail` |
|---|:-:|:-:|:-:|:-:|
| `texto` | yes (the article) | no | no | optional |
| `imagem` | yes (caption) | yes | no | optional |
| `video` | yes (description) | no | yes | recommended |
| `pdf` | yes (description) | yes | no | recommended |

The platform does not currently enforce these per-type rules — the editor is responsible for filling the right fields. A future dashboard pass will add per-type forms; until then, see Appendix B for what happens if a field is missed.

#### To add

1. Sidebar → **Integrate → Conteúdos → Add**.
2. Pick the parent Tema.
3. Pick `tipo`.
4. Fill in `titulo` and `corpo`.
5. Upload `ficheiro` or paste `url_externa` per the table above.
6. Upload `thumbnail` if applicable.
7. Set `dificuldade` if known.
8. Check `descarregavel` if it should be downloadable.
9. Leave `publicado` **unchecked** until the content has been reviewed (see section 7).
10. Save.
11. Pass the record to the reviewer per section 6.

#### To edit

Same path, click the record. **Changing `tipo` after creation requires re-uploading files** in many cases — be cautious.

#### To remove

Delete removes the database row immediately. **The uploaded file is not automatically removed from disk** — see section 4.7.

### 3.5 Jogo

#### What it is

A game — either an external recommendation (link only) or a project-created downloadable.

#### Fields

| Field | Type | Required | Rules |
|---|---|---|---|
| `disciplina` | FK → Disciplina | optional | Leave blank for cross-discipline games. |
| `titulo` | text, max 200 | yes | |
| `descricao` | text, max 500 | yes | Short — *will be widened to TextField in a future migration; do not exceed 500 for now*. |
| `faixa_etaria` | text, max 200 | yes | Free text, e.g. `6–9 anos`. |
| `url_externa` | URL | conditional | Required for external games. |
| `ficheiro` | file upload | conditional | Required for project-created games. |
| `tamanho_kb` | integer | optional | Filled automatically by future enhancement; for now, leave blank. |
| `publicado` | boolean | yes | Gating switch. |

#### To add / edit / remove

Same pattern as Conteúdo, under **Integrate → Jogos**.

### 3.6 Livro

#### What it is

A book recommendation — title, author, summary, age range, optional cover image and optional PDF.

#### Fields

| Field | Type | Required | Rules |
|---|---|---|---|
| `titulo` | text, max 200 | yes | |
| `autor` | text, max 200 | yes (currently) | Will accept blank in a future migration. |
| `faixa_etaria` | text, max 200 | yes | Free text. |
| `resumo` | text, max 1000 | yes | |
| `temas` | text, max 500 | optional | Free-text comma-separated for now — *will become a many-to-many relation to Tema in a future migration. Until then, write themes as plain text*. |
| `capa` | image upload | optional | Book cover. |
| `ficheiro` | file upload | optional | Full text or sample PDF. |
| `publicado` | boolean | yes | |

#### To add / edit / remove

Same pattern, under **Integrate → Livros**.

### 3.7 Exercício

> ⚠️ **This model is under reorganisation.** Field names will change from English to Portuguese, and a real `disciplina` foreign key will replace the free-text `subject_id`. Refer to `DASHBOARD_CRUD_TODO.md` for the migration plan. Until then, the fields below are the current state.

#### Current fields

| Field | Type | Notes |
|---|---|---|
| `title` | text | Will become `titulo`. |
| `level` | integer | Will become `nivel`. |
| `subject_id` | text | Will become `disciplina` (FK). For now, use the Disciplina's `slug` value here. |
| `description` | text | Will become `descricao`. |
| `pdf_url` | URL | Will be paired with a real `ficheiro` upload field. |
| `publicado` | boolean | Gating switch. |
| `title_color`, `icon_img`, `path` | text | **Do not use.** These will be removed; they are frontend concerns leaking into the database. |

#### To add

For now: use Django Admin. Avoid `title_color`, `icon_img`, and `path` — they will be deleted on next migration and any value entered there will be lost.

### 3.8 Aula

> ⚠️ **Same status as Exercício** — field rename and FK migration pending.

#### Current fields

| Field | Type | Notes |
|---|---|---|
| `title`, `level`, `subject_id`, `description` | as above | Same renames pending. |
| `video_url` | URL | Will become `url_externa`. |
| `thumbnail_url` | text | Will become a real `thumbnail` ImageField — uploads will become possible. |
| `duration` | integer (seconds) | Optional. |
| `publicado` | boolean | Gating switch. |

### 3.9 MaterialOriginal

> **Do not use.** Marked for removal in the dashboard TODO. No frontend page reads from this model.

### 3.10 Developer checklist — register models in Django Admin

For Editors to actually see any of the models above in the Django Admin sidebar, each must be registered. This is a one-time task for the backend lead.

In `srcs/backend/integrate/admin.py`, add (Cristian, please own):

```python
from django.contrib import admin
from .models import (
    Disciplina, Tema, Conteudo,
    Jogo, Livro,
    Exercicio, Aula,
)

@admin.register(Disciplina)
class DisciplinaAdmin(admin.ModelAdmin):
    list_display = ("nome", "slug")
    search_fields = ("nome", "slug")
    prepopulated_fields = {"slug": ("nome",)}

@admin.register(Tema)
class TemaAdmin(admin.ModelAdmin):
    list_display = ("titulo", "disciplina", "seccao", "ano_escolar")
    list_filter = ("disciplina", "seccao", "ano_escolar")
    search_fields = ("titulo", "slug")
    prepopulated_fields = {"slug": ("titulo",)}

@admin.register(Conteudo)
class ConteudoAdmin(admin.ModelAdmin):
    list_display = ("titulo", "tema", "tipo", "publicado", "criado_em")
    list_filter = ("publicado", "tipo", "dificuldade", "tema__disciplina")
    search_fields = ("titulo", "corpo")
    list_editable = ("publicado",)

@admin.register(Jogo)
class JogoAdmin(admin.ModelAdmin):
    list_display = ("titulo", "disciplina", "publicado")
    list_filter = ("publicado", "disciplina")
    list_editable = ("publicado",)

@admin.register(Livro)
class LivroAdmin(admin.ModelAdmin):
    list_display = ("titulo", "autor", "publicado")
    list_filter = ("publicado",)
    search_fields = ("titulo", "autor")
    list_editable = ("publicado",)

# Exercicio and Aula intentionally omitted until field renames land.
```

Also set in `settings.py` (Adrien, please own):

```python
LANGUAGE_CODE = "pt-pt"
TIME_ZONE = "Europe/Lisbon"
USE_TZ = True
```

This switches Django Admin's labels and date formatting to Portuguese, matching what Editors will be working with.

### 3.11 Common gotchas

- **"This field is required" on save:** check the per-type field table in 3.4. Different `tipo` values need different fields.
- **"already exists" on Tema save:** the `(disciplina, slug, seccao)` combination is taken. Change one of the three.
- **Edit doesn't show on the public site:** check `publicado`. If true, hard-refresh the public page (Ctrl+F5) — the frontend caches.
- **Delete doesn't remove uploaded file:** see section 4.7.

---

## 4. Dynamic upload pipelines

INTEGRA-TE accepts file uploads through several content types. This section explains what can be uploaded, where the files end up, what to watch for, and how to recover from problems.

### 4.1 What can be uploaded, by model

| Model | Field | Purpose | Typical formats |
|---|---|---|---|
| `Conteudo` | `ficheiro` | The content artefact | PDF, JPG, PNG, MP4, WebM |
| `Conteudo` | `thumbnail` | Card preview image | JPG, PNG, WebP |
| `Jogo` | `ficheiro` | Game distributable | ZIP, PDF |
| `Livro` | `capa` | Book cover image | JPG, PNG, WebP |
| `Livro` | `ficheiro` | Book PDF | |
| *(future)* `Aula` | `thumbnail` | Lesson card image | Pending migration |
| *(future)* `Exercicio` | `ficheiro` | Exercise sheet PDF | Pending migration |

### 4.2 File type and size limits

| Concern | Current state | Recommendation |
|---|---|---|
| **Allowed types per field** | Not enforced — the server accepts any file. | Editors must visually verify each file before publishing. |
| **Maximum file size** | Django defaults: 2.5 MB in memory, then chunked. No hard cap. | Stay under 25 MB per file. PDFs over that should be split or compressed. |
| **MIME validation** | None. | Editors must rely on file extension and visual inspection. |
| **Virus scan** | None. | Only upload files from trusted sources. |

> **Developer follow-up (Cristian):** add `FileExtensionValidator` to each FileField/ImageField, and set `DATA_UPLOAD_MAX_MEMORY_SIZE` and `FILE_UPLOAD_MAX_MEMORY_SIZE` in `settings.py` to enforce a 25 MB cap. Without these, the platform will accept and store anything, including malformed or oversized files that will break the page that tries to render them.

### 4.3 Where uploaded files go

In production and development, files are stored on disk under Django's `MEDIA_ROOT`:

```
Container path:  /app/staticfiles/media/
Host volume:     media_files (Docker named volume)
URL prefix:      /media/
```

Each model writes to a subdirectory:

| Model + field | Subdirectory |
|---|---|
| `Conteudo.ficheiro` | `media/conteudos/` |
| `Conteudo.thumbnail` | `media/thumbnails/` |
| `Jogo.ficheiro` | `media/jogos/` |
| `Livro.capa` | `media/capas/` |
| `Livro.ficheiro` | `media/livros/` |
| `MaterialOriginal.ficheiro` | `media/materiais_originais/` |

A file uploaded with the name `lesson-1.pdf` becomes `media/conteudos/lesson-1.pdf`. If a file by that name already exists, Django appends a random suffix automatically — `lesson-1_aB3xZ.pdf`.

### 4.4 Uploading through the dashboard

> *Pending custom dashboard delivery. Once live, this section will document the drag-and-drop upload widget, progress indicator, and per-file preview.*

### 4.5 Uploading through Django Admin (interim)

1. Open the record's edit page (or the "Add" form for a new record).
2. Find the file field — it shows a **Choose file** button.
3. Click, pick the file from your computer, confirm.
4. The form shows the chosen file's name. **The upload has not happened yet** — it happens on Save.
5. Click **Save**.
6. The page reloads, and the file field now shows a link to the uploaded file (e.g. `Currently: conteudos/lesson-1.pdf`). Click the link to verify the file opens correctly.

### 4.6 Replacing an uploaded file

1. Open the record's edit page.
2. Find the file field. It shows the current file.
3. Tick the **Clear** checkbox below the field. This will remove the current file on save.
4. Click **Choose file** and pick the new file.
5. Save.

> The old file is **not** automatically removed from disk by Django — see 4.7.

### 4.7 Removing files and orphaned data

When a record is deleted, or its file field is cleared, **Django removes the database reference but leaves the file on disk**. Over time this can build up.

Two ways to clean up:

1. **For one file:** ask a developer to delete the orphaned file from `/app/staticfiles/media/...` inside the backend container.
2. **For routine cleanup:** the developer team should add a `django-cleanup` package and run `make orphans-clean` periodically. *Not yet implemented — flagged in `DASHBOARD_CRUD_TODO.md`.*

Until automation is added, Editors should be aware that "delete" only hides content from the public site; the file persists.

### 4.8 Upload pipeline diagram

```
Browser              Django                   Disk
  │                    │                        │
  │── POST /admin/ ───►│                        │
  │   (multipart form) │                        │
  │                    │── validate fields ────►│
  │                    │   (none for files)     │
  │                    │                        │
  │                    │── write to ───────────►│  /app/staticfiles/media/<subdir>/
  │                    │   MEDIA_ROOT           │      <filename>.<ext>
  │                    │                        │
  │                    │── save record ────────►│  (DB row holds the relative path)
  │                    │                        │
  │◄── 302 redirect ───│                        │
  │   to list view     │                        │
  │                    │                        │
  │── GET /media/...  ►│                        │
  │   (later, public)  │── stream file ────────►│
  │◄── file ───────────│                        │
```

### 4.9 Troubleshooting uploads

| Symptom | Likely cause | Fix |
|---|---|---|
| Save spins forever | File too large; upload chunking timing out | Compress or split the file. Ask a developer to raise upload size cap. |
| "Permission denied" on save | Container can't write to media volume | Developer task — check volume mount and ownership. |
| File saved but link broken | Frontend caching the old URL | Hard-refresh the public page (Ctrl+F5). |
| Image displays sideways | EXIF orientation not handled | Re-export the image with orientation baked in, OR rotate before upload. |
| PDF won't open in browser | Corrupt or password-protected | Re-export the PDF without encryption. |

---

## 5. Asset controls

INTEGRA-TE has two categories of visual asset, and they live in different places. Editors should know the difference.

### 5.1 The two asset categories

| Category | Where it lives | Who manages it | Examples |
|---|---|---|---|
| **Static branding assets** | `srcs/frontend/src/assets/` (baked into the build) | Developers, with Editor input | Logo cloud, decorative bushes/clouds, EU/Portugal 2030 logos, Loulé Coat of Arms, navbar sphere icons, day/night backgrounds |
| **CMS-managed media** | `MEDIA_ROOT` on the server (uploaded via the CMS) | Editors | Content PDFs, book covers, video thumbnails, game files |

Changing a static branding asset requires a developer to swap the file and rebuild the frontend. Changing a CMS-managed asset is an upload through Django Admin or the dashboard.

### 5.2 Static branding asset inventory

The current branding assets bundled with the frontend, with their roles:

| Asset | File | Used on | Constraints |
|---|---|---|---|
| Logo (cloud) | `cloud_logo.png` / `.webp` | Navbar, every interior page | INTEGRA-TE wordmark |
| EU logo + funding statement | embedded in `Footer.tsx` | Footer of every page | **Mandatory — EU visibility obligation.** Must remain present, legible, and unmodified. |
| Portugal 2030 logo | embedded in `Footer.tsx` | Footer of every page | **Mandatory — EU visibility obligation.** |
| Algarve 2030 logo | embedded in `Footer.tsx` | Footer of every page | **Mandatory — regional funding visibility.** |
| Loulé Concelho logo | embedded in `Footer.tsx` | Footer of every page | **Mandatory — municipal partner credit.** |
| Loulé Coat of Arms | `Loulé_municipality_COA.png` | Footer / branding contexts | Used as official partner identifier. |
| Sphere icons | `purple_dot.webp`, `green_dot.webp`, `red_dot.webp`, `salmon_dot.webp`, `blue_dot.webp`, `darkb_dot.webp`, etc. | Navbar icons, homepage menu | Re-used between Navbar and Homepage — change either and both move. |
| Icon glyphs | `weight.webp`, `controller.webp`, `blackboard.png`, `blue_book.webp`, `video.webp`, `download.webp`, `user.webp`, `info.webp` | Layered on sphere icons | Match what each section represents. |
| Day/night backgrounds | `content2.webp`, `noite.webp` | Behind the main glass panel on Aprender/Resolver/Ler | Swapped by the night-mode toggle. |
| Decorative scene | `bush.webp`, `bush2.webp`, `books.webp`, `rainbow.webp` + `_night` variants | Decorative elements around the panel | Day and night variants must stay in sync — replace one, replace the other. |
| Favicon | `srcs/frontend/public/favicon.svg` | Browser tab | SVG, currently 202 KB — flagged for optimisation. |

### 5.3 Replacing a static branding asset

This is a **developer task**, not an Editor task. The procedure:

1. Editor provides the replacement file to the developer team, with the filename it should be saved as (must match the existing name to avoid code changes).
2. Developer commits the file to `srcs/frontend/src/assets/`.
3. Developer runs the WebP conversion if applicable: `make convert`.
4. Developer rebuilds the frontend container: `make rebuild`.
5. Editor verifies the change on the public site.

### 5.4 EU visibility compliance — non-negotiable

The Portugal 2030 and EU funding logos **must remain present on every public-facing page**, sized at least to legibility, and unmodified in colour or layout. Removing or obscuring them puts the foundation's funding compliance at risk.

If any of the following happen, raise immediately with the project lead:

- A page is added without a footer.
- The footer is restyled in a way that hides any of the four mandatory logos.
- Logos are recoloured (must stay in their official palette).
- Logos are scaled so small as to be illegible.

The reviewer checklist in section 7 includes a logo presence check.

### 5.5 CMS-managed media — see section 4

Everything Editors can upload goes through the upload pipeline documented in section 4. There is no separate "asset library" for those — they are attached directly to the record they belong to (a Conteúdo's PDF, a Livro's cover, etc.). The "library" concept will likely arrive with the custom dashboard.

### 5.6 Backups

Two things need backing up regularly. **Both are developer tasks**, not Editor tasks:

| What | How often | Owned by |
|---|---|---|
| PostgreSQL database (all content rows) | Daily | Developer team — see `ops/` once configured |
| `MEDIA_ROOT` volume (every uploaded file) | Daily | Developer team |

Editors should know backup status is monitored; restore procedures are out of scope for this guide.

---

## 6. Content workflows

> **Section owner: TBD — content/editorial lead.**
> **Status: stub awaiting draft.**
>
> This section should document the editorial lifecycle of a single piece of content from idea to publication, including:
>
> - **Authoring conventions** — voice, register, vocabulary suitable for the target age range (6–12). Use of accents, capitalisation, punctuation. Approved/discouraged terms.
> - **Source attribution** — how to cite external sources, what licences are acceptable for re-use, when permission is required.
> - **Image and PDF preparation** — recommended dimensions, file size targets, naming conventions (`portugues-1ano-substantivos-01.pdf` style), pre-upload checklist.
> - **Video selection** — criteria for embedding external videos (e.g. YouTube channel allowlist, length cap, no advertising, no inappropriate content in recommendations).
> - **Difficulty tagging** — how `basico` / `intermedio` / `avancado` are decided.
> - **Section assignment** — when does material go in Aprender vs Resolver vs Ler.
> - **Editorial calendar / cadence** — release schedule if any.
> - **Handover to verification** — exactly how a piece of content is marked "ready for review" (currently no flag for this — needs proposal).
>
> Draft this section in coordination with Fundação António Aleixo's content team, since they know what register works with their audience. The developer team should not draft this alone.

---

## 7. Verification controls

> **Section owner: TBD — review/QA lead.**
> **Status: stub awaiting draft.**
>
> This section should document the review gates a piece of content passes before going public, including:
>
> - **Reviewer assignment** — who reviews what (e.g. Português content reviewed by a Português specialist, accessibility reviewed by Adrien, EU compliance reviewed by Giulio).
> - **Pre-publication checklist** — concrete pass/fail items the reviewer must confirm:
>   - Spelling and grammar pass.
>   - Tipo / corpo / ficheiro / url_externa match per section 3.4.
>   - Thumbnail present and correctly sized.
>   - Difficulty tag is accurate.
>   - File downloads correctly (test the link from the public page once `publicado=True` is set on a staging environment).
>   - For videos: source is from the allowlist, no auto-playing ads, embed uses `youtube-nocookie.com`.
>   - For PDFs: opens in browser, not password-protected, prints correctly.
>   - For images: not pixellated, no embedded watermark from a third-party stock site.
>   - Accessibility: alt text on images, video has captions or transcript link, PDF is text-selectable (not a scanned image).
>   - EU/Portugal 2030 footer visible on the page the content lives on.
> - **Approval mechanism** — until a custom workflow exists, the proposed convention is: reviewer leaves a note via the Django Admin change-message field on Save ("Reviewed by X on date, OK"). After approval, the editor (or reviewer) flips `publicado` to True.
> - **Rejection handling** — what to do if a check fails: how the editor is notified, where the issue is logged, how rework is tracked.
> - **Post-publication monitoring** — periodic re-checks of older content, especially for broken external links (YouTube videos go private, third-party PDFs disappear).
> - **Incident response** — if inappropriate content is published in error, the immediate rollback procedure (uncheck `publicado`, then post-mortem).
>
> Draft this section in coordination with the project lead (Adrien) and the accessibility/compliance reviewer (Giulio).

---

## Appendix A — Glossary

| Term | Meaning |
|---|---|
| **CMS** | Content Management System — the admin-facing tools used to add/edit/remove content. |
| **Disciplina** | A school subject. Top of the content hierarchy. |
| **Tema** | A topic within a Disciplina, scoped to a school year and a site section. |
| **Conteúdo** | A single piece of pedagogical material — video, article, image, PDF. |
| **Jogo** | A game (external link or downloadable). |
| **Livro** | A book recommendation. |
| **Aprender / Resolver / Ler** | The three content sections on the public site. |
| **Publicado** | Boolean flag controlling whether content is visible to the public. |
| **Slug** | URL-safe short identifier used in addresses. Lowercase, hyphens, no accents. |
| **FK (foreign key)** | A link from one record to another (e.g. Tema → Disciplina). |
| **Cascade delete** | When deleting a parent record also deletes all child records pointing at it. |
| **MEDIA_ROOT** | The server location where uploaded files are stored. |
| **Django Admin** | The interim admin interface, available at `/admin/`. |
| **Dashboard** | The future custom admin interface, available at `/dashboard/` (under construction). |
| **Staff / Superuser** | Django's terms for Editor / Admin access levels. |

## Appendix B — Common errors

| Message | Meaning | Fix |
|---|---|---|
| `"Este campo é obrigatório."` / `"This field is required."` | A required field is empty. | Check section 3.4's per-type table. |
| `"already exists."` on a Tema | Slug conflicts within the same Disciplina + Seccao. | Change the slug, or check the topic isn't a duplicate. |
| `"Ensure this filename has at most N characters."` | Uploaded file name too long. | Rename the file before upload. |
| `"Upload a valid image."` | File is not a recognised image format, or is corrupted. | Re-export the image as JPG or PNG. |
| 404 on the public side after Save | `publicado` is False, OR slug changed and an old URL is being followed. | Check `publicado`, then check the URL. |
| 502 on Save with a large file | Upload chunking timed out. | Compress the file. |
| File link works in Admin but 404 publicly | Frontend cache. | Hard-refresh (Ctrl+F5). |

## Appendix C — Where to get help

| Question type | Contact | How |
|---|---|---|
| "How do I do X in the CMS?" | Giulio (documentation lead) | Send a screenshot + what you were trying to do. |
| "The CMS is broken / I can't log in" | Adrien (project lead) | Direct message; include the exact error. |
| "I think a model field is wrong" | Cristian (backend lead) | Send the model name + field + what's wrong. |
| "I need a static asset replaced" | Diogo (frontend integration) | Send the new file + filename it should replace. |
| "Content/editorial question" | TBD — content lead | See section 6. |
| "Verification/review question" | TBD — review lead | See section 7. |

---

*Last reviewed: 2026-06-19.*