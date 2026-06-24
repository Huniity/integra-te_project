import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText, Play, ExternalLink } from 'lucide-react';
import { useNightMode } from '../core/NightMode';
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
  const { isNightMode } = useNightMode();
  const embedUrl = aula.videoUrl ? toEmbedUrl(aula.videoUrl) : null;
  const hasVideo = !!embedUrl || !!aula.videoUrl;
  const hasPdf = !!aula.ficheiro_url;
  const hasBoth = hasVideo && hasPdf;

  const [tab, setTab] = useState<'video' | 'pdf'>(hasVideo ? 'video' : 'pdf');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const pdfSrc = aula.ficheiro_url ? toProxiedPath(aula.ficheiro_url) : null;

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
            {aula.title}
          </h2>
          <span className={`px-2.5 py-0.5 rounded-full uppercase text-[9px] font-black tracking-wide ${getLevelBadgeClassName(aula.level)}`}>
            Nível {aula.level}
          </span>
        </div>

        {aula.description && (
          <p className={`text-sm font-medium leading-relaxed mb-4 text-left ${isNightMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {aula.description}
          </p>
        )}

        {hasBoth && (
          <div className={`flex w-full max-w-xs mb-4 rounded-xl p-1 gap-1 border ${isNightMode ? 'bg-slate-950/40 border-white/5' : 'bg-slate-50 border-slate-200/40'}`}>
            <button
              onClick={() => setTab('video')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                tab === 'video'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isNightMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Play size={12} fill={tab === 'video' ? 'currentColor' : 'none'} />
              Vídeo
            </button>
            <button
              onClick={() => setTab('pdf')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                tab === 'pdf'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isNightMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <FileText size={12} />
              PDF
            </button>
          </div>
        )}

        <div className="w-full">
          {hasVideo && (!hasBoth || tab === 'video') && (
            embedUrl ? (
              <div className={`w-full rounded-xl overflow-hidden aspect-video bg-black shadow-md border ${isNightMode ? 'border-white/5' : 'border-slate-200'}`}>
                <iframe
                  src={embedUrl}
                  title={aula.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div className={`p-6 rounded-xl border flex flex-col items-center justify-center ${isNightMode ? 'bg-slate-950 border-slate-800/60' : 'bg-slate-50 border-slate-100'}`}>
                <a
                  href={aula.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Play size={14} fill="currentColor" /> Assistir a Vídeo Externo <ExternalLink size={12} />
                </a>
              </div>
            )
          )}

          {hasPdf && (!hasBoth || tab === 'pdf') && pdfSrc && (
            <div className="w-full flex flex-col gap-3">
              <iframe
                src={pdfSrc}
                title={`PDF — ${aula.title}`}
                className={`w-full rounded-xl border ${isNightMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}
                style={{ height: 'min(460px, 50vh)' }}
              />
              <a
                href={pdfSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors self-end"
              >
                <FileText size={14} />
                Abrir PDF noutra janela <ExternalLink size={12} />
              </a>
            </div>
          )}

          {!hasVideo && !hasPdf && (
            <div className={`p-6 rounded-xl border ${isNightMode ? 'bg-slate-950 border-slate-800/60' : 'bg-slate-50 border-slate-100'}`}>
              <p className={`text-sm font-medium leading-relaxed text-center ${isNightMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Esta aula não possui material audiovisual disponível de momento.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
