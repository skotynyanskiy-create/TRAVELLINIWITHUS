import type { Variants } from 'motion/react';

/**
 * Canonical editorial reveal easing (out-expo style). Single source of truth:
 * i componenti devono importare questo invece di reinlinare `[0.22, 1, 0.36, 1]`.
 */
export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Premium easing for the image clip-path wipe (D3 signature motion).
 * Slightly more aggressive out-expo: perceivable as "film-like" without being flashy.
 */
export const IMAGE_WIPE_EASE = [0.16, 1, 0.3, 1] as const;

/** Durate canoniche (allineate ai token CSS --duration*). */
export const DURATION = { fast: 0.15, base: 0.22, slow: 0.32, reveal: 0.7 } as const;

/** Fade + slide up — the most common reveal animation. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
};

/** Reveal editoriale canonico (fade + slide up sobrio) per sezioni e card. */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.reveal, ease: REVEAL_EASE } },
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
