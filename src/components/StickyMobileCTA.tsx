import { useEffect, useState } from 'react';
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

export default function StickyMobileCTA({
  label,
  to,
  href,
  onClick,
  trackingId,
  revealAfter = 320,
}: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);

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

  const baseClass = `inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 text-sm font-bold uppercase tracking-widest text-white shadow-[0_18px_36px_rgba(0,0,0,0.18)] transition-opacity ${
    visible ? 'opacity-100' : 'pointer-events-none opacity-0'
  }`;

  const content = (
    <>
      {label}
      <ArrowRight size={16} />
    </>
  );

  return (
    <div
      aria-hidden={!visible}
      className="md:hidden fixed bottom-0 inset-x-0 z-[60] border-t border-black/5 bg-white/95 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] backdrop-blur-md"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 280ms ease-out, opacity 280ms ease-out',
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
}
