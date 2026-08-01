import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@/src/components/TransitionLink';
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
    () => revealAfter < 0 || (typeof window !== 'undefined' && window.scrollY > revealAfter)
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (revealAfter < 0) return;

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
    'inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 text-sm font-bold uppercase tracking-widest text-[var(--color-ink)] shadow-[var(--shadow-lg)]';

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
      data-visible={visible ? 'true' : 'false'}
      className="fixed inset-x-0 bottom-0 z-[60] translate-y-[110%] border-t border-black/5 bg-white/95 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] transition-transform duration-300 ease-out data-[visible=true]:translate-y-0 data-[visible=false]:pointer-events-none md:hidden"
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
