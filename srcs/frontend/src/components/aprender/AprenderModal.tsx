import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText, Play, X, ExternalLink } from 'lucide-react';
import { getLevelBadgeClassName } from '../../utils/aprender';
import { useNightMode } from '../core/NightMode';
import type { Aula } from '../../api/contracts/aulas';

function toEmbedUrl(url: string): string | null {
  if (url.includes('youtube.com/watch')) return url.replace('watch?v=', 'embed/');
  if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'www.youtube.com/embed/');
  if (url.includes('vimeo.com/')) return url.replace('vimeo.com/', 'player.vimeo.com/video/');
  return null;
}

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
      className="fixed inset-0 z-[9999] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex w-full ${hasMedia ? 'max-w-4xl' : 'max-w-md'} flex-col items-center rounded-[24px] p-6 border transition-all animate-in zoom-in-95 duration-200
          ${isNightMode
            ? 'bg-slate-900 border-white/[0.08] text-white shadow-2xl'
            : 'bg-white border-slate-100 text-slate-900 shadow-2xl'
          }`}
      >
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border transition-colors cursor-pointer
            ${isNightMode
              ? 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
              : 'bg-slate-50 border-slate-200/60 text-slate-400 hover:text-slate-700'
            }`}
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* Título Principal */}
        <div className="w-full pr-8 mb-3">
          <h2 className="font-['Fredoka',sans-serif] text-2xl font-black text-blue-600 dark:text-blue-400 mb-1 leading-tight">
            {aula.title}
          </h2>
          <span className={`inline-block px-2.5 py-0.5 rounded-full uppercase text-[9px] font-black tracking-wider shadow-xs ${getLevelBadgeClassName(aula.level)}`}>
            Nível {aula.level}
          </span>
        </div>

        {/* Descrição em Destaque no Modal */}
        {aula.description && (
          <p className={`text-sm md:text-base leading-relaxed mb-5 w-full text-left font-medium ${isNightMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {aula.description}
          </p>
        )}

        {/* Abas Alternadas (Se houver Vídeo + PDF) */}
        {hasBoth && (
          <div className={`flex w-full max-w-xs mb-5 rounded-xl p-1 gap-1 border ${isNightMode ? 'bg-slate-950/40 border-white/[0.05]' : 'bg-slate-50 border-slate-200/40'}`}>
            <button
              onClick={() => setTab('video')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                tab === 'video' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Play size={12} fill={tab === 'video' ? 'currentColor' : 'none'} />
              Vídeo
            </button>
            <button
              onClick={() => setTab('pdf')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                tab === 'pdf' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <FileText size={12} />
              PDF
            </button>
          </div>
        )}

        {/* Reprodutor de Vídeo */}
        {hasVideo && (!hasBoth || tab === 'video') && (
          embedUrl ? (
            <div className="w-full rounded-xl overflow-hidden aspect-video bg-black shadow-md border border-white/5">
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
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Play size={14} fill="currentColor" /> Abrir Vídeo Externo <ExternalLink size={12} />
            </a>
          )
        )}

        {/* Reprodutor de PDF */}
        {hasPdf && (!hasBoth || tab === 'pdf') && pdfSrc && (
          <div className="w-full flex flex-col gap-3">
            <div className="w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5">
              <iframe
                src={pdfSrc}
                title={`PDF — ${aula.title}`}
                className="w-full border-0 opacity-90"
                style={{ height: 'min(460px, 48vh)' }}
              />
            </div>
            <a
              href={pdfSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <FileText size={14} />
              Abrir PDF Completo <ExternalLink size={12} />
            </a>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
