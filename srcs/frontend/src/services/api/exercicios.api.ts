import { fetchWithConfig } from './index';
import type { Exercicio } from '../../api/contracts/exercicios';

export const exerciciosApi = {
    getExercicios: async (): Promise<Exercicio[]> => {
        try {
            const response = await fetchWithConfig<Exercicio[]>('/exercicios');
            return Array.isArray(response) ? response : [];
        } catch (error) {
            console.error('Failed to fetch exercicios:', error);
            return [];
        }
    },
};
