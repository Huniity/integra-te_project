


import { Menu, X, ChevronDown, CircleUserRound } from 'lucide-react'
import cloudLogo from '../../assets/Dashboard/cloud_logo.png'

interface DashboardNavProps {
    menuOpen: boolean
    onToggleMenu: () => void
}

const DashboardNav = ({ menuOpen, onToggleMenu }: DashboardNavProps) => {
    return (
        <nav className="flex items-center justify-between gap-4 p-4 z-10">
            <h1 className="relative mb-1 px-6 py-3 text-2xl font-bold text-(--text-h)">
                <img src={cloudLogo} alt="" className="absolute inset-0 translate-x-0 translate-y-[-25%] scale-105 object-contain" />
                <span className="relative">INTEGRA-TE</span>
            </h1>

            <button
                type="button"
                onClick={onToggleMenu}
                aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-md"
            >
                <CircleUserRound size={32} className="text-blue-500" />
                <span className="text-center leading-tight">
                    <span className="block text-sm font-semibold text-blue-500">Admin</span>
                    <span className="block text-xs text-(--text)">Editor</span>
                </span>
                <span className="lg:hidden">
                    {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </span>
            </button>
        </nav>
    )
}

export default DashboardNav
