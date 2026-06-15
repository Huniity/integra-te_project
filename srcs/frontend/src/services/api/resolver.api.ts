import { fetchWithConfig } from './index';
import { Exercicio } from '../../api/contracts/resolver';

type GetExerciciosResponse = Exercicio[];

export const exercicioApi = {
    getExercicios: async (): Promise<GetExerciciosResponse> => {
        const response = await fetchWithConfig<GetExerciciosResponse>('/exercicios');
        return Array.isArray(response) ? response : [];
    }
}
