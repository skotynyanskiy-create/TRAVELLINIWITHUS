import type { Variants } from 'motion/react';

/** Fade + slide up — the most common reveal animation. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
};

/** Slide from left — for 2-column layouts (left content). */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

/** Slide from right — for 2-column layouts (right content). */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

/** Scale in — for badges, icons, counters. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

/**
 * Staggered card grid container — use on the parent grid element.
 * Pairs with `cardItem` on each child card.
 */
export const cardContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/**
 * Individual card reveal — spring physics with subtle Y travel.
 * Use as `variants={cardItem}` on each card motion.div.
 */
/**
 * Heart pulse — use with `animate` keyed to a counter that increments on toggle.
 * Plays a quick scale-up bounce every time the key changes.
 */
export const heartPulse: Variants = {
  beat: {
    scale: [1, 1.35, 0.9, 1.1, 1],
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
};

export const cardItem: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25,
    },
  },
};
