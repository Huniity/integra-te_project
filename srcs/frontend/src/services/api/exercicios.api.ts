import { fetchWithConfig } from './index';
import type { Exercicio, ExercicioPayload } from '../../api/contracts/exercicios';

function toFormData(p: ExercicioPayload): FormData {
  const fd = new FormData();
  fd.append('title', p.title);
  fd.append('subjectId', p.subjectId);
  fd.append('level', String(p.level));
  fd.append('publicado', String(p.publicado));
  if (p.description)  fd.append('description', p.description);
  if (p.thumbnailUrl) fd.append('thumbnailUrlInput', p.thumbnailUrl);
  if (p.thumbnail)    fd.append('thumbnail', p.thumbnail);
  if (p.videoUrl)     fd.append('videoUrl', p.videoUrl);
  if (p.ficheiro)     fd.append('ficheiro', p.ficheiro);
  return fd;
}

function toJson(p: ExercicioPayload): string {
  const body: Record<string, unknown> = {
    title: p.title,
    subjectId: p.subjectId,
    level: p.level,
    publicado: p.publicado,
  };
  if (p.description)  body.description       = p.description;
  if (p.thumbnailUrl) body.thumbnailUrlInput  = p.thumbnailUrl;
  if (p.videoUrl)     body.videoUrl           = p.videoUrl;
  return JSON.stringify(body);
}

export const exerciciosApi = {
  getExercicios: async (): Promise<Exercicio[]> => {
    try {
      const data = await fetchWithConfig<Exercicio[]>('/exercicios/');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  createExercicio: async (payload: ExercicioPayload): Promise<Exercicio> => {
    const body = (payload.ficheiro || payload.thumbnail) ? toFormData(payload) : toJson(payload);
    return fetchWithConfig<Exercicio>('/exercicios/', { method: 'POST', body });
  },

  updateExercicio: async (id: string, payload: ExercicioPayload): Promise<Exercicio> => {
    const body = (payload.ficheiro || payload.thumbnail) ? toFormData(payload) : toJson(payload);
    return fetchWithConfig<Exercicio>(`/exercicios/${id}/`, { method: 'PUT', body });
  },

  deleteExercicio: async (id: string): Promise<void> => {
    await fetchWithConfig<null>(`/exercicios/${id}/`, { method: 'DELETE' });
  },
};
