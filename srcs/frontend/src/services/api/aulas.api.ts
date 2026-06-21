import { fetchWithConfig } from './index';
import type { Aula, AulaPayload } from '../../api/contracts/aulas';

function toFormData(payload: AulaPayload): FormData {
    const fd = new FormData();
    fd.append('title', payload.title);
    fd.append('subjectId', payload.subjectId);
    fd.append('level', String(payload.level));
    fd.append('publicado', String(payload.publicado));
    if (payload.description)  fd.append('description', payload.description);
    if (payload.videoUrl)     fd.append('videoUrl', payload.videoUrl);
    if (payload.thumbnailUrl) fd.append('thumbnailUrl', payload.thumbnailUrl);
    if (payload.ficheiro)     fd.append('ficheiro', payload.ficheiro);
    return fd;
}

function toJson(payload: AulaPayload): string {
    const body: Record<string, unknown> = {
        title: payload.title,
        subjectId: payload.subjectId,
        level: payload.level,
        publicado: payload.publicado,
    };
    if (payload.description)  body.description  = payload.description;
    if (payload.videoUrl)     body.videoUrl     = payload.videoUrl;
    if (payload.thumbnailUrl) body.thumbnailUrl = payload.thumbnailUrl;
    return JSON.stringify(body);
}

export const aulasApi = {
    getAulas: async (): Promise<Aula[]> => {
        try {
            const data = await fetchWithConfig<Aula[]>('/aulas/');
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    },

    createAula: async (payload: AulaPayload): Promise<Aula> => {
        const body = payload.ficheiro ? toFormData(payload) : toJson(payload);
        return fetchWithConfig<Aula>('/aulas/', { method: 'POST', body });
    },

    updateAula: async (id: string, payload: AulaPayload): Promise<Aula> => {
        const body = payload.ficheiro ? toFormData(payload) : toJson(payload);
        return fetchWithConfig<Aula>(`/aulas/${id}/`, { method: 'PUT', body });
    },

    deleteAula: async (id: string): Promise<void> => {
        await fetchWithConfig<null>(`/aulas/${id}/`, { method: 'DELETE' });
    },
};
