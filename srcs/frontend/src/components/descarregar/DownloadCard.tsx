import { Download, Eye, FileText } from 'lucide-react';
import type { Descarregavel } from '../../api/contracts/descarregar';

interface DownloadCardProps {
  item: Descarregavel;
  onView: (item: Descarregavel) => void;
}

export default function DownloadCard({ item, onView }: DownloadCardProps) {
  const href = item.ficheiro_url ?? item.url_externa;

  return (
    <div className="h-full flex flex-col gap-2 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-xs p-3 shadow-[0_4px_16px_rgba(31,38,135,0.15)] hover:bg-white/25 transition-colors">
      <div className="flex items-start gap-2.5">
        <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-white/30 border border-white/20">
          {item.thumbnail_url
            ? <img src={item.thumbnail_url} alt="" className="h-8 w-8 object-cover rounded-lg" />
            : <FileText size={20} className="text-white" aria-hidden="true" />
          }
        </span>
        <div className="min-w-0">
          <p className="font-['Fredoka',sans-serif] font-black text-white text-sm leading-tight line-clamp-2">
            {item.titulo}
          </p>
          <p className="text-white/60 text-xs mt-0.5 truncate">{item.disciplina_nome} · {item.tema_titulo}</p>
        </div>
      </div>

      {item.corpo && (
        <p className="text-white/75 text-xs leading-snug line-clamp-2 flex-1">{item.corpo}</p>
      )}

      <div className="mt-auto flex gap-2">
        {href ? (
          <>
            <button
              onClick={() => onView(item)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 bg-white/25 border border-white/40 text-white font-['Fredoka',sans-serif] font-black text-xs hover:bg-white/35 active:scale-95 transition-all"
            >
              <Eye size={13} aria-hidden="true" />
              Ver
            </button>
            <a
              href={href}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 bg-white text-[#1e3a8a] font-['Fredoka',sans-serif] font-black text-xs shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:bg-white/90 active:scale-95 transition-all"
            >
              <Download size={13} aria-hidden="true" />
              Descarregar
            </a>
          </>
        ) : (
          <span className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 bg-white/20 text-white/50 font-['Fredoka',sans-serif] font-black text-xs cursor-not-allowed">
            <Download size={13} aria-hidden="true" />
            Indisponível
          </span>
        )}
      </div>
    </div>
  );
}
