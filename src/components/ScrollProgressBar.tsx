import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function ScrollProgressBar() {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    if (typeof window === 'undefined') return;

    const compute = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(1, Math.max(0, scrollTop / docHeight)));
    };

    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[70] h-[2px] bg-transparent"
    >
      <div
        className="h-full origin-left bg-[var(--color-accent)] transition-transform"
        style={{
          transform: `scaleX(${progress})`,
          transitionDuration: progress === 0 ? '0ms' : '120ms',
        }}
      />
    </div>
  );
}
