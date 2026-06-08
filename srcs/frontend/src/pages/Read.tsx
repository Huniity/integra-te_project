import { useState } from 'react';

interface Book {
  id: string;
  title: string;
  abstract: string;
  minAge: number;
  maxAge: number;
  externalLink: string;
  photoUrl: string;
}

export default function Learn() {
  const [activeAgeFilter, setActiveAgeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;
  const booksData: Book[] = [
    {
      id: '1',
      title: 'O Principezinho na Caravana',
      abstract: 'Uma aventura mágica adaptada sobre a inclusão social e novas amizades no concelho de Loulé.',
      minAge: 4,
      maxAge: 6,
      externalLink: 'https://www.amazon.com',
      photoUrl: '/assets/capas/capa-1.png'
    },
    {
      id: '2',
      title: 'Matemática dos Super Heróis',
      abstract: 'Desafios numéricos lúdicos para os mais novos treinarem a lógica enquanto exploram o Algarve.',
      minAge: 4,
      maxAge: 6,
      photoUrl: '/assets/capas/capa-2.png'
    },
    {
      id: '3',
      title: 'Histórias Ocultas da Minha Escola',
      abstract: 'Contos interativos contra o absentismo que mostram a importância da comunidade escolar.',
      minAge: 6,
      maxAge: 9,
      photoUrl: '/assets/capas/capa-3.png'
    },
    {
      id: '4',
      title: 'Descobridores do Futuro',
      abstract: 'Livro focado na igualdade de oportunidades e na diversidade cultural nas salas de aula.',
      minAge: 6,
      maxAge: 9,
      photoUrl: '/assets/capas/capa-4.png'
    },
    {
      id: '5',
      title: 'Cidadãos Digitais Integrados',
      abstract: 'Guia prático e divertido sobre o uso seguro da internet, redes sociais e ferramentas digitais.',
      minAge: 9,
      maxAge: 12,
      photoUrl: '/assets/capas/capa-5.png'
    },
    {
      id: '6',
      title: 'A Jornada da Inclusão Coletiva',
      abstract: 'Uma narrativa densa baseada em inteligência emocional e no impacto do projeto iNTEGRA-TE.',
      minAge: 9,
      maxAge: 12,
      photoUrl: '/assets/capas/capa-6.png'
    }
  ];

  const filteredBooks = booksData.filter(book => {
    if (activeAgeFilter === 'all') return true;
    if (activeAgeFilter === '4-6') return book.minAge === 4 && book.maxAge === 6;
    if (activeAgeFilter === '6-9') return book.minAge === 6 && book.maxAge === 9;
    if (activeAgeFilter === '9-12') return book.minAge === 9 && book.maxAge === 12;
    return true;
  });

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

  const handleFilterChange = (filter: string) => {
    setActiveAgeFilter(filter);
    setCurrentPage(1);
  };

  return (
    <main className="relative overflow-hidden bg-[#c8e8ff] font-['Nunito',sans-serif] min-h-screen pb-16">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&family=Fredoka+One&display=swap');

        @keyframes cloudDrift {
          0%   { transform: translateX(-200px); }
          100% { transform: translateX(110vw); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cloud-bg { animation: cloudDrift 45s linear infinite; }
        .animate-fadeIn { animation: fadeIn 0.4s ease out both; }
        .text-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <div className="cloud-bg absolute top-16 opacity-40">
          <svg width="220" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="56" rx="90" ry="28" fill="white" />
            <ellipse cx="70"  cy="44" rx="44" ry="36" fill="white" />
          </svg>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 pt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mt-6">
          <div className="md:col-span-4 space-y-4">
            <div className="bg-[#2c5ca3] text-white font-['Fredoka_One',cursive] text-2xl px-8 py-4 rounded-2xl shadow-md tracking-wide text-center">
              Livros
            </div>

            <div className="flex flex-col gap-3">
              {[
                { id: 'all', label: 'Todos os Livros' },
                { id: '4-6', label: 'Entre as 4 anos 6' },
                { id: '6-9', label: 'Entre as 6 anos 9' },
                { id: '9-12', label: 'Entre as 9 anos 12' }
              ].map(btn => (
                <button
                  key={btn.id}
                  onClick={() => handleFilterChange(btn.id)}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-sm transition-all transform active:scale-98 text-left shadow-sm border-b-4
                    ${activeAgeFilter === btn.id
                      ? 'bg-[#3b82f6] text-white border-[#1d4ed8] translate-y-[2px]'
                      : 'bg-white hover:bg-gray-50 text-[#1e3a8a] border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>



          <div className="md:col-span-8 bg-[#4a7ec9] rounded-[2.5rem] p-6 md:p-8 shadow-xl border-4 border-white/20 min-h-[560px] flex flex-col justify-between">
            <div className="space-y-6">
              {currentBooks.length > 0 ? (
                currentBooks.map(book => (
                  <a
                    key={book.id}
                    href={book.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="animate-fadeIn block bg-[#2c5ca3]/95 hover:bg-[#204a88] border-2 border-white/10 hover:border-white/30 rounded-3xl p-5 transition-all transform hover:-translate-y-1 shadow-lg group relative"
                  >

                    <div className="absolute top-4 right-4 text-[10px] font-black bg-white/20 text-white px-3 py-1 rounded-full uppercase tracking-wider">
                      {book.minAge}-{book.maxAge} Anos
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">


                      <div className="w-full sm:w-28 h-40 sm:h-28 flex-shrink-0 bg-white/10 rounded-2xl shadow-inner border border-white/10 overflow-hidden flex items-center justify-center">
                        <img
                          src={book.photoUrl}
                          alt={`Capa do livro: ${book.title}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.insertAdjacentHTML('afterbegin', '<span class="text-3xl">📚</span>');
                          }}
                        />
                      </div>



                      <div className="min-w-0 flex-1 space-y-1">
                        <h3 className="font-bold text-white text-lg md:text-xl group-hover:text-amber-300 transition-colors pr-20">
                          {book.title}
                        </h3>
                        <p className="text-clamp text-blue-100 text-sm mt-2 leading-relaxed">
                          {book.abstract}
                        </p>
                      </div>


                      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center group-hover:bg-amber-400 group-hover:text-[#1e3a8a] transition-all transform group-hover:scale-105">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </div>

                    </div>
                  </a>
                ))
              ) : (
                <div className="text-center py-20 text-blue-100 font-bold bg-white/10 rounded-2xl">
                  Nenhum recurso didático encontrado nesta faixa etária.
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 pt-5 border-t border-white/10">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Anterior
                </button>
                <span className="text-xs font-bold text-white px-4">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Seguinte
                </button>
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
