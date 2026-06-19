export interface Livro {
  id: string;
  titulo: string;
  autor?: string;
  faixa_etaria: string;
  resumo?: string;
  temas: number[];
  publicado: boolean;
  criado_em: string;
  capa_url?: string;
  ficheiro_url?: string;
}
