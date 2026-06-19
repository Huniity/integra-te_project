import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NightModeBackground, NightModeProvider, NightModeToggle, useNightMode } from '../components/core/NightMode';
import Aside from '../components/core/Aside';
<<<<<<< HEAD
import MainContent from '../components/resolver/MainContent';
import type { FilterType } from '../components/resolver/MainContent';
import ExerciseModal from './../components/resolver/ExerciseModal';
import type { Exercise } from './../components/resolver/ExerciseModal';
import { getLevelBadgeClassName, subjects } from '../utils/resolver';
=======
import type { SubjectId } from '../components/core/Aside';
import MainContent from '../components/core/MainContent';
import type { FilterType } from '../components/core/MainContent';
import ExerciseCard from '../components/resolver/ExerciseCard';
import ExerciseModal from '../components/resolver/ExerciseModal';
import type { Exercise } from '../components/resolver/ExerciseModal';
import { subjects } from '../utils/resolver';
>>>>>>> dev

import { exercicioApi } from '../services/api/resolver.api';
import Footer from '../components/core/Footer';

export default function Resolver() {
  return (
    <NightModeProvider>
      <ResolverContent />
    </NightModeProvider>
  );
}

function ResolverContent() {
  const navigate = useNavigate();
  const { isNightMode } = useNightMode();
<<<<<<< HEAD
  const [activeSubject, setActiveSubject] = useState('todos');
=======
  const [activeSubject, setActiveSubject] = useState<SubjectId | string>('todos');
>>>>>>> dev
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const [selectedLevel, setSelectedLevel] = useState<number | 'todos'>('todos');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

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

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navItems = [
<<<<<<< HEAD
    { iconImg: './src/assets/lock.png', label: 'Admin', path: '/dashboard' },
=======
    { iconImg: './src/assets/lock.png', label: 'Admin', path: '/admin/' },
>>>>>>> dev
  ];

  const filteredExercises =
    exercises.filter(
      (ex) =>
        (activeSubject === 'todos' || ex.subjectId === activeSubject) &&
        (activeFilter === 'nivel' ? selectedLevel === 'todos' || ex.level === selectedLevel : true),
    );

  useEffect(() => {
      const loadExercises = async () => {
        try {
          setIsLoading(true);
          const data = await exercicioApi.getExercicios();

          setExercises(data);
        } catch (error) {
          console.error("Erro ao carregar os exercícios:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadExercises();
    }, []);

  return (
    <main
      className="relative min-h-screen lg:h-screen w-full px-3 md:px-5 py-2 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto lg:overflow-y-hidden flex flex-col"
    >
      {/* Decorative Elements */}
      <img
        src="./src/assets/bush.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-9%] left-[-5%] z-2 w-28 sm:w-36 md:w-44 lg:w-52 object-contain"
      />
      <img
        src="./src/assets/bush2.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-9%] right-[-4%] z-2 w-28 sm:w-36 md:w-44 lg:w-52 object-contain"
      />
      <img
        src="./src/assets/books.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[0%] left-[0%] z-1 w-28 sm:w-36 md:w-44 lg:w-36 object-contain"
      />
      <img
        src="./src/assets/rainbow.png"
        alt=""
        aria-hidden="true"
        className={`pointer-events-none fixed top-[14%] left-[-5%] z-1 w-28 sm:w-36 md:w-44 lg:w-100 object-contain rotate-24 transition-opacity duration-700 ${
          isNightMode ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <NightModeBackground dayImage="./src/assets/content2.png" nightImage="./src/assets/noite.png" />

      {/* Body: Sidebar + Main */}
      <div className="max-w-[95%] w-full mx-auto flex flex-col lg:flex-row gap-3 lg:gap-20 relative z-10 mt-40 mb-20 pb-2 flex-1 min-h-0">

        <Aside subjects={subjects} activeSubject={activeSubject} onSelectSubject={setActiveSubject} />

        {/* Main Content Panel */}
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
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500 font-semibold">Carregando exercícios...</p>
              </div>
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400 text-lg font-semibold">Nenhum exercício disponível</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 min-[640px]:grid-cols-3 gap-3 sm:gap-4 items-stretch rounded-2xl">
              {filteredExercises.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} onSelect={setSelectedExercise} />
              ))}
            </div>
          )}
        </MainContent>
      </div>
      {selectedExercise && (
        <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      )}
      <NightModeToggle />
      <Footer />
    </main>
  );
}
