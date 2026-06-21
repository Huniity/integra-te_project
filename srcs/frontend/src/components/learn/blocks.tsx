import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Download, Play, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react'
import { mediaUrl } from '../../libs/api'
import type { Conteudo } from '../../libs/api'

/*
   Content block renderers
   Each maps to one Conteudo.tipo value from integrate/models.py TIPO:
     'texto' | 'imagem' | 'video' | 'pdf'
   Note: 'download' is NOT a valid tipo - removed.

   Exported:
     TextBlock     -> tipo: 'texto'   (renders Markdown via react-markdown)
     ImageBlock    -> tipo: 'imagem'
     VideoBlock    -> tipo: 'video'   (privacy-safe YouTube facade)
     DownloadBlock -> tipo: 'pdf'     (filtered by descarregavel)
     ContentBlock  -> dispatcher - picks the right block by tipo
 */

/* Shared wrapper */
function BlockShell({
  title,
  children,
  className = '',
}: {
  title?    : string
  children  : React.ReactNode
  className?: string
}) {
  return (
    <article className={`rounded-2xl bg-white shadow-sm border border-neutral-200/70 overflow-hidden ${className}`}>
      {title && (
        <header className="px-5 pt-5 pb-0">
          <h2 className="font-display font-extrabold text-lg text-neutral-800 leading-snug">
            {title}
          </h2>
        </header>
      )}
      <div className="p-5 pt-4">{children}</div>
    </article>
  )
}

/*
   TextBlock - tipo: 'texto'
   corpo contains Markdown text entered via Django Admin.
   react-markdown + remark-gfm handles rendering safely -
   no dangerouslySetInnerHTML needed.
 */

export function TextBlock({ block }: { block: Conteudo }) {
  return (
    <BlockShell title={block.titulo || undefined}>
      <div
        className="
          font-body text-neutral-700 leading-relaxed
          [&_p]:mb-3
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul_li]:mb-1
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol_li]:mb-1
          [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-brand-blue-600 [&_h3]:mb-2 [&_h3]:mt-4
          [&_strong]:font-bold
          [&_em]:italic
          [&_a]:text-brand-blue-500 [&_a]:underline [&_a]:underline-offset-2
          [&_blockquote]:border-l-4 [&_blockquote]:border-brand-blue-200
            [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-500
          [&_code]:font-mono [&_code]:text-sm [&_code]:bg-neutral-100
            [&_code]:px-1 [&_code]:rounded
          [&_pre]:bg-neutral-100 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto
          [&_hr]:border-neutral-200 [&_hr]:my-4
          [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse
          [&_th]:bg-brand-blue-50 [&_th]:font-bold [&_th]:p-2 [&_th]:border [&_th]:border-neutral-200
          [&_td]:p-2 [&_td]:border [&_td]:border-neutral-200
        "
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {block.corpo}
        </ReactMarkdown>
      </div>
    </BlockShell>
  )
}

/*
   ImageBlock - tipo: 'imagem'
*/

export function ImageBlock({ block }: { block: Conteudo }) {
  const src = mediaUrl(block.ficheiro)

  if (!src) {
    return (
      <BlockShell title={block.titulo || undefined}>
        <div className="flex items-center gap-2 text-neutral-400">
          <ImageIcon size={18} aria-hidden="true" />
          <span className="text-sm">Imagem não disponível.</span>
        </div>
      </BlockShell>
    )
  }

  return (
    <BlockShell title={block.titulo || undefined} className="!p-0">
      <figure>
        <img
          src={src}
          alt={block.titulo || 'Imagem ilustrativa'}
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover"
        />
        {block.corpo && (
          <figcaption className="px-5 py-3 text-sm text-neutral-500 font-body border-t border-neutral-100">
            {block.corpo}
          </figcaption>
        )}
      </figure>
    </BlockShell>
  )
}

/*
   VideoBlock - tipo: 'video'
   Privacy-safe YouTube embed using youtube-nocookie.com.

   GDPR facade pattern:
     1. Page loads -> shows poster thumbnail only (zero YouTube requests)
     2. User clicks play -> iframe inserted (YouTube contacted only now)
     3. No `autoplay` param -> user initiates play inside the YouTube player

   Satisfies GDPR Art. 5(1)(c) data minimisation: third-party
   resources load only upon explicit user interaction.
*/

function extractYouTubeId(url: string): string | null {
  const RE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  return url.match(RE)?.[1] ?? null
}

export function VideoBlock({ block }: { block: Conteudo }) {
  const [activated, setActivated] = useState(false)

  const videoId  = block.url_externa ? extractYouTubeId(block.url_externa) : null
  const thumbSrc =
    mediaUrl(block.thumbnail) ??
    (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.webp` : null)

  if (!videoId) {
    return (
      <BlockShell title={block.titulo || undefined}>
        <div className="flex items-center gap-2 text-neutral-400">
          <AlertCircle size={18} aria-hidden="true" />
          <span className="text-sm">Ligação de vídeo inválida.</span>
        </div>
      </BlockShell>
    )
  }

  const embedUrl =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?rel=0&modestbranding=1`

  return (
    <BlockShell title={block.titulo || undefined} className="!p-0">
      <div className="relative w-full aspect-video bg-neutral-900">

        {!activated ? (
          <button
            type="button"
            onClick={() => setActivated(true)}
            aria-label={`Reproduzir vídeo: ${block.titulo || 'vídeo'}`}
            className="group relative w-full h-full block focus-visible:outline-2 focus-visible:outline-brand-blue-400"
          >
            {thumbSrc && (
              <img
                src={thumbSrc}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-200" />
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <span className="
                flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center
                rounded-full bg-white/90 text-brand-blue-600 shadow-lg
                group-hover:scale-110 group-hover:bg-white transition-transform duration-200
              ">
                <Play size={28} fill="currentColor" aria-hidden="true" />
              </span>
            </div>
            <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/60">
              Ao reproduzir, ligará ao YouTube.
            </p>
          </button>
        ) : (
          <iframe
            src={embedUrl}
            title={block.titulo || 'Vídeo educativo'}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 w-full h-full border-0"
          />
        )}
      </div>

      {block.corpo && (
        <p className="px-5 py-3 text-sm text-neutral-500 font-body border-t border-neutral-100">
          {block.corpo}
        </p>
      )}
    </BlockShell>
  )
}

/*
   DownloadBlock - tipo: 'pdf'

   Visibility filter rules (from scope doc):
     SHOW download button  when  descarregavel === true  AND  ficheiro !== null
     SHOW view-only notice when  descarregavel === false AND  ficheiro !== null
     HIDE block entirely   when  ficheiro === null
 */

function formatFileLabel(path: string): string {
  const ext  = path.split('.').pop()?.toUpperCase() ?? 'PDF'
  const name = path.split('/').pop() ?? path
  return `${ext} — ${name}`
}

export function DownloadBlock({ block }: { block: Conteudo }) {
  const fileSrc = mediaUrl(block.ficheiro)

  if (!fileSrc) return null

  const label = formatFileLabel(block.ficheiro ?? '')

  return (
    <BlockShell title={block.titulo || undefined}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue-100 text-brand-blue-600">
            <FileText size={22} />
          </span>
          <p className="font-body text-sm text-neutral-600 truncate" title={label}>
            {label}
          </p>
        </div>

        {block.descarregavel ? (
          <a
            href={fileSrc}
            download
            aria-label={`Descarregar: ${block.titulo || label}`}
            className="
              inline-flex items-center gap-2 shrink-0
              font-display font-bold text-sm text-white
              bg-brand-blue-500 hover:bg-brand-blue-400 active:bg-brand-blue-600
              px-5 py-2.5 rounded-pill
              shadow-sm transition-colors duration-150
              focus-visible:outline-2 focus-visible:outline-brand-blue-300
            "
          >
            <Download size={16} aria-hidden="true" />
            Descarregar
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 shrink-0 text-xs text-neutral-400 font-body">
            <AlertCircle size={13} aria-hidden="true" />
            Apenas para visualização
          </span>
        )}
      </div>

      {block.corpo && (
        <p className="mt-3 text-sm text-neutral-500 font-body border-t border-neutral-100 pt-3">
          {block.corpo}
        </p>
      )}
    </BlockShell>
  )
}

/*
   ContentBlock - dispatcher
   Only handles tipos defined in integrate/models.py TIPO choices.
   'download' is not a valid tipo and has been removed.
 */

export function ContentBlock({ block }: { block: Conteudo }) {
  switch (block.tipo) {
    case 'texto'  : return <TextBlock     block={block} />
    case 'imagem' : return <ImageBlock    block={block} />
    case 'video'  : return <VideoBlock    block={block} />
    case 'pdf'    : return <DownloadBlock block={block} />
    default:
      return (
        <BlockShell>
          <p className="text-sm text-neutral-400 font-body">
            Tipo de conteúdo não reconhecido: <code className="font-mono">{block.tipo}</code>
          </p>
        </BlockShell>
      )
  }
}
