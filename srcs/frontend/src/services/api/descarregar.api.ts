import { fetchWithConfig } from './index';
import type { Descarregavel, DescarregavelPayload } from '../../api/contracts/descarregar';

function toFormData(p: DescarregavelPayload): FormData {
  const fd = new FormData();
  fd.append('tema', p.tema);
  fd.append('titulo', p.titulo);
  fd.append('publicado', String(p.publicado));
  if (p.corpo)       fd.append('corpo', p.corpo);
  if (p.dificuldade) fd.append('dificuldade', p.dificuldade);
  if (p.url_externa) fd.append('url_externa', p.url_externa);
  if (p.ficheiro)    fd.append('ficheiro', p.ficheiro);
  if (p.thumbnail)   fd.append('thumbnail', p.thumbnail);
  return fd;
}

function toJson(p: DescarregavelPayload): string {
  const body: Record<string, unknown> = {
    tema: p.tema,
    titulo: p.titulo,
    publicado: p.publicado,
  };
  if (p.corpo)       body.corpo       = p.corpo;
  if (p.dificuldade) body.dificuldade = p.dificuldade;
  if (p.url_externa) body.url_externa = p.url_externa;
  return JSON.stringify(body);
}

export const descarregarApi = {
  getDescarregaveis: async (): Promise<Descarregavel[]> => {
    try {
      const data = await fetchWithConfig<Descarregavel[]>('/descarregar/');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  createDescarregavel: async (payload: DescarregavelPayload): Promise<Descarregavel> => {
    const body = (payload.ficheiro || payload.thumbnail) ? toFormData(payload) : toJson(payload);
    return fetchWithConfig<Descarregavel>('/descarregar/', { method: 'POST', body });
  },

  updateDescarregavel: async (id: string, payload: DescarregavelPayload): Promise<Descarregavel> => {
    const body = (payload.ficheiro || payload.thumbnail) ? toFormData(payload) : toJson(payload);
    return fetchWithConfig<Descarregavel>(`/descarregar/${id}/`, { method: 'PUT', body });
  },

  deleteDescarregavel: async (id: string): Promise<void> => {
    await fetchWithConfig<null>(`/descarregar/${id}/`, { method: 'DELETE' });
  },
};
