import { fetchWithConfig } from './index';
import type { Livro, LivroPayload } from '../../api/contracts/livros';

function toFormData(p: LivroPayload): FormData {
  const fd = new FormData();
  fd.append('titulo', p.titulo);
  fd.append('faixa_etaria', p.faixa_etaria);
  fd.append('publicado', String(p.publicado));
  if (p.autor)    fd.append('autor', p.autor);
  if (p.resumo)   fd.append('resumo', p.resumo);
  if (p.temas)    fd.append('temas', p.temas);
  if (p.capa)     fd.append('capa', p.capa);
  if (p.ficheiro) fd.append('ficheiro', p.ficheiro);
  return fd;
}

function toJson(p: LivroPayload): string {
  const body: Record<string, unknown> = {
    titulo: p.titulo,
    faixa_etaria: p.faixa_etaria,
    publicado: p.publicado,
  };
  if (p.autor)   body.autor   = p.autor;
  if (p.resumo)  body.resumo  = p.resumo;
  if (p.temas)   body.temas   = p.temas;
  return JSON.stringify(body);
}

export const livrosApi = {
  getLivros: async (): Promise<Livro[]> => {
    try {
      const data = await fetchWithConfig<Livro[]>('/livros/');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  createLivro: async (payload: LivroPayload): Promise<Livro> => {
    const body = (payload.capa || payload.ficheiro) ? toFormData(payload) : toJson(payload);
    return fetchWithConfig<Livro>('/livros/', { method: 'POST', body });
  },

  updateLivro: async (id: string, payload: LivroPayload): Promise<Livro> => {
    const body = (payload.capa || payload.ficheiro) ? toFormData(payload) : toJson(payload);
    return fetchWithConfig<Livro>(`/livros/${id}/`, { method: 'PUT', body });
  },

  deleteLivro: async (id: string): Promise<void> => {
    await fetchWithConfig<null>(`/livros/${id}/`, { method: 'DELETE' });
  },
};
