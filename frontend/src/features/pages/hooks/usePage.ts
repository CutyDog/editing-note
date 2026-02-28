import { useQuery } from '@tanstack/react-query';
import { getPage } from '../api';

export const usePage = (id: number | null) => {
  return useQuery({
    queryKey: ['pages', id],
    queryFn: () => getPage(id!),
    enabled: !!id,
  });
};
