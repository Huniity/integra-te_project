import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Exercicio as Exercise } from '../../api/contracts/exercicios';
import { getLevelBadgeClassName } from '../../utils/resolver';

export type { Exercise };

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

  return createPortal(
    <div onClick={onClose} className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-2xl flex-col rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800"
      >
        {/* Botão Fechar de Canto Superior */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* Cabeçalho do Modal: Nome bem legível e nível */}
        <div className="pr-8 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-wrap items-center gap-3">
          <h2 className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {exercise.title}
          </h2>
          <span className={`px-2.5 py-0.5 rounded-full uppercase text-[9px] font-black tracking-wide ${getLevelBadgeClassName(exercise.level)}`}>
            Nível {exercise.level}
          </span>
        </div>

        {/* Área do Conteúdo: Sem distrações */}
        <div className="w-full">
          {(exercise.ficheiro_url ?? exercise.pdfUrl) ? (
            <iframe
              src={exercise.ficheiro_url ?? exercise.pdfUrl!}
              title={exercise.title}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50"
              style={{ height: 'min(520px, 65vh)' }}
            />
          ) : (
            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
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
