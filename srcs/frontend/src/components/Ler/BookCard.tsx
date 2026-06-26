import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNightMode } from '../core/NightMode';
import type { Livro } from '../../api/contracts/livros';

interface BookCardProps {
  livro: Livro;
  onSelect: (livro: Livro) => void;
  index?: number;
}

export default function BookCard({ livro, onSelect, index = 0 }: BookCardProps) {
  const { isNightMode } = useNightMode();

  return (
    <motion.div
      onClick={() => onSelect(livro)}
      className={`group relative cursor-pointer flex flex-col justify-between items-center rounded-[24px] sm:rounded-[32px] border p-3 sm:p-4 w-full h-auto lg:h-full lg:min-h-0 ${
        isNightMode
          ? 'bg-slate-900 border-slate-800 shadow-xl'
          : 'bg-white border-slate-100 shadow-[0_12px_24px_rgba(0,0,0,0.02)]'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', transition: { duration: 0.2, ease: 'easeOut' } }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`w-full flex-shrink-0 lg:flex-1 h-40 sm:h-44 lg:h-auto lg:min-h-[110px] lg:max-h-[150px] xl:max-h-[160px] rounded-2xl overflow-hidden mb-2 flex items-center justify-center p-3 transition-transform duration-300 group-hover:scale-[1.02] ${isNightMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
        <img
          src={livro.capa_url ?? '/src/assets/blue_book.webp'}
          alt={livro.titulo}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="w-full text-center py-2 px-1">
        <h3
          style={{ color: isNightMode ? '#ffffff' : '#1e293b' }}
          className="font-['Fredoka'] font-bold text-sm sm:text-base xl:text-lg leading-tight line-clamp-2"
        >
          {livro.titulo}
        </h3>
        {livro.autor && (
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium line-clamp-1 mt-0.5">
            {livro.autor}
          </p>
        )}
      </div>

      <div className={`flex flex-col items-center w-full pt-1.5 border-t border-dashed flex-shrink-0 ${isNightMode ? 'border-slate-800/60' : 'border-slate-100'}`}>
        <button
          type="button"
          aria-label={`Ver livro: ${livro.titulo}`}
          className="w-full flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-['Fredoka'] font-bold text-xs shadow-md transition-all duration-200 active:scale-95"
        >
          <span>Ver Livro</span>
          <ArrowRight size={13} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
