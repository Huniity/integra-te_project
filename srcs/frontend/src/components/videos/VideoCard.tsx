import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useNightMode } from '../core/NightMode';
import type { Video } from '../../api/contracts/videos';

function getYoutubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

const SUBJECT_IMG: Record<string, string> = {
  matematica:       '/src/assets/math.webp',
  portugues:        '/src/assets/book3.webp',
  'estudo-do-meio': '/src/assets/science.webp',
};

interface VideoCardProps {
  video: Video;
  onPlay: (v: Video) => void;
  index?: number;
}

export default function VideoCard({ video, onPlay, index = 0 }: VideoCardProps) {
  const { isNightMode } = useNightMode();
  const src = video.url_externa ?? video.ficheiro_url;
  const thumbnail =
    video.thumbnail_url ||
    (src ? getYoutubeThumbnail(src) : null) ||
    SUBJECT_IMG[video.disciplina_slug] ||
    null;

  return (
    <motion.div
      onClick={() => onPlay(video)}
      className={`group relative cursor-pointer flex flex-col justify-between items-center rounded-[24px] sm:rounded-[32px] border p-3 sm:p-4 w-full h-auto lg:h-full lg:min-h-0 ${
        isNightMode
          ? 'bg-slate-900 border-slate-800 shadow-xl'
          : 'bg-white border-slate-100 shadow-[0_12px_24px_rgba(0,0,0,0.02)]'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', transition: { duration: 0.2, ease: 'easeOut' } }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`relative w-full flex-shrink-0 lg:flex-1 h-40 sm:h-44 lg:h-auto lg:min-h-[110px] lg:max-h-[150px] xl:max-h-[160px] rounded-2xl overflow-hidden mb-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02] ${isNightMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
        {thumbnail ? (
          <img src={thumbnail} alt={video.titulo} className="w-full h-full object-cover" />
        ) : (
          <Play size={40} className={isNightMode ? 'text-slate-600' : 'text-slate-300'} aria-hidden="true" />
        )}
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
            <Play size={20} className="text-[#1e3a8a] ml-1" aria-hidden="true" />
          </span>
        </span>
      </div>

      <div className="w-full text-center py-2 px-1">
        <h3
          style={{ color: isNightMode ? '#ffffff' : '#1e293b' }}
          className="font-['Fredoka'] font-bold text-sm sm:text-base xl:text-lg leading-tight line-clamp-2"
        >
          {video.titulo}
        </h3>
        <p className={`text-xs mt-0.5 ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {video.disciplina_nome}{video.tema_titulo ? ` · ${video.tema_titulo}` : ''}
        </p>
      </div>

      <div className={`flex flex-col items-center gap-1.5 w-full pt-1.5 border-t border-dashed flex-shrink-0 ${isNightMode ? 'border-slate-800/60' : 'border-slate-100'}`}>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-['Fredoka'] font-bold text-xs shadow-md transition-all duration-200 active:scale-95"
        >
          <span>Assistir</span>
          <Play size={11} strokeWidth={2.5} className="fill-white" />
        </button>
      </div>
    </motion.div>
  );
}
