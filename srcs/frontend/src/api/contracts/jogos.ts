export interface Jogo {
  id: string;
  titulo: string;
  subjectId?: string;
  level?: number;
  thumbnailUrl?: string;
  descricao?: string;
  videoUrl?: string;
  ficheiro_url?: string;
  publicado: boolean;
  criado_em: string;
  // legacy
  faixa_etaria?: string;
  url_externa?: string;
  disciplina?: string;
  disciplina_nome?: string;
  disciplina_slug?: string;
}

export interface JogoPayload {
  titulo: string;
  subjectId?: string;
  level?: number;
  thumbnailUrl?: string;
  descricao?: string;
  videoUrl?: string;
  ficheiro?: File | null;
  publicado: boolean;
}
