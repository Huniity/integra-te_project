import type { ReactNode } from 'react';

interface MainContentJogosProps {
  title: string;
  children: ReactNode;
}

export default function MainContentJogos({ title, children }: MainContentJogosProps) {
  return (
    <div className="flex-1 min-h-0 bg-blue-600/30 backdrop-blur-xs rounded-3xl shadow-[0_18px_45px_rgba(31,38,135,0.28)] border border-white/30 ring-1 ring-white/20 overflow-hidden flex flex-col">
      {/* Cabeçalho Interno do Painel */}
      <div className="relative px-5 pt-4 pb-3 flex flex-col items-center sm:flex-row sm:items-center justify-between gap-2 overflow-visible">
        <img
          src="./src/assets/stars.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-50] top-1/2 h-[100%] w-2/3 -translate-y-2/3 mx-auto object-contain"
        />
        <div className="relative z-10 flex items-center gap-3">
          <h1
            className="font-['Fredoka',sans-serif] text-3xl font-black text-white"
            style={{
              textShadow:
                '-1px 0 #2563eb, 0 1px #2563eb, 1px 0 #2563eb, 0 -1px #2563eb, 1px 1px #2563eb, -1px -1px #2563eb',
            }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Janela interna dos cards com scroll isolado */}
      <div className="flex-1 min-h-0 px-5 py-4 overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  );
}
