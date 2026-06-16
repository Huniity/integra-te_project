import {
    Home,
    Dumbbell,
    PlayCircle,
    Download,
    GraduationCap,
    Image,
    Folder,
    Settings,
    ChevronRight,
    type LucideIcon,
} from 'lucide-react'


export interface Tab {
    id: string
    label: string
    icon: LucideIcon
    color: string
}

export const TABS: Tab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'bg-sky-500' },
    { id: 'exercicios', label: 'Exercícios', icon: Dumbbell, color: 'bg-violet-500' },
    { id: 'videos', label: 'Vídeos', icon: PlayCircle, color: 'bg-orange-500' },
    { id: 'ficheiros', label: 'Ficheiros', icon: Download, color: 'bg-blue-500' },
    { id: 'aulas', label: 'Aulas', icon: GraduationCap, color: 'bg-green-500' },
    { id: 'galeria', label: 'Galeria', icon: Image, color: 'bg-pink-500' },
    { id: 'categorias', label: 'Categorias', icon: Folder, color: 'bg-yellow-500' },
    { id: 'definicoes', label: 'Definições', icon: Settings, color: 'bg-gray-500' },
]

interface TabPanelProps {
    activeTab: string
    onSelect: (id: string) => void
}

const TabPanel = ({ activeTab, onSelect }: TabPanelProps) => {
    return (
        <>
            <h2 className="mb-2 px-2 lg:text-[clamp(1.2rem,2.2vh,1.25rem)] xl:text-[clamp(1.3rem,2.4vh,1.3rem)] 2xl:text-[clamp(1.4rem,2.6vh,1.4rem)] font-bold text-(--text-h) text-center">
                Painel de Gestão
            </h2>
            <nav className="flex flex-col lg:gap-[clamp(0.35rem,0.6vh,0.5rem)] xl:gap-[clamp(0.45rem,0.6vh,0.5rem)] 2xl:gap-[clamp(0.575rem,0.8vh,0.625rem)]">
                {TABS.map((tab) => {
                    const Icon = tab.icon
                    const isActive = tab.id === activeTab

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onSelect(tab.id)}
                            aria-current={isActive ? 'page' : undefined}
                            className={`flex items-center gap-3 rounded-full px-4 py-[clamp(0.375rem,1vh,0.625rem)] text-left lg:text-[clamp(1rem,1.6vh,1rem)] xl:text-[clamp(1.1rem,1.8vh,1.1rem)] 2xl:text-[clamp(1.2rem,2vh,1.2rem)] font-medium transition-colors ${isActive
                                ? `${tab.color} text-white shadow`
                                : 'text-(--text) hover:bg-(--code-bg)'
                                }`}
                        >
                            <Icon size="1em" />
                            {tab.label}
                            {isActive && <ChevronRight size="1em" className="ml-auto" />}
                        </button>
                    )
                })}
            </nav>
        </>
    )
}

export default TabPanel
