export interface Video {
  id: string;
  titulo: string;
  tipo: string;
  corpo: string;
  dificuldade?: string;
  url_externa?: string;
  publicado: boolean;
  criado_em: string;
  ficheiro_url?: string;
  thumbnail_url?: string;
  disciplina_slug: string;
  disciplina_nome: string;
  tema_titulo: string;
}
