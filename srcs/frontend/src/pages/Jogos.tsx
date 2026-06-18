import { useState, useEffect } from 'react';
import { NightModeBackground, NightModeProvider, NightModeToggle, useNightMode } from '../components/core/NightMode';
import AsideJogos from '../components/core/asidejogos';
import type { GameAgeFilterId, GameAgeSubject } from '../components/core/asidejogos';
import MainContentJogos from '../components/Games/MainContent';
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

  const [activeSubject, setActiveSubject] = useState<GameAgeFilterId>('todos');
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ageSubjects: GameAgeSubject[] = [
    { id: 'todos', label: 'Todos os Jogos' },
    { id: '4-6', label: 'Entre os 4 e 6 anos' },
    { id: '6-9', label: 'Entre os 6 e 9 anos' },
    { id: '9-12', label: 'Entre os 9 e 12 anos' },
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

        <AsideJogos subjects={ageSubjects} activeSubject={activeSubject} onSelectSubject={setActiveSubject} />

        <MainContentJogos title="Jogos Disponíveis">
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
                <a
                  key={jogo.id}
                  href={jogo.ficheiro_url ?? jogo.url_externa ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 w-full cursor-pointer group"
                >
                  <div className="w-full max-w-[220px] aspect-square rounded-2xl bg-white/20 border border-white/30 backdrop-blur-xs flex items-center justify-center shadow-[0_4px_16px_rgba(31,38,135,0.15)] group-hover:scale-105 transition-transform duration-300">
                    <img
                      src="/src/assets/controller.webp"
                      alt=""
                      aria-hidden="true"
                      className="w-16 h-16 object-contain opacity-80"
                    />
                  </div>
                  <p className="font-['Fredoka',sans-serif] text-sm md:text-base font-black text-center leading-tight text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
                    {jogo.titulo}
                  </p>
                  {jogo.descricao && (
                    <p className="text-white/70 text-xs text-center line-clamp-2">{jogo.descricao}</p>
                  )}
                </a>
              ))}
            </div>
          )}
        </MainContentJogos>
      </div>

      <NightModeToggle />
      <Footer />
    </main>
  );
}
