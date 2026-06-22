import { Play } from 'lucide-react';
import type { Video } from '../../api/contracts/videos';

function getYoutubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

const SUBJECT_IMG: Record<string, string> = {
  matematica:       '/src/assets/math.webp',
  portugues:        '/src/assets/book3.png',
  'estudo-do-meio': '/src/assets/science.png',
};

interface VideoCardProps {
  video: Video;
  onPlay: (v: Video) => void;
}

export default function VideoCard({ video, onPlay }: VideoCardProps) {
  const src = video.url_externa ?? video.ficheiro_url;

  const thumbnail =
    video.thumbnail_url ||
    (src ? getYoutubeThumbnail(src) : null) ||
    SUBJECT_IMG[video.disciplina_slug] ||
    null;

  return (
    <button
      onClick={() => onPlay(video)}
      className="group text-left flex flex-col rounded-2xl bg-white/20 border border-white/30 backdrop-blur-xs overflow-hidden shadow-[0_4px_16px_rgba(31,38,135,0.15)] hover:bg-white/30 active:scale-[0.98] transition-all h-full"
    >
      {/* Thumbnail — fills remaining card height */}
      <div className="relative w-full flex-1 min-h-0 overflow-hidden bg-black/40">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play size={32} className="text-white/30" aria-hidden="true" />
          </div>
        )}

        {/* Hover play overlay */}
        <span className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl">
            <Play size={20} className="text-[#1e3a8a] ml-0.5" fill="#1e3a8a" aria-hidden="true" />
          </span>
        </span>
      </div>

      {/* Text — fixed height */}
      <div className="shrink-0 px-3 py-2.5 flex flex-col gap-0.5 min-w-0">
        <p className="font-['Fredoka',sans-serif] font-black text-white text-sm leading-tight line-clamp-2">
          {video.titulo}
        </p>
        <p className="text-white/55 text-xs truncate">{video.disciplina_nome} · {video.tema_titulo}</p>
        {video.corpo && (
          <p className="text-white/65 text-xs leading-snug line-clamp-1">{video.corpo}</p>
        )}
      </div>
    </button>
  );
}
