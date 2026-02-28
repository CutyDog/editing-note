import axios from '../../../lib/axios';
import type { Page, CreatePageParams } from '../types';

export const createPage = async (params: CreatePageParams): Promise<Page> => {
  const response = await axios.post<Page>('/api/pages', { page: params });
  return response.data;
};
