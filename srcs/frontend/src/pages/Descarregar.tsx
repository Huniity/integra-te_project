import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import { NightModeBackground, NightModeProvider, NightModeToggle, useNightMode } from '../components/core/NightMode';
import Searchbar from '../components/core/SearchBar';
import Aside from '../components/core/Aside';
import type { SubjectId } from '../components/core/Aside';
import { subjects } from '../utils/descarregar';
import { descarregarApi } from '../services/api/descarregar.api';
import type { Descarregavel } from '../api/contracts/descarregar';
import Footer from '../components/core/Footer';

export default function Descarregar() {
  return (
    <NightModeProvider>
      <DescarregarContent />
    </NightModeProvider>
  );
}

function DescarregarContent() {
  const navigate = useNavigate();
  const { isNightMode } = useNightMode();

  const [activeSubject, setActiveSubject] = useState<SubjectId>('todos');
  const [items, setItems] = useState<Descarregavel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navItems = [
    { iconImg: './src/assets/lock.png', label: 'Admin', path: '/login' },
  ];

  const filtered = items.filter(
    (item) => activeSubject === 'todos' || item.disciplina_slug === activeSubject,
  );

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await descarregarApi.getDescarregaveis();
        setItems(data);
      } catch (error) {
        console.error('Erro ao carregar ficheiros:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="relative min-h-screen lg:h-screen w-full px-3 md:px-5 py-2 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto lg:overflow-y-hidden flex flex-col">

      {/* Decorative elements */}
      <img src="./src/assets/bush.webp" alt="" aria-hidden="true"
        className="pointer-events-none fixed bottom-[-9%] left-[-5%] z-2 w-28 sm:w-36 md:w-44 lg:w-52 object-contain" />
      <img src="./src/assets/bush2.webp" alt="" aria-hidden="true"
        className="pointer-events-none fixed bottom-[-9%] right-[-4%] z-2 w-28 sm:w-36 md:w-44 lg:w-52 object-contain" />
      <img src="./src/assets/books.webp" alt="" aria-hidden="true"
        className="pointer-events-none fixed bottom-[0%] left-[0%] z-1 w-28 sm:w-36 md:w-44 lg:w-36 object-contain" />
      <img src="./src/assets/rainbow.png" alt="" aria-hidden="true"
        className={`pointer-events-none fixed top-[14%] left-[-5%] z-1 w-28 sm:w-36 md:w-44 lg:w-100 object-contain rotate-24 transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <NightModeBackground dayImage="./src/assets/content2.png" nightImage="./src/assets/noite.png" />

      {/* Body: Sidebar + Main */}
      <div className="max-w-[95%] w-full mx-auto flex flex-col lg:flex-row gap-3 lg:gap-20 relative z-10 mt-40 mb-20 pb-2 flex-1 min-h-0">

        <Aside subjects={subjects} activeSubject={activeSubject} onSelectSubject={setActiveSubject} />

        {/* Main content panel */}
        <div className="flex-1 min-h-0 bg-blue-600/30 backdrop-blur-xs rounded-3xl shadow-[0_18px_45px_rgba(31,38,135,0.28)] border border-white/30 ring-1 ring-white/20 overflow-hidden flex flex-col">

          {/* Panel header */}
          <div className="relative px-5 pt-3 pb-2 flex items-center shrink-0">
            <img src="./src/assets/stars.png" alt="" aria-hidden="true"
              className="pointer-events-none absolute inset-x-[-50] top-1/2 h-[100%] w-2/3 -translate-y-2/3 mx-auto object-contain" />
            <h1
              className="relative z-10 font-['Fredoka',sans-serif] text-3xl font-black text-white"
              style={{ textShadow: '-1px 0 #2563eb, 0 1px #2563eb, 1px 0 #2563eb, 0 -1px #2563eb, 1px 1px #2563eb, -1px -1px #2563eb, 1px -1px #2563eb, -1px 1px #2563eb' }}
            >
              Descarregar!
            </h1>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
                  <p className="text-white/80 font-semibold">A carregar ficheiros…</p>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-white/60 text-lg font-semibold">Nenhum ficheiro disponível</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {filtered.map((item) => (
                  <DownloadCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <NightModeToggle />

      {/* Footer */}
      <Footer />
    </main>
  );
}

function DownloadCard({ item }: { item: Descarregavel }) {
  const href = item.ficheiro_url ?? item.url_externa;

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-xs p-4 shadow-[0_4px_16px_rgba(31,38,135,0.15)] hover:bg-white/25 transition-colors">

      {/* Icon + title */}
      <div className="flex items-start gap-3">
        <span className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-white/30 border border-white/20">
          {item.thumbnail_url
            ? <img src={item.thumbnail_url} alt="" className="h-10 w-10 object-cover rounded-lg" />
            : <FileText size={24} className="text-white" aria-hidden="true" />
          }
        </span>
        <div className="min-w-0">
          <p className="font-['Fredoka',sans-serif] font-black text-white text-base leading-tight line-clamp-2">
            {item.titulo}
          </p>
          <p className="text-white/60 text-xs mt-0.5">{item.disciplina_nome} · {item.tema_titulo}</p>
        </div>
      </div>

      {/* Description */}
      {item.corpo && (
        <p className="text-white/75 text-sm leading-snug line-clamp-2">{item.corpo}</p>
      )}

      {/* Download button */}
      {href ? (
        <a
          href={href}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 bg-white text-[#1e3a8a] font-['Fredoka',sans-serif] font-black text-sm shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:bg-white/90 active:scale-95 transition-all"
        >
          <Download size={16} aria-hidden="true" />
          Descarregar
        </a>
      ) : (
        <span className="mt-auto inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 bg-white/20 text-white/50 font-['Fredoka',sans-serif] font-black text-sm cursor-not-allowed">
          <Download size={16} aria-hidden="true" />
          Indisponível
        </span>
      )}
    </div>
  );
}
