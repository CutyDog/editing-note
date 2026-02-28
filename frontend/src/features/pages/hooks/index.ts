import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPages, getPage, createPage, updatePage, deletePage } from '../api';
import type { UpdatePageParams } from '../types';

export const usePages = () => {
  return useQuery({
    queryKey: ['pages'],
    queryFn: getPages,
  });
};

export const usePage = (id: number | null) => {
  return useQuery({
    queryKey: ['pages', id],
    queryFn: () => getPage(id!),
    enabled: !!id,
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, params }: { id: number; params: UpdatePageParams }) =>
      updatePage(id, params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['pages', data.id] });
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};
