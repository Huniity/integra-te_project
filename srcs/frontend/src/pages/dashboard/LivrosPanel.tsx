import { useEffect, useRef, useState } from 'react'
import { Pencil, Trash2, Plus, X, FileText, Eye } from 'lucide-react'
import { livrosApi } from '../../services/api/livros.api'
import type { Livro, LivroPayload } from '../../api/contracts/livros'
import Pagination from '../../components/core/Pagination'
import BookModal from '../../components/Ler/BookModal'

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
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 sticky top-0 bg-white">
                    <h2 className="text-lg font-bold text-gray-800">{initial.titulo ? 'Editar Livro' : 'Novo Livro'}</h2>
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
                            <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Autor</label>
                            <input value={form.autor ?? ''} onChange={e => set('autor', e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Faixa Etária *</label>
                            <select value={form.faixa_etaria} onChange={e => set('faixa_etaria', e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                                {FAIXAS.map(f => <option key={f} value={f}>{f} anos</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Resumo</label>
                        <textarea rows={3} value={form.resumo ?? ''} onChange={e => set('resumo', e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Temas</label>
                        <input value={form.temas ?? ''} onChange={e => set('temas', e.target.value)}
                            placeholder="Ex: Matemática, Ciências"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Capa (imagem)</label>
                        <input ref={capaRef} type="file" accept="image/*" onChange={e => set('capa', e.target.files?.[0] ?? null)}
                            className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">Ficheiro PDF</label>
                        {currentFicheiroUrl && !form.ficheiro && (
                            <a href={(() => { try { return new URL(currentFicheiroUrl).pathname } catch { return currentFicheiroUrl } })()}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline mb-1">
                                <FileText size={13} /> PDF atual
                            </a>
                        )}
                        <input ref={ficheiroRef} type="file" accept="application/pdf" onChange={e => set('ficheiro', e.target.files?.[0] ?? null)}
                            className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
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

const LivrosPanel = ({ autoCreate }: { autoCreate?: boolean }) => {
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

            <div className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                    </div>
                ) : livros.length === 0 ? (
                    <div className="flex h-40 items-center justify-center text-gray-400 font-semibold">Nenhum livro encontrado</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10">
                            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                                <th className="px-4 py-3">Título</th>
                                <th className="px-4 py-3">Autor</th>
                                <th className="px-4 py-3">Faixa Etária</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pageItems.map(livro => (
                                <tr key={livro.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-semibold text-gray-800">
                                        {livro.titulo}
                                        {livro.resumo && <p className="text-xs font-normal text-gray-400 mt-0.5 line-clamp-1">{livro.resumo}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{livro.autor || '—'}</td>
                                    <td className="px-4 py-3 text-gray-500">{livro.faixa_etaria} anos</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${livro.publicado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
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
                                                    <button onClick={() => setPreviewLivro(livro)} className="rounded p-1.5 text-gray-400 hover:bg-purple-50 hover:text-purple-600 cursor-pointer" title="Visualizar"><Eye size={15} /></button>
                                                    <button onClick={() => setModal({ open: true, livro })} className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 cursor-pointer" title="Editar"><Pencil size={15} /></button>
                                                    <button onClick={() => setDeleteId(livro.id)} className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-pointer" title="Eliminar"><Trash2 size={15} /></button>
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
