import axios from '../../../lib/axios';
import type { Page, PageSummary, CreatePageParams, UpdatePageParams } from '../types';

export const getPages = async (): Promise<PageSummary[]> => {
  const response = await axios.get<PageSummary[]>('/api/pages');
  return response.data;
};

export const getPage = async (id: number): Promise<Page> => {
  const response = await axios.get<Page>(`/api/pages/${id}`);
  return response.data;
};

export const createPage = async (params: CreatePageParams): Promise<Page> => {
  const response = await axios.post<Page>('/api/pages', { page: params });
  return response.data;
};

export const updatePage = async (id: number, params: UpdatePageParams): Promise<Page> => {
  const response = await axios.patch<Page>(`/api/pages/${id}`, { page: params });
  return response.data;
};

export const deletePage = async (id: number): Promise<void> => {
  await axios.delete(`/api/pages/${id}`);
};
