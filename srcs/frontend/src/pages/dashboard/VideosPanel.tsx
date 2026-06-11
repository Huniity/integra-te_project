

import { Eye, Trash, Pen } from 'lucide-react';

const LIST_VIDEOS = [
    {
        "id": 1,
        "title": "Introdução à Integra-te",
        "description": "Conheça a plataforma Integra-te e suas funcionalidades.",
        "url": "https://www.youtube.com/watch?v=4qahlto97ZE",
    },
    {
        "id": 2,
        "title": "Como usar o painel de controle",
        "description": "Aprenda a navegar e utilizar o painel de controle do Integra-te.",
        "url": "https://www.youtube.com/watch?v=4qahlto97ZE",
    },
    {
        "id": 3,
        "title": "Dicas para criar conteúdo envolvente",
        "description": "Saiba como criar vídeos que engajem seus alunos.",
        "url": "https://www.youtube.com/watch?v=4qahlto97ZE",
    },
    {
        "id": 4,
        "title": "Integra-te para professores",
        "description": "Veja como os professores podem aproveitar ao máximo a plataforma.",
        "url": "https://www.youtube.com/watch?v=4qahlto97ZE",
    }
]


const VideosPanel = () => {
    return (
        <div className="">
            <div>
                <h1 className="mb-1 text-2xl font-bold text-(--text-h) text-white">Vídeos</h1>
                <p className="mb-6 text-(--text) font-bold text-white">
                    Gere aqui o conteúdo de vídeo disponivel para os alunos. Pode adicionar, editar ou remover vídeos.
                </p>
            </div>
            <div className="flex h-[69vh] items-center justify-center rounded-2xl bg-white rounded-2xl">
                <ul className="flex h-full w-full flex-col gap-4 overflow-auto p-4">
                    {LIST_VIDEOS.map((video) => (
                        <li key={video.id} className="flex h-36 w-full items-center gap-4 rounded-lg border border-(--border) border-black/10 border-2px p-4 text-white bg-white">
                            <div className="h-full aspect-video rounded-lg bg-gray-200" />
                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-(--text-h) text-gray-800">{video.title}</h2>
                                    <p className="text-sm text-(--text) text-gray-600">{video.description}</p>
                                </div>
                                <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                                    Assistir vídeo
                                </a>
                            </div>
                            <div className="flex">
                                <span className="mr-2 rounded px-3 py-1 text-sm font-medium text-emerald-500 bg-emerald-100">
                                    PUBLICADO
                                </span>
                            </div>
                            <div className="flex items-end">
                                <button className="mr-2 rounded px-3 py-1 text-sm font-medium text-white">
                                    <Eye size={16} className="mr-1 hover:text-emerald-600 text-black" />
                                </button>
                                <button className="mr-2 rounded px-3 py-1 text-sm font-medium text-white ">
                                    <Pen size={16} className="mr-1 hover:text-blue-600 text-black" />
                                </button>
                                <button className="rounded px-3 py-1 text-sm font-medium text-white hover:text-red-600">
                                    <Trash size={16} className="mr-1 hover:text-red-600 text-black"/>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default VideosPanel
