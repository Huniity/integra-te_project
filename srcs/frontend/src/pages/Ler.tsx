import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!id || livros.length === 0) return;
    setSelectedBook(livros.find((livro) => livro.id === id) ?? null);
  }, [id, livros]);

  const closeBook = () => {
    setSelectedBook(null);
    if (id) navigate('/ler', { replace: true });
  };

  const filteredBooks = livros.filter(
    (livro) => activeSubject === 'todos' || livro.faixa_etaria === activeSubject,
  );

  const carousel = useCarousel(filteredBooks, { mobile: 2, tablet: 4, desktop: 6 });

  return (
    <main className="relative min-h-screen lg:h-screen w-full px-3 md:px-5 py-2 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto lg:overflow-y-hidden flex flex-col">

      {/* Decorative elements */}
      <motion.img src="/src/assets/bush.webp" alt="" aria-hidden="true"
        initial={{ y: 60 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`pointer-events-none fixed bottom-[-1%] left-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <motion.img src="/src/assets/bush_night.webp" alt="" aria-hidden="true"
        initial={{ y: 60 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`pointer-events-none fixed bottom-[-1%] left-[-3%] z-2 w-28 sm:w-36 md:w-44 lg:w-70 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <motion.img src="/src/assets/bush2.webp" alt="" aria-hidden="true"
        initial={{ y: 60 }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}
        className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <motion.img src="/src/assets/bush2_night.webp" alt="" aria-hidden="true"
        initial={{ y: 60 }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}
        className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-62 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <motion.img src="/src/assets/books.webp" alt="" aria-hidden="true"
        initial={{ y: 60 }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className={`pointer-events-none fixed bottom-[2%] left-[3%] z-1 w-28 sm:w-36 md:w-44 lg:w-46 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <motion.img src="/src/assets/books_night.webp" alt="" aria-hidden="true"
        initial={{ y: 60 }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className={`pointer-events-none fixed bottom-[2%] left-[3%] z-1 w-28 sm:w-36 md:w-44 lg:w-46 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <motion.img src="/src/assets/rainbow.webp" alt="" aria-hidden="true"
        initial={{ y: -40, rotate: 10, scale: 0.9 }} animate={{ y: 0, rotate: 24, scale: 1 }} transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className={`pointer-events-none fixed top-[14%] left-[-5%] z-1 w-28 sm:w-36 md:w-44 lg:w-100 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <NightModeBackground dayImage="/src/assets/bg_day.webp" nightImage="/src/assets/bg_night.webp" />

      <div className="max-w-[95%] w-full mx-auto flex flex-col lg:flex-row gap-3 lg:gap-20 relative z-10 mt-16 sm:mt-20 lg:mt-24 xl:mt-30 pb-2 flex-1 min-h-0">
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
                className="h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch"
                onTouchStart={carousel.onTouchStart}
                onTouchEnd={carousel.onTouchEnd}
              >
                {carousel.pageItems.map((livro, i) => (
                  <BookCard key={livro.id} livro={livro} onSelect={setSelectedBook} index={i} />
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

      {selectedBook && <BookModal book={selectedBook} onClose={closeBook} />}
    </main>
  );
}
