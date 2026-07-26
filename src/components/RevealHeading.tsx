import { createElement, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { REVEAL_EASE } from '@/src/lib/animations';

type HeadingTag = 'h2' | 'p' | 'span';

const MOTION_TAG = { h2: motion.h2, p: motion.p, span: motion.span } as const;

interface RevealHeadingProps {
  /** Una riga per elemento. Testo reale, mai aria-hidden — l'ordine di lettura è il titolo completo. */
  lines: ReactNode[];
  /** Tag del titolo. Default h2 (unico uso previsto per il gesto-firma). */
  as?: HeadingTag;
  id?: string;
  className?: string;
}

/**
 * Motion-firma del sito: reveal a maschera-riga sugli h2 serif.
 * Riferimento vivente: CoupleIntro.tsx (data-couple-line, GSAP) — stesso gesto,
 * qui in motion/react per i componenti condivisi (Section, ZoneBand, MetodoBand).
 * Maschera in-flow (overflow-hidden su span block) → zero CLS, transform-only.
 */
export default function RevealHeading({
  lines,
  as: Tag = 'h2',
  id,
  className = '',
}: RevealHeadingProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return createElement(
      Tag,
      { id, className },
      lines.map((line, index) => (
        <span key={index} className="block">
          {line}
        </span>
      ))
    );
  }

  // L'osservazione viewport DEVE stare sul tag esterno: una riga traslata al
  // 110% dentro overflow-hidden ha area visibile zero, quindi un whileInView
  // sulla riga stessa non scatterebbe mai (IntersectionObserver interseca col
  // clip degli antenati). Le righe ereditano la variant dal padre.
  const MotionTag = MOTION_TAG[Tag];
  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {lines.map((line, index) => (
        <span key={index} className="block overflow-hidden">
          <motion.span
            className="block"
            variants={{
              hidden: { y: '110%' },
              visible: {
                y: 0,
                transition: { duration: 0.8, ease: REVEAL_EASE, delay: index * 0.1 },
              },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
