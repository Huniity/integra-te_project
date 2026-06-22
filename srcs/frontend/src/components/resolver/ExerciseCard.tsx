import { getLevelBadgeClassName } from '../../utils/resolver';
import type { Exercise } from '../resolver/ExerciseModal';

const SUBJECT_IMG: Record<string, string> = {
  matematica:       './src/assets/math.webp',
  portugues:        './src/assets/book3.png',
  'estudo-do-meio': './src/assets/science.png',
};

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
}

export default function ExerciseCard({ exercise, onSelect }: ExerciseCardProps) {
  return (
    <div className="rounded-2xl min-h-[210px] bg-white border border-gray-100 flex flex-col items-center p-3 group hover:-translate-y-1 transition-transform duration-200">
      <p className={`font-['Fredoka',sans-serif] text-lg font-semibold text-center mb-1.5 leading-tight ${exercise.titleColor}`}>
        {exercise.title}
      </p>

      <div className="w-24 h-24 flex items-center justify-center my-1">
        <img
          src={exercise.thumbnailUrl || exercise.iconImg || SUBJECT_IMG[exercise.subjectId] || './src/assets/math.webp'}
          alt={exercise.title}
          className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-200"
          onError={(e) => { (e.target as HTMLImageElement).src = SUBJECT_IMG[exercise.subjectId] || './src/assets/math.webp'; }}
        />
      </div>

      <span className={`-mt-2 mb-2.5 px-3 py-0.5 rounded-full uppercase relative z-10 text-[10px] font-extrabold tracking-[0.05em] ${getLevelBadgeClassName(exercise.level)}`}>
        Nível {exercise.level}
      </span>

      <button
        onClick={() => onSelect(exercise)}
        className="w-2/3 text-white font-extrabold text-xs py-1.5 rounded-full flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-br from-blue-600 to-blue-700 shadow-[0_4px_12px_rgba(37,99,235,0.4)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(37,99,235,0.5)] active:translate-y-0"
      >
        Começar
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    </div>
  );
}
