import { useState, useEffect } from 'react';
import { NightModeBackground, NightModeProvider, NightModeToggle, useNightMode } from '../components/core/NightMode';
import Aside from '../components/core/Aside';
import type { SubjectId } from '../components/core/Aside';
import MainContent from '../components/core/MainContent';
import { useCarousel, CarouselNav } from '../components/core/Carousel';
import DownloadCard from '../components/descarregar/DownloadCard';
import PdfModal from '../components/descarregar/PdfModal';
import { subjects } from '../utils/descarregar';
import { descarregarApi } from '../services/api/descarregar.api';
import { aulasApi } from '../services/api/aulas.api';
import { exerciciosApi } from '../services/api/exercicios.api';
import { livrosApi } from '../services/api/livros.api';
import type { Descarregavel } from '../api/contracts/descarregar';
import type { Aula } from '../api/contracts/aulas';
import type { Exercicio } from '../api/contracts/exercicios';
import type { Livro } from '../api/contracts/livros';
import Footer from '../components/core/Footer';

const SUBJECT_LABEL: Record<string, string> = {
  matematica:       'Matemática',
  portugues:        'Português',
  'estudo-do-meio': 'Estudo do Meio',
};

const SUBJECT_IMG: Record<string, string> = {
  matematica:       './src/assets/math.webp',
  portugues:        './src/assets/book3.png',
  'estudo-do-meio': './src/assets/science.png',
};

function aulaToDescarregavel(a: Aula): Descarregavel {
  return {
    id:              `aula-${a.id}`,
    titulo:          a.title,
    tipo:            'pdf',
    corpo:           a.description,
    ficheiro_url:    a.ficheiro_url,
    url_externa:     undefined,
    thumbnail_url:   a.thumbnailUrl ?? SUBJECT_IMG[a.subjectId],
    disciplina_slug: a.subjectId,
    disciplina_nome: SUBJECT_LABEL[a.subjectId] ?? a.subjectId,
    tema_titulo:     `Aula · Nível ${a.level}`,
    descarregavel:   true,
    publicado:       a.publicado,
    criado_em:       a.createdAt ?? '',
  };
}

function exercicioToDescarregavel(e: Exercicio): Descarregavel {
  return {
    id:              `exercicio-${e.id}`,
    titulo:          e.title,
    tipo:            'pdf',
    corpo:           e.description,
    ficheiro_url:    e.ficheiro_url,
    url_externa:     undefined,
    thumbnail_url:   e.thumbnailUrl ?? SUBJECT_IMG[e.subjectId],
    disciplina_slug: e.subjectId,
    disciplina_nome: SUBJECT_LABEL[e.subjectId] ?? e.subjectId,
    tema_titulo:     `Exercício · Nível ${e.level}`,
    descarregavel:   true,
    publicado:       e.publicado,
    criado_em:       '',
  };
}

function livroToDescarregavel(l: Livro): Descarregavel {
  return {
    id:              `livro-${l.id}`,
    titulo:          l.titulo,
    tipo:            'pdf',
    corpo:           l.resumo,
    ficheiro_url:    l.ficheiro_url,
    url_externa:     undefined,
    thumbnail_url:   l.capa_url,
    disciplina_slug: '',
    disciplina_nome: 'Livro',
    tema_titulo:     l.faixa_etaria ? `${l.faixa_etaria} anos` : '',
    descarregavel:   true,
    publicado:       l.publicado,
    criado_em:       l.criado_em,
  };
}

export default function Descarregar() {
  return (
    <NightModeProvider>
      <DescarregarContent />
    </NightModeProvider>
  );
}

function DescarregarContent() {
  const { isNightMode } = useNightMode();
  const [activeSubject, setActiveSubject] = useState<SubjectId | string>('todos');
  const [items, setItems] = useState<Descarregavel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Descarregavel | null>(null);

  const filtered = items.filter(
    (item) => activeSubject === 'todos' || item.disciplina_slug === activeSubject,
  );

  const carousel = useCarousel(filtered, { desktop: 9 });

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [dashboardPdfs, aulas, exercicios, livros] = await Promise.all([
          descarregarApi.getDescarregaveis(),
          aulasApi.getAulas(),
          exerciciosApi.getExercicios(),
          livrosApi.getLivros(),
        ]);

        const fromAulas = aulas
          .filter((a) => a.publicado && a.ficheiro_url)
          .map(aulaToDescarregavel);

        const fromExercicios = exercicios
          .filter((e) => e.publicado && e.ficheiro_url)
          .map(exercicioToDescarregavel);

        const fromLivros = livros
          .filter((l) => l.publicado && l.ficheiro_url)
          .map(livroToDescarregavel);

        const fromDashboard = dashboardPdfs.filter((d) => d.publicado);

        setItems([...fromDashboard, ...fromAulas, ...fromExercicios, ...fromLivros]);
      } catch (error) {
        console.error('Erro ao carregar ficheiros:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="relative min-h-screen lg:h-screen w-full px-3 md:px-5 py-2 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto lg:overflow-y-hidden flex flex-col">
      <img src="./src/assets/bush.png" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-9%] left-[-5%] z-2 w-28 sm:w-36 md:w-44 lg:w-52 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="./src/assets/bush_night.png" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-9%] left-[-5%] z-2 w-28 sm:w-36 md:w-44 lg:w-52 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="./src/assets/bush2.png" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-9%] right-[-4%] z-2 w-28 sm:w-36 md:w-44 lg:w-52 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="./src/assets/bush2_night.png" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-9%] right-[-4%] z-2 w-28 sm:w-36 md:w-44 lg:w-52 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="./src/assets/books.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[0%] left-[0%] z-1 w-28 sm:w-36 md:w-44 lg:w-36 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="./src/assets/books_night.png" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[0%] left-[0%] z-1 w-28 sm:w-36 md:w-44 lg:w-36 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="./src/assets/rainbow.png" alt="" aria-hidden="true"
        className={`pointer-events-none fixed top-[14%] left-[-5%] z-1 w-28 sm:w-36 md:w-44 lg:w-100 object-contain rotate-24 transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <NightModeBackground dayImage="./src/assets/content2.png" nightImage="./src/assets/noite.png" />

      <div className="max-w-[95%] w-full mx-auto flex flex-col lg:flex-row gap-3 lg:gap-20 relative z-10 mt-30 pb-2 flex-1 min-h-0">
        <Aside subjects={subjects} activeSubject={activeSubject} onSelectSubject={setActiveSubject} />

        <div className="flex-1 min-h-0 flex flex-col gap-2">
          <MainContent title="Descarregar!" fillContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
                  <p className="text-white/80 font-semibold">A carregar ficheiros…</p>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/60 text-lg font-semibold">Nenhum ficheiro disponível</p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:flex-1 sm:min-h-0 sm:grid-cols-3 sm:grid-rows-3 gap-2"
                onTouchStart={carousel.onTouchStart}
                onTouchEnd={carousel.onTouchEnd}
              >
                {carousel.pageItems.map((item) => (
                  <DownloadCard key={item.id} item={item} onView={setSelected} />
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

      {selected && <PdfModal item={selected} onClose={() => setSelected(null)} />}
      <NightModeToggle />
      <Footer />
    </main>
  );
}
