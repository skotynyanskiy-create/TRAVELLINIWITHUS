import { useRef, type ReactNode, type CSSProperties } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface MagneticWrapperProps {
  children: ReactNode;
  /** Maximum displacement in px applied to the child when the pointer hovers near it. */
  strength?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Subtle magnetic-attraction wrapper for premium CTAs (Aman/luxury pattern).
 * The child element drifts toward the pointer while inside the wrapper bounds,
 * then springs back to origin on leave. Disabled on coarse pointers and when
 * the user prefers reduced motion.
 */
export default function MagneticWrapper({
  children,
  strength = 8,
  className,
  style,
}: MagneticWrapperProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 220, damping: 18, mass: 0.4 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  if (reducedMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = event.clientX - rect.left - rect.width / 2;
    const relY = event.clientY - rect.top - rect.height / 2;
    x.set((relX / (rect.width / 2)) * strength);
    y.set((relY / (rect.height / 2)) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      className={`pointer-fine:contents ${className ?? ''}`.trim()}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div style={{ x: sx, y: sy, display: 'inline-block' }}>{children}</motion.div>
    </div>
  );
}
