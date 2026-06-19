import { useState, useEffect } from 'react';
import { NightModeBackground, NightModeProvider, NightModeToggle, useNightMode } from '../components/core/NightMode';
import Aside from '../components/core/Aside';
import type { Subject, SubjectId } from '../components/core/Aside';
import MainContent from '../components/core/MainContent';
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
    { id: 'todos',  label: 'Todos os Jogos',     iconImg: './src/assets/controller.webp' },
    { id: '4-6',   label: '4 à 6 anos', iconImg: './src/assets/puzzle.png' },
    { id: '6-9',   label: '6 à 9 anos', iconImg: './src/assets/abc.webp' },
    { id: '9-12',  label: '9 à 12 anos', iconImg: './src/assets/sudoku.webp' },
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

  return (
    <main className="relative min-h-screen lg:h-screen w-full px-3 md:px-5 py-2 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto lg:overflow-y-hidden flex flex-col">
      <NightModeBackground dayImage="/src/assets/content2.png" nightImage="/src/assets/noite.png" />

      {/* Layout Dividido */}
      <div className="max-w-[95%] w-full mx-auto flex flex-col lg:flex-row gap-3 lg:gap-20 relative z-10 mt-40 mb-20 pb-2 flex-1 min-h-0">

        <Aside subjects={ageSubjects} activeSubject={activeSubject} onSelectSubject={setActiveSubject} title="Idades" />

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
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 justify-items-center rounded-2xl relative z-10 pt-2 w-full max-w-2xl mx-auto">
              {filteredGames.map((jogo) => (
                <JogoCard key={jogo.id} jogo={jogo} />
              ))}
            </div>
          )}
        </MainContent>
      </div>

      <NightModeToggle />
      <Footer />
    </main>
  );
}
