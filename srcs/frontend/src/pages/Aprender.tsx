import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NightModeBackground, NightModeProvider, NightModeToggle, useNightMode } from '../components/core/NightMode';
import Aside from '../components/core/Aside';
import type { SubjectId } from '../components/core/Aside';
import MainContent from '../components/aprender/MainContent';
import type { FilterType } from '../components/aprender/MainContent';
import AprenderCard from '../components/aprender/AprenderCard';
import AprenderModal from '../components/aprender/AprenderModal';
import { subjects } from '../utils/aprender';

import { aulasApi } from '../services/api/aprender.api';
import type { Aula } from '../api/contracts/aprender';
import Footer from '../components/core/Footer';

export default function Aprender() {
  return (
    <NightModeProvider>
      <AprenderContent />
    </NightModeProvider>
  );
}

function AprenderContent() {
  const navigate = useNavigate();
  const { isNightMode } = useNightMode();
  const [activeSubject, setActiveSubject] = useState<SubjectId>('todos');
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

  const navItems = [
    { iconImg: './src/assets/lock.png', label: 'Admin', path: '/admin/' },
  ];

  const filteredAulas =
    aulas.filter(
      (ex) =>
        (activeSubject === 'todos' || ex.subjectId === activeSubject) &&
        (activeFilter === 'nivel' ? selectedLevel === 'todos' || ex.level === selectedLevel : true),
    );

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
            <div className="grid grid-cols-2 min-[640px]:grid-cols-3 gap-3 sm:gap-4 items-stretch rounded-2xl">
              {filteredAulas.map((ex) => (
                <AprenderCard key={ex.id} aula={ex} onSelect={setSelectedAula} />
              ))}
            </div>
          )}
        </MainContent>
      </div>
      {selectedAula && (
        <AprenderModal aula={selectedAula} onClose={() => setSelectedAula(null)} />
      )}
      <NightModeToggle />
      <Footer />
    </main>
  );
}
