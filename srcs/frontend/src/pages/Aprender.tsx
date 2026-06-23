import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NightModeBackground, useNightMode } from '../components/core/NightMode';
import Aside from '../components/core/Aside';
import type { SubjectId } from '../components/core/Aside';
import MainContent from '../components/core/MainContent';
import type { FilterType } from '../components/core/MainContent';
import { useCarousel, CarouselNav } from '../components/core/Carousel';
import AprenderCard from '../components/aprender/AprenderCard';
import AprenderModal from '../components/aprender/AprenderModal';
import { subjects } from '../utils/aprender';

import { aulasApi } from '../services/api/aulas.api';
import type { Aula } from '../api/contracts/aulas';
import Footer from '../components/core/Footer';

export default function Aprender() {
  return <AprenderContent />;
}

function AprenderContent() {
  const { isNightMode } = useNightMode();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState<SubjectId | string>('todos');
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const [selectedLevel, setSelectedLevel] = useState<number | 'todos'>('todos');
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);

  const handleSelectAllLevels = () => {
    setActiveFilter('todos');
    setSelectedLevel('todos');
  };

  const handleSelectLevel = (level: number | 'todos') => {
    if (level === 'todos') {
      setActiveFilter('todos');
      setSelectedLevel('todos');
    } else {
      setActiveFilter('nivel');
      setSelectedLevel(level);
    }
  };

  const [aulas, setAulas] = useState<Aula[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const filteredAulas =
    aulas.filter(
      (ex) =>
        (activeSubject === 'todos' || ex.subjectId === activeSubject) &&
        (activeFilter === 'nivel' ? selectedLevel === 'todos' || ex.level === selectedLevel : true),
    );

  const carousel = useCarousel(filteredAulas, { mobile: 2, tablet: 4, desktop: 6 });

  useEffect(() => {
    const loadAulas = async () => {
      try {
        setIsLoading(true);
        const data = await aulasApi.getAulas();

        setAulas(data);
      } catch (error) {
        console.error("Erro ao carregar as aulas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAulas();
  }, []);

  useEffect(() => {
    if (!id || aulas.length === 0) return;
    setSelectedAula(aulas.find((aula) => aula.id === id) ?? null);
  }, [id, aulas]);

  const closeAula = () => {
    setSelectedAula(null);
    if (id) navigate('/aprender', { replace: true });
  };

  return (
    <main
      className="relative min-h-screen lg:h-screen w-full px-3 md:px-5 py-2 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto lg:overflow-y-hidden flex flex-col"
    >
      {/* Decorative Elements */}
      <img src="/src/assets/bush.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] left-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="/src/assets/bush_night.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] left-[-3%] z-2 w-28 sm:w-36 md:w-44 lg:w-70 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="/src/assets/bush2.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="/src/assets/bush2_night.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="/src/assets/books.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[2%] left-[3%] z-1 w-28 sm:w-36 md:w-44 lg:w-46 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="/src/assets/books_night.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[2%] left-[3%] z-1 w-28 sm:w-36 md:w-44 lg:w-46 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img
        src="/src/assets/rainbow.webp"
        alt=""
        aria-hidden="true"
        className={`pointer-events-none fixed top-[14%] left-[-5%] z-1 w-28 sm:w-36 md:w-44 lg:w-100 object-contain rotate-24 transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'
          }`}
      />

      <NightModeBackground dayImage="/src/assets/content2.webp" nightImage="/src/assets/noite.webp" />

      {/* Body: Sidebar + Main */}
      <div className="max-w-[95%] w-full mx-auto flex flex-col lg:flex-row gap-3 lg:gap-20 relative z-10 mt-16 sm:mt-20 lg:mt-24 xl:mt-30 pb-2 flex-1 min-h-0">

        <Aside subjects={subjects} activeSubject={activeSubject} onSelectSubject={setActiveSubject} />

        {/* Main Content Panel + nav below */}
        <div className="flex-1 min-h-0 flex flex-col gap-2">
          <MainContent
            title="Aprende connosco!"
            activeFilter={activeFilter}
            selectedLevel={selectedLevel}
            onSelectAll={handleSelectAllLevels}
            onSelectLevel={handleSelectLevel}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-500 font-semibold">Carregando exercícios...</p>
                </div>
              </div>
            ) : filteredAulas.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400 text-lg font-semibold">Nenhum exercício disponível</p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch"
                onTouchStart={carousel.onTouchStart}
                onTouchEnd={carousel.onTouchEnd}
              >
                {carousel.pageItems.map(aula => (
                  <AprenderCard key={aula.id} aula={aula} onSelect={setSelectedAula} />
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
      {selectedAula && (
        <AprenderModal aula={selectedAula} onClose={closeAula} />
      )}
      <Footer />
    </main>
  );
}
