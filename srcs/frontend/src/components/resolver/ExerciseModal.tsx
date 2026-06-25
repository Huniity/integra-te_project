import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNightMode } from '../core/NightMode';
import type { Exercicio as Exercise } from '../../api/contracts/exercicios';
import { getLevelBadgeClassName } from '../../utils/resolver';

export type { Exercise };

interface ExerciseModalProps {
  exercise: Exercise;
  onClose: () => void;
}

export default function ExerciseModal({ exercise, onClose }: ExerciseModalProps) {
  const { isNightMode } = useNightMode();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div onClick={onClose} className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex w-full max-w-2xl flex-col rounded-2xl p-6 shadow-2xl border ${
          isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className={`absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer ${
            isNightMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className={`pr-8 mb-4 border-b pb-3 flex flex-wrap items-center gap-3 ${isNightMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <h2 className={`font-['Fredoka'] text-xl sm:text-2xl font-bold leading-tight ${isNightMode ? 'text-white' : 'text-slate-900'}`}>
            {exercise.title}
          </h2>
          <span className={`px-2.5 py-0.5 rounded-full uppercase text-[9px] font-black tracking-wide ${getLevelBadgeClassName(exercise.level)}`}>
            Nível {exercise.level}
          </span>
        </div>

        <div className="w-full">
          {(exercise.ficheiro_url ?? exercise.pdfUrl) ? (
            <iframe
              src={exercise.ficheiro_url ?? exercise.pdfUrl!}
              title={exercise.title}
              className={`w-full rounded-xl border ${isNightMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}
              style={{ height: 'min(520px, 65vh)' }}
            />
          ) : (
            <div className={`p-6 rounded-xl border ${isNightMode ? 'bg-slate-950 border-slate-800/60' : 'bg-slate-50 border-slate-100'}`}>
              <p className={`text-sm font-medium leading-relaxed ${isNightMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {exercise.description ?? 'Sem descrição disponível para este exercício.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
