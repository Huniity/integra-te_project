export interface Livro {
  id: string;
  titulo: string;
  autor: string;
  faixa_etaria: string;
  resumo: string;
  temas: string;
  capa_url: string | null;
  ficheiro_url: string | null;
  publicado: boolean;
  criado_em: string;
}
