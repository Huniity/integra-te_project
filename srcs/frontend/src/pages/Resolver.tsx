import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { NightModeBackground, useNightMode } from '../components/core/NightMode';
import Aside from '../components/core/Aside';
import type { SubjectId } from '../components/core/Aside';
import MainContent from '../components/core/MainContent';
import type { FilterType } from '../components/core/MainContent';
import { useCarousel, CarouselNav } from '../components/core/Carousel';
import ExerciseCard from '../components/resolver/ExerciseCard';
import ExerciseModal from '../components/resolver/ExerciseModal';
import type { Exercise } from '../components/resolver/ExerciseModal';
import { subjects } from '../utils/resolver';
import { exerciciosApi } from '../services/api/exercicios.api';
import Footer from '../components/core/Footer';

export default function Resolver() {
  return <ResolverContent />;
}

function ResolverContent() {
  const { isNightMode } = useNightMode();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeSubject, setActiveSubject] = useState<SubjectId | string>(
    searchParams.get('subject') ?? 'todos'
  );

  useEffect(() => {
    const s = searchParams.get('subject');
    if (s) setActiveSubject(s);
  }, [searchParams]);

  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const [selectedLevel, setSelectedLevel] = useState<number | 'todos'>('todos');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSelectAllLevels = () => { setActiveFilter('todos'); setSelectedLevel('todos'); };
  const handleSelectLevel = (level: number | 'todos') => {
    if (level === 'todos') { setActiveFilter('todos'); setSelectedLevel('todos'); }
    else { setActiveFilter('nivel'); setSelectedLevel(level); }
  };

  const filteredExercises = exercises.filter(
    (ex) =>
      (activeSubject === 'todos' || ex.subjectId === activeSubject) &&
      (activeFilter === 'nivel' ? selectedLevel === 'todos' || ex.level === selectedLevel : true),
  );

  const carousel = useCarousel(filteredExercises, { mobile: 2, tablet: 4, desktop: 6 });

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setExercises(await exerciciosApi.getExercicios());
      } catch (error) {
        console.error('Erro ao carregar os exercícios:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!id || exercises.length === 0) return;
    setSelectedExercise(exercises.find((ex) => ex.id === id) ?? null);
  }, [id, exercises]);

  const closeExercise = () => {
    setSelectedExercise(null);
    if (id) navigate('/resolver', { replace: true });
  };

  return (
    <main className="relative min-h-screen lg:h-screen w-full px-3 md:px-5 py-2 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto lg:overflow-y-hidden flex flex-col">

      {/* Decorative elements */}
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
      <img src="/src/assets/rainbow.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed top-[14%] left-[-5%] z-1 w-28 sm:w-36 md:w-44 lg:w-100 object-contain rotate-24 transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <NightModeBackground dayImage="/src/assets/bg_day.webp" nightImage="/src/assets/bg_night.webp" />

      <div className="max-w-[95%] w-full mx-auto flex flex-col lg:flex-row gap-3 lg:gap-20 relative z-10 mt-16 sm:mt-20 lg:mt-24 xl:mt-30 pb-2 flex-1 min-h-0">
        <Aside subjects={subjects} activeSubject={activeSubject} onSelectSubject={setActiveSubject} />

        <div className="flex-1 min-h-0 flex flex-col gap-2">
          <MainContent
            title="Pratica connosco!"
            activeFilter={activeFilter}
            selectedLevel={selectedLevel}
            onSelectAll={handleSelectAllLevels}
            onSelectLevel={handleSelectLevel}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
                  <p className="text-gray-500 font-semibold">Carregando exercícios...</p>
                </div>
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400 text-lg font-semibold">Nenhum exercício disponível</p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch"
                onTouchStart={carousel.onTouchStart}
                onTouchEnd={carousel.onTouchEnd}
              >
                {carousel.pageItems.map((ex) => (
                  <ExerciseCard key={ex.id} exercise={ex} onSelect={setSelectedExercise} />
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

      {selectedExercise && (
        <ExerciseModal exercise={selectedExercise} onClose={closeExercise} />
      )}
      <Footer />
    </main>
  );
}
