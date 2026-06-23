import { useState, useEffect, type ComponentType, createElement } from 'react'
import bg from '../assets/day_bg.webp'
import bgNight from '../assets/night_bg.webp'
import cloudMenu from '../assets/cloud_menu2.webp'

import Aside from '../components/core/Aside'
import MainContent from '../components/core/MainContent'
import { NightModeBackground } from '../components/core/NightMode'
import { TABS } from './dashboard/TabPanel'
import OverviewPanel from './dashboard/OverviewPanel'
import ExerciciosPanel from './dashboard/ExerciciosPanel'
import VideosPanel from './dashboard/VideosPanel'
import FicheirosPanel from './dashboard/FicheirosPanel'
import AulasPanel from './dashboard/AulasPanel'
import LivrosPanel from './dashboard/LivrosPanel'
import JogosPanel from './dashboard/JogosPanel'

const TAB_PANELS: Record<string, ComponentType<{ autoCreate?: boolean }>> = {
    aulas: AulasPanel,
    exercicios: ExerciciosPanel,
    livros: LivrosPanel,
    jogos: JogosPanel,
    ficheiros: FicheirosPanel,
    videos: VideosPanel,
}

const DASHBOARD_SUBJECTS = TABS.map((tab) => ({
    id: tab.id,
    label: tab.label,
    icon: <tab.icon size={20} />,
}))

function DashboardInner() {
    const [activeTab, setActiveTab] = useState<string>(TABS[0].id)
    const [pendingCreate, setPendingCreate] = useState(false)
    const [username, setUsername] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/v1/me', { credentials: 'include' })
            .then(r => r.json())
            .then(data => setUsername(data.username))
            .catch(() => {})
    }, [])
    const ActivePanel = TAB_PANELS[activeTab]
    const activeTabLabel = TABS.find((t) => t.id === activeTab)?.label ?? ''

    function handleSetActiveTab(tabId: string) {
        setActiveTab(tabId)
        setPendingCreate(false)
    }

    function handleTabSelectCreate(tabId: string) {
        setActiveTab(tabId)
        setPendingCreate(true)
    }

    return (
        <div className="relative flex h-screen w-screen flex-col overflow-hidden">
            <NightModeBackground dayImage={bg} nightImage={bgNight} />

            <section className="relative flex flex-1 gap-3 sm:gap-4 lg:gap-6 px-3 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 min-h-0 mt-[5%]">
                <Aside
                    subjects={DASHBOARD_SUBJECTS}
                    activeSubject={activeTab}
                    onSelectSubject={handleSetActiveTab}
                    title="Painel de Gestão"
                    cloudImage={cloudMenu}
                />

                <MainContent title={activeTabLabel} logoutBtn={true} greeting={activeTab === 'dashboard' && username ? `Olá ${username}, bem-vindo à sua área!` : undefined}>
                    {activeTab === 'dashboard'
                        ? <OverviewPanel onTabSelect={handleTabSelectCreate} />
                        : createElement(ActivePanel, { autoCreate: pendingCreate })
                    }
                </MainContent>
            </section>
        </div>
    )
}

const Dashboard = () => <DashboardInner />

export default Dashboard
