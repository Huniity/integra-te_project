import { Play, FileText, ArrowRight } from 'lucide-react';
import { useNightMode } from '../core/NightMode';
import type { Aula } from '../../api/contracts/aulas';
import { getLevelBadgeClassName } from '../../utils/aprender';

interface AprenderCardProps {
  aula: Aula;
  onSelect: (aula: Aula) => void;
}

function getVideoThumbnail(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/ids\/|album\/(\d+)\/video\/|(\d+))(\/[a-zA-Z0-9]+)?/);
  if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[1])) {
    const id = vimeoMatch[3] || vimeoMatch[1];
    return `https://vumbnail.com/${id}.jpg`;
  }

  return null;
}

export default function AprenderCard({ aula, onSelect }: AprenderCardProps) {
  const { isNightMode } = useNightMode();
  const videoThumbnail = aula.videoUrl ? getVideoThumbnail(aula.videoUrl) : null;

  const getCardStyle = () => {
    if (aula.videoUrl) {
      return {
        bgGradient: isNightMode ? 'from-blue-950/40 to-slate-900/60' : 'from-blue-50 to-indigo-50/60',
        decorColor: 'rgba(59, 130, 246, 0.05)'
      };
    }
    return {
      bgGradient: isNightMode ? 'from-emerald-950/40 to-slate-900/60' : 'from-emerald-50 to-teal-50/60',
      decorColor: 'rgba(16, 185, 129, 0.05)'
    };
  };

  const style = getCardStyle();

  return (
    <div
      onClick={() => onSelect(aula)}
      className={`group relative flex flex-col rounded-[28px] border p-5 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden justify-between
        ${isNightMode
          ? 'bg-slate-900/90 border-white/[0.08] shadow-[0_15px_30px_rgba(0,0,0,0.3)]'
          : 'bg-white border-slate-200/60 shadow-[0_12px_24px_rgba(31,38,135,0.04)] hover:shadow-[0_20px_40px_rgba(31,38,135,0.08)]'
        }`}
    >
      {/* 1. Bloco Superior: Título corrigido para preto no dia e branco na noite */}
      <div className="w-full flex flex-col mb-4">
        <h3
          style={{ color: isNightMode ? '#ffffff' : '#000000' }}
          className="font-['Fredoka',sans-serif] font-black text-xl mb-2"
        >
          {aula.title}
        </h3>

        {aula.description ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
            {aula.description}
          </p>
        ) : (
          <div className="h-4" />
        )}
      </div>

      {/* 2. Bloco Inferior: Área da Imagem com menos zoom */}
      <div className={`relative w-full aspect-[16/9] rounded-[20px] overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br ${style.bgGradient} border border-slate-100/70 dark:border-white/[0.04]`}>

        {videoThumbnail ? (
          /* Zoom reduzido para scale-[1.06] para mostrar mais da imagem original */
          <img
            src={videoThumbnail}
            alt={`Capa de ${aula.title}`}
            className="absolute inset-0 w-full h-full object-cover scale-[1.06] transition-transform duration-500 group-hover:scale-[1.12]"
          />
        ) : (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="50%" r="25%" fill="none" stroke={style.decorColor} strokeWidth="2" />
            <circle cx="50%" cy="50%" r="45%" fill="none" stroke={style.decorColor} strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>
        )}

        {videoThumbnail && <div className="absolute inset-0 bg-black/10 dark:bg-black/20 pointer-events-none" />}

        {/* Botão Central */}
        <div className="z-10 px-5 py-2.5 rounded-full font-['Fredoka',sans-serif] font-bold text-xs text-white bg-blue-600 group-hover:bg-blue-700 shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105">
          <span>Aprender</span>
          {aula.videoUrl ? (
            <Play size={12} fill="currentColor" strokeWidth={0} />
          ) : (
            <FileText size={12} />
          )}
          <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
        </div>

        {/* Badge Lateral */}
        <span className={`absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full uppercase text-[8px] font-black tracking-wider shadow-md ${getLevelBadgeClassName(aula.level)}`}>
          Nível {aula.level}
        </span>
      </div>
    </div>
  );
}
