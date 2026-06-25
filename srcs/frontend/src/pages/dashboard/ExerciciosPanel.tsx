import { useEffect, useRef, useState } from 'react'
import { Pencil, Trash2, Plus, X, FileText, Eye } from 'lucide-react'
import { exerciciosApi } from '../../services/api/exercicios.api'
import type { Exercicio, ExercicioPayload } from '../../api/contracts/exercicios'
import Pagination from '../../components/core/Pagination'
import ExerciseModal from '../../components/resolver/ExerciseModal'
import type { Exercise } from '../../components/resolver/ExerciseModal'
import { useNightMode } from '../../components/core/NightMode'
import { dashboardTheme } from '../../utils/dashboardTheme'

const SUBJECTS = [
    { id: 'matematica', label: 'Matemática' },
    { id: 'portugues', label: 'Português' },
    { id: 'estudo-do-meio', label: 'Estudo do Meio' },
]

const SUBJECT_IMG: Record<string, string> = {
    matematica:       '/src/assets/math.webp',
    portugues:        '/src/assets/book3.webp',
    'estudo-do-meio': '/src/assets/science.webp',
}

const PAGE_SIZE = 8

const EMPTY: ExercicioPayload = {
    title: '', subjectId: 'matematica', level: 1,
    description: '', thumbnailUrl: '', videoUrl: '', ficheiro: null,
    publicado: false,
}

function ExercicioModal({ initial, currentFicheiroUrl, onSave, onClose }: {
    initial: ExercicioPayload
    currentFicheiroUrl?: string
    onSave: (p: ExercicioPayload) => Promise<void>
    onClose: () => void
}) {
    const { isNightMode } = useNightMode()
    const th = dashboardTheme(isNightMode)
    const [form, setForm] = useState<ExercicioPayload>({ ...initial, thumbnail: null })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    const thumbnailRef = useRef<HTMLInputElement>(null)
    const [thumbPreview, setThumbPreview] = useState<string | null>(initial.thumbnailUrl || null)

    const set = <K extends keyof ExercicioPayload>(k: K, v: ExercicioPayload[K]) => setForm(f => ({ ...f, [k]: v }))

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true); setError(null)
        try { await onSave(form); onClose() }
        catch { setError('Erro ao guardar. Tenta novamente.') }
        finally { setSaving(false) }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className={th.modalCard}>
                <div className={th.modalHeader}>
                    <h2 className={th.modalTitle}>{initial.title ? 'Editar Exercício' : 'Novo Exercício'}</h2>
                    <button onClick={onClose} className={th.modalCloseBtn}><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
                    <div>
                        <label className={th.label}>Título *</label>
                        <input required value={form.title} onChange={e => set('title', e.target.value)}
                            className={th.input} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={th.label}>Matéria *</label>
                            <select value={form.subjectId} onChange={e => set('subjectId', e.target.value)}
                                className={th.select}>
                                {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={th.label}>Nível *</label>
                            <select value={form.level} onChange={e => set('level', Number(e.target.value))}
                                className={th.select}>
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
                                <input type="url" value={form.thumbnailUrl ?? ''}
                                    onChange={e => {
                                        set('thumbnailUrl', e.target.value || undefined)
                                        setThumbPreview(e.target.value || null)
                                        if (e.target.value) set('thumbnail', null)
                                    }}
                                    placeholder="https://exemplo.com/imagem.png"
                                    className={th.input} />
                                <input
                                    ref={thumbnailRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        const file = e.target.files?.[0] ?? null
                                        set('thumbnail', file)
                                        if (file) {
                                            setThumbPreview(URL.createObjectURL(file))
                                            set('thumbnailUrl', undefined)
                                        }
                                    }}
                                    className={th.fileInput} />
                                <p className={th.inputHint}>URL ou ficheiro. Se vazio, usa a imagem padrão da matéria</p>
                            </div>
                            <div className={th.thumbBox}>
                                <img
                                    src={thumbPreview || SUBJECT_IMG[form.subjectId] || '/src/assets/math.webp'}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).src = '/src/assets/math.webp' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={th.label}>Descrição</label>
                        <textarea rows={3} value={form.description ?? ''} onChange={e => set('description', e.target.value)}
                            className={th.textarea} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={th.label}>URL do Vídeo</label>
                            <input type="url" value={form.videoUrl ?? ''} onChange={e => set('videoUrl', e.target.value || undefined)}
                                placeholder="https://youtube.com/..."
                                className={th.input} />
                        </div>
                    </div>

                    <div>
                        <label className={th.label}>PDF (opcional)</label>
                        {currentFicheiroUrl && !form.ficheiro && (
                            <a href={(() => { try { return new URL(currentFicheiroUrl).pathname } catch { return currentFicheiroUrl } })()}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline mb-1">
                                <FileText size={13} /> PDF atual
                            </a>
                        )}
                        <input ref={fileRef} type="file" accept="application/pdf"
                            onChange={e => set('ficheiro', e.target.files?.[0] ?? null)}
                            className={th.fileInput} />
                        {form.ficheiro && <p className={`mt-1 ${th.inputHint}`}>{(form.ficheiro as File).name}</p>}
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={form.publicado} onChange={e => set('publicado', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 accent-blue-600" />
                        <span className={th.checkboxLabel}>Publicado</span>
                    </label>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex justify-end gap-2 pt-1">
                        <button type="button" onClick={onClose} className={th.cancelBtn}>Cancelar</button>
                        <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
                            {saving ? 'A guardar…' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const ExerciciosPanel = ({ autoCreate }: { autoCreate?: boolean }) => {
    const { isNightMode } = useNightMode()
    const th = dashboardTheme(isNightMode)
    const [exercicios, setExercicios] = useState<Exercicio[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [modal, setModal] = useState<{ open: boolean; exercicio: Exercicio | null }>({ open: false, exercicio: null })
    const [previewEx, setPreviewEx] = useState<Exercicio | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    async function load() {
        setIsLoading(true)
        setExercicios(await exerciciosApi.getExercicios())
        setIsLoading(false)
    }

    useEffect(() => { load() }, [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { if (autoCreate) setModal({ open: true, exercicio: null }) }, [])

    const totalPages = Math.max(1, Math.ceil(exercicios.length / PAGE_SIZE))
    const pageItems = exercicios.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    async function handleSave(payload: ExercicioPayload) {
        if (modal.exercicio) await exerciciosApi.updateExercicio(modal.exercicio.id, payload)
        else await exerciciosApi.createExercicio(payload)
        await load()
    }

    async function handleDelete(id: string) {
        await exerciciosApi.deleteExercicio(id)
        setDeleteId(null)
        await load()
    }

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-3">
            <div className="flex items-center justify-between shrink-0">
                <p className="text-white/70 text-sm font-semibold">{exercicios.length} exercício{exercicios.length !== 1 ? 's' : ''}</p>
                <button onClick={() => setModal({ open: true, exercicio: null })}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer">
                    <Plus size={16} /> Novo Exercício
                </button>
            </div>

            <div className={`flex-1 min-h-0 overflow-y-auto ${th.tableWrap}`}>
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                    </div>
                ) : exercicios.length === 0 ? (
                    <div className={`flex h-40 items-center justify-center ${th.emptyState}`}>Nenhum exercício encontrado</div>
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
                            {pageItems.map(ex => (
                                <tr key={ex.id} className={th.row}>
                                    <td className={`px-4 py-3 ${th.cellPrimary}`}>
                                        {ex.title}
                                        {ex.description && <p className={th.cellMuted}>{ex.description}</p>}
                                    </td>
                                    <td className={`px-4 py-3 ${th.cellSecondary}`}>{SUBJECTS.find(s => s.id === ex.subjectId)?.label ?? ex.subjectId}</td>
                                    <td className="px-4 py-3">
                                        <span className={th.levelBadge(ex.level)}>Nível {ex.level}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={ex.publicado ? th.badgePublished : th.badgeDraft}>
                                            {ex.publicado ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {deleteId === ex.id ? (
                                                <>
                                                    <span className="text-xs text-red-500 font-semibold mr-1">Eliminar?</span>
                                                    <button onClick={() => handleDelete(ex.id)} className="rounded px-2 py-1 text-xs font-bold text-white bg-red-500 hover:bg-red-600 cursor-pointer">Sim</button>
                                                    <button onClick={() => setDeleteId(null)} className="rounded px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer">Não</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => setPreviewEx(ex)} className={`${th.actionBase} ${th.actionPreview}`} title="Visualizar"><Eye size={15} /></button>
                                                    <button onClick={() => setModal({ open: true, exercicio: ex })} className={`${th.actionBase} ${th.actionEdit}`} title="Editar"><Pencil size={15} /></button>
                                                    <button onClick={() => setDeleteId(ex.id)} className={`${th.actionBase} ${th.actionDelete}`} title="Eliminar"><Trash2 size={15} /></button>
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

            <Pagination page={page} totalPages={totalPages} totalItems={exercicios.length} pageSize={PAGE_SIZE} onPage={setPage} />

            {previewEx && <ExerciseModal exercise={previewEx as unknown as Exercise} onClose={() => setPreviewEx(null)} />}

            {modal.open && (
                <ExercicioModal
                    currentFicheiroUrl={modal.exercicio?.ficheiro_url}
                    initial={modal.exercicio ? {
                        title: modal.exercicio.title,
                        subjectId: modal.exercicio.subjectId,
                        level: modal.exercicio.level,
                        description: modal.exercicio.description ?? '',
                        thumbnailUrl: modal.exercicio.thumbnailUrl ?? '',
                        videoUrl: modal.exercicio.videoUrl ?? '',
                        ficheiro: null,
                        publicado: modal.exercicio.publicado,
                    } : EMPTY}
                    onSave={handleSave}
                    onClose={() => setModal({ open: false, exercicio: null })}
                />
            )}
        </div>
    )
}

export default ExerciciosPanel
