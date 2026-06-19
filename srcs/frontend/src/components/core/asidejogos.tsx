export type GameAgeFilterId = 'todos' | '4-6' | '6-9' | '9-12';

export interface GameAgeSubject {
  id: GameAgeFilterId;
  label: string;
}

interface AsideJogosProps {
  subjects: GameAgeSubject[];
  activeSubject: GameAgeFilterId;
  onSelectSubject: (id: GameAgeFilterId) => void;
}

export default function AsideJogos({ subjects, activeSubject, onSelectSubject }: AsideJogosProps) {
  return (
    <>
      {/* Mobile + Tablet */}
      <section className="lg:hidden bg-white/90 rounded-2xl p-2.5 shadow-lg border border-white/60 backdrop-blur-sm w-full">
        <h2 className="font-['Fredoka',sans-serif] text-sm font-black text-[#1e3a8a] mb-2 flex items-center justify-center gap-1 text-center">
          Idades
        </h2>
        <div className="flex flex-wrap justify-center gap-1.5 pb-1 overflow-x-hidden">
          {subjects.map((subj) => (
            <button
              key={`mobile-${subj.id}`}
              onClick={() => onSelectSubject(subj.id)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer border-2 shadow-[0_4px_12px_rgba(15,23,42,0.08)] max-w-full ${
                activeSubject === subj.id
                  ? 'border-transparent bg-gradient-to-br from-blue-700 to-blue-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)]'
                  : 'bg-gray-50 text-[#1e3a8a] border-transparent hover:bg-blue-50 hover:border-blue-200'
              }`}
            >
              <span className="font-extrabold">{subj.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Desktop (Nuvem de fundo esticada e títulos posicionados) */}
      <aside className="hidden lg:flex flex-col justify-center items-center h-full w-64 shrink-0 relative z-20">
        <div className="relative w-full h-[320px] flex items-center justify-center">
          <img
            src="./src/assets/cloud_menu.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[135%] w-[150%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-95"
          />
          <div className="relative z-10 w-[85%] px-2 pt-2 pb-4">
            <h2 className="justify-center font-['Fredoka',sans-serif] text-2xl font-black text-[#005bb7] mb-4 flex items-center gap-1">
              Idades
            </h2>
            <div className="flex flex-col gap-1.5">
              {subjects.map((subj) => (
                <button
                  key={subj.id}
                  onClick={() => onSelectSubject(subj.id)}
                  className={`w-full flex items-center justify-center text-center px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer border-2 shadow-sm ${
                    activeSubject === subj.id
                      ? 'border-transparent bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-[0_3px_10px_rgba(37,99,235,0.3)]'
                      : 'bg-white/40 text-[#1e3a8a] border-transparent hover:bg-blue-50/60 hover:border-blue-200'
                  }`}
                >
                  <span className="font-['Fredoka',sans-serif] font-black tracking-wide">{subj.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
