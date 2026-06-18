import { fetchWithConfig } from './index';
import type { Jogo } from '../../api/contracts/jogos';

export const jogosApi = {
  getJogos: async (): Promise<Jogo[]> => {
    try {
      const response = await fetchWithConfig<Jogo[]>('/jogos');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Failed to fetch jogos:', error);
      return [];
    }
  },
};
