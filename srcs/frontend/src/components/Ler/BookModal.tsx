import { createPortal } from 'react-dom';
import type { Livro } from '../../api/contracts/livros';

interface BookModalProps {
  book: Livro;
  onClose: () => void;
}

export default function BookModal({ book, onClose }: BookModalProps) {
  return createPortal(
    <div onClick={onClose} className="fixed inset-0 z-[9999] overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center px-4 py-8">
        <div onClick={(e) => e.stopPropagation()} className="relative flex w-full max-w-sm flex-col items-center rounded-3xl bg-white p-6 shadow-2xl">
          <button type="button" onClick={onClose}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="w-28 h-36 flex items-center justify-center my-2">
            <img src={book.capa_url ?? './src/assets/blue_book.webp'} alt={book.titulo}
              className="w-full h-full object-contain drop-shadow-md" />
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
            <a href={book.ficheiro_url} target="_blank" rel="noopener noreferrer"
              className="w-full text-center text-white font-extrabold text-sm py-3 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer">
              Começar Leitura
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
