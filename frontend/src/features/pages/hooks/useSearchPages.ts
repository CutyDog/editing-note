import { useQuery } from '@tanstack/react-query';
import { searchPages } from '../api';
import type { PageSummary } from '../types';

export const useSearchPages = (query: string) => {
  return useQuery<PageSummary[], Error>({
    queryKey: ['pages', 'search', query],
    queryFn: () => searchPages(query),
    enabled: query.length > 0,
    staleTime: 60 * 1000,
  });
};
