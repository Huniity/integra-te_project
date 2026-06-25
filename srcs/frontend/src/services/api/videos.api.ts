import { fetchWithConfig } from './index';
import type { Video, VideoPayload } from '../../api/contracts/videos';

function toFormData(p: VideoPayload): FormData {
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

function toJson(p: VideoPayload): string {
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

export const videosApi = {
  getVideos: async (): Promise<Video[]> => {
    try {
      const data = await fetchWithConfig<Video[]>('/videos/');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  createVideo: async (payload: VideoPayload): Promise<Video> => {
    const body = (payload.ficheiro || payload.thumbnail) ? toFormData(payload) : toJson(payload);
    return fetchWithConfig<Video>('/videos/', { method: 'POST', body });
  },

  updateVideo: async (id: string, payload: VideoPayload): Promise<Video> => {
    const body = (payload.ficheiro || payload.thumbnail) ? toFormData(payload) : toJson(payload);
    return fetchWithConfig<Video>(`/videos/${id}/`, { method: 'PUT', body });
  },

  deleteVideo: async (id: string): Promise<void> => {
    await fetchWithConfig<null>(`/videos/${id}/`, { method: 'DELETE' });
  },
};
