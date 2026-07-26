import { useQuery } from '@tanstack/react-query';
import {
  siteContentDefaults,
  type SiteContentKey,
  type SiteContentMap,
} from '../config/siteContent';
import { isAuditMode } from '../config/auditMode';

export function useSiteContent<K extends SiteContentKey>(key: K) {
  const isCinematicHome = typeof window !== 'undefined' && window.location.pathname === '/';

  return useQuery<SiteContentMap[K]>({
    queryKey: ['site-content', key],
    queryFn: async () => {
      if (isAuditMode()) {
        return siteContentDefaults[key] as SiteContentMap[K];
      }

      // Import dinamico: tiene firebaseService (e quindi firestore) fuori dal
      // modulepreload eager di Navbar/Footer presenti su ogni rotta.
      const { fetchSiteContent } = await import('../services/firebaseService');
      const remoteContent = await fetchSiteContent(key);
      return {
        ...siteContentDefaults[key],
        ...(remoteContent ?? {}),
      } as SiteContentMap[K];
    },
    enabled: !isCinematicHome,
    staleTime: 1000 * 60 * 5,
  });
}
