import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, X, FileText, Eye } from 'lucide-react'
import { descarregarApi } from '../../services/api/descarregar.api'
import { temasApi } from '../../services/api/temas.api'
import type { Descarregavel, DescarregavelPayload } from '../../api/contracts/descarregar'
import type { Tema } from '../../api/contracts/temas'
import Pagination from '../../components/core/Pagination'
import { useNightMode } from '../../components/core/NightMode'
import { dashboardTheme } from '../../utils/dashboardTheme'

const DIFICULDADES = [
    { id: 'basico', label: 'Básico' },
    { id: 'intermedio', label: 'Intermédio' },
    { id: 'avancado', label: 'Avançado' },
]

const PAGE_SIZE = 8

const EMPTY = (temas: Tema[]): DescarregavelPayload => ({
    titulo: '', corpo: '', tema: temas[0]?.id ?? '', dificuldade: '', url_externa: '', publicado: false, ficheiro: null, thumbnail: null,
})

function FicheiroModal({ initial, temas, currentFicheiroUrl, onSave, onClose }: {
    initial: DescarregavelPayload
    temas: Tema[]
    currentFicheiroUrl?: string
    onSave: (p: DescarregavelPayload) => Promise<void>
    onClose: () => void
}) {
    const { isNightMode } = useNightMode()
    const th = dashboardTheme(isNightMode)
    const [form, setForm] = useState<DescarregavelPayload>(initial)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const set = <K extends keyof DescarregavelPayload>(k: K, v: DescarregavelPayload[K]) => setForm(f => ({ ...f, [k]: v }))

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
                    <h2 className={th.modalTitle}>{initial.titulo ? 'Editar Ficheiro' : 'Novo Ficheiro'}</h2>
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
                        <label className={th.label}>URL externa</label>
                        <input type="url" value={form.url_externa ?? ''} onChange={e => set('url_externa', e.target.value || undefined)}
                            placeholder="https://..."
                            className={th.input} />
                    </div>
                    <div>
                        <label className={th.label}>Ficheiro PDF</label>
                        {currentFicheiroUrl && !form.ficheiro && (
                            <a href={(() => { try { return new URL(currentFicheiroUrl).pathname } catch { return currentFicheiroUrl } })()}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline mb-1">
                                <FileText size={13} /> PDF atual
                            </a>
                        )}
                        <input type="file" accept="application/pdf" onChange={e => set('ficheiro', e.target.files?.[0] ?? null)}
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

const FicheirosPanel = ({ autoCreate }: { autoCreate?: boolean }) => {
    const { isNightMode } = useNightMode()
    const th = dashboardTheme(isNightMode)
    const [ficheiros, setFicheiros] = useState<Descarregavel[]>([])
    const [temas, setTemas] = useState<Tema[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [modal, setModal] = useState<{ open: boolean; ficheiro: Descarregavel | null }>({ open: false, ficheiro: null })
    const [deleteId, setDeleteId] = useState<string | null>(null)

    async function load() {
        setIsLoading(true)
        const [f, t] = await Promise.all([descarregarApi.getDescarregaveis(), temasApi.getTemas()])
        setFicheiros(f); setTemas(t)
        setIsLoading(false)
    }

    useEffect(() => { load() }, [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { if (autoCreate) setModal({ open: true, ficheiro: null }) }, [])

    const totalPages = Math.max(1, Math.ceil(ficheiros.length / PAGE_SIZE))
    const pageItems = ficheiros.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    async function handleSave(payload: DescarregavelPayload) {
        if (modal.ficheiro) await descarregarApi.updateDescarregavel(modal.ficheiro.id, payload)
        else await descarregarApi.createDescarregavel(payload)
        await load()
    }

    function openFicheiro(f: Descarregavel) {
        const raw = f.ficheiro_url || f.url_externa
        if (!raw) return
        const url = (() => { try { return new URL(raw).pathname } catch { return raw } })()
        window.open(url, '_blank')
    }

    async function handleDelete(id: string) {
        await descarregarApi.deleteDescarregavel(id)
        setDeleteId(null)
        await load()
    }

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-3">
            <div className="flex items-center justify-between shrink-0">
                <p className="text-white/70 text-sm font-semibold">{ficheiros.length} ficheiro{ficheiros.length !== 1 ? 's' : ''}</p>
                <button onClick={() => setModal({ open: true, ficheiro: null })}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer">
                    <Plus size={16} /> Novo Ficheiro
                </button>
            </div>

            <div className={`flex-1 min-h-0 overflow-y-auto ${th.tableWrap}`}>
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                    </div>
                ) : ficheiros.length === 0 ? (
                    <div className={`flex h-40 items-center justify-center ${th.emptyState}`}>Nenhum ficheiro encontrado</div>
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
                            {pageItems.map(f => (
                                <tr key={f.id} className={th.row}>
                                    <td className={`px-4 py-3 ${th.cellPrimary}`}>
                                        {f.titulo}
                                        {f.corpo && <p className={th.cellMuted}>{f.corpo}</p>}
                                    </td>
                                    <td className={`px-4 py-3 ${th.cellSecondary}`}>{f.tema_titulo}</td>
                                    <td className={`px-4 py-3 ${th.cellSecondary}`}>{f.disciplina_nome}</td>
                                    <td className="px-4 py-3">
                                        <span className={f.publicado ? th.badgePublished : th.badgeDraft}>
                                            {f.publicado ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {deleteId === f.id ? (
                                                <>
                                                    <span className="text-xs text-red-500 font-semibold mr-1">Eliminar?</span>
                                                    <button onClick={() => handleDelete(f.id)} className="rounded px-2 py-1 text-xs font-bold text-white bg-red-500 hover:bg-red-600 cursor-pointer">Sim</button>
                                                    <button onClick={() => setDeleteId(null)} className="rounded px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer">Não</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => openFicheiro(f)} disabled={!f.ficheiro_url && !f.url_externa} className={`${th.actionBase} ${th.actionPreview} disabled:opacity-30`} title="Abrir PDF"><Eye size={15} /></button>
                                                    <button onClick={() => setModal({ open: true, ficheiro: f })} className={`${th.actionBase} ${th.actionEdit}`} title="Editar"><Pencil size={15} /></button>
                                                    <button onClick={() => setDeleteId(f.id)} className={`${th.actionBase} ${th.actionDelete}`} title="Eliminar"><Trash2 size={15} /></button>
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

            <Pagination page={page} totalPages={totalPages} totalItems={ficheiros.length} pageSize={PAGE_SIZE} onPage={setPage} />

            {modal.open && (
                <FicheiroModal
                    temas={temas}
                    currentFicheiroUrl={modal.ficheiro?.ficheiro_url}
                    initial={modal.ficheiro ? { titulo: modal.ficheiro.titulo, corpo: modal.ficheiro.corpo, tema: modal.ficheiro.tema ?? '', dificuldade: modal.ficheiro.dificuldade ?? '', url_externa: modal.ficheiro.url_externa ?? '', publicado: modal.ficheiro.publicado, ficheiro: null, thumbnail: null } : EMPTY(temas)}
                    onSave={handleSave}
                    onClose={() => setModal({ open: false, ficheiro: null })}
                />
            )}
        </div>
    )
}

export default FicheirosPanel
