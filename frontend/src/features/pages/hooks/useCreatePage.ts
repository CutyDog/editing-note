import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPage } from '../api';

export const useCreatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};
