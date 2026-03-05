import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritePage, unfavoritePage } from '../api';

export const useFavoritePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: favoritePage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pages'] }),
  });
};

export const useUnfavoritePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unfavoritePage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pages'] }),
  });
};
