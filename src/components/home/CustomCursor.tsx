import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

/**
 * Cursore elastico personalizzato che segue il mouse (desktop-only).
 * Si auto-disattiva su dispositivi touch (pointer: coarse) per risparmiare risorse.
 * Supporta la proprietà data-cursor="testo" per ingrandirsi e mostrare un tooltip testuale.
 */
export default function CustomCursor() {
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(
    () => window.matchMedia('(pointer: coarse)').matches
  );

  // Coordinate reali del mouse
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Springs per un movimento elastico e fluido (Awwwards pattern)
  const springConfig = { stiffness: 350, damping: 28, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // 1. Rileva se e' un dispositivo touch (coarse pointer)
    const mediaQuery = window.matchMedia('(pointer: coarse)');

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    // Se touch, blocca l'inquadramento mouse eventi
    if (mediaQuery.matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Cerca se l'elemento hovered ha data-cursor definito
      const hoverTarget = target.closest('[data-cursor]');
      if (hoverTarget) {
        const text = hoverTarget.getAttribute('data-cursor') || '';
        setCursorText(text);
        setIsHovered(true);
      } else {
        // Altrimenti, se e' un elemento interattivo standard, si ingrandisce soltanto
        const interactiveTarget = target.closest(
          'a, button, [role="button"], input, select, textarea'
        );
        if (interactiveTarget) {
          setIsHovered(true);
          setCursorText('');
        } else {
          setIsHovered(false);
          setCursorText('');
        }
      }
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Cerchio esterno elastico */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-accent)] bg-transparent text-[10px] font-sans font-bold uppercase tracking-wider text-white mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: isHovered ? (cursorText ? 80 : 44) : 24,
          height: isHovered ? (cursorText ? 80 : 44) : 24,
          backgroundColor: isHovered && cursorText ? 'rgba(194, 65, 12, 0.2)' : 'transparent',
          borderColor: isHovered ? 'var(--color-accent)' : 'rgba(194, 65, 12, 0.4)',
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.2 }}
      >
        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center leading-none text-white text-[9px] tracking-widest px-1 font-semibold"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Puntino interno rigido */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          scale: isHovered ? 0 : 1,
        }}
        transition={{ type: 'tween', ease: 'linear', duration: 0.08 }}
      />
    </>
  );
}
