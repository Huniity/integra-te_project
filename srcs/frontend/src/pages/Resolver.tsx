import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NightModeBackground, NightModeProvider, NightModeToggle, useNightMode } from '../components/core/NightMode';
import Searchbar from '../components/core/SearchBar';
import Aside from '../components/core/Aside';
import type { SubjectId } from '../components/core/Aside';
import MainContent from '../components/core/MainContent';
import type { FilterType } from '../components/core/MainContent';
import ExerciseCard from '../components/resolver/ExerciseCard';
import ExerciseModal from '../components/resolver/ExerciseModal';
import type { Exercise } from '../components/resolver/ExerciseModal';
import { subjects } from '../utils/resolver';

import { exercicioApi } from '../services/api/resolver.api';

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
  const [activeSubject, setActiveSubject] = useState<SubjectId>('todos');
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
    { iconImg: './src/assets/lock.png', label: 'Admin', path: '/login' },
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

      {/* Header */}
      <header className="max-w-[95%] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 mb-2 relative z-30 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="h-18 w-[225px] flex items-center justify-center bg-center bg-no-repeat bg-[length:100%_100%] transform hover:scale-105 transition-transform cursor-pointer"
          style={{ backgroundImage: 'url(./src/assets/cloud_logo.png)' }}
        >
          <span className="font-['Fredoka',sans-serif] text-xl md:text-[1.5rem] font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#005bb7] to-[#3b82f6]">
            INTEGRA-TE
          </span>
        </button>

        <Searchbar />
        <nav className="flex flex-wrap items-center justify-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
              className="w-9 h-9 bg-white/30 rounded-full flex items-center justify-center shadow-md border-2 border-white/20 hover:scale-110 active:scale-95 transition-transform cursor-pointer backdrop-blur-xs"
            >
              <img
                src={item.iconImg}
                alt={item.label}
                className="w-7 h-7 object-contain"
              />
            </button>
          ))}
        </nav>

      </header>

      {/* Body: Sidebar + Main */}
      <div className="max-w-[95%] w-full mx-auto flex flex-col lg:flex-row gap-3 lg:gap-20 relative z-10 pb-2 flex-1 min-h-0">

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
      {/* Footer */}
      <footer className="w-full mt-1 mb-1 flex justify-center relative z-20 shrink-0">
        <div className="w-full sm:w-auto bg-white/95 rounded-3xl sm:rounded-full px-4 sm:px-7 py-2 sm:py-2.5 shadow-lg border-2 border-white flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:gap-7 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 sm:border-r border-gray-200 sm:pr-5 last:border-0">
            <div className="w-8 h-5 bg-blue-800 flex items-center justify-center text-[6px] text-yellow-400 font-bold rounded-sm">EU</div>
            <span className="text-[10px] font-black text-gray-500 leading-tight uppercase">Cofinanciado pela<br />União Europeia</span>
          </div>
          <div className="text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
            ALGARVE <span className="text-orange-500">2030</span>
          </div>
          <div className="text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600">
            PORTUGAL <span className="text-amber-500">2030</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-500 leading-tight uppercase">Loulé<br />concelho</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
