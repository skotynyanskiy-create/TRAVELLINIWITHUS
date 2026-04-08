import { useQuery } from '@tanstack/react-query';
import { fetchSiteContent } from '../services/firebaseService';
import {
  resolveSiteContent,
  type SiteContentKey,
  type SiteContentMap,
} from '../config/siteContent';

export function useSiteContent<K extends SiteContentKey>(key: K) {
  return useQuery<SiteContentMap[K]>({
    queryKey: ['site-content', key],
    queryFn: async () => {
      const remoteContent = await fetchSiteContent(key);
      return resolveSiteContent(key, remoteContent);
    },
    staleTime: 1000 * 60 * 5,
  });
}
