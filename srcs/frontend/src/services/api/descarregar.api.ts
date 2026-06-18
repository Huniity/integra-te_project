import { fetchWithConfig } from './index';
import type { Descarregavel } from '../../api/contracts/descarregar';

export const descarregarApi = {
  getDescarregaveis: async (): Promise<Descarregavel[]> => {
    try {
      const response = await fetchWithConfig<Descarregavel[]>('/descarregar/');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Failed to fetch downloadable files:', error);
      return [];
    }
  },
};
