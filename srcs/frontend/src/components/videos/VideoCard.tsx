import { Play } from 'lucide-react';
import type { Video } from '../../api/contracts/videos';

interface VideoCardProps {
  video: Video;
  onPlay: (v: Video) => void;
}

export default function VideoCard({ video, onPlay }: VideoCardProps) {
  const src = video.url_externa ?? video.ficheiro_url;

  return (
    <button
      onClick={() => onPlay(video)}
      className="group text-left flex flex-col gap-2 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-xs overflow-hidden shadow-[0_4px_16px_rgba(31,38,135,0.15)] hover:bg-white/25 active:scale-[0.98] transition-all"
    >
      <div className="relative w-full aspect-video bg-black/30 overflow-hidden">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play size={40} className="text-white/50" aria-hidden="true" />
          </div>
        )}
        {src && (
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <Play size={24} className="text-[#1e3a8a] ml-1" aria-hidden="true" />
            </span>
          </span>
        )}
      </div>

      <div className="px-3 pb-3 flex flex-col gap-1">
        <p className="font-['Fredoka',sans-serif] font-black text-white text-base leading-tight line-clamp-2">
          {video.titulo}
        </p>
        <p className="text-white/60 text-xs">{video.disciplina_nome} · {video.tema_titulo}</p>
        {video.corpo && (
          <p className="text-white/70 text-sm leading-snug line-clamp-2 mt-0.5">{video.corpo}</p>
        )}
      </div>
    </button>
  );
}
