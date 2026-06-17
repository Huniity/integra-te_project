import { useEffect } from 'react';
import { getLevelBadgeClassName } from '../../utils/resolver';

export interface Exercise {
  id: number;
  title: string;
  level: number;
  subjectId: string;
  titleColor: string;
  iconImg: string;
  path: string;
  description?: string;
  pdfUrl?: string;
}

interface ExerciseModalProps {
  exercise: Exercise;
  onClose: () => void;
}

export default function ExerciseModal({ exercise, onClose }: ExerciseModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative flex w-full max-w-md max-h-[85vh] flex-col items-center overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="w-20 h-20 flex items-center justify-center my-1 shrink-0">
          <img
            src={exercise.iconImg}
            alt={exercise.title}
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>

        <p className={`font-['Fredoka',sans-serif] text-xl font-semibold text-center mb-2 leading-tight ${exercise.titleColor}`}>
          {exercise.title}
        </p>

        <span className={`mb-4 px-3 py-0.5 rounded-full uppercase text-[10px] font-extrabold tracking-[0.05em] ${getLevelBadgeClassName(exercise.level)}`}>
          Nível {exercise.level}
        </span>

        {exercise.pdfUrl ? (
          <iframe
            src={exercise.pdfUrl}
            title={exercise.title}
            className="h-80 w-full rounded-xl border border-gray-200"
          />
        ) : (
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            {exercise.description ?? 'Sem descrição disponível para este exercício.'}
          </p>
        )}
      </div>
    </div>
  );
}
