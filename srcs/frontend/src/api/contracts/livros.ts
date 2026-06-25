export interface Livro {
  id: string;
  titulo: string;
  autor?: string;
  faixa_etaria: string;
  resumo?: string;
  temas?: string;
  publicado: boolean;
  criado_em: string;
  capa_url?: string;
  ficheiro_url?: string;
}

export interface LivroPayload {
  titulo: string;
  autor?: string;
  faixa_etaria: string;
  resumo?: string;
  temas?: string;
  publicado: boolean;
  capa?: File | null;
  ficheiro?: File | null;
}
