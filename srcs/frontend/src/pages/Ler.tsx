import { useState, useEffect } from 'react';
import { NightModeBackground, NightModeProvider, NightModeToggle, useNightMode } from '../components/core/NightMode';
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
  return (
    <NightModeProvider>
      <ReadContent />
    </NightModeProvider>
  );
}

function ReadContent() {
  const { isNightMode } = useNightMode();
  const [activeSubject, setActiveSubject] = useState<SubjectId | string>('todos');
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [isLoading, setIsLoading] = useState(true);


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

  const carousel = useCarousel(filteredBooks);

  return (
    <main className="relative min-h-screen lg:h-screen w-full px-3 md:px-5 py-2 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto lg:overflow-y-hidden flex flex-col">

      {/* Decorative elements */}
      <img src="./src/assets/bush.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] left-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="./src/assets/bush_night.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] left-[-3%] z-2 w-28 sm:w-36 md:w-44 lg:w-70 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="./src/assets/bush2.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="./src/assets/bush2_night.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="./src/assets/books.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[2%] left-[3%] z-1 w-28 sm:w-36 md:w-44 lg:w-46 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="./src/assets/books_night.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[2%] left-[3%] z-1 w-28 sm:w-36 md:w-44 lg:w-46 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="./src/assets/rainbow.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed top-[14%] left-[-5%] z-1 w-28 sm:w-36 md:w-44 lg:w-100 object-contain rotate-24 transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <NightModeBackground dayImage="./src/assets/content2.webp" nightImage="./src/assets/noite.webp" />

      <div className="max-w-[95%] w-full mx-auto flex flex-col lg:flex-row gap-3 lg:gap-20 relative z-10 mt-30 pb-2 flex-1 min-h-0">
        <Aside subjects={ageSubjects} activeSubject={activeSubject} onSelectSubject={setActiveSubject} title="Idades" />

        <div className="flex-1 min-h-0 flex flex-col gap-2">
          <MainContent title="Livros Disponíveis!">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
                  <p className="text-white/80 font-semibold">A carregar livros…</p>
                </div>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-white/90 font-semibold">Nenhum livro disponível para esta faixa etária.</p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-stretch"
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
      <NightModeToggle />
      <Footer />
    </main>
  );
}

interface BookModalProps {
  book: Livro;
  onClose: () => void;
}

function BookModal({ book, onClose }: BookModalProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-sm flex-col items-center rounded-3xl bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="w-28 h-36 flex items-center justify-center my-2">
          <img
            src={book.capa_url ?? './src/assets/blue_book.webp'}
            alt={book.titulo}
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>

        <h3 className="font-['Fredoka',sans-serif] text-2xl font-black text-center text-blue-600 mb-1 mt-2">
          {book.titulo}
        </h3>

        {book.autor && (
          <p className="text-xs text-gray-400 font-semibold text-center mb-2">{book.autor}</p>
        )}

        {book.resumo && (
          <p className="text-sm text-gray-500 font-medium text-center leading-relaxed mb-6 px-4">
            {book.resumo}
          </p>
        )}

        {book.ficheiro_url && (
          <a
            href={book.ficheiro_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center text-white font-extrabold text-sm py-3 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            Começar Leitura
          </a>
        )}
      </div>
    </div>
  );
}
