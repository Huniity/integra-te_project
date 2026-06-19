import { useState, useEffect } from 'react';
import { NightModeBackground, NightModeProvider, NightModeToggle, useNightMode } from '../components/core/NightMode';
import Aside from '../components/core/Aside';
import type { SubjectId } from '../components/core/Aside';
import MainContent from '../components/core/MainContent';
import VideoCard from '../components/videos/VideoCard';
import VideoModal from '../components/videos/VideoModal';
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
