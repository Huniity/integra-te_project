import { useState, useEffect } from 'react';
import { NightModeBackground, NightModeProvider, NightModeToggle, useNightMode } from '../components/core/NightMode';
import Aside from '../components/core/Aside';
import type { SubjectId } from '../components/core/Aside';
import MainContent from '../components/core/MainContent';
import JogoCard from '../components/jogos/JogoCard';
import Footer from '../components/core/Footer';
import { jogosApi } from '../services/api/jogos.api';
import type { Jogo } from '../api/contracts/jogos';
import { ageSubjects } from '../utils/jogos';

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
      <NightModeBackground dayImage="/src/assets/content2.webp" nightImage="/src/assets/noite.webp" />

      {/* Header */}
      <header className="max-w-[95%] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 mb-2 relative z-30 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="h-18 w-[225px] flex items-center justify-center bg-center bg-no-repeat bg-[length:100%_100%] transform hover:scale-105 transition-transform cursor-pointer"
          style={{ backgroundImage: 'url(/src/assets/cloud_logo.png)' }}
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
              <img src={item.iconImg} alt={item.label} className="w-7 h-7 object-contain" />
            </button>
          ))}
        </nav>
      </header>

      {/* Layout Dividido */}
      <div className="max-w-[95%] w-full mx-auto flex flex-col lg:flex-row gap-3 lg:gap-20 relative z-10 pb-2 flex-1 min-h-0">

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
