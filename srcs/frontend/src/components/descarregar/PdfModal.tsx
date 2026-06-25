import { createPortal } from 'react-dom';
import { X, Download } from 'lucide-react';
import type { Descarregavel } from '../../api/contracts/descarregar';

interface PdfModalProps {
  item: Descarregavel;
  onClose: () => void;
}

export default function PdfModal({ item, onClose }: PdfModalProps) {
  const href = item.ficheiro_url ?? item.url_externa;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 flex flex-col w-full max-w-4xl h-[90vh] rounded-3xl bg-[#0f1b4c] border border-white/20 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-3 border-b border-white/10">
          <p className="font-['Fredoka',sans-serif] font-black text-white text-lg leading-tight truncate">
            {item.titulo}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {href && (
              <a
                href={href}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white text-[#1e3a8a] font-['Fredoka',sans-serif] font-black text-xs hover:bg-white/90 active:scale-95 transition-all"
              >
                <Download size={13} aria-hidden="true" />
                Descarregar
              </a>
            )}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* PDF viewer */}
        {href ? (
          <iframe
            src={href}
            title={item.titulo}
            className="flex-1 w-full border-0 bg-white"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/50 text-sm">
            Ficheiro não disponível
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
