import { useRef, type ReactNode, type CSSProperties } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface TiltCardProps {
  children: ReactNode;
  /** Maximum tilt in degrees applied along each axis. Default 6deg. */
  maxTilt?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Subtle 3D tilt wrapper for premium image cards (Aman / luxury hospitality
 * pattern). The card rotates a few degrees toward the pointer on hover,
 * springs back on leave. Disabled under prefers-reduced-motion.
 */
export default function TiltCard({ children, maxTilt = 6, className, style }: TiltCardProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springConfig = { stiffness: 180, damping: 16, mass: 0.5 };
  const sx = useSpring(px, springConfig);
  const sy = useSpring(py, springConfig);

  const rotateY = useTransform(sx, [-1, 1], [-maxTilt, maxTilt]);
  const rotateX = useTransform(sy, [-1, 1], [maxTilt, -maxTilt]);

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
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    px.set(relX * 2);
    py.set(relY * 2);
  };

  const handleMouseLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: 1100, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
