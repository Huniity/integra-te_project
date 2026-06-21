import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText, Play } from 'lucide-react';
import { getLevelBadgeClassName } from '../../utils/aprender';
import type { Aula } from '../../api/contracts/aulas';

function toEmbedUrl(url: string): string | null {
    if (url.includes('youtube.com/watch')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'www.youtube.com/embed/');
    if (url.includes('vimeo.com/')) return url.replace('vimeo.com/', 'player.vimeo.com/video/');
    return null;
}

// Django builds absolute URLs using the Docker-internal host (backend:8000).
// Strip to path only so Vite's /media proxy can serve it to the browser.
function toProxiedPath(url: string): string {
    try { return new URL(url).pathname; } catch { return url; }
}

interface AprenderModalProps {
  aula: Aula;
  onClose: () => void;
}

export default function AprenderModal({ aula, onClose }: AprenderModalProps) {
  const embedUrl = aula.videoUrl ? toEmbedUrl(aula.videoUrl) : null;
  const hasVideo = !!embedUrl || !!aula.videoUrl;
  const hasPdf = !!aula.ficheiro_url;
  const hasBoth = hasVideo && hasPdf;
  const hasMedia = hasVideo || hasPdf;

  const [tab, setTab] = useState<'video' | 'pdf'>(hasVideo ? 'video' : 'pdf');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const pdfSrc = aula.ficheiro_url ? toProxiedPath(aula.ficheiro_url) : null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/40 backdrop-blur-sm"
    >
      <div className="flex min-h-full items-center justify-center px-4 py-8">
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative flex w-full ${hasMedia ? 'max-w-4xl' : 'max-w-md'} flex-col items-center rounded-3xl bg-white p-6 shadow-2xl`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <p className="font-['Fredoka',sans-serif] text-xl font-semibold text-center mb-2 leading-tight text-blue-700 pr-8">
            {aula.title}
          </p>

          <span className={`mb-4 px-3 py-0.5 rounded-full uppercase text-[10px] font-extrabold tracking-[0.05em] ${getLevelBadgeClassName(aula.level)}`}>
            Nível {aula.level}
          </span>

          {aula.description && (
            <p className="text-sm text-gray-500 text-center leading-relaxed mb-4">
              {aula.description}
            </p>
          )}

          {/* Tabs — only shown when both video and PDF exist */}
          {hasBoth && (
            <div className="flex w-full mb-4 rounded-xl bg-gray-100 p-1 gap-1">
              <button
                onClick={() => setTab('video')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-all cursor-pointer ${
                  tab === 'video'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Play size={14} />
                Vídeo
              </button>
              <button
                onClick={() => setTab('pdf')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-all cursor-pointer ${
                  tab === 'pdf'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText size={14} />
                PDF
              </button>
            </div>
          )}

          {/* Video panel */}
          {hasVideo && (!hasBoth || tab === 'video') && (
            embedUrl ? (
              <div className="w-full rounded-xl overflow-hidden aspect-video bg-black">
                <iframe
                  src={embedUrl}
                  title={aula.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <a
                href={aula.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Play size={14} /> Ver Vídeo
              </a>
            )
          )}

          {/* PDF panel */}
          {hasPdf && (!hasBoth || tab === 'pdf') && pdfSrc && (
            <div className="w-full flex flex-col gap-2">
              <iframe
                src={pdfSrc}
                title={`PDF — ${aula.title}`}
                className="w-full rounded-xl border border-gray-100"
                style={{ height: 'min(640px, 60vh)' }}
              />
              <a
                href={pdfSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-50 px-5 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100 transition-colors"
              >
                <FileText size={14} />
                Abrir PDF em nova aba
              </a>
            </div>
          )}

          {!hasMedia && (
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              Sem descrição disponível para esta aula.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
