import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Video } from '../../api/contracts/videos';

interface VideoModalProps {
  video: Video;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const src = video.url_externa ?? video.ficheiro_url;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const isEmbed = src && (
    src.includes('youtube.com') ||
    src.includes('youtu.be') ||
    src.includes('vimeo.com')
  );

  const embedSrc = src
    ? src
        .replace('watch?v=', 'embed/')
        .replace('youtu.be/', 'www.youtube.com/embed/')
    : null;

  return createPortal(
    <div onClick={onClose} className="fixed inset-0 z-[9999] overflow-y-auto bg-black/70 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-3xl rounded-3xl bg-blue-900/80 border border-white/20 shadow-2xl overflow-hidden"
        >
          {isEmbed && embedSrc ? (
            <div className="aspect-video w-full">
              <iframe
                src={embedSrc}
                title={video.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : src ? (
            <div className="aspect-video w-full bg-black">
              <video src={src} controls className="w-full h-full" />
            </div>
          ) : (
            <div className="aspect-video w-full flex items-center justify-center bg-black/40">
              <p className="text-white/60 font-semibold">Vídeo indisponível</p>
            </div>
          )}

          <div className="px-5 py-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-['Fredoka',sans-serif] font-black text-xl text-white leading-tight">
                {video.titulo}
              </h2>
              <p className="text-white/60 text-sm mt-0.5">{video.disciplina_nome} · {video.tema_titulo}</p>
              {video.corpo && (
                <p className="text-white/75 text-sm mt-2 leading-snug">{video.corpo}</p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors text-lg font-black"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
