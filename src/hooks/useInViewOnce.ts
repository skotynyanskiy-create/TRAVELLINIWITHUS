import { useEffect, useState, type RefObject } from 'react';

/**
 * True from the first time `ref` intersects the viewport (with optional rootMargin).
 * Stays true after that so heavy children are not torn down on scroll away.
 */
export function useInViewOnce(ref: RefObject<Element | null>, rootMargin = '200px 0px'): boolean {
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (inView) return;

    let cancelled = false;
    let io: IntersectionObserver | null = null;
    let rafId = 0;

    const observe = () => {
      const el = ref.current;
      if (!el) {
        // ref not mounted yet — retry next frame once
        rafId = requestAnimationFrame(() => {
          if (!cancelled && ref.current) observe();
          else if (!cancelled) setInView(true);
        });
        return;
      }

      if (typeof IntersectionObserver === 'undefined') {
        setInView(true);
        return;
      }

      io = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setInView(true);
            io?.disconnect();
          }
        },
        { root: null, rootMargin, threshold: 0.01 }
      );
      io.observe(el);
    };

    observe();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      io?.disconnect();
    };
  }, [inView, ref, rootMargin]);

  return inView;
}
