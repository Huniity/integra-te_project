import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText, Play, ExternalLink } from 'lucide-react';
import { getLevelBadgeClassName } from '../../utils/aprender';
import type { Aula } from '../../api/contracts/aulas';

// Função para converter links normais do YouTube/Vimeo em formato Embed funcional
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
  const embedUrl = aula.videoUrl ? toEmbedUrl(aula.videoUrl) : null;
  const hasVideo = !!embedUrl || !!aula.videoUrl;
  const hasPdf = !!aula.ficheiro_url;
  const hasBoth = hasVideo && hasPdf;

  // Estado da aba ativa
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
        className="relative flex w-full max-w-2xl flex-col rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800"
      >
        {/* Botão Fechar de Canto Superior (Igual ao ExerciseModal) */}
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

        {/* Cabeçalho do Modal: Título legível e nível (Estrutura idêntica ao ExerciseModal) */}
        <div className="pr-8 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-wrap items-center gap-3">
          <h2 className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {aula.title}
          </h2>
          <span className={`px-2.5 py-0.5 rounded-full uppercase text-[9px] font-black tracking-wide ${getLevelBadgeClassName(aula.level)}`}>
            Nível {aula.level}
          </span>
        </div>

        {/* Descrição opcional inserida suavemente antes do player */}
        {aula.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4 text-left">
            {aula.description}
          </p>
        )}

        {/* Abas Alternadas de Média (Apenas renderiza se existirem os dois conteúdos) */}
        {hasBoth && (
          <div className="flex w-full max-w-xs mb-4 rounded-xl p-1 gap-1 border bg-slate-50 dark:bg-slate-950/40 border-slate-200/40 dark:border-white/[0.05]">
            <button
              onClick={() => setTab('video')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                tab === 'video' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Play size={12} fill={tab === 'video' ? 'currentColor' : 'none'} />
              Vídeo
            </button>
            <button
              onClick={() => setTab('pdf')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                tab === 'pdf' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <FileText size={12} />
              PDF
            </button>
          </div>
        )}

        {/* Área Multimédia do Conteúdo */}
        <div className="w-full">
          {/* Aba de Vídeo Ativa */}
          {hasVideo && (!hasBoth || tab === 'video') && (
            embedUrl ? (
              <div className="w-full rounded-xl overflow-hidden aspect-video bg-black shadow-md border border-slate-200 dark:border-white/5">
                <iframe
                  src={embedUrl}
                  title={aula.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/60 flex flex-col items-center justify-center">
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

          {/* Aba de PDF Ativa */}
          {hasPdf && (!hasBoth || tab === 'pdf') && pdfSrc && (
            <div className="w-full flex flex-col gap-3">
              <iframe
                src={pdfSrc}
                title={`PDF — ${aula.title}`}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50"
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

          {/* Caso não exista absolutamente nenhum ficheiro nem vídeo associado */}
          {!hasVideo && !hasPdf && (
            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-center">
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
