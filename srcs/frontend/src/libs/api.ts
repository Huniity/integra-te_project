/*
   API client — typed wrappers around the DRF REST endpoints.
   Proxy in vite.config.ts routes /api → http://backend:8000
                                  /media → http://backend:8000
   */

const API_BASE = '/api/v1'

/* Domain types (mirror Django models exactly) */

export type ConteudoTipo =
  | 'texto'
  | 'imagem'
  | 'video'
  | 'download'
  | 'pdf'
  | (string & Record<never, never>)   // allow unknown future tipos gracefully

export interface Disciplina {
  id    : string
  nome  : string
  slug  : string
  ordem : number
  desc  : string
}

export interface Tema {
  id          : string
  disciplina  : Disciplina           // nested by DRF serialiser
  titulo      : string
  desc        : string
  slug        : string
  ano_escolar : number
  seccao      : string
  ordem       : number
  publicado   : boolean
}

export interface Conteudo {
  id            : string
  tema_id       : string
  tipo          : ConteudoTipo
  titulo        : string
  corpo         : string        // rich-text HTML for tipo='texto'
  ficheiro      : string | null // relative path OR full URL from DRF
  url_externa   : string | null // YouTube URL for tipo='video'
  thumbnail     : string | null // optional poster image path
  ordem         : number
  dificuldade   : string | null
  descarregavel : boolean
  publicado     : boolean
  criado_em     : string        // ISO-8601
}

export interface TemaDetail extends Tema {
  conteudos : Conteudo[]
}

/* API error */
export class ApiError extends Error {
  constructor(
    public readonly status  : number,
    public readonly path    : string,
  ) {
    super(`HTTP ${status} — ${path}`)
    this.name = 'ApiError'
  }
}

/* Core fetch helper */
async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new ApiError(res.status, path)
  return res.json() as Promise<T>
}

/* Public API surface */
export const api = {
  getTema      : (slug: string) => get<TemaDetail>(`/temas/${slug}/`),
  getDisciplina: (slug: string) => get<Disciplina>(`/disciplinas/${slug}/`),
  getTemas     : ()             => get<Tema[]>('/temas/'),
  getDisciplinas: ()            => get<Disciplina[]>('/disciplinas/'),
} as const

/* Media URL helper */

/**
 * Resolves a DRF file path into a browser-usable URL.
 * DRF may return either a full URL (http://...) or a relative path.
 */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `/media/${path.replace(/^\/+/, '')}`
}