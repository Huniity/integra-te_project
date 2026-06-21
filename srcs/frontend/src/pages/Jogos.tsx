import { useState, useEffect } from 'react';
import { NightModeBackground, NightModeProvider, NightModeToggle, useNightMode } from '../components/core/NightMode';
import Aside from '../components/core/Aside';
import type { Subject, SubjectId } from '../components/core/Aside';
import MainContent from '../components/core/MainContent';
import { useCarousel, CarouselNav } from '../components/core/Carousel';
import JogoCard from '../components/jogos/JogoCard';
import Footer from '../components/core/Footer';
import { jogosApi } from '../services/api/jogos.api';
import type { Jogo } from '../api/contracts/jogos';

export default function Games() {
  return (
    <NightModeProvider>
      <GamesContent />
    </NightModeProvider>
  );
}

function GamesContent() {
  const { isNightMode } = useNightMode();
  const [activeSubject, setActiveSubject] = useState<SubjectId | string>('todos');
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ageSubjects: Subject[] = [
    { id: 'todos', label: 'Todos os Jogos', iconImg: './src/assets/controller.webp' },
    { id: '4-6',   label: '4 à 6 anos',    iconImg: './src/assets/puzzle.png' },
    { id: '6-9',   label: '6 à 9 anos',    iconImg: './src/assets/abc.webp' },
    { id: '9-12',  label: '9 à 12 anos',   iconImg: './src/assets/sudoku.webp' },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setJogos(await jogosApi.getJogos());
      } catch (error) {
        console.error('Erro ao carregar jogos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredGames = jogos.filter(
    (jogo) => activeSubject === 'todos' || jogo.faixa_etaria === activeSubject,
  );

  const carousel = useCarousel(filteredGames);

  return (
    <main className="relative min-h-screen lg:h-screen w-full px-3 md:px-5 py-2 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto lg:overflow-y-hidden flex flex-col">
      <img src="./src/assets/bush.png" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-9%] left-[-5%] z-2 w-28 sm:w-36 md:w-44 lg:w-52 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="./src/assets/bush_night.png" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-9%] left-[-5%] z-2 w-28 sm:w-36 md:w-44 lg:w-52 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="./src/assets/bush2.png" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-9%] right-[-4%] z-2 w-28 sm:w-36 md:w-44 lg:w-52 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="./src/assets/bush2_night.png" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-9%] right-[-4%] z-2 w-28 sm:w-36 md:w-44 lg:w-52 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="./src/assets/books.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[0%] left-[0%] z-1 w-28 sm:w-36 md:w-44 lg:w-36 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="./src/assets/books_night.png" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[0%] left-[0%] z-1 w-28 sm:w-36 md:w-44 lg:w-36 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="./src/assets/rainbow.png" alt="" aria-hidden="true"
        className={`pointer-events-none fixed top-[14%] left-[-5%] z-1 w-28 sm:w-36 md:w-44 lg:w-100 object-contain rotate-24 transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <NightModeBackground dayImage="./src/assets/content2.png" nightImage="./src/assets/noite.png" />

      <div className="max-w-[95%] w-full mx-auto flex flex-col lg:flex-row gap-3 lg:gap-20 relative z-10 mt-30 pb-2 flex-1 min-h-0">
        <Aside subjects={ageSubjects} activeSubject={activeSubject} onSelectSubject={setActiveSubject} title="Idades" />

        <div className="flex-1 min-h-0 flex flex-col gap-2">
          <MainContent title="Jogos Disponíveis">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
                  <p className="text-white/80 font-semibold">A carregar jogos…</p>
                </div>
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-white/90 font-semibold">Nenhum jogo disponível para esta faixa etária.</p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
                onTouchStart={carousel.onTouchStart}
                onTouchEnd={carousel.onTouchEnd}
              >
                {carousel.pageItems.map((jogo) => (
                  <JogoCard key={jogo.id} jogo={jogo} />
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

      <NightModeToggle />
      <Footer />
    </main>
  );
}
