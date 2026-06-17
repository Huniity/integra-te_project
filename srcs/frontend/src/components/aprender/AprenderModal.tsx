import { useEffect } from 'react';
import { getLevelBadgeClassName } from '../../utils/aprender';
import type { Aula } from '../../api/contracts/aprender';

interface AprenderModalProps {
  aula: Aula;
  onClose: () => void;
}

export default function AprenderModal({ aula, onClose }: AprenderModalProps) {
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

        {aula.thumbnail_url && (
          <div className="w-full mb-3 shrink-0">
            <img
              src={aula.thumbnail_url}
              alt={aula.title}
              className="w-full rounded-xl object-cover max-h-40"
            />
          </div>
        )}

        <p className="font-['Fredoka',sans-serif] text-xl font-semibold text-center mb-2 leading-tight text-blue-700">
          {aula.title}
        </p>

        <span className={`mb-4 px-3 py-0.5 rounded-full uppercase text-[10px] font-extrabold tracking-[0.05em] ${getLevelBadgeClassName(aula.level)}`}>
          Nível {aula.level}
        </span>

        <p className="text-sm text-gray-600 text-center leading-relaxed">
          {aula.description ?? 'Sem descrição disponível para esta aula.'}
        </p>
      </div>
    </div>
  );
}
