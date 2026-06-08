import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="w-full bg-transparent font-nunito sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between gap-8">

        {/* LOGO (Estilo BD/Cartoon) */}
        <Link
          to="/"
          className="font-fredoka text-2xl text-[#FFFFFF] no-underline bg-[#2a4a8a]/15 border-[3px] border-[#1a1a2e] rounded-2xl py-1.5 px-5 inline-block shadow-[3px_3px_0_#1a1a2e] tracking-wider hover:translate-y-[1px] hover:shadow-[2px_2px_0_#1a1a2e] transition-all uppercase shrink-0"
        >
          iNTEGRA-TE
        </Link>

        {/* SEARCH BAR BEM GRANDE (Estilo pílula esticada central) */}
        <div className="flex-1 max-w-[600px] flex items-center justify-between bg-[#2a4a8a] text-white rounded-full py-2.5 px-5 shadow-lg border border-white/10 group transition-all duration-200 focus-within:ring-4 focus-within:ring-[#3db8f5]/50">

          {/* Avatar Esquerdo */}
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-pink-400 flex items-center justify-center text-sm shadow-inner shrink-0 transform group-hover:scale-110 transition-transform">
              👤
            </span>
            <span className="text-sm font-medium tracking-wide text-white/90 select-none">
              O que procuras?
            </span>
          </div>

          {/* Ícone de Lupa Direito */}
          <svg
            className="w-5 h-5 text-white/80 cursor-pointer hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

        </div>

        {/* Espaçador invisível à direita para manter a searchbar perfeitamente centralizada em desktop */}
        <div className="w-[145px] hidden lg:block shrink-0" aria-hidden="true" />

      </div>
    </nav>
  )
}
