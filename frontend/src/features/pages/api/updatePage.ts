import axios from '../../../lib/axios';
import type { Page, UpdatePageParams } from '../types';

export const updatePage = async (id: number, params: UpdatePageParams): Promise<Page> => {
  const response = await axios.patch<Page>(`/api/pages/${id}`, { page: params });
  return response.data;
};
