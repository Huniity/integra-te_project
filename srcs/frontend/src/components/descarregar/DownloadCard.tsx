import { motion } from 'framer-motion'
import { Download, Eye, FileText } from 'lucide-react';
import { useNightMode } from '../core/NightMode';
import type { Descarregavel } from '../../api/contracts/descarregar';

interface DownloadCardProps {
  item: Descarregavel;
  onView: (item: Descarregavel) => void;
  index?: number;
}

export default function DownloadCard({ item, onView, index = 0 }: DownloadCardProps) {
  const { isNightMode } = useNightMode();
  const href = item.ficheiro_url ?? item.url_externa;

  return (
    <motion.div
      onClick={() => onView(item)}
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
        {item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt={item.titulo} className="w-full h-full object-contain" />
        ) : (
          <FileText size={40} className={isNightMode ? 'text-slate-600' : 'text-slate-300'} aria-hidden="true" />
        )}
      </div>

      <div className="w-full text-center py-2 px-1">
        <h3
          style={{ color: isNightMode ? '#ffffff' : '#1e293b' }}
          className="font-['Fredoka'] font-bold text-sm sm:text-base xl:text-lg leading-tight line-clamp-2"
        >
          {item.titulo}
        </h3>
        <p className={`text-xs mt-0.5 ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {item.disciplina_nome}{item.tema_titulo ? ` · ${item.tema_titulo}` : ''}
        </p>
      </div>

      <div className={`flex items-center gap-2 w-full pt-1.5 border-t border-dashed flex-shrink-0 ${isNightMode ? 'border-slate-800/60' : 'border-slate-100'}`}>
        {href ? (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onView(item); }}
              aria-label={`Ver: ${item.titulo}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-['Fredoka'] font-bold text-xs transition-all duration-200 active:scale-95"
            >
              <Eye size={13} aria-hidden="true" />
              Ver
            </button>
            <a
              href={href}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Descarregar: ${item.titulo}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-['Fredoka'] font-bold text-xs shadow-md transition-all duration-200 active:scale-95"
            >
              <Download size={13} aria-hidden="true" />
              Descarregar
            </a>
          </>
        ) : (
          <span className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full font-['Fredoka'] font-bold text-xs cursor-not-allowed ${isNightMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
            <Download size={13} aria-hidden="true" />
            Indisponível
          </span>
        )}
      </div>
    </motion.div>
  );
}
