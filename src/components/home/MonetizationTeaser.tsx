import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookMarked, Map, Sparkles } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';
import { DEMO_GUIDES } from '../../config/demoGuides';

type Status = 'live' | 'beta' | 'coming-soon';

interface TeaserCard {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  to: string;
  image: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  status: Status;
  badge?: string;
}

const STATUS_STYLES: Record<Status, { label: string; className: string }> = {
  live: {
    label: 'Disponibile',
    className: 'bg-[var(--color-success-soft)] text-[var(--color-success-text)]',
  },
  beta: {
    label: 'Beta',
    className: 'bg-[var(--color-warning-soft)] text-[var(--color-warning-text)]',
  },
  'coming-soon': {
    label: 'In arrivo',
    className: 'bg-[var(--color-muted-bg-2)] text-[var(--color-ink-2)]',
  },
};

const featuredGuide = DEMO_GUIDES[0];

const CARDS: TeaserCard[] = [
  {
    eyebrow: 'Shop guide',
    title: featuredGuide?.title || 'Weekend a Catania',
    description:
      featuredGuide?.subtitle ||
      'Tre giorni tra mercato, vulcano e cibo di strada. Guida PDF + mappa.',
    cta: 'Apri lo shop',
    to: '/shop',
    image:
      featuredGuide?.coverImage ||
      'https://images.unsplash.com/photo-1556471013-0001958d2f12?q=80&w=1200&auto=format&fit=crop',
    icon: BookMarked,
    status: 'coming-soon',
    badge: 'Bestseller demo',
  },
  {
    eyebrow: 'Esplora dal vivo',
    title: 'Mappa interattiva',
    description:
      'Tutti i posti raccontati su una mappa. Filtra per zona, esperienza, stagione: l’archivio diventa visivo.',
    cta: 'Apri la mappa',
    to: '/mappa',
    image:
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop',
    icon: Map,
    status: 'live',
  },
  {
    eyebrow: 'Travellini Club',
    title: 'Tutte le guide a 5,90/mese.',
    description:
      'Accesso completo al catalogo digitale, newsletter privata, sconti partner selezionati.',
    cta: 'Scopri il Club',
    to: '/club',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
    icon: Sparkles,
    status: 'coming-soon',
    badge: 'Lancio Q4 2026',
  },
];

export default function MonetizationTeaser() {
  return (
    <section className="bg-[var(--color-sand)] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-10 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
            Tutto quello che pubblichiamo
          </span>
          <h2 className="mt-3 text-3xl font-serif leading-tight tracking-tight text-[var(--color-ink)] md:text-5xl">
            Oltre gli articoli pubblici:{' '}
            <span className="italic text-black/55">guide, strumenti, Club.</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.to}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <Link
                  to={card.to}
                  className="relative block aspect-[5/4] overflow-hidden"
                  aria-label={card.title}
                >
                  <OptimizedImage
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] shadow-sm backdrop-blur-md ${STATUS_STYLES[card.status].className}`}
                    >
                      {STATUS_STYLES[card.status].label}
                    </span>
                    {card.badge && (
                      <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink)] backdrop-blur-md">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
                    <Icon size={16} />
                  </div>
                </Link>

                <div className="flex flex-1 flex-col gap-3 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                    {card.eyebrow}
                  </p>
                  <Link to={card.to} className="block">
                    <h3 className="text-xl font-serif leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent-text)] md:text-2xl">
                      {card.title}
                    </h3>
                  </Link>
                  <p className="line-clamp-3 text-sm leading-relaxed text-black/60">
                    {card.description}
                  </p>
                  <Link
                    to={card.to}
                    className="mt-auto inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    {card.cta} <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
