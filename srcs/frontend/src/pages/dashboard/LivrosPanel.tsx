import { useEffect, useRef, useState } from 'react'
import { Pencil, Trash2, Plus, X, FileText, Eye } from 'lucide-react'
import { livrosApi } from '../../services/api/livros.api'
import type { Livro, LivroPayload } from '../../api/contracts/livros'
import Pagination from '../../components/core/Pagination'
import BookModal from '../../components/Ler/BookModal'
import { useNightMode } from '../../components/core/NightMode'
import { dashboardTheme } from '../../utils/dashboardTheme'

const FAIXAS = ['4-6', '6-9', '9-12']
const PAGE_SIZE = 8

const EMPTY: LivroPayload = {
    titulo: '', autor: '', faixa_etaria: '4-6', resumo: '', temas: '', publicado: false, capa: null, ficheiro: null,
}

function LivroModal({ initial, currentFicheiroUrl, onSave, onClose }: {
    initial: LivroPayload
    currentFicheiroUrl?: string
    onSave: (p: LivroPayload) => Promise<void>
    onClose: () => void
}) {
    const { isNightMode } = useNightMode()
    const th = dashboardTheme(isNightMode)
    const [form, setForm] = useState<LivroPayload>(initial)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const ficheiroRef = useRef<HTMLInputElement>(null)
    const capaRef = useRef<HTMLInputElement>(null)

    const set = <K extends keyof LivroPayload>(k: K, v: LivroPayload[K]) => setForm((f: LivroPayload) => ({ ...f, [k]: v }))

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
                    <h2 className={th.modalTitle}>{initial.titulo ? 'Editar Livro' : 'Novo Livro'}</h2>
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
                            <label className={th.label}>Autor</label>
                            <input value={form.autor ?? ''} onChange={e => set('autor', e.target.value)}
                                className={th.input} />
                        </div>
                        <div>
                            <label className={th.label}>Faixa Etária *</label>
                            <select value={form.faixa_etaria} onChange={e => set('faixa_etaria', e.target.value)}
                                className={th.select}>
                                {FAIXAS.map(f => <option key={f} value={f}>{f} anos</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className={th.label}>Resumo</label>
                        <textarea rows={3} value={form.resumo ?? ''} onChange={e => set('resumo', e.target.value)}
                            className={th.textarea} />
                    </div>
                    <div>
                        <label className={th.label}>Temas</label>
                        <input value={form.temas ?? ''} onChange={e => set('temas', e.target.value)}
                            placeholder="Ex: Matemática, Ciências"
                            className={th.input} />
                    </div>
                    <div>
                        <label className={th.label}>Capa (imagem)</label>
                        <input ref={capaRef} type="file" accept="image/*" onChange={e => set('capa', e.target.files?.[0] ?? null)}
                            className={th.fileInput} />
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
                        <input ref={ficheiroRef} type="file" accept="application/pdf" onChange={e => set('ficheiro', e.target.files?.[0] ?? null)}
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

const LivrosPanel = ({ autoCreate }: { autoCreate?: boolean }) => {
    const { isNightMode } = useNightMode()
    const th = dashboardTheme(isNightMode)
    const [livros, setLivros] = useState<Livro[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [modal, setModal] = useState<{ open: boolean; livro: Livro | null }>({ open: false, livro: null })
    const [previewLivro, setPreviewLivro] = useState<Livro | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    async function load() {
        setIsLoading(true)
        setLivros(await livrosApi.getLivros())
        setIsLoading(false)
    }

    useEffect(() => { load() }, [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { if (autoCreate) setModal({ open: true, livro: null }) }, [])

    const totalPages = Math.max(1, Math.ceil(livros.length / PAGE_SIZE))
    const pageItems = livros.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    async function handleSave(payload: LivroPayload) {
        if (modal.livro) await livrosApi.updateLivro(modal.livro.id, payload)
        else await livrosApi.createLivro(payload)
        await load()
    }

    async function handleDelete(id: string) {
        await livrosApi.deleteLivro(id)
        setDeleteId(null)
        await load()
    }

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-3">
            <div className="flex items-center justify-between shrink-0">
                <p className="text-white/70 text-sm font-semibold">{livros.length} livro{livros.length !== 1 ? 's' : ''}</p>
                <button onClick={() => setModal({ open: true, livro: null })}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer">
                    <Plus size={16} /> Novo Livro
                </button>
            </div>

            <div className={`flex-1 min-h-0 overflow-y-auto ${th.tableWrap}`}>
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                    </div>
                ) : livros.length === 0 ? (
                    <div className={`flex h-40 items-center justify-center ${th.emptyState}`}>Nenhum livro encontrado</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10">
                            <tr className={th.theadRow}>
                                <th className="px-4 py-3">Título</th>
                                <th className="px-4 py-3">Autor</th>
                                <th className="px-4 py-3">Faixa Etária</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className={th.tbody}>
                            {pageItems.map(livro => (
                                <tr key={livro.id} className={th.row}>
                                    <td className={`px-4 py-3 ${th.cellPrimary}`}>
                                        {livro.titulo}
                                        {livro.resumo && <p className={th.cellMuted}>{livro.resumo}</p>}
                                    </td>
                                    <td className={`px-4 py-3 ${th.cellSecondary}`}>{livro.autor || '—'}</td>
                                    <td className={`px-4 py-3 ${th.cellSecondary}`}>{livro.faixa_etaria} anos</td>
                                    <td className="px-4 py-3">
                                        <span className={livro.publicado ? th.badgePublished : th.badgeDraft}>
                                            {livro.publicado ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {deleteId === livro.id ? (
                                                <>
                                                    <span className="text-xs text-red-500 font-semibold mr-1">Eliminar?</span>
                                                    <button onClick={() => handleDelete(livro.id)} className="rounded px-2 py-1 text-xs font-bold text-white bg-red-500 hover:bg-red-600 cursor-pointer">Sim</button>
                                                    <button onClick={() => setDeleteId(null)} className="rounded px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer">Não</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => setPreviewLivro(livro)} className={`${th.actionBase} ${th.actionPreview}`} title="Visualizar"><Eye size={15} /></button>
                                                    <button onClick={() => setModal({ open: true, livro })} className={`${th.actionBase} ${th.actionEdit}`} title="Editar"><Pencil size={15} /></button>
                                                    <button onClick={() => setDeleteId(livro.id)} className={`${th.actionBase} ${th.actionDelete}`} title="Eliminar"><Trash2 size={15} /></button>
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

            <Pagination page={page} totalPages={totalPages} totalItems={livros.length} pageSize={PAGE_SIZE} onPage={setPage} />

            {previewLivro && <BookModal book={previewLivro} onClose={() => setPreviewLivro(null)} />}

            {modal.open && (
                <LivroModal
                    initial={modal.livro ? { titulo: modal.livro.titulo, autor: modal.livro.autor ?? '', faixa_etaria: modal.livro.faixa_etaria, resumo: modal.livro.resumo ?? '', temas: modal.livro.temas ?? '', publicado: modal.livro.publicado, capa: null, ficheiro: null } : EMPTY}
                    currentFicheiroUrl={modal.livro?.ficheiro_url}
                    onSave={handleSave}
                    onClose={() => setModal({ open: false, livro: null })}
                />
            )}
        </div>
    )
}

export default LivrosPanel
