import { ArrowRight } from 'lucide-react';
import type { MouseEvent } from 'react';
import Button from './Button';

type FinalCtaIntent = 'discovery' | 'newsletter' | 'business';

interface FinalCtaSectionProps {
  intent?: FinalCtaIntent;
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  className?: string;
}

const defaults: Record<
  FinalCtaIntent,
  Required<Pick<FinalCtaSectionProps, 'eyebrow' | 'title' | 'description' | 'primaryLabel' | 'primaryTo' | 'secondaryLabel' | 'secondaryTo'>>
> = {
  discovery: {
    eyebrow: 'Continua a esplorare',
    title: 'Trova il prossimo posto da salvare.',
    description:
      'Destinazioni, esperienze e guide sono collegate tra loro per aiutarti a scegliere meglio dove andare dopo.',
    primaryLabel: 'Esplora destinazioni',
    primaryTo: '/destinazioni',
    secondaryLabel: 'Sfoglia esperienze',
    secondaryTo: '/esperienze',
  },
  newsletter: {
    eyebrow: 'Resta nel filo giusto',
    title: 'Ricevi contenuti utili quando sono pronti.',
    description:
      'La newsletter raccoglie solo aggiornamenti selezionati: nuovi posti, guide pratiche e risorse davvero utili.',
    primaryLabel: 'Vai alla newsletter',
    primaryTo: '#newsletter',
    secondaryLabel: 'Leggi le guide',
    secondaryTo: '/guide',
  },
  business: {
    eyebrow: 'Per brand e territori',
    title: 'Costruiamo racconti travel credibili.',
    description:
      'Se il tuo progetto ha bisogno di contenuti editoriali, visual e community reale, entra dal media kit o dalla pagina collaborazioni.',
    primaryLabel: 'Richiedi il media kit',
    primaryTo: '/media-kit',
    secondaryLabel: 'Vedi collaborazioni',
    secondaryTo: '/collaborazioni',
  },
};

export default function FinalCtaSection({
  intent = 'discovery',
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
  className = '',
}: FinalCtaSectionProps) {
  const copy = {
    ...defaults[intent],
    ...(eyebrow ? { eyebrow } : {}),
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(primaryLabel ? { primaryLabel } : {}),
    ...(primaryTo ? { primaryTo } : {}),
    ...(secondaryLabel ? { secondaryLabel } : {}),
    ...(secondaryTo ? { secondaryTo } : {}),
  };

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (copy.primaryTo.startsWith('#')) {
      event.preventDefault();
      document.querySelector(copy.primaryTo)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className={`relative overflow-hidden rounded-[3rem] bg-[var(--color-ink)] px-8 py-12 text-white shadow-2xl md:px-14 md:py-16 ${className}`}
    >
      <div className="absolute inset-0 bg-topo opacity-20" />
      <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <span className="mb-5 block text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            {copy.eyebrow}
          </span>
          <h2 className="text-4xl font-serif leading-tight tracking-tight md:text-6xl">{copy.title}</h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/68 md:text-lg">
            {copy.description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          {copy.primaryTo.startsWith('#') ? (
            <a
              href={copy.primaryTo}
              onClick={handleAnchorClick}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--color-accent)] px-8 py-4 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-all hover:bg-white"
            >
              {copy.primaryLabel}
              <ArrowRight size={16} />
            </a>
          ) : (
            <Button to={copy.primaryTo} variant="cta" className="whitespace-nowrap">
              {copy.primaryLabel}
              <ArrowRight size={16} />
            </Button>
          )}
          <Button to={copy.secondaryTo} variant="outline-light" className="whitespace-nowrap">
            {copy.secondaryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
