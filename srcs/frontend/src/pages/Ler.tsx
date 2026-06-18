import { useState, useEffect } from 'react';
import { NightModeBackground, NightModeProvider, NightModeToggle, useNightMode } from '../components/core/NightMode';
import Footer from '../components/core/Footer';
import { livrosApi } from '../services/api/livros.api';
import type { Livro } from '../api/contracts/livros';

export type AgeFilterId = 'todos' | '4-6' | '6-9' | '9-12';

export interface AgeSubject {
  id: AgeFilterId;
  label: string;
  iconImg: string;
}

export default function Read() {
  return (
    <NightModeProvider>
      <ReadContent />
    </NightModeProvider>
  );
}

function ReadContent() {
  const { isNightMode } = useNightMode();

  const [activeSubject, setActiveSubject] = useState<AgeFilterId>('todos');
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ageSubjects: AgeSubject[] = [
    { id: 'todos', label: 'Todos os Livros', iconImg: './src/assets/star.png' },
    { id: '4-6', label: 'Entre os 4 e 6 anos', iconImg: './src/assets/star.png' },
    { id: '6-9', label: 'Entre os 6 e 9 anos', iconImg: './src/assets/star.png' },
    { id: '9-12', label: 'Entre os 9 e 12 anos', iconImg: './src/assets/star.png' },
  ];

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

  return (
    <main className="relative min-h-screen lg:h-screen w-full px-3 md:px-5 py-2 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto lg:overflow-y-hidden flex flex-col">

      {/* Elementos de Interface do Fundo */}
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

      {/* Layout Principal Dividido */}
      <div className="max-w-[95%] w-full mx-auto flex flex-col lg:flex-row gap-3 lg:gap-20 relative z-10 mt-40 mb-20 pb-2 flex-1 min-h-0">

        <AsideLer subjects={ageSubjects} activeSubject={activeSubject} onSelectSubject={setActiveSubject} />

        <MainContentLer title="Livros Disponíveis">
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
            <div className="grid grid-cols-2 min-[640px]:grid-cols-3 gap-3 sm:gap-4 items-stretch rounded-2xl relative z-10">
              {filteredBooks.map((livro) => (
                <div
                  key={livro.id}
                  className="rounded-2xl min-h-[220px] bg-white border border-gray-100 flex flex-col items-center justify-between p-3 group hover:-translate-y-1 transition-transform duration-200 shadow-sm"
                >
                  <p className="font-['Fredoka',sans-serif] text-base md:text-lg font-semibold text-center mb-1 leading-tight text-blue-600">
                    {livro.titulo}
                  </p>

                  <div className="w-24 h-24 flex items-center justify-center my-1 transform group-hover:scale-105 transition-transform duration-200">
                    {livro.capa_url ? (
                      <img
                        src={livro.capa_url}
                        alt={livro.titulo}
                        className="w-full h-full object-contain drop-shadow-md"
                      />
                    ) : (
                      <img
                        src="./src/assets/blue_book.webp"
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-contain drop-shadow-md opacity-80"
                      />
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedBook(livro)}
                    className="w-full sm:w-5/6 text-white font-extrabold text-xs py-1.5 rounded-full flex items-center justify-center gap-1.5 cursor-pointer bg-gradient-to-br from-blue-600 to-blue-700 shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)] active:translate-y-0"
                  >
                    Ver Livro
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </MainContentLer>
      </div>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}

      <NightModeToggle />
      <Footer />
    </main>
  );
}

interface AsideLerProps {
  subjects: AgeSubject[];
  activeSubject: AgeFilterId;
  onSelectSubject: (id: AgeFilterId) => void;
}

// Alterado o nome da função interna para evitar colisões de exportação
function AsideLer({ subjects, activeSubject, onSelectSubject }: AsideLerProps) {
  return (
    <>
      {/* Mobile + Tablet */}
      <section className="lg:hidden bg-white/90 rounded-2xl p-2.5 shadow-lg border border-white/60 backdrop-blur-sm w-full">
        <h2 className="font-['Fredoka',sans-serif] text-sm font-black text-[#1e3a8a] mb-2 flex items-center justify-center gap-1 text-center">
          Idades
        </h2>
        <div className="flex flex-wrap justify-center gap-1.5 pb-1 overflow-x-hidden">
          {subjects.map((subj) => (
            <button
              key={`mobile-${subj.id}`}
              onClick={() => onSelectSubject(subj.id)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer border-2 shadow-[0_4px_12px_rgba(15,23,42,0.08)] max-w-full ${
                activeSubject === subj.id
                  ? 'border-transparent bg-gradient-to-br from-blue-700 to-blue-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)]'
                  : 'bg-gray-50 text-[#1e3a8a] border-transparent hover:bg-blue-50 hover:border-blue-200'
              }`}
            >
              <span className="font-extrabold">{subj.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Desktop - Ajustado com a nuvem de fundo esticada e títulos posicionados */}
      <aside className="hidden lg:flex flex-col justify-center items-center h-full w-64 shrink-0 relative z-20">
        <div className="relative w-full h-[320px] flex items-center justify-center">
          <img
            src="./src/assets/cloud_menu.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[135%] w-[150%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-95"
          />
          <div className="relative z-10 w-[85%] px-2 pt-2 pb-4">
            <h2 className="justify-center font-['Fredoka',sans-serif] text-2xl font-black text-[#005bb7] mb-4 flex items-center gap-1">
              Idades
            </h2>
            <div className="flex flex-col gap-1.5">
              {subjects.map((subj) => (
                <button
                  key={subj.id}
                  onClick={() => onSelectSubject(subj.id)}
                  className={`w-full flex items-center justify-center text-center px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer border-2 shadow-sm ${
                    activeSubject === subj.id
                      ? 'border-transparent bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-[0_3px_10px_rgba(37,99,235,0.3)]'
                      : 'bg-white/40 text-[#1e3a8a] border-transparent hover:bg-blue-50/60 hover:border-blue-200'
                  }`}
                >
                  <span className="font-['Fredoka',sans-serif] font-black tracking-wide">{subj.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

    </>
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

interface MainContentLerProps {
  title: string;
  children: React.ReactNode;
}

function MainContentLer({ title, children }: MainContentLerProps) {
  return (
    <div className="flex-1 min-h-0 bg-blue-600/30 backdrop-blur-xs rounded-3xl shadow-[0_18px_45px_rgba(31,38,135,0.28)] border border-white/30 ring-1 ring-white/20 overflow-hidden flex flex-col">
      <div className="relative px-5 pt-4 pb-3 flex flex-col items-center sm:flex-row sm:items-center justify-between gap-2 overflow-visible">
        <img
          src="./src/assets/stars.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-50] top-1/2 h-[100%] w-2/3 -translate-y-2/3 mx-auto object-contain"
        />
        <div className="relative z-10 flex items-center gap-3">
          <h1
            className="font-['Fredoka',sans-serif] text-3xl font-black text-white"
            style={{
              textShadow:
                '-1px 0 #2563eb, 0 1px #2563eb, 1px 0 #2563eb, 0 -1px #2563eb, 1px 1px #2563eb, -1px -1px #2563eb',
            }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Espaço interno para os livros com scroll interno isolado da aplicação */}
      <div className="flex-1 min-h-0 px-5 py-4 overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  );
}
