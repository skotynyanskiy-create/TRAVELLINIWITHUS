import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import type Lenis from 'lenis';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface SmoothScrollContextValue {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { duration?: number; immediate?: boolean }
  ) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: (target, options) => {
    if (typeof window === 'undefined') return;
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
    } else {
      const el = document.querySelector(target);
      if (el instanceof HTMLElement)
        el.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
    }
  },
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (reducedMotion) return;
    if (typeof window === 'undefined') return;
    if (location.pathname === '/') return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const startSmoothScroll = () => {
      void Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]).then(
        ([lenisModule, gsapModule, scrollTriggerModule]) => {
          if (cancelled) return;

          const LenisCtor = lenisModule.default;
          const gsap = gsapModule.gsap;
          const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

          gsap.registerPlugin(ScrollTrigger);

          const lenis = new LenisCtor({
            duration: 1.1,
            easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
            smoothWheel: true,
          });
          lenisRef.current = lenis;

          const onScroll = () => ScrollTrigger.update();
          lenis.on('scroll', onScroll);

          const ticker = (time: number) => lenis.raf(time * 1000);
          gsap.ticker.add(ticker);
          gsap.ticker.lagSmoothing(0);

          cleanup = () => {
            lenis.off('scroll', onScroll);
            gsap.ticker.remove(ticker);
            lenis.destroy();
            lenisRef.current = null;
          };
        }
      );
    };

    const timeoutId = globalThis.setTimeout(startSmoothScroll, 3200);

    return () => {
      cancelled = true;
      globalThis.clearTimeout(timeoutId);
      cleanup?.();
    };
  }, [reducedMotion, location.pathname]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname]);

  const scrollTo: SmoothScrollContextValue['scrollTo'] = (target, options) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target as number | string | HTMLElement, {
        duration: options?.duration ?? 1.4,
        immediate: options?.immediate,
      });
      return;
    }
    if (typeof window === 'undefined') return;
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
    } else {
      const el = document.querySelector(target);
      if (el instanceof HTMLElement)
        el.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ scrollTo }}>{children}</SmoothScrollContext.Provider>
  );
}
