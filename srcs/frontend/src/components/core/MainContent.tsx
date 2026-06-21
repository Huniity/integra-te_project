import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type FilterType = 'todos' | 'nivel';

const levelOptions: Array<{ value: number | 'todos'; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 1, label: 'Nível 1' },
  { value: 2, label: 'Nível 2' },
  { value: 3, label: 'Nível 3' },
];

interface MainContentProps {
  title: string;
  activeFilter?: FilterType;
  selectedLevel?: number | 'todos';
  onSelectAll?: () => void;
  onSelectLevel?: (level: number | 'todos') => void;
  /** When true, content area uses overflow-hidden + flex-col so children can fill height with h-full */
  fillContent?: boolean;
  children: ReactNode;
}

export default function MainContent({
  title,
  activeFilter,
  selectedLevel,
  onSelectAll,
  onSelectLevel,
  fillContent = false,
  children,
}: MainContentProps) {
  const [isLevelMenuOpen, setIsLevelMenuOpen] = useState(false);
  const levelMenuRef = useRef<HTMLDivElement | null>(null);
  const showFilters = !!onSelectAll && !!onSelectLevel;

  useEffect(() => {
    if (!showFilters) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!levelMenuRef.current) return;
      if (!levelMenuRef.current.contains(event.target as Node)) {
        setIsLevelMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  const selectedLevelLabel =
    levelOptions.find((option) => option.value === selectedLevel)?.label ?? 'Todos';

  return (
    <div className="flex-1 min-h-0 bg-blue-600/30 backdrop-blur-xs rounded-3xl shadow-[0_18px_45px_rgba(31,38,135,0.28)] border border-white/30 ring-1 ring-white/20 overflow-hidden flex flex-col">

      {/* Header */}
      <div className="relative px-5 pt-3 pb-2 flex flex-col items-center sm:flex-row sm:items-center justify-between gap-2 overflow-visible">
        <img
          src="./src/assets/stars.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-50] top-1/2 h-[100%] w-2/3 -translate-y-2/3 mx-auto object-contain"
        />
        <div className="relative z-10 flex items-center gap-3">
          <h1
            className="font-['Fredoka',sans-serif] text-3xl font-black text-white"
            style={{
              textShadow:
                '-1px 0 #2563eb, 0 1px #2563eb, 1px 0 #2563eb, 0 -1px #2563eb, 1px 1px #2563eb, -1px -1px #2563eb, 1px -1px #2563eb, -1px 1px #2563eb',
            }}
          >
            {title}
          </h1>
        </div>

        {/* Filter buttons — only rendered when handlers are provided */}
        {showFilters && (
          <div className="relative z-10 self-center sm:self-auto flex flex-wrap justify-center items-center rounded-2xl sm:rounded-full p-1 gap-12">
            <button
              onClick={onSelectAll}
              className={`px-3 py-1.5 rounded-full text-md font-extrabold transition-all cursor-pointer shadow-[0_4px_12px_rgba(15,23,42,0.12)] ${
                activeFilter === 'todos'
                  ? 'bg-white text-[#1e3a8a] shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
                  : 'text-gray-500 hover:text-[#1e3a8a]'
              }`}
            >
              Todos
            </button>

            <div ref={levelMenuRef} className="relative flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-white/80 border border-gray-200 shadow-[0_4px_12px_rgba(15,23,42,0.12)]">
              <span className="text-md font-extrabold text-[#1e3a8a]">
                Por nível
              </span>
              <button
                type="button"
                onClick={() => setIsLevelMenuOpen((prev) => !prev)}
                className="flex items-center gap-1 rounded-full border border-blue-200 bg-white px-2 py-0.5 text-xs font-black text-[#1e3a8a] shadow-sm hover:bg-blue-50 transition-colors"
              >
                {selectedLevelLabel}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-3.5 w-3.5 transition-transform ${isLevelMenuOpen ? 'rotate-180' : ''}`}
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {isLevelMenuOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 min-w-32 rounded-xl border border-blue-100 bg-white p-1 shadow-xl">
                  {levelOptions.map((option) => {
                    const isActive = selectedLevel === option.value;

                    return (
                      <button
                        key={String(option.value)}
                        type="button"
                        onClick={() => {
                          onSelectLevel!(option.value);
                          setIsLevelMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-bold transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-[#1e3a8a] hover:bg-blue-50'
                        }`}
                      >
                        <span>{option.label}</span>
                        {isActive && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 min-h-0 px-4 py-3 ${fillContent ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
        {children}
      </div>
    </div>
  );
}
