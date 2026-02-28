import axios from '../../../lib/axios';
import type { PageSummary } from '../types';

export const getPages = async (): Promise<PageSummary[]> => {
  const response = await axios.get<PageSummary[]>('/api/pages');
  return response.data;
};
