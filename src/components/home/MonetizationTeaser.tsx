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
}

// The status badges previously rendered ("Disponibile" / "Beta" / "In arrivo")
// have been removed from the UI — the section now only shows cards with
// status === 'live' (see VISIBLE_CARDS below), so a label is redundant.
// The Status type stays as a gate to control visibility; STATUS_STYLES was
// dropped to silence the unused-vars warning. Bring it back when we have
// multiple live cards and want to label states.

const featuredGuide = DEMO_GUIDES[0];

// TODO[R+B]: quando shop reale (preorder-first 1 SKU) e Club saranno live,
// passare status: 'live' e rimuovere il filtro `.filter(c => c.status === 'live')`
// per renderizzare tutte e 3 le card. Per ora solo la Mappa e' live e visibile.
const CARDS: TeaserCard[] = [
  {
    eyebrow: 'Shop guide',
    title: featuredGuide?.title || 'Weekend a Catania',
    description:
      featuredGuide?.subtitle ||
      'Tre giorni tra mercato, vulcano e cibo di strada. Guida PDF + mappa.',
    cta: 'Apri lo shop',
    to: '/shop',
    image: featuredGuide?.coverImage || '/images/brand/collab-work.webp',
    icon: BookMarked,
    status: 'coming-soon',
  },
  {
    eyebrow: 'Esplora dal vivo',
    title: 'Mappa interattiva',
    description:
      'Tutti i posti raccontati su una mappa. Filtra per zona, esperienza, stagione: l’archivio diventa visivo.',
    cta: 'Apri la mappa',
    to: '/mappa',
    image: '/images/brand/couple-travel.webp',
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
    image: '/images/brand/about-editorial.webp',
    icon: Sparkles,
    status: 'coming-soon',
  },
];

const VISIBLE_CARDS = CARDS.filter((c) => c.status === 'live');

export default function MonetizationTeaser() {
  if (VISIBLE_CARDS.length === 0) return null;

  const gridCols =
    VISIBLE_CARDS.length === 1
      ? 'md:max-w-2xl md:mx-auto'
      : VISIBLE_CARDS.length === 2
        ? 'md:grid-cols-2'
        : 'md:grid-cols-3';

  return (
    <section className="bg-[var(--color-sand)] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-10 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
            Strumenti pubblicati
          </span>
          <h2 className="mt-3 text-3xl font-serif leading-tight tracking-tight text-[var(--color-ink)] md:text-5xl">
            Oltre gli articoli:{' '}
            <span className="italic text-black/55">strumenti che usiamo davvero.</span>
          </h2>
        </div>

        <div className={`grid gap-6 ${gridCols}`}>
          {VISIBLE_CARDS.map((card, idx) => {
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
