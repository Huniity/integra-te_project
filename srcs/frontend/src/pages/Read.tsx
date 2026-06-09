import { useState } from 'react';

interface Book {
  id: string;
  title: string;
  level: number;
  abstract: string;
  externalLink: string;
  photoUrl: string;
  iconType: string;
}

export default function Learn() {
  const [activeSubject, setActiveSubject] = useState<string>('portugues');

  // Dados adaptados para corresponder perfeitamente aos 6 níveis exibidos na imagem institucional
  const booksData: Book[] = [
    {
      id: '1',
      title: 'Nível 1',
      level: 1,
      abstract: 'Uma aventura mágica adaptada sobre a inclusão social.',
      externalLink: 'https://www.amazon.com',
      photoUrl: 'src/assets/capas/capa-1.png',
      iconType: '📘'
    },
    {
      id: '2',
      title: 'Nível 2',
      level: 2,
      abstract: 'Desafios lúdicos para treinar a lógica.',
      externalLink: 'https://www.amazon.com',
      photoUrl: 'src/assets/capas/capa-2.png',
      iconType: '📙'
    },
    {
      id: '3',
      title: 'Nível 3',
      level: 3,
      abstract: 'Contos interativos contra o absentismo.',
      externalLink: 'https://www.amazon.com',
      photoUrl: 'src/assets/capas/capa-3.png',
      iconType: '📕'
    },
    {
      id: '4',
      title: 'Nível 4',
      level: 4,
      abstract: 'Livro focado na igualdade de oportunidades.',
      externalLink: 'https://www.amazon.com',
      photoUrl: 'src/assets/capas/capa-4.png',
      iconType: '📗'
    },
    {
      id: '5',
      title: 'Nível 5',
      level: 5,
      abstract: 'Guia prático e divertido sobre o uso seguro da internet.',
      externalLink: 'https://www.amazon.com',
      photoUrl: 'src/assets/capas/capa-5.png',
      iconType: '📒'
    },
    {
      id: '6',
      title: 'Nível 6',
      level: 6,
      abstract: 'Uma narrativa densa baseada em inteligência emocional.',
      externalLink: 'https://www.amazon.com',
      photoUrl: 'src/assets/capas/capa-6.png',
      iconType: '📔'
    }
  ];

  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed pt-6 pb-24 px-4 md:px-8 font-['Nunito',sans-serif] overflow-x-hidden selection:bg-blue-200"
      style={{ backgroundImage: 'url(src/assets/jardim.jpeg)' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;600;700;800;900&display=swap');
        .font-fredoka { font-family: 'Fredoka', sans-serif; }
        .cloud-shadow { filter: drop-shadow(0 8px 16px rgba(0,0,0,0.06)); }
        .inner-panel-inset { box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.08); }
      `}</style>

      {/* --- MENU SUPERIOR (HEADER) --- */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-8 relative z-30">
        {/* Logótipo iNTEGRA-TE na Nuvem */}
        <div className="bg-white/95 px-8 py-3 rounded-full shadow-lg border-2 border-white flex items-center justify-center pointer-events-pointer transition-transform hover:scale-102">
          <span className="font-fredoka text-2xl md:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#005bb7] to-[#3b82f6]">
            iNTEGRA-TE
          </span>
        </div>

        {/* Botões Centrais Redondos de Categorias */}
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-2 rounded-full border border-white/40 shadow-sm">
          <button className="w-12 h-12 rounded-full bg-gradient-to-b from-purple-400 to-purple-600 text-white flex items-center justify-center text-xl shadow-md transform hover:scale-110 transition-all">
            📚
          </button>
          <button className="w-12 h-12 rounded-full bg-gradient-to-b from-red-400 to-red-500 text-white flex items-center justify-center text-xl shadow-md transform hover:scale-110 transition-all opacity-80 hover:opacity-100">
            ▶️
          </button>
          <button className="w-12 h-12 rounded-full bg-gradient-to-b from-green-400 to-green-500 text-white flex items-center justify-center text-xl shadow-md transform hover:scale-110 transition-all opacity-80 hover:opacity-100">
            🖼️
          </button>
          <button className="w-12 h-12 rounded-full bg-gradient-to-b from-blue-400 to-blue-500 text-white flex items-center justify-center text-xl shadow-md transform hover:scale-110 transition-all opacity-80 hover:opacity-100">
            ℹ️
          </button>
        </div>

        {/* Barra de Pesquisa e Perfil do Utilizador */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="O que procuras?"
              className="w-full bg-[#005bb7] text-white placeholder-white/80 pl-12 pr-4 py-2.5 rounded-full font-bold text-sm outline-none border-2 border-white/20 focus:border-white shadow-md"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-base">🔍</span>
          </div>

          <div className="bg-[#005bb7] text-white px-5 py-2 rounded-full flex items-center gap-3 border-2 border-white/20 shadow-md">
            <div className="w-7 h-7 bg-orange-400 rounded-full flex items-center justify-center text-sm shadow-inner">🧑‍🦱</div>
            <span className="font-black text-sm tracking-wide">Diogo</span>
          </div>
        </div>
      </header>

      {/* --- CORPO PRINCIPAL DA PÁGINA --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">

        {/* COLUNA ESQUERDA: Menu de Matérias */}
        <aside className="lg:col-span-3 space-y-6 relative">
          <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-6 shadow-xl border-4 border-white cloud-shadow relative z-10">
            <h2 className="font-fredoka text-2xl text-[#005bb7] font-black mb-6 flex items-center justify-center gap-2">
              Matérias <span className="text-amber-400">⭐</span>
            </h2>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setActiveSubject('portugues')}
                className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm transition-all flex items-center justify-between shadow-md border-b-4 ${
                  activeSubject === 'portugues'
                    ? 'bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] text-white border-blue-700'
                    : 'bg-white text-[#005bb7] border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🅰️</span>
                  <span>Português</span>
                </div>
                {activeSubject === 'portugues' && <span className="text-xs">▶</span>}
              </button>

              <button
                onClick={() => setActiveSubject('matematica')}
                className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm transition-all flex items-center justify-between shadow-md border-b-4 ${
                  activeSubject === 'matematica'
                    ? 'bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] text-white border-blue-700'
                    : 'bg-white text-[#005bb7] border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔢</span>
                  <span>Matemática</span>
                </div>
                {activeSubject === 'matematica' && <span className="text-xs">▶</span>}
              </button>

              <button
                onClick={() => setActiveSubject('estudo_meio')}
                className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm transition-all flex items-center justify-between shadow-md border-b-4 ${
                  activeSubject === 'estudo_meio'
                    ? 'bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] text-white border-blue-700'
                    : 'bg-white text-[#005bb7] border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🌍</span>
                  <span>Estudo do Meio</span>
                </div>
                {activeSubject === 'estudo_meio' && <span className="text-xs">▶</span>}
              </button>
            </div>
          </div>

          {/* Ilustração da Pilha de Livros abaixo do menu */}
          <div className="pl-4 pt-2 hidden lg:block drop-shadow-md">
            <div className="relative w-20 flex flex-col items-center">
              <div className="w-16 h-3 bg-red-400 rounded-sm shadow-sm border-b-2 border-red-500"></div>
              <div className="w-18 h-3.5 bg-blue-400 rounded-sm shadow-sm border-b-2 border-blue-500 -mt-1"></div>
              <div className="w-14 h-3 bg-amber-400 rounded-sm shadow-sm border-b-2 border-amber-500 -mt-1"></div>
              <span className="absolute -top-5 text-xl">🍎</span>
            </div>
          </div>

          {/* PERSONAGEM: Rapaz acenando (Sobreposto entre a esquerda e o centro) */}
          <div className="absolute -right-14 -bottom-10 w-40 md:w-48 z-20 pointer-events-none hidden xl:block">
            <img
              src="src/assets/rapaz.jpg"
              alt="Rapaz iNTEGRA-TE"
              className="w-full h-auto object-contain drop-shadow-xl"
            />
          </div>
        </aside>

        {/* COLUNA DIREITA: Grelha de Livros Principal */}
        <section className="lg:col-span-9 relative">
          <div className="bg-[#3483eb] rounded-[3rem] p-6 md:p-10 shadow-2xl border-4 border-white/30 relative z-10 inner-panel-inset">

            {/* Título Interno */}
            <h2 className="font-fredoka text-2xl md:text-3xl text-white font-bold mb-8 tracking-wide">
              {activeSubject === 'portugues' && 'Português - Livros'}
              {activeSubject === 'matematica' && 'Matemática - Recursos'}
              {activeSubject === 'estudo_meio' && 'Estudo do Meio - Atividades'}
            </h2>

            {/* Grelha de Recursos 3x2 igual ao Mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {booksData.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col items-center bg-transparent group text-center"
                >
                  {/* Contentor do Ícone do Livro 3D / Capa Animada */}
                  <div className="w-32 h-36 flex items-center justify-center relative mb-3 transform group-hover:scale-105 group-hover:rotate-2 transition-all">
                    <img
                      src={book.photoUrl}
                      alt={book.title}
                      className="w-full h-full object-contain drop-shadow-md"
                      onError={(e) => {
                        // Fallback decorativo idêntico caso a imagem local ainda não exista
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.className += " bg-white/10 rounded-2xl border-2 border-white/20 shadow-inner";
                        e.currentTarget.parentElement!.innerHTML = `<span class="text-6xl select-none">${book.iconType}</span>`;
                      }}
                    />
                  </div>

                  {/* Rótulo do Nível */}
                  <h3 className="font-fredoka text-lg text-white font-semibold mb-1 tracking-wide">
                    {book.title}
                  </h3>

                  {/* Pequena ligação de referência */}
                  <span className="text-[11px] text-blue-100 font-medium mb-3 opacity-90 block truncate max-w-[180px]">
                    Link para: {book.externalLink.replace('https://', '')}
                  </span>

                  {/* Botão de Acesso Estilo Pill Amarelo/Laranja */}
                  <a
                    href={book.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#ffb800] hover:bg-[#e6a600] text-[#1e3a8a] font-black text-xs px-5 py-2 rounded-full shadow-md border-b-4 border-[#cc9300] active:border-b-0 active:translate-y-[4px] transition-all uppercase tracking-wider"
                  >
                    <span>Amazon</span>
                    <span className="text-[10px]">🛒</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* PERSONAGEM: Rapariga à direita com mochila */}
          <div className="absolute -right-16 top-1/3 w-40 md:w-48 z-20 pointer-events-none hidden xl:block">
            <img
              src="src/assets/image_1aad23.png"
              alt="Rapariga iNTEGRA-TE"
              className="w-full h-auto object-contain drop-shadow-xl"
            />
          </div>
        </section>
      </div>

      {/* --- RODAPÉ INSTITUCIONAL (LOGOS DE COFINANCIAMENTO) --- */}
      <footer className="w-full mt-16 flex justify-center relative z-20">
        <div className="bg-white/95 rounded-full px-8 py-3 shadow-lg border-2 border-white flex flex-wrap items-center justify-center gap-6 md:gap-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 border-r border-gray-200 pr-6 last:border-0">
            <div className="w-8 h-5 bg-blue-800 flex items-center justify-center text-[6px] text-yellow-400 font-bold rounded-sm">EU</div>
            <span className="text-[10px] font-black text-gray-500 leading-tight uppercase">Cofinanciado pela<br/>União Europeia</span>
          </div>
          <div className="text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
            ALGARVE <span className="text-orange-500">2030</span>
          </div>
          <div className="text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600">
            PORTUGAL <span className="text-amber-500">2030</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xl">🏰</div>
            <span className="text-[10px] font-black text-gray-500 leading-tight uppercase">Loulé<br/>concelho</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
