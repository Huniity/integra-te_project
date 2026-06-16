export type SubjectId = string;

export interface Subject {
  id: SubjectId;
  label: string;
  iconImg: string;
  path?: string;
}

interface AsideProps {
  subjects: Subject[];
  activeSubject: SubjectId;
  onSelectSubject: (id: SubjectId) => void;
}

export default function Aside({ subjects, activeSubject, onSelectSubject }: AsideProps) {
  return (
    <>
      {/* Mobile + Tablet*/}
      <section className="lg:hidden bg-white/90 rounded-2xl p-2.5 shadow-lg border border-white/60 backdrop-blur-sm">
        <h2 className="font-['Fredoka',sans-serif] text-sm font-black text-[#1e3a8a] mb-2 flex items-center justify-center gap-1 text-center">
          Matérias
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
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 overflow-hidden`}>
                <img src={subj.iconImg} alt={subj.label} className="w-4 h-4 object-contain" />
              </div>
              <span className={`font-extrabold ${activeSubject === subj.id ? 'text-white' : 'text-[#1e3a8a]'}`}>
                {subj.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Desktop */}
      <aside className="hidden lg:flex flex-col justify-center items-center gap-2.5 w-64 shrink-0">
        <div className="relative w-full overflow-visible px-2 py-2">
          <img
            src="./src/assets/cloud_menu.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[160%] -translate-x-1/2 -translate-y-1/2 object-fill opacity-95"
          />
          <div className="relative z-10 mx-auto w-[90%] px-4 py-3">
            <h2 className="justify-center font-['Fredoka',sans-serif] text-2xl font-black text-[#1e3a8a] mb-6 flex items-center gap-1">
              Matérias
            </h2>
            <div className="flex flex-col justify-center gap-2">
              {subjects.map((subj) => (
                <button
                  key={subj.id}
                  onClick={() => onSelectSubject(subj.id)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer border-2 shadow-[0_6px_14px_rgba(15,23,42,0.10)] border-transparent ${
                    activeSubject === subj.id
                      ? 'bg-gradient-to-br from-blue-700 to-blue-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)]'
                      : 'text-[#1e3a8a] hover:bg-blue-50 hover:border-blue-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden`}>
                    <img src={subj.iconImg} alt={subj.label} className="w-6 h-6 object-contain" />
                  </div>
                  <span className={`font-extrabold ${activeSubject === subj.id ? 'text-white' : 'text-[#1e3a8a]'}`}>
                    {subj.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
