import { useEffect, useRef, type RefObject } from 'react';
import { mapScrollToTimeline } from './acts';

/**
 * Dedicated Lenis on the tall scroller. Global SmoothScrollProvider does not
 * cover standalone routes, so the experience owns its own instance.
 * Exposes refs (no React state) so the canvas reads t at frame rate.
 */
export function useMasterTimeline(scrollerRef: RefObject<HTMLElement | null>, enabled = true) {
  const tRef = useRef(0);
  const rawRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const update = () => {
      const el = scrollerRef.current;
      if (!el) return;
      const max = el.scrollHeight - window.innerHeight;
      const raw = max > 0 ? window.scrollY / max : 0;
      rawRef.current = Math.min(1, Math.max(0, raw));
      tRef.current = mapScrollToTimeline(rawRef.current);
    };
    update();

    void import('lenis').then((mod) => {
      if (cancelled) return;
      const lenis = new mod.default({
        // Act 0 contract: first scroll must answer instantly.
        duration: 0.9,
        smoothWheel: true,
      });
      let raf = 0;
      const frame = (time: number) => {
        lenis.raf(time);
        update();
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      cleanup = () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
      };
    });

    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelled = true;
      window.removeEventListener('scroll', update);
      cleanup?.();
    };
  }, [scrollerRef, enabled]);

  return { tRef, rawRef };
}
