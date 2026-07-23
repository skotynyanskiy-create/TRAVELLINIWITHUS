import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import LeadMagnetCover from '../LeadMagnetCover';

const PROMISE_POINTS = [
  'Una shortlist italiana da tenere pronta quando vuoi partire.',
  'Per ogni posto: ritmo, periodo giusto e cosa evitare.',
  'Stesso tono del sito: pratico, personale, senza liste infinite.',
];

export default function HomeLeadMagnet() {
  return (
    <section
      className="bg-[var(--color-surface-2)] py-16 md:py-24"
      aria-labelledby="lead-magnet-home-heading"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
            <Sparkles size={12} /> La prima guida
          </span>
          <h2
            id="lead-magnet-home-heading"
            className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-[var(--color-ink)] md:text-5xl"
          >
            Una lista corta per il prossimo posto giusto.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-black/66 md:text-lg">
            10 posti provati e consigliati da noi. La ricevi lasciando l’email.
          </p>

          <ul className="mt-7 grid gap-3">
            {PROMISE_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-sm leading-relaxed text-black/68"
              >
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/guida-in-regalo"
            className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-7 text-xs font-bold uppercase tracking-widest text-white shadow-xs transition-all hover:bg-[var(--color-accent-hover)]"
          >
            Ricevi la prima guida
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[19rem] lg:mx-0 lg:justify-self-end">
          <div
            aria-hidden="true"
            className="absolute inset-2 -z-10 rotate-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-atlante-carta-deep)]"
          />
          <div className="relative aspect-[4/5] -rotate-2 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-[var(--shadow-xl)]">
            <LeadMagnetCover />
          </div>
        </div>
      </div>
    </section>
  );
}
