import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, X, Eye } from 'lucide-react'
import { videosApi } from '../../services/api/videos.api'
import { temasApi } from '../../services/api/temas.api'
import type { Video, VideoPayload } from '../../api/contracts/videos'
import type { Tema } from '../../api/contracts/temas'
import Pagination from '../../components/core/Pagination'
import VideoPreviewModal from '../../components/videos/VideoModal'
import { useNightMode } from '../../components/core/NightMode'
import { dashboardTheme } from '../../utils/dashboardTheme'

const DIFICULDADES = [
    { id: 'basico', label: 'Básico' },
    { id: 'intermedio', label: 'Intermédio' },
    { id: 'avancado', label: 'Avançado' },
]

const PAGE_SIZE = 8

const EMPTY = (temas: Tema[]): VideoPayload => ({
    titulo: '', corpo: '', tema: temas[0]?.id ?? '', dificuldade: '', url_externa: '', publicado: false, ficheiro: null, thumbnail: null,
})

function VideoModal({ initial, temas, onSave, onClose }: {
    initial: VideoPayload
    temas: Tema[]
    onSave: (p: VideoPayload) => Promise<void>
    onClose: () => void
}) {
    const { isNightMode } = useNightMode()
    const th = dashboardTheme(isNightMode)
    const [form, setForm] = useState<VideoPayload>(initial)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const set = <K extends keyof VideoPayload>(k: K, v: VideoPayload[K]) => setForm(f => ({ ...f, [k]: v }))

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
                    <h2 className={th.modalTitle}>{initial.titulo ? 'Editar Vídeo' : 'Novo Vídeo'}</h2>
                    <button onClick={onClose} className={th.modalCloseBtn}><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
                    <div>
                        <label className={th.label}>Título *</label>
                        <input required value={form.titulo} onChange={e => set('titulo', e.target.value)}
                            className={th.input} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={th.label}>Tema *</label>
                            <select required value={form.tema} onChange={e => set('tema', e.target.value)}
                                className={th.select}>
                                {temas.map(t => <option key={t.id} value={t.id}>{t.titulo} ({t.disciplina_nome})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={th.label}>Dificuldade</label>
                            <select value={form.dificuldade ?? ''} onChange={e => set('dificuldade', e.target.value || undefined)}
                                className={th.select}>
                                <option value="">—</option>
                                {DIFICULDADES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className={th.label}>Descrição</label>
                        <textarea rows={3} value={form.corpo ?? ''} onChange={e => set('corpo', e.target.value)}
                            className={th.textarea} />
                    </div>
                    <div>
                        <label className={th.label}>URL do Vídeo</label>
                        <input type="url" value={form.url_externa ?? ''} onChange={e => set('url_externa', e.target.value || undefined)}
                            placeholder="https://youtube.com/..."
                            className={th.input} />
                    </div>
                    <div>
                        <label className={th.label}>Ficheiro de vídeo</label>
                        <input type="file" accept="video/*" onChange={e => set('ficheiro', e.target.files?.[0] ?? null)}
                            className={th.fileInput} />
                    </div>
                    <div>
                        <label className={th.label}>Thumbnail</label>
                        <input type="file" accept="image/*" onChange={e => set('thumbnail', e.target.files?.[0] ?? null)}
                            className={th.fileInput} />
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

const VideosPanel = ({ autoCreate }: { autoCreate?: boolean }) => {
    const { isNightMode } = useNightMode()
    const th = dashboardTheme(isNightMode)
    const [videos, setVideos] = useState<Video[]>([])
    const [temas, setTemas] = useState<Tema[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [modal, setModal] = useState<{ open: boolean; video: Video | null }>({ open: false, video: null })
    const [previewVideo, setPreviewVideo] = useState<Video | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    async function load() {
        setIsLoading(true)
        const [v, t] = await Promise.all([videosApi.getVideos(), temasApi.getTemas()])
        setVideos(v); setTemas(t)
        setIsLoading(false)
    }

    useEffect(() => { load() }, [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { if (autoCreate) setModal({ open: true, video: null }) }, [])

    const totalPages = Math.max(1, Math.ceil(videos.length / PAGE_SIZE))
    const pageItems = videos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    async function handleSave(payload: VideoPayload) {
        if (modal.video) await videosApi.updateVideo(modal.video.id, payload)
        else await videosApi.createVideo(payload)
        await load()
    }

    async function handleDelete(id: string) {
        await videosApi.deleteVideo(id)
        setDeleteId(null)
        await load()
    }

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-3">
            <div className="flex items-center justify-between shrink-0">
                <p className="text-white/70 text-sm font-semibold">{videos.length} vídeo{videos.length !== 1 ? 's' : ''}</p>
                <button onClick={() => setModal({ open: true, video: null })}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer">
                    <Plus size={16} /> Novo Vídeo
                </button>
            </div>

            <div className={`flex-1 min-h-0 overflow-y-auto ${th.tableWrap}`}>
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                    </div>
                ) : videos.length === 0 ? (
                    <div className={`flex h-40 items-center justify-center ${th.emptyState}`}>Nenhum vídeo encontrado</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10">
                            <tr className={th.theadRow}>
                                <th className="px-4 py-3">Título</th>
                                <th className="px-4 py-3">Tema</th>
                                <th className="px-4 py-3">Disciplina</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className={th.tbody}>
                            {pageItems.map(video => (
                                <tr key={video.id} className={th.row}>
                                    <td className={`px-4 py-3 ${th.cellPrimary}`}>
                                        {video.titulo}
                                        {video.corpo && <p className={th.cellMuted}>{video.corpo}</p>}
                                    </td>
                                    <td className={`px-4 py-3 ${th.cellSecondary}`}>{video.tema_titulo}</td>
                                    <td className={`px-4 py-3 ${th.cellSecondary}`}>{video.disciplina_nome}</td>
                                    <td className="px-4 py-3">
                                        <span className={video.publicado ? th.badgePublished : th.badgeDraft}>
                                            {video.publicado ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {deleteId === video.id ? (
                                                <>
                                                    <span className="text-xs text-red-500 font-semibold mr-1">Eliminar?</span>
                                                    <button onClick={() => handleDelete(video.id)} className="rounded px-2 py-1 text-xs font-bold text-white bg-red-500 hover:bg-red-600 cursor-pointer">Sim</button>
                                                    <button onClick={() => setDeleteId(null)} className="rounded px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer">Não</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => setPreviewVideo(video)} className={`${th.actionBase} ${th.actionPreview}`} title="Visualizar"><Eye size={15} /></button>
                                                    <button onClick={() => setModal({ open: true, video })} className={`${th.actionBase} ${th.actionEdit}`} title="Editar"><Pencil size={15} /></button>
                                                    <button onClick={() => setDeleteId(video.id)} className={`${th.actionBase} ${th.actionDelete}`} title="Eliminar"><Trash2 size={15} /></button>
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

            <Pagination page={page} totalPages={totalPages} totalItems={videos.length} pageSize={PAGE_SIZE} onPage={setPage} />

            {previewVideo && <VideoPreviewModal video={previewVideo} onClose={() => setPreviewVideo(null)} />}

            {modal.open && (
                <VideoModal
                    temas={temas}
                    initial={modal.video ? { titulo: modal.video.titulo, corpo: modal.video.corpo, tema: modal.video.tema ?? '', dificuldade: modal.video.dificuldade ?? '', url_externa: modal.video.url_externa ?? '', publicado: modal.video.publicado, ficheiro: null, thumbnail: null } : EMPTY(temas)}
                    onSave={handleSave}
                    onClose={() => setModal({ open: false, video: null })}
                />
            )}
        </div>
    )
}

export default VideosPanel
