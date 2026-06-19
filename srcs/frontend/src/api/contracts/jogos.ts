export interface Jogo {
  id: string;
  titulo: string;
  descricao?: string;
  faixa_etaria: string;
  url_externa?: string;
  tamanho_kb?: number;
  publicado: boolean;
  criado_em: string;
  disciplina_nome: string;
  disciplina_slug: string;
  ficheiro_url?: string;
}
