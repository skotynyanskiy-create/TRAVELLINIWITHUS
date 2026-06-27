import { useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Link } from '@/src/components/TransitionLink';
import { getAllRegions } from '../../lib/regions';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const REGIONS = getAllRegions();

export default function HomeDispatchIndex() {
  const reducedMotion = useReducedMotion();
  const enablePeek = !reducedMotion;
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Thumbnail di peek che segue il puntatore con lag morbido (solo desktop).
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 220, damping: 28, mass: 0.6 });
  const y = useSpring(pointerY, { stiffness: 220, damping: 28, mass: 0.6 });

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!enablePeek) return;
    pointerX.set(event.clientX + 24);
    pointerY.set(event.clientY - 150);
  };

  return (
    <section
      aria-labelledby="dispatch-index-title"
      className="section-editorial bg-[var(--color-sand)]"
      onPointerMove={handlePointerMove}
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* TODO[seo]: copy eyebrow/titolo da confermare con seo-strategist */}
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
          Indice — dove siamo stati in Italia
        </p>
        <h2
          id="dispatch-index-title"
          className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-[1.05] text-[var(--color-ink)] md:text-4xl"
        >
          Le regioni che raccontiamo
        </h2>

        <ul className="mt-10 border-t border-[var(--color-border)]">
          {REGIONS.map((region, index) => (
            <li key={region.slug}>
              <Link
                to={`/destinazione/${region.slug}`}
                className="group flex min-h-11 items-baseline gap-4 border-b border-[var(--color-border)] py-6 transition-colors hover:bg-black/[0.015] md:gap-8 md:py-8"
                onPointerEnter={() => enablePeek && setActiveImage(region.heroImage)}
                onPointerLeave={() => enablePeek && setActiveImage(null)}
              >
                <span aria-hidden className="dispatch-index-number pt-2 md:pt-3">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-serif text-[clamp(2rem,5vw,4.25rem)] font-medium leading-[1.02] text-[var(--color-ink)] transition-transform duration-500 ease-out md:group-hover:translate-x-2">
                  {region.name}
                </span>
                <span className="hidden shrink-0 self-center text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-muted)] sm:block">
                  {region.country}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Peek: solo desktop (lg+), non interattiva, segue il puntatore. */}
      {enablePeek && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[300px] w-[240px] overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-premium)] lg:block"
          style={{ x, y }}
          animate={{ opacity: activeImage ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeImage && (
            <img
              src={activeImage}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          )}
        </motion.div>
      )}
    </section>
  );
}
