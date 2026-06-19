import { fetchWithConfig } from './index';
import type { Exercicio } from '../../api/contracts/resolver';

type GetExerciciosResponse = Exercicio[];

export const exercicioApi = {
    getExercicios: async (): Promise<GetExerciciosResponse> => {
        try {
            const response = await fetchWithConfig<GetExerciciosResponse>('/exercicios/');
            return Array.isArray(response) ? response : [];
        } catch (error) {
            console.error('Failed to fetch exercises:', error);
            return [];
        }
    }
}
