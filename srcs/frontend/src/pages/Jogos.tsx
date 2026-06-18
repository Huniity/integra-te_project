import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NightModeBackground, NightModeProvider, NightModeToggle, useNightMode } from '../components/core/NightMode';
import Searchbar from '../components/core/SearchBar';
import AsideJogos from '../components/core/asidejogos';
import type { GameAgeFilterId, GameAgeSubject } from '../components/core/asidejogos';
import MainContentJogos from '../components/Games/MainContent';

interface GameType {
  id: string;
  title: string;
  ageGroup: string;
  gameUrl: string;
  photoUrl: string;
}

export default function Games() {
  return (
    <NightModeProvider>
      <GamesContent />
    </NightModeProvider>
  );
}

function GamesContent() {
  const navigate = useNavigate();
  const { isNightMode } = useNightMode();

  const [activeSubject, setActiveSubject] = useState<GameAgeFilterId>('todos');

  const ageSubjects: GameAgeSubject[] = [
    { id: 'todos', label: 'Todos os Jogos' },
    { id: '4-6', label: 'Entre os 4 e 6 anos' },
    { id: '6-9', label: 'Entre os 6 e 9 anos' },
    { id: '9-12', label: 'Entre os 9 e 12 anos' },
  ];


  const gamesData: GameType[] = [
    {
      id: '1',
      title: 'Sudoku dos Números',
      ageGroup: '4-6',
      gameUrl: 'https://wordwall.net',
      photoUrl: '/src/assets/sudoku.webp',
    },
    {
      id: '2',
      title: 'Explorador ABC',
      ageGroup: '4-6',
      gameUrl: 'https://wordwall.net',
      photoUrl: '/src/assets/sudoku.webp',
    },
    {
      id: '3',
      title: 'Jogo do Enforcado',
      ageGroup: '6-9',
      gameUrl: 'https://wordwall.net',
      photoUrl: '/src/assets/sudoku.webp',
    },
    {
      id: '4',
      title: 'Campo Minado Lógico',
      ageGroup: '9-12',
      gameUrl: 'https://wordwall.net',
      photoUrl: '/src/assets/sudoku.webp',
    },
  ];

  const navItems = [
    { iconImg: '/src/assets/lock.png', label: 'Admin', path: '/login' },
  ];

  const filteredGames = gamesData.filter(
    (game) => activeSubject === 'todos' || game.ageGroup === activeSubject
  );

  return (
    <main className="relative min-h-screen lg:h-screen w-full px-3 md:px-5 py-2 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto lg:overflow-y-hidden flex flex-col">
      <NightModeBackground dayImage="/src/assets/content2.png" nightImage="/src/assets/noite.png" />

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

        <AsideJogos subjects={ageSubjects} activeSubject={activeSubject} onSelectSubject={setActiveSubject} />

        <MainContentJogos title="Jogos Disponíveis">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 justify-items-center rounded-2xl relative z-10 pt-2 w-full max-w-2xl mx-auto">
              {filteredGames.map((game) => (
                <a
                  key={game.id}
                  href={game.gameUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block cursor-pointer flex flex-col items-center transition-none bg-transparent hover:bg-transparent"
                >
                  <p className="font-['Fredoka',sans-serif] text-sm md:text-base font-black text-center mb-2 leading-tight text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
                    {game.title}
                  </p>
                  <div className="w-full max-w-[300px] aspect-square flex items-center justify-center overflow-visible bg-transparent">
                    <img
                      src={game.photoUrl}
                      alt={game.title}
                      className="w-full h-full object-cover rounded-2xl duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.className += " bg-amber-500/90 border border-white/40 flex flex-col items-center justify-center p-2 text-center text-[11px] text-white font-bold rounded-2xl";
                          e.currentTarget.parentElement.innerHTML = `<span>Erro no arquivo</span>`;
                        }
                      }}
                    />
                  </div>
                </a>
              ))}
            </div>

            {filteredGames.length === 0 && (
              <div className="text-center py-16 font-semibold text-white/90 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs w-full">
                Nenhum jogo disponível para esta faixa etária.
              </div>
            )}
          </div>
        </MainContentJogos>
      </div>

      <NightModeToggle />


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
