import { ArrowRight } from 'lucide-react';
import { useNightMode } from '../core/NightMode';
import type { Aula } from '../../api/contracts/aulas';
import { getLevelBadgeClassName } from '../../utils/aprender';

interface AprenderCardProps {
  aula: Aula;
  onSelect: (aula: Aula) => void;
}

export default function AprenderCard({ aula, onSelect }: AprenderCardProps) {
  const { isNightMode } = useNightMode();

  return (
    <div
      onClick={() => onSelect(aula)}
      className={`
        group relative cursor-pointer
        flex flex-col justify-between items-center
        rounded-[24px] sm:rounded-[32px] border p-4 sm:p-5 w-full
        /* Mantém as alturas exatas do ExerciseCard para não quebrar os botões */
        h-auto lg:h-full lg:min-h-0
        transition-all duration-300 hover:-translate-y-1.5
        ${isNightMode
          ? 'bg-slate-900 border-slate-800 shadow-xl'
          : 'bg-white border-slate-100 shadow-[0_12px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]'
        }
      `}
    >
      {/* 🖼️ Área da Imagem Adaptável (Mapeada para thumbnailUrl) */}
      <div className={`
        w-[70%] flex-shrink-0 lg:flex-1 h-36 sm:h-44 lg:h-auto lg:min-h-[130px] lg:max-h-[150px] xl:max-h-[180px] rounded-2xl overflow-hidden mb-3 sm:mb-4 flex items-center justify-center p-3 transition-transform duration-300 group-hover:scale-[1.02]
        ${isNightMode ? 'bg-black-700' : 'bg-white'}
      `}>
        {aula.thumbnailUrl ? (
          <img
            src={aula.thumbnailUrl}
            alt={aula.title}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center opacity-30">
            <span className="text-xs font-bold font-['Fredoka']">Sem imagem</span>
          </div>
        )}
      </div>

      {/* 📝 Bloco Central do Título */}
      <div className="flex flex-col items-center justify-center gap-1 w-full text-center mb-4 flex-grow px-1">
        <h3
          style={{ color: isNightMode ? '#ffffff' : '#1e293b' }}
          className="font-['Fredoka'] font-bold text-sm sm:text-base xl:text-lg leading-tight line-clamp-2"
        >
          {aula.title}
        </h3>
      </div>

      {/* 🔘 Rodapé Robusto (Nível + Botão "Aprender" fixo na base) */}
      <div className="flex flex-col items-center gap-2.5 sm:gap-2 w-full pt-3 sm:pt-2 border-t border-dashed border-slate-100 dark:border-slate-800/60 flex-shrink-0">
        <span className={`px-3 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wide ${getLevelBadgeClassName(aula.level)}`}>
          Nível {aula.level}
        </span>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 px-5 py-2 sm:py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-['Fredoka'] font-bold text-xs shadow-md transition-all duration-200 active:scale-95"
        >
          <span>Aprender</span>
          <ArrowRight size={13} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
