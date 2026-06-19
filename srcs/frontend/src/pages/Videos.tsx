import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { NightModeBackground, NightModeProvider, NightModeToggle, useNightMode } from '../components/core/NightMode';
import Aside from '../components/core/Aside';
import type { SubjectId } from '../components/core/Aside';
import MainContent from '../components/core/MainContent';
import { subjects } from '../utils/videos';
import { videosApi } from '../services/api/videos.api';
import type { Video } from '../api/contracts/videos';
import Footer from '../components/core/Footer';

export default function Videos() {
  return (
    <NightModeProvider>
      <VideosContent />
    </NightModeProvider>
  );
}

function VideosContent() {
  const { isNightMode } = useNightMode();

  const [activeSubject, setActiveSubject] = useState<SubjectId | string>('todos');
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Video | null>(null);

  const filtered = videos.filter(
    (v) => activeSubject === 'todos' || v.disciplina_slug === activeSubject,
  );

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setVideos(await videosApi.getVideos());
      } catch (error) {
        console.error('Erro ao carregar vídeos:', error);
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
        className={`pointer-events-none fixed bottom-[-1%] left-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="./src/assets/bush_night.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] left-[-3%] z-2 w-28 sm:w-36 md:w-44 lg:w-70 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="./src/assets/bush2.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="./src/assets/bush2_night.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="./src/assets/books.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[2%] left-[3%] z-1 w-28 sm:w-36 md:w-44 lg:w-46 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="./src/assets/books_night.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[2%] left-[3%] z-1 w-28 sm:w-36 md:w-44 lg:w-46 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="./src/assets/rainbow.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed top-[14%] left-[-5%] z-1 w-28 sm:w-36 md:w-44 lg:w-100 object-contain rotate-24 transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <NightModeBackground dayImage="./src/assets/content2.webp" nightImage="./src/assets/noite.webp" />
      {/* Body: Sidebar + Main */}
      <div className="max-w-[95%] w-full mx-auto flex flex-col lg:flex-row gap-3 lg:gap-20 relative z-10 mt-40 mb-20 pb-2 flex-1 min-h-0">

        <Aside subjects={subjects} activeSubject={activeSubject} onSelectSubject={setActiveSubject} />

        <MainContent title="Vídeos!">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
                <p className="text-white/80 font-semibold">A carregar vídeos…</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-white/60 text-lg font-semibold">Nenhum vídeo disponível</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {filtered.map((video) => (
                <VideoCard key={video.id} video={video} onPlay={setSelected} />
              ))}
            </div>
          )}
        </MainContent>
      </div>

      {/* Video modal */}
      {selected && <VideoModal video={selected} onClose={() => setSelected(null)} />}

      <NightModeToggle />
      <Footer />
    </main>
  );
}

/* Video thumbnail card */
function VideoCard({ video, onPlay }: { video: Video; onPlay: (v: Video) => void }) {
  const src = video.url_externa ?? video.ficheiro_url;

  return (
    <button
      onClick={() => onPlay(video)}
      className="group text-left flex flex-col gap-2 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-xs overflow-hidden shadow-[0_4px_16px_rgba(31,38,135,0.15)] hover:bg-white/25 active:scale-[0.98] transition-all"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-black/30 overflow-hidden">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play size={40} className="text-white/50" aria-hidden="true" />
          </div>
        )}
        {/* Play overlay */}
        {src && (
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <Play size={24} className="text-[#1e3a8a] ml-1" aria-hidden="true" />
            </span>
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-3 pb-3 flex flex-col gap-1">
        <p className="font-['Fredoka',sans-serif] font-black text-white text-base leading-tight line-clamp-2">
          {video.titulo}
        </p>
        <p className="text-white/60 text-xs">{video.disciplina_nome} · {video.tema_titulo}</p>
        {video.corpo && (
          <p className="text-white/70 text-sm leading-snug line-clamp-2 mt-0.5">{video.corpo}</p>
        )}
      </div>
    </button>
  );
}

/* Modal that embeds or links the video */
function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const src = video.url_externa ?? video.ficheiro_url;

  /* Close on backdrop click or Escape */
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  const isEmbed = src && (
    src.includes('youtube.com') ||
    src.includes('youtu.be') ||
    src.includes('vimeo.com')
  );

  const embedSrc = src
    ? src
        .replace('watch?v=', 'embed/')
        .replace('youtu.be/', 'www.youtube.com/embed/')
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.titulo}
      onKeyDown={handleKey}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-blue-900/80 border border-white/20 shadow-2xl overflow-hidden">

        {/* Video area */}
        {isEmbed && embedSrc ? (
          <div className="aspect-video w-full">
            <iframe
              src={embedSrc}
              title={video.titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : src ? (
          <div className="aspect-video w-full bg-black">
            <video src={src} controls className="w-full h-full" />
          </div>
        ) : (
          <div className="aspect-video w-full flex items-center justify-center bg-black/40">
            <p className="text-white/60 font-semibold">Vídeo indisponível</p>
          </div>
        )}

        {/* Info footer */}
        <div className="px-5 py-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-['Fredoka',sans-serif] font-black text-xl text-white leading-tight">
              {video.titulo}
            </h2>
            <p className="text-white/60 text-sm mt-0.5">{video.disciplina_nome} · {video.tema_titulo}</p>
            {video.corpo && (
              <p className="text-white/75 text-sm mt-2 leading-snug">{video.corpo}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors text-lg font-black"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
