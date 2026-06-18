export default function Footer() {
  return (
    <footer className="w-full mt-2 md:mt-3 flex justify-center relative z-20 shrink-0">
        <div className="bg-white/95 rounded-3xl sm:rounded-full px-3 sm:px-5 md:px-8 py-1.5 sm:py-2.5 shadow-lg border-2 border-white flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 sm:border-r border-gray-200 sm:pr-4 md:pr-6 last:border-0">
            <span className="text-[10px] font-black text-gray-500 leading-tight uppercase">Cofinanciado pela<br/>União Europeia</span>
          </div>
          <div className="text-xs sm:text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
            ALGARVE <span className="text-orange-500">2030</span>
          </div>
          <div className="text-xs sm:text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600">
            PORTUGAL <span className="text-amber-500">2030</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-500 leading-tight uppercase">Loulé<br/>concelho</span>
          </div>
        </div>
      </footer>
  )
}
