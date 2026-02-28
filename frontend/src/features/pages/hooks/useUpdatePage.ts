import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePage } from '../api';
import type { UpdatePageParams } from '../types';

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
