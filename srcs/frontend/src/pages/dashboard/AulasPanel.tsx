import { useEffect, useState } from 'react'
import { aulasApi } from '../../services/api/aulas.api'
import type { Aula } from '../../api/contracts/aulas'

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

const AulasPanel = () => {
    const [aulas, setAulas] = useState<Aula[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setIsLoading(true)
            const data = await aulasApi.getAulas()
            setAulas(data)
            setIsLoading(false)
        }
        load()
    }, [])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-(--text-h)">Aulas</h1>
                    <p className="text-sm text-(--text)">
                        {isLoading ? '...' : `${aulas.length} aula${aulas.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                        <p className="text-sm font-semibold text-gray-400">A carregar aulas...</p>
                    </div>
                </div>
            ) : aulas.length === 0 ? (
                <div className="flex items-center justify-center py-24">
                    <p className="text-gray-400 font-semibold">Nenhuma aula disponível</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                                <th className="px-4 py-3">Título</th>
                                <th className="px-4 py-3">Matéria</th>
                                <th className="px-4 py-3">Nível</th>
                                <th className="px-4 py-3">Duração</th>
                                <th className="px-4 py-3">Vídeo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {aulas.map((aula) => (
                                <tr key={aula.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-semibold text-gray-800">
                                        {aula.title}
                                        {aula.description && (
                                            <p className="text-xs font-normal text-gray-400 mt-0.5 line-clamp-1">
                                                {aula.description}
                                            </p>
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
                                        {aula.videoUrl ? (
                                            <a
                                                href={aula.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline font-medium"
                                            >
                                                Ver vídeo
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

export default AulasPanel
