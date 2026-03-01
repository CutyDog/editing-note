import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMe, type UpdateMeParams } from '../api';
import type { User } from '../../../types/auth';

export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateMeParams>({
    mutationFn: updateMe,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['me'], updatedUser);
    },
  });
};
