import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePage } from '../api';

export const useDeletePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};
