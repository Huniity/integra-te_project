export default function Footer() {
  return (
    <footer className="w-full bg-[#dbeeff] border-t-2 border-[#a8d4f5]/60 py-4 px-6 mt-auto font-nunito">
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-90">

        {/* LOGO 1: União Europeia */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-12 h-[32px] bg-[#003399] rounded p-1 flex flex-col justify-between shadow-sm">
            <div className="grid grid-cols-4 gap-[2px] w-full h-full p-[1px]">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-[3px] h-[3px] bg-[#ffcc00] rounded-full mx-auto" />
              ))}
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#1a3a8a] leading-tight">
            Cofinanciado pela<br />União Europeia
          </span>
        </div>

        {/* LOGO 2: Algarve 2030 */}
        <div className="flex items-center shrink-0">
          <div className="py-0.5 px-3 rounded-lg border border-[#a8d4f5] flex flex-col items-center justify-center leading-none bg-white text-[#1a3a8a] h-[34px]">
            <span className="text-[8px] font-bold tracking-[0.5px] text-[#5577aa] mb-[2px]">ALGARVE</span>
            <span className="text-sm font-black tracking-tighter">2030</span>
          </div>
          {/* Se preferires usar imagem futuramente: */}
          {/* <img src="/src/assets/algarve2030.png" alt="Algarve 2030" className="h-8 object-contain" /> */}
        </div>

        {/* LOGO 3: Portugal 2030 */}
        <div className="flex items-center shrink-0">
          <div className="py-0.5 px-3 rounded-lg border border-[#8b0000]/20 flex flex-col items-center justify-center leading-none bg-[#c62828] text-white h-[34px]">
            <span className="text-[8px] font-bold tracking-[0.5px] opacity-90 mb-[2px]">PORTUGAL</span>
            <span className="text-sm font-black tracking-tighter">2030</span>
          </div>
        </div>

        {/* LOGO 4: Brasão de Loulé */}
        <div className="flex items-center shrink-0">
          <div className="w-8 h-8 bg-gray-100 rounded-full border border-gray-300 flex items-center justify-center text-lg shadow-sm" aria-label="Município de Loulé">
            🏰
          </div>
        </div>

        {/* LOGO 5: Loulé Concelho */}
        <div className="flex items-center shrink-0">
          <div className="py-0.5 px-3 rounded-lg border border-[#a8d4f5] flex flex-col items-center justify-center leading-none bg-white text-[#2a4a8a] h-[34px]">
            <span className="text-[8px] font-bold tracking-[0.2px] text-[#7799cc] uppercase mb-[1px]">loulé</span>
            <span className="text-xs font-black tracking-tight lowercase">concelho</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
