import { motion } from 'motion/react';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { revealUp } from '@/src/lib/animations';
import OptimizedImage from '../OptimizedImage';
import type { DiaryBeat } from './types';

interface DiaryProps {
  beats: DiaryBeat[];
  /** Titolo di sezione. Default coerente col resto del template Articolo. */
  title?: string;
  /** Standfirst breve sotto il titolo — opzionale, editoriale. */
  intro?: string;
}

interface DiaryBeatItemProps {
  beat: DiaryBeat;
  index: number;
}

function DiaryBeatItem({ beat, index }: DiaryBeatItemProps) {
  const reduced = useReducedMotion();
  const imageFirst = index % 2 === 0;
  const hasCaption = Boolean(beat.image.caption || beat.image.credit);

  return (
    <motion.div
      className="grid items-center gap-6 md:grid-cols-2 md:gap-12"
      initial={reduced ? false : 'hidden'}
      whileInView={reduced ? undefined : 'visible'}
      viewport={{ once: true, margin: '-80px' }}
      variants={reduced ? undefined : revealUp}
    >
      <figure className={imageFirst ? 'md:order-1' : 'md:order-2'}>
        <div className="overflow-hidden rounded-[var(--radius-lg)]">
          <OptimizedImage
            src={beat.image.src}
            alt={beat.image.alt}
            className="aspect-[4/3] w-full object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        {hasCaption && (
          <figcaption className="mt-3">
            {beat.image.caption && (
              <span className="font-serif italic text-[14px] leading-[1.5] text-[var(--color-ink-2)] md:text-[15px]">
                {beat.image.caption}
              </span>
            )}
            {beat.image.caption && beat.image.credit && (
              <span className="text-[var(--color-muted-fg)]" aria-hidden="true">
                {' · '}
              </span>
            )}
            {beat.image.credit && (
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted-fg)]">
                {beat.image.credit}
              </span>
            )}
          </figcaption>
        )}
      </figure>

      <div className={imageFirst ? 'md:order-2' : 'md:order-1'}>
        <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-muted-fg)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="mt-3 font-serif text-2xl leading-tight text-[var(--color-ink)] md:text-3xl">
          {beat.title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-2)] md:text-lg">
          {beat.text}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Variante "Diario": registro emotivo/narrativo del viaggio, in 3-4 beat
 * fotografici. Convive con l'Itinerario leggibile (logistica) e con
 * ReviewBlock/Il Timbro (verdetto) — non li sostituisce.
 *
 * Gate: renderizza solo se `beats` non e' vuoto. Il chiamante decide dove
 * posizionarla nel template (handoff: sopra "Itinerario leggibile").
 */
export default function Diary({ beats, title = 'Diario di viaggio', intro }: DiaryProps) {
  if (!beats || beats.length === 0) return null;

  return (
    <section id="diario" className="mt-20 scroll-mt-32 border-t border-black/8 pt-10 md:pt-12">
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
        Il registro di viaggio
      </p>
      <h2 className="max-w-2xl font-serif text-3xl leading-tight text-[var(--color-ink)] md:text-4xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-ink-2)] md:text-lg">
          {intro}
        </p>
      )}
      <div className="mt-12 space-y-16 md:mt-14 md:space-y-24">
        {beats.map((beat, index) => (
          <DiaryBeatItem key={beat.id} beat={beat} index={index} />
        ))}
      </div>
    </section>
  );
}
