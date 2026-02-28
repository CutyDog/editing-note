import axios from '../../../lib/axios';
import type { Page } from '../types';

export const getPage = async (id: number): Promise<Page> => {
  const response = await axios.get<Page>(`/api/pages/${id}`);
  return response.data;
};
