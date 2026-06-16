import { useState, type ComponentType } from 'react'
import bg from '../assets/content2.png'
import cloudMenu from '../assets/cloud_menu2.png'

import Aside from '../components/core/Aside'
import MainContent from '../components/resolver/MainContent'
import DashboardNav from './dashboard/DashboardNav'
import { TABS } from './dashboard/TabPanel'
import OverviewPanel from './dashboard/OverviewPanel'
import ExerciciosPanel from './dashboard/ExerciciosPanel'
import VideosPanel from './dashboard/VideosPanel'
import FicheirosPanel from './dashboard/FicheirosPanel'
import AulasPanel from './dashboard/AulasPanel'
import GaleriaPanel from './dashboard/GaleriaPanel'
import CategoriasPanel from './dashboard/CategoriasPanel'
import DefinicoesPanel from './dashboard/DefinicoesPanel'
import LivrosPanel from './dashboard/LivrosPanel'

const TAB_PANELS: Record<string, ComponentType> = {
    dashboard: OverviewPanel,
    exercicios: ExerciciosPanel,
    videos: VideosPanel,
    ficheiros: FicheirosPanel,
    aulas: AulasPanel,
    galeria: GaleriaPanel,
    categorias: CategoriasPanel,
    definicoes: DefinicoesPanel,
    livros: LivrosPanel,
}

const DASHBOARD_SUBJECTS = TABS.map((tab) => ({
    id: tab.id,
    label: tab.label,
    icon: <tab.icon size={20} />,
}))

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState<string>(TABS[0].id)
    const ActivePanel = TAB_PANELS[activeTab]
    const activeTabLabel = TABS.find((t) => t.id === activeTab)?.label ?? ''

    return (
        <div
            className="flex h-screen w-screen flex-col bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <DashboardNav />

            <section className="flex flex-1 gap-6 px-16 py-8 min-h-0">
                <Aside
                    subjects={DASHBOARD_SUBJECTS}
                    activeSubject={activeTab}
                    onSelectSubject={setActiveTab}
                    title="Painel de Gestão"
                    cloudImage={cloudMenu}
                    width="w-80"
                />

                <MainContent title={activeTabLabel}>
                    <ActivePanel />
                </MainContent>
            </section>
        </div>
    )
}

export default Dashboard
