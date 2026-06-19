# CRUD Implementation Guide

Two worked examples. **Aula** = JSON only (template for Exercício, Jogo, Livro).
**Vídeo** = URL + optional file upload (template for Descarregar).

---

## AULA — JSON only, no file uploads

### Step 1 — Backend: serializer

File: `srcs/backend/integrate/serializers.py`

Add `publicado` to `AulaSerializer` fields so the dashboard can read and toggle it.

```python
class AulaSerializer(serializers.ModelSerializer):
    subjectId   = serializers.CharField(source="subject_id")
    videoUrl    = serializers.URLField(source="video_url", allow_null=True)
    thumbnailUrl = serializers.CharField(source="thumbnail_url")
    createdAt   = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model  = Aula
        fields = (
            "id", "title", "subjectId", "level", "description",
            "videoUrl", "thumbnailUrl", "duration", "publicado", "createdAt",
        )
```

> `createdAt` is marked `read_only=True` so Django ignores it on POST/PUT.
> All the `source=` aliases work in both directions (read AND write).

---

### Step 2 — Backend: viewset

File: `srcs/backend/integrate/views.py`

```python
# top of file — add ModelViewSet to the import
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet

class AulaViewSet(ModelViewSet):
    serializer_class   = AulaSerializer
    permission_classes = [AllowAny]   # TODO: swap to IsAdminUser for writes after login is wired
    queryset           = Aula.objects.all().order_by('-created_at')
```

No URL changes needed — `DefaultRouter` already creates all CRUD routes:
- `GET    /api/aulas/`        → list
- `POST   /api/aulas/`        → create
- `GET    /api/aulas/{id}/`   → retrieve
- `PUT    /api/aulas/{id}/`   → full update
- `PATCH  /api/aulas/{id}/`   → partial update
- `DELETE /api/aulas/{id}/`   → delete

---

### Step 3 — Frontend: contract type

File: `srcs/frontend/src/api/contracts/aulas.ts`

```typescript
export interface Aula {
  id: string          // UUID — was number, fix it
  title: string
  subjectId: string
  level: number
  description?: string
  videoUrl?: string
  thumbnailUrl?: string
  duration?: number
  publicado: boolean
  createdAt?: string
}

// What you send on POST / PUT (no id, no createdAt)
export interface AulaPayload {
  title: string
  subjectId: string
  level: number
  description?: string
  videoUrl?: string
  thumbnailUrl?: string
  duration?: number
  publicado: boolean
}
```

---

### Step 4 — Frontend: API service

File: `srcs/frontend/src/services/api/aulas.api.ts`

```typescript
import { fetchWithConfig } from './index'
import type { Aula, AulaPayload } from '../../api/contracts/aulas'

export const aulasApi = {
  getAulas: async (): Promise<Aula[]> => {
    try {
      const data = await fetchWithConfig<Aula[]>('/aulas/')
      return Array.isArray(data) ? data : []
    } catch {
      return []
    }
  },

  createAula: (payload: AulaPayload): Promise<Aula> =>
    fetchWithConfig<Aula>('/aulas/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateAula: (id: string, payload: AulaPayload): Promise<Aula> =>
    fetchWithConfig<Aula>(`/aulas/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteAula: (id: string): Promise<void> =>
    fetchWithConfig<void>(`/aulas/${id}/`, { method: 'DELETE' }),
}
```

---

### Step 5 — Frontend: panel + modal

File: `srcs/frontend/src/pages/dashboard/AulasPanel.tsx`

Full replacement — adds "Nova Aula" button, Edit/Delete per row, and the form modal.

```tsx
import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, X } from 'lucide-react'
import { aulasApi } from '../../services/api/aulas.api'
import type { Aula, AulaPayload } from '../../api/contracts/aulas'
import Pagination from '../../components/core/Pagination'

const SUBJECT_LABELS: Record<string, string> = {
  portugues: 'Português',
  matematica: 'Matemática',
  'estudo-do-meio': 'Estudo do Meio',
}
const LEVEL_COLORS: Record<number, string> = {
  1: 'bg-emerald-100 text-emerald-700',
  2: 'bg-orange-100 text-orange-700',
  3: 'bg-purple-100 text-purple-700',
}
const PAGE_SIZE = 5
const EMPTY: AulaPayload = {
  title: '', subjectId: 'portugues', level: 1,
  description: '', videoUrl: '', duration: undefined, publicado: false,
}

/* ── Form modal ─────────────────────────────────────────────────────────── */
function AulaFormModal({
  initial, onClose, onSaved,
}: {
  initial?: Aula
  onClose: () => void
  onSaved: (a: Aula) => void
}) {
  const [form, setForm] = useState<AulaPayload>(
    initial
      ? { title: initial.title, subjectId: initial.subjectId, level: initial.level,
          description: initial.description ?? '', videoUrl: initial.videoUrl ?? '',
          duration: initial.duration, publicado: initial.publicado }
      : EMPTY,
  )
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const saved = initial
        ? await aulasApi.updateAula(initial.id, form)
        : await aulasApi.createAula(form)
      onSaved(saved)
    } catch {
      setError('Não foi possível guardar. Tenta novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
         onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6"
           onClick={e => e.stopPropagation()}>

        <button onClick={onClose}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
          <X size={16} />
        </button>

        <h2 className="text-xl font-black text-gray-800 mb-5">
          {initial ? 'Editar Aula' : 'Nova Aula'}
        </h2>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4">

          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Título *</label>
            <input required type="text" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          {/* Matéria + Nível */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Matéria *</label>
              <select required value={form.subjectId}
                onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="portugues">Português</option>
                <option value="matematica">Matemática</option>
                <option value="estudo-do-meio">Estudo do Meio</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Nível *</label>
              <select required value={form.level}
                onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value={1}>Nível 1</option>
                <option value={2}>Nível 2</option>
                <option value={3}>Nível 3</option>
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Descrição</label>
            <textarea rows={3} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
          </div>

          {/* URL vídeo + Duração */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">URL do Vídeo</label>
              <input type="url" value={form.videoUrl ?? ''}
                onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="https://youtube.com/..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Duração (min)</label>
              <input type="number" min={0} value={form.duration ?? ''}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>

          {/* Publicado */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={form.publicado}
              onChange={e => setForm(f => ({ ...f, publicado: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Publicado (visível no site)</span>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="rounded-lg px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60">
              {saving ? 'A guardar…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Panel ───────────────────────────────────────────────────────────────── */
const AulasPanel = () => {
  const [aulas, setAulas]           = useState<Aula[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [page, setPage]             = useState(1)
  const [modalOpen, setModalOpen]   = useState(false)
  const [editing, setEditing]       = useState<Aula | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function load() {
    setIsLoading(true)
    setAulas(await aulasApi.getAulas())
    setIsLoading(false)
  }
  useEffect(() => { load() }, [])

  function handleSaved(saved: Aula) {
    setModalOpen(false)
    setAulas(prev => {
      const idx = prev.findIndex(a => a.id === saved.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next }
      return [saved, ...prev]
    })
  }

  async function handleDelete(id: string) {
    setIsDeleting(true)
    try {
      await aulasApi.deleteAula(id)
      setAulas(prev => prev.filter(a => a.id !== id))
    } finally {
      setDeletingId(null)
      setIsDeleting(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(aulas.length / PAGE_SIZE))
  const pageItems  = aulas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
    </div>
  )

  return (
    <>
      <div className="flex-1 min-h-0 flex flex-col gap-3">

        {/* Header */}
        <div className="flex justify-end">
          <button onClick={() => { setEditing(undefined); setModalOpen(true) }}
            className="flex items-center gap-2 rounded-xl px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm">
            <Plus size={16} /> Nova Aula
          </button>
        </div>

        {aulas.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white/60 font-semibold">Nenhuma aula. Cria a primeira!</p>
          </div>
        ) : (
          <>
            <div className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">Título</th>
                    <th className="px-4 py-3">Matéria</th>
                    <th className="px-4 py-3">Nível</th>
                    <th className="px-4 py-3">Duração</th>
                    <th className="px-4 py-3">Publicado</th>
                    <th className="px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pageItems.map(aula => (
                    <tr key={aula.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {aula.title}
                        {aula.description && (
                          <p className="text-xs font-normal text-gray-400 mt-0.5 line-clamp-1">{aula.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {SUBJECT_LABELS[aula.subjectId] ?? aula.subjectId}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${LEVEL_COLORS[aula.level] ?? 'bg-gray-100 text-gray-600'}`}>
                          Nível {aula.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {aula.duration != null ? `${aula.duration} min` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${aula.publicado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {aula.publicado ? 'Sim' : 'Não'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {deletingId === aula.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 font-semibold">Tens a certeza?</span>
                            <button onClick={() => handleDelete(aula.id)} disabled={isDeleting}
                              className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg disabled:opacity-60">
                              {isDeleting ? '…' : 'Eliminar'}
                            </button>
                            <button onClick={() => setDeletingId(null)}
                              className="text-xs font-bold text-gray-500 hover:text-gray-700">
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button onClick={() => { setEditing(aula); setModalOpen(true) }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50"
                              title="Editar">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => setDeletingId(aula.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                              title="Eliminar">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages}
              totalItems={aulas.length} pageSize={PAGE_SIZE} onPage={setPage} />
          </>
        )}
      </div>

      {modalOpen && (
        <AulaFormModal
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}

export default AulasPanel
```

---

## VÍDEO — URL + optional file upload (FormData)

The key difference from Aula: the backend uses the **`Conteudo`** model (not a dedicated `Video` model), and the form can include a thumbnail image upload, which means you must send `FormData` instead of JSON whenever a file is attached.

---

### Step 1 — Backend: write serializer

File: `srcs/backend/integrate/serializers.py`

`ConteudoItemSerializer` only has read-only computed fields (`ficheiro_url`, `thumbnail_url`). You need a second serializer for writes so Django can accept the actual file/FK values.

```python
class ConteudoWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Conteudo
        fields = (
            "id", "tema", "titulo", "corpo",
            "url_externa", "ficheiro", "thumbnail",
            "dificuldade", "descarregavel", "publicado",
        )
        # `tipo` is intentionally excluded — the viewset sets it automatically
```

---

### Step 2 — Backend: viewset

File: `srcs/backend/integrate/views.py`

```python
# add ConteudoWriteSerializer to the serializers import at the top

class VideosViewSet(ModelViewSet):
    permission_classes = [AllowAny]  # TODO: IsAdminUser on writes after login

    def get_queryset(self):
        qs = Conteudo.objects.filter(tipo="video").select_related("tema", "tema__disciplina")
        # show all to staff, published-only to public
        if self.request.user and self.request.user.is_staff:
            return qs
        return qs.filter(publicado=True)

    def get_serializer_class(self):
        # read → rich serializer with computed URL fields
        # write → simple serializer that accepts FKs and file fields
        if self.action in ("list", "retrieve"):
            return ConteudoItemSerializer
        return ConteudoWriteSerializer

    def perform_create(self, serializer):
        serializer.save(tipo="video")   # hardcode tipo so the dashboard can't set it wrong
```

Routes are the same pattern — `DefaultRouter` gives you all six.

---

### Step 3 — Frontend: contract type

File: `srcs/frontend/src/api/contracts/videos.ts`

```typescript
export interface Video {
  id: string
  titulo: string
  tipo: string
  corpo: string
  dificuldade?: string
  url_externa?: string
  publicado: boolean
  criado_em: string
  ficheiro_url?: string
  thumbnail_url?: string
  disciplina_slug: string
  disciplina_nome: string
  tema_titulo: string
  tema: string   // tema UUID — needed to send on create/update
}

// What you POST / PUT
export interface VideoPayload {
  tema: string           // UUID of the selected Tema
  titulo: string
  corpo: string
  url_externa?: string
  dificuldade?: string
  publicado: boolean
  thumbnail?: File       // present only when the user picks a file
}
```

---

### Step 4 — Frontend: API service

File: `srcs/frontend/src/services/api/videos.api.ts`

The trick: build a `FormData` always (it handles both text fields and the optional file). If there is no file, just don't append it — Django's `ImageField` is nullable.

```typescript
import { fetchWithConfig } from './index'
import type { Video, VideoPayload } from '../../api/contracts/videos'

function toFormData(payload: VideoPayload): FormData {
  const fd = new FormData()
  fd.append('tema',    payload.tema)
  fd.append('titulo',  payload.titulo)
  fd.append('corpo',   payload.corpo)
  fd.append('publicado', String(payload.publicado))
  if (payload.url_externa) fd.append('url_externa', payload.url_externa)
  if (payload.dificuldade) fd.append('dificuldade', payload.dificuldade)
  if (payload.thumbnail)   fd.append('thumbnail', payload.thumbnail)  // File object
  return fd
}

export const videosApi = {
  getVideos: async (): Promise<Video[]> => {
    try {
      const data = await fetchWithConfig<Video[]>('/videos/')
      return Array.isArray(data) ? data : []
    } catch {
      return []
    }
  },

  createVideo: (payload: VideoPayload): Promise<Video> =>
    fetchWithConfig<Video>('/videos/', {
      method: 'POST',
      body: toFormData(payload),
      // fetchWithConfig detects FormData and skips Content-Type: application/json
    }),

  updateVideo: (id: string, payload: VideoPayload): Promise<Video> =>
    fetchWithConfig<Video>(`/videos/${id}/`, {
      method: 'PUT',
      body: toFormData(payload),
    }),

  deleteVideo: (id: string): Promise<void> =>
    fetchWithConfig<void>(`/videos/${id}/`, { method: 'DELETE' }),
}
```

---

### Step 5 — Frontend: load Temas for the select

The form needs a Tema dropdown. Load them once when the modal opens.

```typescript
// Quick inline fetch inside the modal — no need for a full service
const [temas, setTemas] = useState<{ id: string; titulo: string }[]>([])

useEffect(() => {
  fetchWithConfig<{ id: string; titulo: string }[]>('/temas/')
    .then(data => setTemas(Array.isArray(data) ? data : []))
    .catch(() => {})
}, [])
```

If you want to filter by section (only `seccao=aprender` for Aulas, etc.) you can add a query param once the TemaViewSet supports filtering. For now, show all.

---

### Step 6 — Frontend: panel + modal

File: `srcs/frontend/src/pages/dashboard/VideosPanel.tsx`

The panel is identical in structure to `AulasPanel`. The only differences in the **modal** are:

1. **Tema select** — loaded from the API (see step 5)
2. **URL field** — YouTube / Vimeo link stored as `url_externa`
3. **Thumbnail file input** — optional, triggers `FormData` path
4. **Dificuldade select** — básico / intermédio / avançado

```tsx
import { useEffect, useRef, useState } from 'react'
import { Pencil, Trash2, Plus, X, Play } from 'lucide-react'
import { videosApi } from '../../services/api/videos.api'
import { fetchWithConfig } from '../../services/api/index'
import type { Video, VideoPayload } from '../../api/contracts/videos'
import Pagination from '../../components/core/Pagination'

const PAGE_SIZE = 5

type TemaOption = { id: string; titulo: string }

/* ── Form modal ─────────────────────────────────────────────────────────── */
function VideoFormModal({
  initial, onClose, onSaved,
}: {
  initial?: Video
  onClose: () => void
  onSaved: (v: Video) => void
}) {
  const [temas, setTemas]           = useState<TemaOption[]>([])
  const [form, setForm]             = useState<Omit<VideoPayload, 'thumbnail'>>({
    tema: initial?.tema ?? '',
    titulo: initial?.titulo ?? '',
    corpo: initial?.corpo ?? '',
    url_externa: initial?.url_externa ?? '',
    dificuldade: initial?.dificuldade ?? '',
    publicado: initial?.publicado ?? false,
  })
  const [thumbFile, setThumbFile]   = useState<File | null>(null)
  const fileRef                     = useRef<HTMLInputElement>(null)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState<string | null>(null)

  useEffect(() => {
    fetchWithConfig<TemaOption[]>('/temas/')
      .then(data => setTemas(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload: VideoPayload = {
        ...form,
        thumbnail: thumbFile ?? undefined,
      }
      const saved = initial
        ? await videosApi.updateVideo(initial.id, payload)
        : await videosApi.createVideo(payload)
      onSaved(saved)
    } catch {
      setError('Não foi possível guardar. Tenta novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
         onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6"
           onClick={e => e.stopPropagation()}>

        <button onClick={onClose}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
          <X size={16} />
        </button>

        <h2 className="text-xl font-black text-gray-800 mb-5">
          {initial ? 'Editar Vídeo' : 'Novo Vídeo'}
        </h2>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">{error}</p>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4">

          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Título *</label>
            <input required type="text" value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          {/* Tema */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Tema *</label>
            <select required value={form.tema}
              onChange={e => setForm(f => ({ ...f, tema: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">— Selecionar tema —</option>
              {temas.map(t => (
                <option key={t.id} value={t.id}>{t.titulo}</option>
              ))}
            </select>
          </div>

          {/* Corpo */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Descrição</label>
            <textarea rows={3} value={form.corpo}
              onChange={e => setForm(f => ({ ...f, corpo: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
          </div>

          {/* URL vídeo */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">URL do Vídeo (YouTube / Vimeo)</label>
            <input type="url" value={form.url_externa ?? ''}
              onChange={e => setForm(f => ({ ...f, url_externa: e.target.value }))}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          {/* Dificuldade */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Dificuldade</label>
            <select value={form.dificuldade ?? ''}
              onChange={e => setForm(f => ({ ...f, dificuldade: e.target.value || undefined }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">— Nenhuma —</option>
              <option value="basico">Básico</option>
              <option value="intermedio">Intermédio</option>
              <option value="avancado">Avançado</option>
            </select>
          </div>

          {/* Thumbnail upload */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Miniatura (imagem)</label>
            <div className="flex items-center gap-3">
              <button type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                {thumbFile ? thumbFile.name : 'Escolher ficheiro…'}
              </button>
              {thumbFile && (
                <button type="button" onClick={() => setThumbFile(null)}
                  className="text-xs text-red-500 hover:underline">
                  Remover
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => setThumbFile(e.target.files?.[0] ?? null)} />
            {/* Show existing thumbnail when editing */}
            {!thumbFile && initial?.thumbnail_url && (
              <img src={initial.thumbnail_url} alt=""
                className="mt-2 h-16 w-28 rounded-lg object-cover border border-gray-100" />
            )}
          </div>

          {/* Publicado */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={form.publicado}
              onChange={e => setForm(f => ({ ...f, publicado: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Publicado (visível no site)</span>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="rounded-lg px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60">
              {saving ? 'A guardar…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Panel ───────────────────────────────────────────────────────────────── */
const VideosPanel = () => {
  const [videos, setVideos]         = useState<Video[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [page, setPage]             = useState(1)
  const [modalOpen, setModalOpen]   = useState(false)
  const [editing, setEditing]       = useState<Video | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function load() {
    setIsLoading(true)
    setVideos(await videosApi.getVideos())
    setIsLoading(false)
  }
  useEffect(() => { load() }, [])

  function handleSaved(saved: Video) {
    setModalOpen(false)
    setVideos(prev => {
      const idx = prev.findIndex(v => v.id === saved.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next }
      return [saved, ...prev]
    })
  }

  async function handleDelete(id: string) {
    setIsDeleting(true)
    try {
      await videosApi.deleteVideo(id)
      setVideos(prev => prev.filter(v => v.id !== id))
    } finally {
      setDeletingId(null)
      setIsDeleting(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(videos.length / PAGE_SIZE))
  const pageItems  = videos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
    </div>
  )

  return (
    <>
      <div className="flex-1 min-h-0 flex flex-col gap-3">
        <div className="flex justify-end">
          <button onClick={() => { setEditing(undefined); setModalOpen(true) }}
            className="flex items-center gap-2 rounded-xl px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-sm">
            <Plus size={16} /> Novo Vídeo
          </button>
        </div>

        {videos.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white/60 font-semibold">Nenhum vídeo. Adiciona o primeiro!</p>
          </div>
        ) : (
          <>
            <div className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">Título</th>
                    <th className="px-4 py-3">Tema</th>
                    <th className="px-4 py-3">Disciplina</th>
                    <th className="px-4 py-3">Dificuldade</th>
                    <th className="px-4 py-3">Publicado</th>
                    <th className="px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pageItems.map(video => (
                    <tr key={video.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        <div className="flex items-center gap-2">
                          {video.thumbnail_url
                            ? <img src={video.thumbnail_url} alt="" className="h-8 w-12 rounded object-cover shrink-0" />
                            : <span className="flex h-8 w-12 items-center justify-center rounded bg-gray-100 shrink-0">
                                <Play size={14} className="text-gray-400" />
                              </span>
                          }
                          {video.titulo}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{video.tema_titulo}</td>
                      <td className="px-4 py-3 text-gray-500">{video.disciplina_nome}</td>
                      <td className="px-4 py-3 text-gray-500 capitalize">{video.dificuldade ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${video.publicado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {video.publicado ? 'Sim' : 'Não'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {deletingId === video.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 font-semibold">Tens a certeza?</span>
                            <button onClick={() => handleDelete(video.id)} disabled={isDeleting}
                              className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg disabled:opacity-60">
                              {isDeleting ? '…' : 'Eliminar'}
                            </button>
                            <button onClick={() => setDeletingId(null)}
                              className="text-xs font-bold text-gray-500 hover:text-gray-700">
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button onClick={() => { setEditing(video); setModalOpen(true) }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50"
                              title="Editar">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => setDeletingId(video.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                              title="Eliminar">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages}
              totalItems={videos.length} pageSize={PAGE_SIZE} onPage={setPage} />
          </>
        )}
      </div>

      {modalOpen && (
        <VideoFormModal
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}

export default VideosPanel
```

---

## What changes for the other tabs

| Tab | Template | Key differences |
|-----|----------|-----------------|
| **Exercício** | Aula | Swap `videoUrl`/`duration` for `pdfUrl` (URL) + `ficheiro` (file upload) — same toFormData trick as Vídeo |
| **Descarregar** | Vídeo | Same `ConteudoWriteSerializer` / `toFormData`, but `perform_create` sets `tipo="pdf"` and `descarregavel=True` instead of `tipo="video"` |
| **Livros** | Vídeo | Two file fields (`capa` image + `ficheiro` PDF). No Tema select — has `faixa_etaria` select instead |
| **Jogos** | Aula/Vídeo | Has `disciplina` FK select (load from `/api/disciplinas/`) + optional `ficheiro` game file upload |
