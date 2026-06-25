import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NightModeBackground, useNightMode } from '../components/core/NightMode';
import Aside from '../components/core/Aside';
import type { SubjectId } from '../components/core/Aside';
import MainContent from '../components/core/MainContent';
import { useCarousel, CarouselNav } from '../components/core/Carousel';
import { subjects } from '../utils/videos';
import { videosApi } from '../services/api/videos.api';
import { aulasApi } from '../services/api/aulas.api';
import { exerciciosApi } from '../services/api/exercicios.api';
import type { Video } from '../api/contracts/videos';
import type { Aula } from '../api/contracts/aulas';
import type { Exercicio } from '../api/contracts/exercicios';
import Footer from '../components/core/Footer';
import VideoCard from '../components/videos/VideoCard';
import VideoModal from '../components/videos/VideoModal';

const SUBJECT_LABEL: Record<string, string> = {
  matematica:       'Matemática',
  portugues:        'Português',
  'estudo-do-meio': 'Estudo do Meio',
};

function aulaToVideo(a: Aula): Video {
  return {
    id:              `aula-${a.id}`,
    titulo:          a.title,
    tipo:            'video',
    corpo:           a.description,
    url_externa:     a.videoUrl,
    ficheiro_url:    undefined,
    thumbnail_url:   a.thumbnailUrl || undefined,
    disciplina_slug: a.subjectId,
    disciplina_nome: SUBJECT_LABEL[a.subjectId] ?? a.subjectId,
    tema_titulo:     `Aula · Nível ${a.level}`,
    publicado:       a.publicado,
    criado_em:       a.createdAt ?? '',
  };
}

function exercicioToVideo(e: Exercicio): Video {
  return {
    id:              `exercicio-${e.id}`,
    titulo:          e.title,
    tipo:            'video',
    corpo:           e.description,
    url_externa:     e.videoUrl,
    ficheiro_url:    undefined,
    thumbnail_url:   e.thumbnailUrl || undefined,
    disciplina_slug: e.subjectId,
    disciplina_nome: SUBJECT_LABEL[e.subjectId] ?? e.subjectId,
    tema_titulo:     `Exercício · Nível ${e.level}`,
    publicado:       e.publicado,
    criado_em:       '',
  };
}

export default function Videos() {
  return <VideosContent />;
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

  const carousel = useCarousel(filtered, { mobile: 2, tablet: 4, desktop: 6 });

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [dashboardVideos, aulas, exercicios] = await Promise.all([
          videosApi.getVideos(),
          aulasApi.getAulas(),
          exerciciosApi.getExercicios(),
        ]);

        const fromAulas = aulas
          .filter((a) => a.publicado && a.videoUrl)
          .map(aulaToVideo);

        const fromExercicios = exercicios
          .filter((e) => e.publicado && e.videoUrl)
          .map(exercicioToVideo);

        const fromDashboard = dashboardVideos.filter((v) => v.publicado);

        setVideos([...fromDashboard, ...fromAulas, ...fromExercicios]);
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

      <motion.img src="/src/assets/bush.webp" alt="" aria-hidden="true"
        initial={{ y: 60 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`pointer-events-none fixed bottom-[-1%] left-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <motion.img src="/src/assets/bush_night.webp" alt="" aria-hidden="true"
        initial={{ y: 60 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`pointer-events-none fixed bottom-[-1%] left-[-3%] z-2 w-28 sm:w-36 md:w-44 lg:w-70 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <motion.img src="/src/assets/bush2.webp" alt="" aria-hidden="true"
        initial={{ y: 60 }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}
        className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <motion.img src="/src/assets/bush2_night.webp" alt="" aria-hidden="true"
        initial={{ y: 60 }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}
        className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <motion.img src="/src/assets/books.webp" alt="" aria-hidden="true"
        initial={{ y: 60 }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className={`pointer-events-none fixed bottom-[2%] left-[3%] z-1 w-28 sm:w-36 md:w-44 lg:w-46 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <motion.img src="/src/assets/books_night.webp" alt="" aria-hidden="true"
        initial={{ y: 60 }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className={`pointer-events-none fixed bottom-[2%] left-[3%] z-1 w-28 sm:w-36 md:w-44 lg:w-46 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <motion.img src="/src/assets/rainbow.webp" alt="" aria-hidden="true"
        initial={{ y: -40, rotate: 10, scale: 0.9 }} animate={{ y: 0, rotate: 24, scale: 1 }} transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className={`pointer-events-none fixed top-[14%] left-[-5%] z-1 w-28 sm:w-36 md:w-44 lg:w-100 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <NightModeBackground dayImage="/src/assets/bg_day.webp" nightImage="/src/assets/bg_night.webp" />

      <div className="max-w-[95%] w-full mx-auto flex flex-col lg:flex-row gap-3 lg:gap-20 relative z-10 mt-16 sm:mt-20 lg:mt-24 xl:mt-30 pb-2 flex-1 min-h-0">
        <Aside subjects={subjects} activeSubject={activeSubject} onSelectSubject={setActiveSubject} />

        <div className="flex-1 min-h-0 flex flex-col gap-2">
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
              <div
                className="h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch"
                onTouchStart={carousel.onTouchStart}
                onTouchEnd={carousel.onTouchEnd}
              >
                {carousel.pageItems.map((video, i) => (
                  <VideoCard key={video.id} video={video} onPlay={setSelected} index={i} />
                ))}
              </div>
            )}
          </MainContent>

          <CarouselNav
            page={carousel.page}
            totalPages={carousel.totalPages}
            onPrev={carousel.prev}
            onNext={carousel.next}
            onDot={carousel.setPage}
          />
        </div>
      </div>

      {selected && <VideoModal video={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
