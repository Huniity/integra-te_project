import { motion } from 'framer-motion'
import type { Jogo } from '../../api/contracts/jogos';

const SUBJECT_IMG: Record<string, string> = {
  matematica:       '/src/assets/math.webp',
  portugues:        '/src/assets/book3.webp',
  'estudo-do-meio': '/src/assets/science.webp',
};

interface JogoCardProps {
  jogo: Jogo;
  index?: number;
}

export default function JogoCard({ jogo, index = 0 }: JogoCardProps) {
  const imgSrc = jogo.thumbnailUrl
    || (jogo.subjectId ? SUBJECT_IMG[jogo.subjectId] : undefined)
    || '/src/assets/controller.webp';

  return (
    <motion.a
      href={jogo.ficheiro_url ?? jogo.url_externa ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2 w-full cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ scale: 1.04, transition: { duration: 0.2, ease: 'easeOut' } }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="w-full max-w-[220px] aspect-square rounded-2xl bg-white/20 border border-white/30 backdrop-blur-xs flex items-center justify-center shadow-[0_4px_16px_rgba(31,38,135,0.15)] overflow-hidden">
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = '/src/assets/controller.webp'; }}
        />
      </div>
      <p className="font-['Fredoka',sans-serif] text-sm md:text-base font-black text-center leading-tight text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
        {jogo.titulo}
      </p>
      {jogo.descricao && (
        <p className="text-white/70 text-xs text-center line-clamp-2">{jogo.descricao}</p>
      )}
    </motion.a>
  );
}
