import { useEffect, useRef } from 'react';
import { trackEvent } from '../services/analytics';

interface UseArticleAnalyticsParams {
  slug: string;
  category?: string;
  title?: string;
  enabled: boolean;
}

const MILESTONES = [25, 50, 75, 100] as const;
const READ_COMPLETE_SCROLL_PCT = 80;
const READ_COMPLETE_TIME_MS = 60_000;

export function useArticleAnalytics({ slug, category, title, enabled }: UseArticleAnalyticsParams) {
  const startedRef = useRef(false);
  const milestonesFiredRef = useRef<Set<number>>(new Set());
  const readCompleteFiredRef = useRef(false);
  const startTimeRef = useRef(0);

  useEffect(() => {
    startedRef.current = false;
    milestonesFiredRef.current = new Set();
    readCompleteFiredRef.current = false;
    startTimeRef.current = 0;
  }, [slug]);

  useEffect(() => {
    if (!enabled || !slug || startedRef.current) return;
    startedRef.current = true;
    startTimeRef.current = Date.now();
    trackEvent('article_read_start', { slug, category, title });
  }, [enabled, slug, category, title]);

  useEffect(() => {
    if (!enabled || !slug) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const milestone of MILESTONES) {
        if (pct >= milestone && !milestonesFiredRef.current.has(milestone)) {
          milestonesFiredRef.current.add(milestone);
          trackEvent(`article_scroll_${milestone}`, { slug, category, title });
        }
      }

      if (!readCompleteFiredRef.current && pct >= READ_COMPLETE_SCROLL_PCT) {
        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed >= READ_COMPLETE_TIME_MS) {
          readCompleteFiredRef.current = true;
          trackEvent('article_read_complete', {
            slug,
            category,
            title,
            time_on_page_ms: elapsed,
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled, slug, category, title]);
}
