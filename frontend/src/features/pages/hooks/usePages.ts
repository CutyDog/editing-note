import { useQuery } from '@tanstack/react-query';
import { getPages } from '../api';

export const usePages = () => {
  return useQuery({
    queryKey: ['pages'],
    queryFn: getPages,
  });
};
