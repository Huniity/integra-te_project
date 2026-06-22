import type { Livro } from '../../api/contracts/livros';

interface BookCardProps {
  livro: Livro;
  onSelect: (livro: Livro) => void;
}

export default function BookCard({ livro, onSelect }: BookCardProps) {
  return (
    <div className="rounded-2xl min-h-[220px] bg-white border border-gray-100 flex flex-col items-center justify-between p-3 group hover:-translate-y-1 transition-transform duration-200 shadow-sm">
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
            src="/src/assets/blue_book.webp"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain drop-shadow-md opacity-80"
          />
        )}
      </div>

      <button
        onClick={() => onSelect(livro)}
        className="w-full sm:w-5/6 text-white font-extrabold text-xs py-1.5 rounded-full flex items-center justify-center gap-1.5 cursor-pointer bg-gradient-to-br from-blue-600 to-blue-700 shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)] active:translate-y-0"
      >
        Ver Livro
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    </div>
  );
}
