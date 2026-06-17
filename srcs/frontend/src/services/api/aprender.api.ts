import { fetchWithConfig } from './index';
import type { Aula } from '../../api/contracts/aprender';

type GetAulasResponse = Aula[];

export const aulasApi = {
	getAulas: async (): Promise<GetAulasResponse> => {
		try {
			const response = await fetchWithConfig<GetAulasResponse>('/aulas');
			return Array.isArray(response) ? response : [];
		} catch (error) {
			console.error('Failed to fetch aulas:', error);
			return [];
		}
	}
}
