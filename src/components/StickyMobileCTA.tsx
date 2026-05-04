import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '../services/analytics';

interface StickyMobileCTAProps {
  label: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  trackingId: string;
  revealAfter?: number;
}

const subscribeNoop = () => () => {};

export default function StickyMobileCTA({
  label,
  to,
  href,
  onClick,
  trackingId,
  revealAfter = 320,
}: StickyMobileCTAProps) {
  // Hydration-safe client gate without an effect-driven setState:
  // server snapshot returns false (no portal rendered), client returns true.
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );

  const [visible, setVisible] = useState(
    () => typeof window !== 'undefined' && window.scrollY > revealAfter
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScroll = () => {
      setVisible(window.scrollY > revealAfter);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [revealAfter]);

  const handleClick = () => {
    trackEvent('cta_sticky_click', { id: trackingId });
    onClick?.();
  };

  const baseClass =
    'inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 text-sm font-bold uppercase tracking-widest text-white shadow-[0_18px_36px_rgba(0,0,0,0.18)]';

  const content = (
    <>
      {label}
      <ArrowRight size={16} />
    </>
  );

  // Portal to body so position:fixed is anchored to the viewport, not to any
  // ancestor with `transform` (route-transition motion.div in Layout creates a
  // containing block that breaks fixed positioning otherwise).
  const node = (
    <div
      inert={!visible}
      aria-hidden={!visible}
      className="md:hidden fixed bottom-0 inset-x-0 z-[60] border-t border-black/5 bg-white/95 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] backdrop-blur-md"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 280ms ease-out',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {to ? (
        <Link to={to} onClick={handleClick} className={baseClass}>
          {content}
        </Link>
      ) : href ? (
        <a href={href} onClick={handleClick} className={baseClass}>
          {content}
        </a>
      ) : (
        <button type="button" onClick={handleClick} className={baseClass}>
          {content}
        </button>
      )}
    </div>
  );

  if (!mounted) return null;
  return createPortal(node, document.body);
}
