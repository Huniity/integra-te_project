import { ArrowRight } from 'lucide-react';
import { useNightMode } from '../core/NightMode';
import type { Exercise } from '../resolver/ExerciseModal';
import { getLevelBadgeClassName } from '../../utils/resolver';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
}

export default function ExerciseCard({ exercise, onSelect }: ExerciseCardProps) {
  const { isNightMode } = useNightMode();

  return (
    <div
      onClick={() => onSelect(exercise)}
      className={`
        group relative cursor-pointer
        flex flex-col justify-between
        rounded-[32px] border p-5 w-full
        /* Força o formato perfeitamente vertical */
        min-h-[390px]
        transition-all duration-300 hover:-translate-y-2
        ${isNightMode
          ? 'bg-slate-900 border-slate-800 shadow-xl'
          : 'bg-white border-slate-100 shadow-[0_16px_32px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_48px_rgba(0,0,0,0.07)]'
        }
      `}
    >

      <div className={`
        w-full h-48 rounded-2xl overflow-hidden mb-4 flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-[1.02]
        ${isNightMode ? 'bg-slate-950/40' : 'bg-slate-50'}
      `}>
        {exercise.iconImg ? (
          <img
            src={exercise.iconImg}
            alt={exercise.title}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center opacity-30">
            <span className="text-xs font-bold font-['Fredoka']">Sem imagem</span>
          </div>
        )}
      </div>


      <div className="flex flex-col gap-1 w-full text-center mb-4 flex-1 justify-start">
        <span className="font-['Fredoka'] font-black text-[10px] tracking-wider uppercase text-blue-600 dark:text-blue-400">
          {exercise.subjectId === 'estudo-do-meio' || exercise.subjectId === 'estudomeio'
            ? 'Estudo do Meio'
            : exercise.subjectId}
        </span>
        <h3
          style={{ color: isNightMode ? '#ffffff' : '#1e293b' }}
          className="font-['Fredoka'] font-bold text-lg leading-tight line-clamp-2 px-1"
        >
          {exercise.title}
        </h3>
      </div>
      <div className="flex flex-col items-center gap-3 w-full pt-4 border-t border-dashed border-slate-100 dark:border-slate-800/60">
        <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide ${getLevelBadgeClassName(exercise.level)}`}>
          Nível {exercise.level}
        </span>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-['Fredoka'] font-bold text-xs shadow-md transition-all duration-200 active:scale-95"
        >
          <span>Praticar</span>
          <ArrowRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
