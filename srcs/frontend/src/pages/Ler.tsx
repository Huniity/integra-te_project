import { useState, useEffect } from 'react';
import { NightModeBackground, useNightMode } from '../components/core/NightMode';
import Aside from '../components/core/Aside';
import type { SubjectId } from '../components/core/Aside';
import MainContent from '../components/core/MainContent';
import { useCarousel, CarouselNav } from '../components/core/Carousel';
import BookCard from '../components/Ler/BookCard';
import BookModal from '../components/Ler/BookModal';
import Footer from '../components/core/Footer';
import { livrosApi } from '../services/api/livros.api';
import type { Livro } from '../api/contracts/livros';
import { ageSubjects } from '../utils/ler';

export default function Read() {
  return <ReadContent />;
}

function ReadContent() {
  const { isNightMode } = useNightMode();
  const [activeSubject, setActiveSubject] = useState<SubjectId | string>('todos');
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔒 Bloqueia o scroll do ecrã de forma idêntica ao ecrã Aprender
  useEffect(() => {
    const handleResize = () => {
      const isDesktopFull = window.innerWidth >= 1280;
      const existingTag = document.getElementById("anti-scroll-global-style");

      if (isDesktopFull && !existingTag) {
        const styleTag = document.createElement("style");
        styleTag.id = "anti-scroll-global-style";
        styleTag.innerHTML = `
          html, body, #root, main, .grid-esconde-scroll {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            overflow: hidden !important;
          }
          html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar, main::-webkit-scrollbar {
            display: none !important;
            width: 0 !important; height: 0 !important;
          }
        `;
        document.head.appendChild(styleTag);
      } else if (!isDesktopFull && existingTag) {
        existingTag.remove();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      const existingTag = document.getElementById("anti-scroll-global-style");
      if (existingTag) existingTag.remove();
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setLivros(await livrosApi.getLivros());
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredBooks = livros.filter(
    (livro) => activeSubject === 'todos' || livro.faixa_etaria === activeSubject,
  );

  const carousel = useCarousel(filteredBooks, { mobile: 2, tablet: 4, desktop: 6 });

  return (
    <main className="relative min-h-screen lg:h-screen w-full px-3 md:px-5 py-2 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto lg:overflow-y-hidden flex flex-col">
      {/* Decorative Elements */}
      <img src="./src/assets/bush.webp" alt="" aria-hidden="true" className={`pointer-events-none fixed bottom-[-1%] left-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="./src/assets/bush_night.webp" alt="" aria-hidden="true" className={`pointer-events-none fixed bottom-[-1%] left-[-3%] z-2 w-28 sm:w-36 md:w-44 lg:w-70 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="./src/assets/bush2.webp" alt="" aria-hidden="true" className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="./src/assets/bush2_night.webp" alt="" aria-hidden="true" className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="./src/assets/books.webp" alt="" aria-hidden="true" className={`pointer-events-none fixed bottom-[2%] left-[3%] z-1 w-28 sm:w-36 md:w-44 lg:w-46 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="./src/assets/books_night.webp" alt="" aria-hidden="true" className={`pointer-events-none fixed bottom-[2%] left-[3%] z-1 w-28 sm:w-36 md:w-44 lg:w-46 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="./src/assets/rainbow.webp" alt="" aria-hidden="true" className={`pointer-events-none fixed top-[14%] left-[-5%] z-1 w-28 sm:w-36 md:w-44 lg:w-100 object-contain rotate-24 transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <NightModeBackground dayImage="./src/assets/content2.webp" nightImage="./src/assets/noite.webp" />

      {/* Body: Sidebar + Main com margens originais idênticas ao Aprender */}
      <div className="max-w-[95%] w-full mx-auto flex flex-col lg:flex-row gap-3 lg:gap-20 relative z-10 mt-16 sm:mt-20 lg:mt-24 xl:mt-30 pb-2 flex-1 min-h-0">
        <Aside subjects={ageSubjects} activeSubject={activeSubject} onSelectSubject={setActiveSubject} title="Idades" />

        <div className="flex-1 min-h-0 flex flex-col gap-2">
          {/* 🎯 CORREÇÃO: Passamos os handlers vazios (ou nulos simulados) para forçar o MainContent a manter a mesma altura de cabeçalho do Aprender */}
          <MainContent
            title="Livros Disponíveis!"
            fillContent={true}
            activeFilter="todos"
            selectedLevel="todos"
            onSelectAll={() => {}}
            onSelectLevel={() => {}}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
                  <p className="text-gray-500 font-semibold">Carregando exercícios...</p>
                </div>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400 text-lg font-semibold">Nenhum livro disponível</p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:grid-rows-2 gap-5 xl:gap-8 items-stretch h-auto xl:h-full w-full xl:overflow-hidden grid-esconde-scroll"
                onTouchStart={carousel.onTouchStart}
                onTouchEnd={carousel.onTouchEnd}
              >
                {carousel.pageItems.map((livro) => (
                  <BookCard key={livro.id} livro={livro} onSelect={setSelectedBook} />
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

      {selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
      <Footer />
    </main>
  );
}
