import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen } from 'lucide-react';
import { useNightMode } from '../core/NightMode';
import type { Livro } from '../../api/contracts/livros';

interface BookModalProps {
  book: Livro;
  onClose: () => void;
}

export default function BookModal({ book, onClose }: BookModalProps) {
  const { isNightMode } = useNightMode();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div onClick={onClose} className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-md flex-col items-center rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800"
      >
        {/* Botão Fechar de Canto Superior */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* Capa do Livro em Destaque */}
        <div className="w-28 h-36 flex items-center justify-center my-3 flex-shrink-0">
          <img
            src={book.capa_url ?? './src/assets/blue_book.webp'}
            alt={book.titulo}
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>

        {/* Cabeçalho de Texto */}
        <div className="w-full text-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {book.titulo}
          </h2>
          {book.autor && (
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1">
              por {book.autor}
            </p>
          )}
        </div>

        {/* Resumo do Livro */}
        <div className="w-full mb-6 max-h-[160px] overflow-y-auto px-1">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-center">
            {book.resumo ?? 'Este livro não tem um resumo disponível.'}
          </p>
        </div>

        {/* Ação de Leitura */}
        {book.ficheiro_url && (
          <a
            href={book.ficheiro_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 text-center text-white font-extrabold text-sm py-3 rounded-full bg-blue-600 hover:bg-blue-700 shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <BookOpen size={16} />
            <span>Começar Leitura</span>
          </a>
        )}
      </div>
    </div>,
    document.body,
  );
}
