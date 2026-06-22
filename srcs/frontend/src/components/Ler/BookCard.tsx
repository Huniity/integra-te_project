import { ArrowRight } from 'lucide-react';
import { useNightMode } from '../core/NightMode';
import type { Livro } from '../../api/contracts/livros';

interface BookCardProps {
  livro: Livro;
  onSelect: (livro: Livro) => void;
}

export default function BookCard({ livro, onSelect }: BookCardProps) {
  const { isNightMode } = useNightMode();

  return (
    <div
      onClick={() => onSelect(livro)}
      className={`
        group relative cursor-pointer
        flex flex-col justify-between items-center
        rounded-[24px] sm:rounded-[32px] border p-4 sm:p-5 w-full
        h-auto lg:h-full lg:min-h-0
        transition-all duration-300 hover:-translate-y-1.5
        ${isNightMode
          ? 'bg-slate-900 border-slate-800 shadow-xl'
          : 'bg-white border-slate-100 shadow-[0_12px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]'
        }
      `}
    >
      <div className={`
        w-[75%] flex-shrink-0 lg:flex-1 h-32 sm:h-36 lg:h-auto lg:max-h-[120px] xl:max-h-[140px] rounded-2xl  mb-2 flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-[1.10]
        ${isNightMode ? 'bg-black-700' : 'bg-white'}
      `}>
        <img
          src={livro.capa_url ?? './src/assets/blue_book.webp'}
          alt={livro.titulo}
          className="w-full h-full object-contain"
        />
      </div>

      {/* 📝 Título e Autor compactados */}
      <div className="flex flex-col items-center justify-center gap-0.5 w-full text-center mb-2 flex-grow px-1">
        <h3
          style={{ color: isNightMode ? '#ffffff' : '#1e293b' }}
          className="font-['Fredoka'] font-bold text-sm sm:text-base leading-tight line-clamp-2"
        >
          {livro.titulo}
        </h3>
        {livro.autor && (
          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-1">
            {livro.autor}
          </p>
        )}
      </div>
      <div className="flex flex-col items-center w-full pt-2.5 border-t border-dashed mt-4 border-slate-100 dark:border-slate-800/60 flex-shrink-0">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 px-5 py-2 sm:py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-['Fredoka'] font-bold text-xs shadow-md transition-all duration-200 active:scale-95"
        >
          <span>Ver Livro</span>
          <ArrowRight size={13} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
