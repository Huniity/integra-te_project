import { Download, FileText } from 'lucide-react';
import type { Descarregavel } from '../../api/contracts/descarregar';

interface DownloadCardProps {
  item: Descarregavel;
}

export default function DownloadCard({ item }: DownloadCardProps) {
  const href = item.ficheiro_url ?? item.url_externa;

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-xs p-4 shadow-[0_4px_16px_rgba(31,38,135,0.15)] hover:bg-white/25 transition-colors">
      <div className="flex items-start gap-3">
        <span className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-white/30 border border-white/20">
          {item.thumbnail_url
            ? <img src={item.thumbnail_url} alt="" className="h-10 w-10 object-cover rounded-lg" />
            : <FileText size={24} className="text-white" aria-hidden="true" />
          }
        </span>
        <div className="min-w-0">
          <p className="font-['Fredoka',sans-serif] font-black text-white text-base leading-tight line-clamp-2">
            {item.titulo}
          </p>
          <p className="text-white/60 text-xs mt-0.5">{item.disciplina_nome} · {item.tema_titulo}</p>
        </div>
      </div>

      {item.corpo && (
        <p className="text-white/75 text-sm leading-snug line-clamp-2">{item.corpo}</p>
      )}

      {href ? (
        <a
          href={href}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 bg-white text-[#1e3a8a] font-['Fredoka',sans-serif] font-black text-sm shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:bg-white/90 active:scale-95 transition-all"
        >
          <Download size={16} aria-hidden="true" />
          Descarregar
        </a>
      ) : (
        <span className="mt-auto inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 bg-white/20 text-white/50 font-['Fredoka',sans-serif] font-black text-sm cursor-not-allowed">
          <Download size={16} aria-hidden="true" />
          Indisponível
        </span>
      )}
    </div>
  );
}
