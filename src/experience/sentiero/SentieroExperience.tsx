import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import SentieroPortal from './SentieroPortal';
import SentieroHud from './SentieroHud';
import SentieroFallback from './SentieroFallback';
import SentieroBackdrop from './SentieroBackdrop';
import { SENTIERO_STAGES } from './sentieroData';
import { trackEvent } from '../../services/analytics';

// Il canvas trascina three.js (~500KB): caricato pigro così la versione
// fallback (mobile / reduced-motion) non lo scarica mai.
const SentieroCanvas = lazy(() => import('./SentieroCanvas'));

export default function SentieroExperience() {
  const prefersReducedMotion = useReducedMotion();
  const [isSmall, setIsSmall] = useState(false);
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Funnel del viaggio (GA4 via trackEvent consent-aware). world_view scatta
  // solo al cambio mondo (ScrollReporter deduplica con last.current), quindi
  // niente flood di eventi sullo scroll avanti-indietro.
  const handleActive = useCallback((index: number) => {
    setActive(index);
    const stage = SENTIERO_STAGES[index];
    trackEvent('sentiero_world_view', { world_id: stage?.id, index, title: stage?.title });
  }, []);

  const handleEnter = useCallback(() => {
    setEntered(true);
    trackEvent('sentiero_enter', { source_page: '/sentiero' });
  }, []);

  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Sfondo scuro su html/body: niente fascia sabbia in overscroll su questa
  // rotta full-bleed. Ripristinato all'uscita.
  useEffect(() => {
    const prevHtml = document.documentElement.style.background;
    const prevBody = document.body.style.background;
    document.documentElement.style.background = '#0b0805';
    document.body.style.background = '#0b0805';
    return () => {
      document.documentElement.style.background = prevHtml;
      document.body.style.background = prevBody;
    };
  }, []);

  if (prefersReducedMotion || isSmall) {
    return <SentieroFallback />;
  }

  return (
    <div className="sentiero-experience relative h-screen w-full overflow-hidden bg-[#0b0805]">
      <style>{`
        .sentiero-experience ::-webkit-scrollbar { width: 0; height: 0; display: none; }
        .sentiero-experience * { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      <SentieroBackdrop active={active} />
      <Suspense fallback={<div className="absolute inset-0" />}>
        <SentieroCanvas
          active={active}
          onActive={handleActive}
          progressRef={progressRef}
          endRef={endRef}
        />
      </Suspense>

      <SentieroHud active={active} progressRef={progressRef} endRef={endRef} />

      <AnimatePresence>
        {!entered && <SentieroPortal key="portal" onEnter={handleEnter} />}
      </AnimatePresence>
    </div>
  );
}
