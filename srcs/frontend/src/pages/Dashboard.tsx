import { useState, type ComponentType } from 'react'
import bg from '../assets/Dashboard/bg.png'
import cloudMenu from '../assets/Dashboard/cloud_menu.png'

import DashboardNav from './dashboard/DashboardNav'
import TabPanel, { TABS } from './dashboard/TabPanel'
import OverviewPanel from './dashboard/OverviewPanel'
import ExerciciosPanel from './dashboard/ExerciciosPanel'
import VideosPanel from './dashboard/VideosPanel'
import FicheirosPanel from './dashboard/FicheirosPanel'
import AulasPanel from './dashboard/AulasPanel'
import GaleriaPanel from './dashboard/GaleriaPanel'
import CategoriasPanel from './dashboard/CategoriasPanel'
import DefinicoesPanel from './dashboard/DefinicoesPanel'

const TAB_PANELS: Record<string, ComponentType> = {
    dashboard: OverviewPanel,
    exercicios: ExerciciosPanel,
    videos: VideosPanel,
    ficheiros: FicheirosPanel,
    aulas: AulasPanel,
    galeria: GaleriaPanel,
    categorias: CategoriasPanel,
    definicoes: DefinicoesPanel,
}

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState<string>(TABS[0].id)
    const [menuOpen, setMenuOpen] = useState(false)
    const ActivePanel = TAB_PANELS[activeTab]

    const handleSelect = (id: string) => {
        setActiveTab(id)
        setMenuOpen(false)
    }

    return (
        <div
            className="flex h-screen w-screen flex-col bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <DashboardNav menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((open) => !open)} />

            {menuOpen && (
                <div className="border-b border-(--border) bg-white p-4 shadow-md lg:hidden">
                    <TabPanel activeTab={activeTab} onSelect={handleSelect} />
                </div>
            )}

            <section className="flex flex-1 gap-6 px-16 py-8">
                <aside className="relative hidden aspect-[941/1772] h-full shrink-0 p-4 lg:block">
                    <img src={cloudMenu} alt="" className="absolute top-[0%] left-[0%] scale-120 object-cover" />
                    <div className="relative top-[5%]">
                        <TabPanel activeTab={activeTab} onSelect={handleSelect} />
                    </div>
                </aside>

                <main className="flex-1 overflow-auto rounded-3xl bg-blue-500/50 border border-4 border-white p-6 shadow-md">
                    <ActivePanel />
                </main>
            </section>
        </div>
    )
}

export default Dashboard
