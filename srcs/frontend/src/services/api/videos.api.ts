import { fetchWithConfig } from './index';
import type { Video } from '../../api/contracts/videos';

export const videosApi = {
  getVideos: async (): Promise<Video[]> => {
    try {
      const response = await fetchWithConfig<Video[]>('/videos');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      return [];
    }
  },
};
