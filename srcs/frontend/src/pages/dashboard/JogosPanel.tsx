import { useEffect, useRef, useState } from 'react'
import { Pencil, Trash2, Plus, X, FileText, Eye } from 'lucide-react'
import { jogosApi } from '../../services/api/jogos.api'
import type { Jogo, JogoPayload } from '../../api/contracts/jogos'
import Pagination from '../../components/core/Pagination'

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

const LEVEL_COLORS: Record<number, string> = {
    1: 'bg-emerald-100 text-emerald-700',
    2: 'bg-orange-100 text-orange-700',
    3: 'bg-purple-100 text-purple-700',
}

const PAGE_SIZE = 8

const EMPTY: JogoPayload = {
    titulo: '', subjectId: 'matematica', level: 1,
    descricao: '', thumbnailUrl: '', videoUrl: '', ficheiro: null,
    publicado: false,
}

function JogoModal({ initial, currentFicheiroUrl, onSave, onClose }: {
    initial: JogoPayload
    currentFicheiroUrl?: string
    onSave: (p: JogoPayload) => Promise<void>
    onClose: () => void
}) {
    const [form, setForm] = useState<JogoPayload>({ ...initial, thumbnail: null })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    const thumbnailRef = useRef<HTMLInputElement>(null)
    const [thumbPreview, setThumbPreview] = useState<string | null>(initial.thumbnailUrl || null)

    const set = <K extends keyof JogoPayload>(k: K, v: JogoPayload[K]) => setForm(f => ({ ...f, [k]: v }))

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true); setError(null)
        try { await onSave(form); onClose() }
        catch { setError('Erro ao guardar. Tenta novamente.') }
        finally { setSaving(false) }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 sticky top-0 bg-white">
                    <h2 className="text-lg font-bold text-gray-800">{initial.titulo ? 'Editar Jogo' : 'Novo Jogo'}</h2>
                    <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100 cursor-pointer"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Título *</label>
                        <input required value={form.titulo} onChange={e => set('titulo', e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Matéria *</label>
                            <select value={form.subjectId ?? 'matematica'} onChange={e => set('subjectId', e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                                {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Nível *</label>
                            <select value={form.level ?? 1} onChange={e => set('level', Number(e.target.value))}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                                <option value={1}>Nível 1</option>
                                <option value={2}>Nível 2</option>
                                <option value={3}>Nível 3</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Imagem do card</label>
                        <div className="flex items-start gap-3">
                            <div className="flex-1 flex flex-col gap-2">
                                <input type="url" value={form.thumbnailUrl ?? ''}
                                    onChange={e => {
                                        set('thumbnailUrl', e.target.value || undefined)
                                        setThumbPreview(e.target.value || null)
                                        if (e.target.value) set('thumbnail', null)
                                    }}
                                    placeholder="https://exemplo.com/imagem.png"
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
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
                                    className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                                <p className="text-xs text-gray-400">URL ou ficheiro. Se vazio, usa a imagem padrão da matéria</p>
                            </div>
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                                <img
                                    src={thumbPreview || SUBJECT_IMG[form.subjectId ?? 'matematica'] || '/src/assets/math.webp'}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).src = '/src/assets/math.webp' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Descrição</label>
                        <textarea rows={3} value={form.descricao ?? ''} onChange={e => set('descricao', e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">URL do Vídeo</label>
                            <input type="url" value={form.videoUrl ?? ''} onChange={e => set('videoUrl', e.target.value || undefined)}
                                placeholder="https://youtube.com/..."
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Ficheiro do Jogo</label>
                        {currentFicheiroUrl && !form.ficheiro && (
                            <a href={(() => { try { return new URL(currentFicheiroUrl).pathname } catch { return currentFicheiroUrl } })()}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline mb-1">
                                <FileText size={13} /> Ficheiro atual
                            </a>
                        )}
                        <input ref={fileRef} type="file"
                            onChange={e => set('ficheiro', e.target.files?.[0] ?? null)}
                            className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                        {form.ficheiro && <p className="mt-1 text-xs text-gray-400">{(form.ficheiro as File).name}</p>}
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={form.publicado} onChange={e => set('publicado', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 accent-blue-600" />
                        <span className="text-sm font-semibold text-gray-700">Publicado</span>
                    </label>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex justify-end gap-2 pt-1">
                        <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50 cursor-pointer">Cancelar</button>
                        <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
                            {saving ? 'A guardar…' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const JogosPanel = ({ autoCreate }: { autoCreate?: boolean }) => {
    const [jogos, setJogos] = useState<Jogo[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [modal, setModal] = useState<{ open: boolean; jogo: Jogo | null }>({ open: false, jogo: null })
    const [deleteId, setDeleteId] = useState<string | null>(null)

    async function load() {
        setIsLoading(true)
        setJogos(await jogosApi.getJogos())
        setIsLoading(false)
    }

    useEffect(() => { load() }, [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { if (autoCreate) setModal({ open: true, jogo: null }) }, [])

    const totalPages = Math.max(1, Math.ceil(jogos.length / PAGE_SIZE))
    const pageItems = jogos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    async function handleSave(payload: JogoPayload) {
        if (modal.jogo) await jogosApi.updateJogo(modal.jogo.id, payload)
        else await jogosApi.createJogo(payload)
        await load()
    }

    function openJogo(j: Jogo) {
        const url = j.videoUrl || j.url_externa || j.ficheiro_url
        if (url) window.open(url, '_blank')
    }

    async function handleDelete(id: string) {
        await jogosApi.deleteJogo(id)
        setDeleteId(null)
        await load()
    }

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-3">
            <div className="flex items-center justify-between shrink-0">
                <p className="text-white/70 text-sm font-semibold">{jogos.length} jogo{jogos.length !== 1 ? 's' : ''}</p>
                <button onClick={() => setModal({ open: true, jogo: null })}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer">
                    <Plus size={16} /> Novo Jogo
                </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                    </div>
                ) : jogos.length === 0 ? (
                    <div className="flex h-40 items-center justify-center text-gray-400 font-semibold">Nenhum jogo encontrado</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10">
                            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                                <th className="px-4 py-3">Título</th>
                                <th className="px-4 py-3">Matéria</th>
                                <th className="px-4 py-3">Nível</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pageItems.map(jogo => (
                                <tr key={jogo.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-semibold text-gray-800">
                                        {jogo.titulo}
                                        {jogo.descricao && <p className="text-xs font-normal text-gray-400 mt-0.5 line-clamp-1">{jogo.descricao}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{SUBJECTS.find(s => s.id === jogo.subjectId)?.label ?? jogo.subjectId ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        {jogo.level ? (
                                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${LEVEL_COLORS[jogo.level] ?? 'bg-gray-100 text-gray-600'}`}>Nível {jogo.level}</span>
                                        ) : <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${jogo.publicado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                            {jogo.publicado ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {deleteId === jogo.id ? (
                                                <>
                                                    <span className="text-xs text-red-500 font-semibold mr-1">Eliminar?</span>
                                                    <button onClick={() => handleDelete(jogo.id)} className="rounded px-2 py-1 text-xs font-bold text-white bg-red-500 hover:bg-red-600 cursor-pointer">Sim</button>
                                                    <button onClick={() => setDeleteId(null)} className="rounded px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer">Não</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => openJogo(jogo)} disabled={!jogo.videoUrl && !jogo.url_externa && !jogo.ficheiro_url} className="rounded p-1.5 text-gray-400 hover:bg-purple-50 hover:text-purple-600 disabled:opacity-30 cursor-pointer" title="Abrir Jogo"><Eye size={15} /></button>
                                                    <button onClick={() => setModal({ open: true, jogo })} className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 cursor-pointer" title="Editar"><Pencil size={15} /></button>
                                                    <button onClick={() => setDeleteId(jogo.id)} className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-pointer" title="Eliminar"><Trash2 size={15} /></button>
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

            <Pagination page={page} totalPages={totalPages} totalItems={jogos.length} pageSize={PAGE_SIZE} onPage={setPage} />

            {modal.open && (
                <JogoModal
                    currentFicheiroUrl={modal.jogo?.ficheiro_url}
                    initial={modal.jogo ? {
                        titulo: modal.jogo.titulo,
                        subjectId: modal.jogo.subjectId ?? 'matematica',
                        level: modal.jogo.level ?? 1,
                        thumbnailUrl: modal.jogo.thumbnailUrl ?? '',
                        descricao: modal.jogo.descricao ?? '',
                        videoUrl: modal.jogo.videoUrl ?? '',
                        ficheiro: null,
                        publicado: modal.jogo.publicado,
                    } : EMPTY}
                    onSave={handleSave}
                    onClose={() => setModal({ open: false, jogo: null })}
                />
            )}
        </div>
    )
}

export default JogosPanel
