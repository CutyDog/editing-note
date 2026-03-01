import { useQuery } from '@tanstack/react-query';
import { getMe } from '../api';
import type { User } from '../../../types/auth';

export const useMe = () => {
  return useQuery<User, Error>({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  });
};
