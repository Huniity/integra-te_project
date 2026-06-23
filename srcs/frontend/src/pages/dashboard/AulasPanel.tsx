import { useEffect, useRef, useState } from 'react'
import { Pencil, Trash2, Plus, X, FileText, Eye } from 'lucide-react'
import { aulasApi } from '../../services/api/aulas.api'
import type { Aula, AulaPayload } from '../../api/contracts/aulas'
import Pagination from '../../components/core/Pagination'
import AprenderModal from '../../components/aprender/AprenderModal'
import { useNightMode } from '../../components/core/NightMode'
import { dashboardTheme } from '../../utils/dashboardTheme'

const SUBJECTS = [
    { id: 'matematica',      label: 'Matemática' },
    { id: 'portugues',       label: 'Português' },
    { id: 'estudo-do-meio',  label: 'Estudo do Meio' },
]

const SUBJECT_IMG: Record<string, string> = {
    matematica:        '/src/assets/math.webp',
    portugues:         '/src/assets/book3.webp',
    'estudo-do-meio':  '/src/assets/science.webp',
}

const PAGE_SIZE = 8

const EMPTY: AulaPayload = {
    title: '',
    subjectId: 'matematica',
    level: 1,
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    ficheiro: null,
    publicado: false,
}

/* ── Form modal ─────────────────────────────────────────────────────────────── */
function AulaModal({
    initial,
    currentFicheiroUrl,
    onSave,
    onClose,
}: {
    initial: AulaPayload
    currentFicheiroUrl?: string
    onSave: (p: AulaPayload) => Promise<void>
    onClose: () => void
}) {
    const { isNightMode } = useNightMode()
    const th = dashboardTheme(isNightMode)
    const [form, setForm] = useState<AulaPayload>({ ...initial, thumbnail: null })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    const thumbnailRef = useRef<HTMLInputElement>(null)
    const [thumbPreview, setThumbPreview] = useState<string | null>(initial.thumbnailUrl || null)

    const set = (k: keyof AulaPayload, v: AulaPayload[keyof AulaPayload]) =>
        setForm((f) => ({ ...f, [k]: v }))

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        setError(null)
        try {
            await onSave(form)
            onClose()
        } catch {
            setError('Erro ao guardar. Tenta novamente.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className={th.modalCard}>
                <div className={th.modalHeader}>
                    <h2 className={th.modalTitle}>
                        {initial.title ? 'Editar Aula' : 'Nova Aula'}
                    </h2>
                    <button onClick={onClose} className={th.modalCloseBtn}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
                    <div>
                        <label className={th.label}>Título *</label>
                        <input
                            required
                            value={form.title}
                            onChange={(e) => set('title', e.target.value)}
                            className={th.input}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={th.label}>Matéria *</label>
                            <select
                                value={form.subjectId}
                                onChange={(e) => set('subjectId', e.target.value)}
                                className={th.select}
                            >
                                {SUBJECTS.map((s) => (
                                    <option key={s.id} value={s.id}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={th.label}>Nível *</label>
                            <select
                                value={form.level}
                                onChange={(e) => set('level', Number(e.target.value))}
                                className={th.select}
                            >
                                <option value={1}>Nível 1</option>
                                <option value={2}>Nível 2</option>
                                <option value={3}>Nível 3</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={th.label}>Imagem do card</label>
                        <div className="flex items-start gap-3">
                            <div className="flex-1 flex flex-col gap-2">
                                <input
                                    type="url"
                                    value={form.thumbnailUrl ?? ''}
                                    onChange={(e) => {
                                        set('thumbnailUrl', e.target.value || undefined)
                                        setThumbPreview(e.target.value || null)
                                        if (e.target.value) set('thumbnail', null)
                                    }}
                                    placeholder="https://exemplo.com/imagem.png"
                                    className={th.input}
                                />
                                <input
                                    ref={thumbnailRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null
                                        set('thumbnail', file)
                                        if (file) {
                                            setThumbPreview(URL.createObjectURL(file))
                                            set('thumbnailUrl', undefined)
                                        }
                                    }}
                                    className={th.fileInput}
                                />
                                <p className={th.inputHint}>URL ou ficheiro. Se vazio, usa a imagem padrão da matéria</p>
                            </div>
                            <div className={th.thumbBox}>
                                <img
                                    src={thumbPreview || SUBJECT_IMG[form.subjectId] || '/src/assets/math.webp'}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/src/assets/math.webp' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={th.label}>Descrição</label>
                        <textarea
                            rows={3}
                            value={form.description ?? ''}
                            onChange={(e) => set('description', e.target.value)}
                            className={th.textarea}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={th.label}>URL do Vídeo</label>
                            <input
                                type="url"
                                value={form.videoUrl ?? ''}
                                onChange={(e) => set('videoUrl', e.target.value || undefined)}
                                placeholder="https://youtube.com/..."
                                className={th.input}
                            />
                        </div>

                    </div>

                    <div>
                        <label className={th.label}>PDF (opcional)</label>
                        {currentFicheiroUrl && !form.ficheiro && (
                            <a
                                href={(() => { try { return new URL(currentFicheiroUrl).pathname; } catch { return currentFicheiroUrl; } })()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline mb-1"
                            >
                                <FileText size={13} /> PDF atual
                            </a>
                        )}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => set('ficheiro', e.target.files?.[0] ?? null)}
                            className={th.fileInput}
                        />
                        {form.ficheiro && (
                            <p className={`mt-1 ${th.inputHint}`}>{(form.ficheiro as File).name}</p>
                        )}
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={form.publicado}
                            onChange={(e) => set('publicado', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                        />
                        <span className={th.checkboxLabel}>Publicado</span>
                    </label>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-end gap-2 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className={th.cancelBtn}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                        >
                            {saving ? 'A guardar…' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

/* ── Panel ──────────────────────────────────────────────────────────────────── */
const AulasPanel = ({ autoCreate }: { autoCreate?: boolean }) => {
    const { isNightMode } = useNightMode()
    const th = dashboardTheme(isNightMode)
    const [aulas, setAulas] = useState<Aula[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [modal, setModal] = useState<{ open: boolean; aula: Aula | null; ficheiroUrl?: string }>({ open: false, aula: null })
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [previewAula, setPreviewAula] = useState<Aula | null>(null)

    async function load() {
        setIsLoading(true)
        setAulas(await aulasApi.getAulas())
        setIsLoading(false)
    }

    useEffect(() => { load() }, [])

    const totalPages = Math.max(1, Math.ceil(aulas.length / PAGE_SIZE))
    const pageItems = aulas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    async function handleSave(payload: AulaPayload) {
        if (modal.aula) {
            await aulasApi.updateAula(modal.aula.id, payload)
        } else {
            await aulasApi.createAula(payload)
        }
        await load()
    }

    async function handleDelete(id: string) {
        await aulasApi.deleteAula(id)
        setDeleteId(null)
        await load()
    }

    function openCreate() { setModal({ open: true, aula: null }) }
    function openEdit(aula: Aula) { setModal({ open: true, aula, ficheiroUrl: aula.ficheiro_url }) }
    function closeModal() { setModal({ open: false, aula: null }) }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { if (autoCreate) openCreate() }, [])

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <p className="text-white/70 text-sm font-semibold">
                    {aulas.length} aula{aulas.length !== 1 ? 's' : ''}
                </p>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer"
                >
                    <Plus size={16} />
                    Nova Aula
                </button>
            </div>

            {/* Table */}
            <div className={`flex-1 min-h-0 overflow-y-auto ${th.tableWrap}`}>
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                    </div>
                ) : aulas.length === 0 ? (
                    <div className={`flex h-40 items-center justify-center ${th.emptyState}`}>
                        Nenhuma aula encontrada
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10">
                            <tr className={th.theadRow}>
                                <th className="px-4 py-3">Título</th>
                                <th className="px-4 py-3">Matéria</th>
                                <th className="px-4 py-3">Nível</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className={th.tbody}>
                            {pageItems.map((aula) => (
                                <tr key={aula.id} className={th.row}>
                                    <td className={`px-4 py-3 ${th.cellPrimary}`}>
                                        {aula.title}
                                        {aula.description && (
                                            <p className={th.cellMuted}>
                                                {aula.description}
                                            </p>
                                        )}
                                    </td>
                                    <td className={`px-4 py-3 ${th.cellSecondary}`}>
                                        {SUBJECTS.find((s) => s.id === aula.subjectId)?.label ?? aula.subjectId}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={th.levelBadge(aula.level)}>
                                            Nível {aula.level}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={aula.publicado ? th.badgePublished : th.badgeDraft}>
                                            {aula.publicado ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {deleteId === aula.id ? (
                                                <>
                                                    <span className="text-xs text-red-500 font-semibold mr-1">Eliminar?</span>
                                                    <button
                                                        onClick={() => handleDelete(aula.id)}
                                                        className="rounded px-2 py-1 text-xs font-bold text-white bg-red-500 hover:bg-red-600 cursor-pointer"
                                                    >
                                                        Sim
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteId(null)}
                                                        className="rounded px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                                                    >
                                                        Não
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => setPreviewAula(aula)}
                                                        className={`${th.actionBase} ${th.actionPreview}`}
                                                        title="Visualizar"
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => openEdit(aula)}
                                                        className={`${th.actionBase} ${th.actionEdit}`}
                                                        title="Editar"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteId(aula.id)}
                                                        className={`${th.actionBase} ${th.actionDelete}`}
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={aulas.length}
                pageSize={PAGE_SIZE}
                onPage={setPage}
            />

            {previewAula && (
                <AprenderModal aula={previewAula} onClose={() => setPreviewAula(null)} />
            )}

            {modal.open && (
                <AulaModal
                    initial={
                        modal.aula
                            ? {
                                title: modal.aula.title,
                                subjectId: modal.aula.subjectId,
                                level: modal.aula.level,
                                description: modal.aula.description ?? '',
                                videoUrl: modal.aula.videoUrl ?? '',
                                thumbnailUrl: modal.aula.thumbnailUrl ?? '',
                                publicado: modal.aula.publicado,
                                ficheiro: null,
                            }
                            : EMPTY
                    }
                    currentFicheiroUrl={modal.ficheiroUrl}
                    onSave={handleSave}
                    onClose={closeModal}
                />
            )}
        </div>
    )
}

export default AulasPanel
