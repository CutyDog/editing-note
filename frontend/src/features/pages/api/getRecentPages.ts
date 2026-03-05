import axios from '../../../lib/axios';
import type { PageSummary } from '../types';

export const getRecentPages = async (): Promise<PageSummary[]> => {
  const response = await axios.get<PageSummary[]>('/api/pages/recent');
  return response.data;
};
