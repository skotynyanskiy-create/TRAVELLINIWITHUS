import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SCROLL_PAGES } from './acts';
import { useMasterTimeline } from './useMasterTimeline';
import ControluceOverlay from './ControluceOverlay';
import ControluceFallback from './ControluceFallback';

// three (~500KB) loads lazily; the fallback never downloads it (Sentiero pattern).
const ControluceCanvas = lazy(() => import('./ControluceCanvas'));

export default function ControluceExperience() {
  const prefersReducedMotion = useReducedMotion();
  const [isSmall, setIsSmall] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { tRef } = useMasterTimeline(scrollerRef, !(prefersReducedMotion || isSmall));

  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Full-bleed: cloth-colored overscroll on this route only (Sentiero pattern).
  useEffect(() => {
    const prevHtml = document.documentElement.style.background;
    const prevBody = document.body.style.background;
    document.documentElement.style.background = '#f3ede2';
    document.body.style.background = '#f3ede2';
    return () => {
      document.documentElement.style.background = prevHtml;
      document.body.style.background = prevBody;
    };
  }, []);

  if (prefersReducedMotion || isSmall) return <ControluceFallback />;

  return (
    <div ref={scrollerRef} style={{ height: `${SCROLL_PAGES * 100}vh` }}>
      <Suspense fallback={<div className="fixed inset-0 bg-[#f3ede2]" />}>
        <ControluceCanvas tRef={tRef} />
      </Suspense>
      <ControluceOverlay tRef={tRef} />
    </div>
  );
}
