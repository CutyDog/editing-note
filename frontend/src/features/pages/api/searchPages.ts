import axios from '../../../lib/axios';
import type { PageSummary } from '../types';

export const searchPages = async (query: string): Promise<PageSummary[]> => {
  const response = await axios.get<PageSummary[]>('/api/pages', {
    params: { q: query }
  });
  return response.data;
};
