import { fetchWithConfig } from './index';
import type { Livro } from '../../api/contracts/livros';

export const livrosApi = {
  getLivros: async (): Promise<Livro[]> => {
    try {
      const response = await fetchWithConfig<Livro[]>('/livros/');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Failed to fetch livros:', error);
      return [];
    }
  },
};
