/*
   API client — typed wrappers around the DRF REST endpoints.
   Proxy in vite.config.ts routes /api  -> http://backend:8000
                                  /media  -> http://backend:8000

   Types mirror the *actual* Django models in integrate/models.py.
   Fields that are not in the model will not be serialised by DRF.
*/

const API_BASE = '/api/v1'

/* Enum literals (from models.py choices)
   These are the exact stored values Django uses, not display labels.  */

/** integrate/models.py -> TIPO choices */
export type ConteudoTipo =
  | 'texto'
  | 'imagem'
  | 'video'
  | 'pdf'
  | (string & Record<never, never>)   // graceful fallback for future tipos

/** integrate/models.py -> DIFICULDADE choices */
export type Dificuldade = 'basico' | 'intermedio' | 'avancado'

/** integrate/models.py -> ANO_ESCOLAR choices */
export type AnoEscolar =
  | '1º Ano' | '2º Ano' | '3º Ano'
  | '4º Ano' | '5º Ano' | '6º Ano'

/** integrate/models.py -> SECCAO choices */
export type Seccao = 'aprender' | 'resolver' | 'ler'

/* Domain types
   Field names and types match the Django model exactly.
   ForeignKey fields: DRF serialises them as <field>_id (UUID string)
   unless the serialiser explicitly nests the related object.           */

export interface Disciplina {
  id   : string
  nome : string
  slug : string
  desc : string
  /* NOTE: no `ordem` field - not present in Disciplina model */
}

export interface Tema {
  id          : string
  disciplina  : Disciplina    // nested object - serialiser must use depth≥1
  titulo      : string
  desc        : string
  slug        : string
  ano_escolar : AnoEscolar    // CharField with choices e.g. "1º Ano" (not a number)
  seccao      : Seccao
  /* NOTE: no `ordem` field - not present in Tema model    */
  /* NOTE: no `publicado` field - not present in Tema model */
}

export interface Conteudo {
  id            : string
  tema_id       : string          // DRF default for ForeignKey -> UUID of Tema
  tipo          : ConteudoTipo
  titulo        : string
  corpo         : string          // Markdown text for tipo='texto'
  ficheiro      : string | null   // relative path OR full URL from DRF
  url_externa   : string | null   // YouTube URL for tipo='video'
  thumbnail     : string | null   // optional poster image path
  dificuldade   : Dificuldade | null
  descarregavel : boolean
  publicado     : boolean
  criado_em     : string          // ISO-8601 datetime
  /* NOTE: no `ordem` field - not present in the Conteudo model.
     Display order is determined by the API queryset ordering.  */
}

export interface TemaDetail extends Tema {
  conteudos : Conteudo[]
}

/* API error */
export class ApiError extends Error {
  constructor(
    public readonly status : number,
    public readonly path   : string,
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
  getTema       : (slug: string) => get<TemaDetail>(`/temas/${slug}/`),
  getDisciplina : (slug: string) => get<Disciplina>(`/disciplinas/${slug}/`),
  getTemas      : ()             => get<Tema[]>('/temas/'),
  getDisciplinas: ()             => get<Disciplina[]>('/disciplinas/'),
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