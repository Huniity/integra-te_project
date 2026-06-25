import { fetchWithConfig } from './index';
import type { Jogo, JogoPayload } from '../../api/contracts/jogos';

function toFormData(p: JogoPayload): FormData {
  const fd = new FormData();
  fd.append('titulo', p.titulo);
  fd.append('publicado', String(p.publicado));
  if (p.subjectId)    fd.append('subjectId', p.subjectId);
  if (p.level != null) fd.append('level', String(p.level));
  if (p.descricao)    fd.append('descricao', p.descricao);
  if (p.thumbnailUrl) fd.append('thumbnailUrlInput', p.thumbnailUrl);
  if (p.thumbnail)    fd.append('thumbnail', p.thumbnail);
  if (p.videoUrl)     fd.append('videoUrl', p.videoUrl);
  if (p.ficheiro)     fd.append('ficheiro', p.ficheiro);
  if (p.faixaEtaria)  fd.append('faixa_etaria', p.faixaEtaria);
  if (p.urlExterna)   fd.append('url_externa', p.urlExterna);
  if (p.disciplina)   fd.append('disciplina', p.disciplina);
  return fd;
}

function toJson(p: JogoPayload): string {
  const body: Record<string, unknown> = {
    titulo: p.titulo,
    publicado: p.publicado,
  };
  if (p.subjectId)    body.subjectId         = p.subjectId;
  if (p.level != null) body.level            = p.level;
  if (p.descricao)    body.descricao         = p.descricao;
  if (p.thumbnailUrl) body.thumbnailUrlInput = p.thumbnailUrl;
  if (p.videoUrl)     body.videoUrl          = p.videoUrl;
  if (p.faixaEtaria)  body.faixa_etaria      = p.faixaEtaria;
  if (p.urlExterna)   body.url_externa       = p.urlExterna;
  if (p.disciplina)   body.disciplina        = p.disciplina;
  return JSON.stringify(body);
}

export const jogosApi = {
  getJogos: async (): Promise<Jogo[]> => {
    try {
      const data = await fetchWithConfig<Jogo[]>('/jogos/');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  createJogo: async (payload: JogoPayload): Promise<Jogo> => {
    const body = (payload.ficheiro || payload.thumbnail) ? toFormData(payload) : toJson(payload);
    return fetchWithConfig<Jogo>('/jogos/', { method: 'POST', body });
  },

  updateJogo: async (id: string, payload: JogoPayload): Promise<Jogo> => {
    const body = (payload.ficheiro || payload.thumbnail) ? toFormData(payload) : toJson(payload);
    return fetchWithConfig<Jogo>(`/jogos/${id}/`, { method: 'PUT', body });
  },

  deleteJogo: async (id: string): Promise<void> => {
    await fetchWithConfig<null>(`/jogos/${id}/`, { method: 'DELETE' });
  },
};
