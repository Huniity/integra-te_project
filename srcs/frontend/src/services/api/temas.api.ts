import { fetchWithConfig } from './index';
import type { Tema, Disciplina } from '../../api/contracts/temas';

export const temasApi = {
  getTemas: async (): Promise<Tema[]> => {
    try {
      const data = await fetchWithConfig<Tema[]>('/temas/');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getDisciplinas: async (): Promise<Disciplina[]> => {
    try {
      const data = await fetchWithConfig<Disciplina[]>('/disciplinas/');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
};
