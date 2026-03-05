import { useQuery } from '@tanstack/react-query';
import { getRecentPages } from '../api/getRecentPages';

export const useRecentPages = () => {
  return useQuery({
    queryKey: ['recent_pages'],
    queryFn: getRecentPages,
  });
};
