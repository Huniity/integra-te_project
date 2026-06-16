import { useEffect, useState } from 'react'
import { livrosApi } from '../../services/api/livros.api'
import type { Livro } from '../../api/contracts/livros'

const LivrosPanel = () => {
    const [livros, setLivros] = useState<Livro[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setIsLoading(true)
            const data = await livrosApi.getLivros()
            setLivros(data)
            setIsLoading(false)
        }
        load()
    }, [])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-(--text-h)">Livros</h1>
                    <p className="text-sm text-(--text)">
                        {isLoading ? '...' : `${livros.length} livro${livros.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                        <p className="text-sm font-semibold text-gray-400">A carregar livros...</p>
                    </div>
                </div>
            ) : livros.length === 0 ? (
                <div className="flex items-center justify-center py-24">
                    <p className="text-gray-400 font-semibold">Nenhum livro disponível</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                                <th className="px-4 py-3">Título</th>
                                <th className="px-4 py-3">Autor</th>
                                <th className="px-4 py-3">Faixa Etária</th>
                                <th className="px-4 py-3">Temas</th>
                                <th className="px-4 py-3">Ficheiro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {livros.map((livro) => (
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
            )}
        </div>
    )
}

export default LivrosPanel
