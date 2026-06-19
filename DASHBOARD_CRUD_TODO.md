# Dashboard CRUD — Todo

Each tab follows the same 8-step pattern.
**Rule:** JSON body for text-only data · `FormData` for anything with a file upload.

---

## Model cleanup — do this first

### Remove
- [ ] `Exercicio.title_color` — Tailwind CSS class stored in DB, pure frontend concern
- [ ] `Exercicio.icon_img` — local asset path stored in DB, frontend maps icons per subject
- [ ] `Exercicio.path` — rename to `url_externa` (consistent with all other models) or remove if unused
- [ ] `MaterialOriginal` — entire model is dead code (no viewset, no URLs, no frontend usage)
- [ ] `Livro.temas` — `CharField(max_length=500)` storing unknown data; replace with `ManyToManyField(Tema, blank=True)` or remove

### Rename — standardise to Portuguese (Aula + Exercicio only)
- [ ] `Exercicio.title` → `titulo`
- [ ] `Exercicio.level` → `nivel`
- [ ] `Exercicio.description` → `descricao`
- [ ] `Aula.title` → `titulo`
- [ ] `Aula.level` → `nivel`
- [ ] `Aula.description` → `descricao`
- [ ] `Aula.video_url` → `url_externa` (consistent with Conteudo, Jogo)
- [ ] `Aula.created_at` → `criado_em`

### Fix field types
- [ ] `Aula.thumbnail_url` (`CharField`) → `thumbnail = models.ImageField(upload_to="thumbnails/", null=True, blank=True)` — needs to be a real image field, not a plain text column
- [ ] `Jogo.descricao` (`CharField(max_length=500)`) → `TextField` — 500 chars is too tight for a game description
- [ ] `Livro.autor` — add `blank=True` (author may be unknown or collective)

### Fix relations — CharField slugs → FK
- [ ] `Aula.subject_id` → `disciplina = models.ForeignKey(Disciplina, on_delete=models.SET_NULL, null=True, blank=True)`
- [ ] `Exercicio.subject_id` → same FK pattern

### Add missing file / media fields
- [ ] `Exercicio` — add `ficheiro = models.FileField(upload_to="exercicios/", null=True, blank=True)` (currently only has `pdf_url` URL field; no actual upload)
- [ ] `Aula` — `thumbnail_url` fix above covers the image field; also add `ficheiro = models.FileField(upload_to="aulas/", null=True, blank=True)` for video file upload (not everyone links YouTube)

### Add missing utility fields
- [ ] `Aula` — add `atualizado_em = models.DateTimeField(auto_now=True)`
- [ ] `Exercicio` — add `criado_em = models.DateTimeField(auto_now_add=True)` + `atualizado_em = models.DateTimeField(auto_now=True)`
- [ ] `Jogo` — add `atualizado_em = models.DateTimeField(auto_now=True)`
- [ ] `Livro` — add `atualizado_em = models.DateTimeField(auto_now=True)`
- [ ] `Conteudo` — add `atualizado_em = models.DateTimeField(auto_now=True)`

### Model field summary (what each model should have when done)

| Model | URL field | File field | Image field |
|-------|-----------|------------|-------------|
| `Exercicio` | `url_externa` (rename from `path`) | `ficheiro` *(add)* | — |
| `Aula` | `url_externa` (rename from `video_url`) | `ficheiro` *(add)* | `thumbnail` *(fix type)* |
| `Jogo` | `url_externa` ✓ | `ficheiro` ✓ | — |
| `Livro` | — | `ficheiro` ✓ | `capa` ✓ |
| `Conteudo` | `url_externa` ✓ | `ficheiro` ✓ | `thumbnail` ✓ |

> After any model change, run `makemigrations` + `migrate` and update the matching serializer.

---

## How content types are stored

| Type | Storage | How |
|------|---------|-----|
| Video | DB only | Paste YouTube/Vimeo URL → stored as `url_externa` → viewer converts to embed |
| PDF / File | Volume (Docker) | Upload via `FormData` → Django `FileField` → served via `MEDIA_URL` |
| Image / Cover | Volume (Docker) | Upload via `FormData` → Django `ImageField` → served via `MEDIA_URL` |

---

## Aulas

### Backend
- [ ] `views.py` — `AulaViewSet`: `ReadOnlyModelViewSet` → `ModelViewSet`
- [ ] `views.py` — Smart queryset: all records for staff · `publicado=True` for public
- [ ] `serializers.py` — Add `publicado` field to `AulaSerializer`

### Frontend
- [ ] `api/contracts/aulas.ts` — Fix `id: string` (was `number`), add `publicado?: boolean`, add `AulaPayload` type
- [ ] `services/api/aulas.api.ts` — Add `createAula`, `updateAula`, `deleteAula`
- [ ] `pages/dashboard/AulasPanel.tsx` — Add "Nova Aula" button, Publicado column, Edit + Delete per row
- [ ] `pages/dashboard/AulasPanel.tsx` — `AulaFormModal` fields:
  - Título (text, required)
  - Matéria (select: português / matemática / estudo-do-meio, required)
  - Nível (select: 1 / 2 / 3, required)
  - Descrição (textarea)
  - URL do Vídeo (url input)
  - Duração (number, minutes)
  - Publicado (checkbox)
  - → Send as **JSON**

---

## Exercícios

### Backend
- [ ] `views.py` — `ExercicioViewSet`: `ReadOnlyModelViewSet` → `ModelViewSet`
- [ ] `views.py` — Smart queryset: all for staff · `publicado=True` for public
- [ ] `serializers.py` — Add `publicado` field to `ExercicioSerializer`

### Frontend
- [ ] `api/contracts/exercicios.ts` — Fix `id: string`, add `publicado?: boolean`, add `ExercicioPayload` type
- [ ] `services/api/exercicios.api.ts` — Add `createExercicio`, `updateExercicio`, `deleteExercicio`
- [ ] `pages/dashboard/ExerciciosPanel.tsx` — Add "Novo Exercício" button, Publicado column, Edit + Delete per row
- [ ] `pages/dashboard/ExerciciosPanel.tsx` — `ExercicioFormModal` fields:
  - Título (text, required)
  - Matéria (select, required)
  - Nível (select 1 / 2 / 3, required)
  - Descrição (textarea)
  - PDF — upload file **or** paste URL (toggle)
  - Publicado (checkbox)
  - → Send as **FormData** if file attached, **JSON** if URL only

---

## Vídeos

### Backend
- [ ] `views.py` — `VideosViewSet`: `ReadOnlyModelViewSet` → `ModelViewSet`
- [ ] `views.py` — Smart queryset: `tipo="video"`, all for staff · `publicado=True` for public
- [ ] `serializers.py` — Add write-capable fields to `ConteudoItemSerializer`: `tema` (writable FK), `titulo`, `corpo`, `url_externa`, `publicado`

### Frontend
- [ ] `api/contracts/videos.ts` — Add `publicado?: boolean`, add `VideoPayload` type
- [ ] `services/api/videos.api.ts` — Add `createVideo`, `updateVideo`, `deleteVideo`
- [ ] `pages/dashboard/VideosPanel.tsx` — Add "Novo Vídeo" button, Edit + Delete per row
- [ ] `pages/dashboard/VideosPanel.tsx` — `VideoFormModal` fields:
  - Título (text, required)
  - Tema (select loaded from `/api/temas/`, required)
  - Descrição / Corpo (textarea)
  - URL do Vídeo — YouTube or Vimeo link (url input, required)
  - Miniatura — upload image (optional)
  - Publicado (checkbox)
  - → Send as **FormData** if thumbnail attached, **JSON** if no file

---

## Ficheiros (PDFs)

### Backend
- [ ] `views.py` — `DescarregarViewSet`: `ReadOnlyModelViewSet` → `ModelViewSet`
- [ ] `views.py` — Smart queryset: `tipo="pdf"`, `descarregavel=True`, all for staff · `publicado=True` for public
- [ ] `serializers.py` — Add write fields to `ConteudoItemSerializer`: `tema` FK, `ficheiro` upload, `thumbnail` upload, `descarregavel`, `publicado`

### Frontend
- [ ] `api/contracts/descarregar.ts` — Add `publicado?: boolean`, add `DescarregavelPayload` type
- [ ] `services/api/descarregar.api.ts` — Add `createDescarregavel`, `updateDescarregavel`, `deleteDescarregavel`
- [ ] `pages/dashboard/FicheirosPanel.tsx` — Add "Novo Ficheiro" button, Edit + Delete per row
- [ ] `pages/dashboard/FicheirosPanel.tsx` — `FicheiroFormModal` fields:
  - Título (text, required)
  - Tema (select from API, required)
  - Descrição / Corpo (textarea)
  - Ficheiro PDF (file upload, required)
  - Miniatura (image upload, optional)
  - Descarregável (checkbox)
  - Publicado (checkbox)
  - → Always **FormData**

---

## Livros

### Backend
- [ ] `views.py` — `LivroViewSet`: `ReadOnlyModelViewSet` → `ModelViewSet`
- [ ] `views.py` — Smart queryset: all for staff · `publicado=True` for public
- [ ] `serializers.py` — Make `capa` and `ficheiro` writable in `LivroSerializers`, add `publicado`

### Frontend
- [ ] `api/contracts/livros.ts` — Add `publicado?: boolean`, add `LivroPayload` type
- [ ] `services/api/livros.api.ts` — Add `createLivro`, `updateLivro`, `deleteLivro`
- [ ] `pages/dashboard/LivrosPanel.tsx` — Add "Novo Livro" button, Edit + Delete per row
- [ ] `pages/dashboard/LivrosPanel.tsx` — `LivroFormModal` fields:
  - Título (text, required)
  - Autor (text)
  - Faixa Etária (select: 4-6 / 6-9 / 9-12, required)
  - Resumo (textarea)
  - Capa (image upload, optional)
  - Ficheiro do Livro — PDF (file upload, optional)
  - Publicado (checkbox)
  - → Always **FormData**

---

## Jogos *(new tab — full wiring needed)*

### Backend
- [ ] `views.py` — `JogoViewSet`: `ReadOnlyModelViewSet` → `ModelViewSet`
- [ ] `views.py` — Smart queryset: all for staff · `publicado=True` for public
- [ ] `serializers.py` — Make `disciplina` a writable FK in `JogosSerializers`, add `publicado`

### Frontend
- [ ] `api/contracts/jogos.ts` — Add `publicado?: boolean`, add `JogoPayload` type
- [ ] `services/api/jogos.api.ts` — Add `createJogo`, `updateJogo`, `deleteJogo`
- [ ] `pages/dashboard/TabPanel.tsx` — Add `{ id: 'jogos', label: 'Jogos', icon: Gamepad2, color: 'bg-pink-500' }` to `TABS`
- [ ] `pages/Dashboard.tsx` — Import `JogosPanel`, add `jogos: JogosPanel` to `TAB_PANELS`
- [ ] `pages/dashboard/JogosPanel.tsx` — **Create file** with table: título, faixa etária, disciplina, publicado, Edit + Delete per row
- [ ] `pages/dashboard/JogosPanel.tsx` — `JogoFormModal` fields:
  - Título (text, required)
  - Descrição (text)
  - Faixa Etária (select: 4-6 / 6-9 / 9-12, required)
  - Disciplina (select loaded from `/api/disciplinas/`, optional)
  - URL Externa **or** upload ficheiro do jogo (toggle)
  - Tamanho KB (number, optional)
  - Publicado (checkbox)
  - → Send as **FormData** if file attached, **JSON** if URL only

---

## Auth — wire once, applies to all tabs

- [ ] `settings.py` — Add `CookieJWTAuthentication` to `DEFAULT_AUTHENTICATION_CLASSES`
- [ ] `views.py` — All `ModelViewSet` instances: replace `AllowAny` on write methods with `IsAdminUser`
- [ ] Frontend — Build `/login` page calling `POST /api/auth/login/` (backend already done in `auth_views.py`)
- [ ] Frontend — Add redirect to `/login` when 401 and refresh also fails (already handled in `fetchWithConfig`)

---

## Suggested order

1. **Aulas** — JSON only, no file uploads, simplest case
2. **Exercícios** — adds PDF upload / URL toggle
3. **Jogos** — adds the full tab wiring from scratch
4. **Livros** — two file uploads (cover + PDF)
5. **Vídeos** — needs tema select loaded from API
6. **Ficheiros** — same pattern as Vídeos but with file upload
7. **Auth** — wire login page and flip all permissions
