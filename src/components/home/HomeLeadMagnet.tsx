import { ArrowRight, CheckCircle2, MapPinned, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import Newsletter from '../Newsletter';
import OptimizedImage from '../OptimizedImage';

const PREVIEW_PLACES = [
  'Procida fuori stagione',
  'Maremma termale',
  "Val d'Orcia lenta",
  'Cilento interno',
];

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
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:px-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
            <Sparkles size={12} /> Guida gratuita
          </span>
          <h2
            id="lead-magnet-home-heading"
            className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-[var(--color-ink)] md:text-5xl"
          >
            Una lista corta per scegliere il prossimo posto giusto.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-black/66 md:text-lg">
            Una mini guida gratuita con 10 luoghi italiani da salvare: non una classifica, ma una
            selezione utile per partire da idee concrete e decidere meglio.
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

          <div className="mt-8 flex flex-wrap gap-2">
            {PREVIEW_PLACES.map((place) => (
              <span
                key={place}
                className="rounded-full border border-black/10 bg-white/65 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black/60"
              >
                {place}
              </span>
            ))}
          </div>

          <Link
            to="/vieni-con-noi"
            className="group mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
          >
            Vedi cosa ricevi
            <ArrowRight
              size={14}
              className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="relative mx-auto w-full max-w-[21rem]">
            <div className="relative rotate-[-2deg] overflow-hidden rounded-lg border border-black/10 bg-white shadow-[var(--shadow-xl)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-ink-deep)] p-6 text-white">
                <OptimizedImage
                  src="/images/lead-magnets/posti-italiani-cover-demo.webp"
                  alt="Copertina della mini guida Travelliniwithus sui posti italiani da salvare"
                  className="absolute inset-0 h-full w-full object-cover"
                  sizes="(max-width: 768px) 80vw, 340px"
                />
                <div className="twu-cover-scrim absolute inset-0" />
                <div className="relative flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-white/68">
                  <span>Travelliniwithus</span>
                  <MapPinned size={14} className="text-[var(--color-accent)]" />
                </div>
                <div className="relative mt-16">
                  <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[var(--color-accent)]">
                    Mini guida gratuita
                  </p>
                  <p className="mt-4 font-serif text-4xl leading-[0.95]">
                    10 posti italiani da salvare.
                  </p>
                </div>
                <div className="relative mt-14 grid grid-cols-3 gap-2">
                  {['Italia', 'Lento', 'Coppia'].map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-white/14 px-3 py-2 text-center text-[9px] font-bold uppercase tracking-[0.16em] text-white/70"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 p-5">
                {['Dove andare', 'Quando partire', 'Cosa evitare'].map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 border-b border-black/8 pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/54">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] md:p-8">
            <div className="mb-5 flex items-start gap-3 text-sm leading-relaxed text-black/68">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
              <span>
                Ricevi il PDF e i prossimi aggiornamenti utili. Zero spam, disiscrizione sempre
                disponibile.
              </span>
            </div>
            <Newsletter
              compact
              stacked
              variant="sand"
              source="home_lead_magnet"
              title="Ricevi la mini guida."
              description="Il PDF da salvare e, dopo, solo aggiornamenti davvero rilevanti."
              ctaLabel="Ricevi la guida"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
