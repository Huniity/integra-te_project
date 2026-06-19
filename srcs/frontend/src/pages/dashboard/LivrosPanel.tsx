import { useEffect, useState } from 'react'
import { livrosApi } from '../../services/api/livros.api'
import type { Livro } from '../../api/contracts/livros'
import Pagination from '../../components/core/Pagination'

const PAGE_SIZE = 5

const LivrosPanel = () => {
    const [livros, setLivros] = useState<Livro[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)

    useEffect(() => {
        const load = async () => {
            setIsLoading(true)
            const data = await livrosApi.getLivros()
            setLivros(data)
            setIsLoading(false)
        }
        load()
    }, [])

    const totalPages = Math.max(1, Math.ceil(livros.length / PAGE_SIZE))
    const pageItems = livros.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                    <p className="text-sm font-semibold text-white/70">A carregar livros...</p>
                </div>
            </div>
        )
    }

    if (livros.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-white/60 font-semibold">Nenhum livro disponível</p>
            </div>
        )
    }

    return (
        <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 z-10">
                        <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                            <th className="px-4 py-3">Título</th>
                            <th className="px-4 py-3">Autor</th>
                            <th className="px-4 py-3">Faixa Etária</th>
                            <th className="px-4 py-3">Temas</th>
                            <th className="px-4 py-3">Ficheiro</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {pageItems.map((livro) => (
                            <tr key={livro.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-semibold text-gray-800">
                                    {livro.titulo}
                                    {livro.resumo && (
                                        <p className="text-xs font-normal text-gray-400 mt-0.5 line-clamp-1">
                                            {livro.resumo}
                                        </p>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-gray-600">{livro.autor}</td>
                                <td className="px-4 py-3 text-gray-500">{livro.faixa_etaria}</td>
                                <td className="px-4 py-3 text-gray-500">{livro.temas || '—'}</td>
                                <td className="px-4 py-3">
                                    {livro.ficheiro_url ? (
                                        <a
                                            href={livro.ficheiro_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            Download
                                        </a>
                                    ) : (
                                        <span className="text-gray-300">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={livros.length}
                pageSize={PAGE_SIZE}
                onPage={setPage}
            />
        </div>
    )
}

export default LivrosPanel
