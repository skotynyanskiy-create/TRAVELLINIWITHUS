import { ArrowRight, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from '@/src/components/TransitionLink';
import OptimizedImage from '@/src/components/OptimizedImage';
import RevealHeading from '@/src/components/RevealHeading';
import { getPublishedReels } from '@/src/config/reels';
import { slugifyZone } from '@/src/config/contentTaxonomy';
import { REVEAL_EASE } from '@/src/lib/animations';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';

interface ZoneBandProps {
  className?: string;
}

type PhotoZoneCard = {
  kind: 'photo';
  label: string;
  sublabel: string;
  slug: string;
  cover: string;
  alt: string;
};

type PlaceholderZoneCard = {
  kind: 'placeholder';
  label: string;
  sublabel: string;
  slug: string;
};

type ZoneCard = PhotoZoneCard | PlaceholderZoneCard;

const publishedReels = getPublishedReels();
const coverForReel = (id: string): string =>
  publishedReels.find((reel) => reel.id === id)?.cover ?? '';

// Italia → reel Toscana (Tavernal), Mondo → reel Egitto/Mar Rosso.
// Europa non ha ancora una foto reale: resta una card editoriale, non inventata.
const ZONE_CARDS: ZoneCard[] = [
  {
    kind: 'photo',
    label: 'Italia',
    sublabel: 'I posti dove torniamo',
    slug: slugifyZone('Italia'),
    cover: coverForReel('reel-toscana-tavernal'),
    alt: 'Una taverna a tema in Toscana, tra le storie che raccontiamo in Italia',
  },
  {
    kind: 'placeholder',
    label: 'Europa',
    sublabel: 'In arrivo, un posto alla volta',
    slug: slugifyZone('Europa'),
  },
  {
    kind: 'photo',
    label: 'Mondo',
    sublabel: 'Oltre i confini di casa',
    slug: slugifyZone('Mondo'),
    cover: coverForReel('reel-egitto-mar-rosso'),
    alt: 'Acqua trasparente sul Mar Rosso in Egitto, i viaggi fuori dai confini',
  },
];

export default function ZoneBand({ className = '' }: ZoneBandProps) {
  return (
    <section
      aria-labelledby="zone-band-title"
      className={`relative bg-[var(--color-sand)] py-20 md:py-28 ${className}`.trim()}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Entry device "frase-lead" senza occhiello — variazione di ritmo
            rispetto alle sezioni con eyebrow accent-uppercase. */}
        <div className="mb-10 max-w-2xl md:mb-12">
          <RevealHeading
            id="zone-band-title"
            className="text-3xl font-serif leading-[1.05] text-ink md:text-5xl"
            lines={[
              'Vicino a casa,',
              <span key="accent" className="italic text-muted-fg-2">
                e dall'altra parte del mondo.
              </span>,
            ]}
          />
        </div>

        <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {ZONE_CARDS.map((card, index) => (
            <ZoneCardView key={card.label} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ZoneCardViewProps {
  card: ZoneCard;
  index: number;
}

function ZoneCardView({ card, index }: ZoneCardViewProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: REVEAL_EASE }}
      className="group relative aspect-[3/4] min-w-[78%] shrink-0 snap-start overflow-hidden rounded-[var(--radius-lg)] bg-ink sm:min-w-[60%] md:aspect-[4/5] md:min-w-0"
    >
      <Link
        to={`/esplora?zone=${card.slug}`}
        className="block h-full w-full"
        aria-label={`Esplora ${card.label}`}
      >
        {card.kind === 'photo' ? (
          <OptimizedImage
            src={card.cover}
            alt={card.alt}
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
            responsiveWidths={[320, 480]}
            sizes="(max-width: 768px) 78vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-ink-deep)]">
            <Compass
              size={72}
              strokeWidth={1}
              aria-hidden="true"
              className="text-white/12 transition-transform duration-[1400ms] ease-out group-hover:rotate-12"
            />
          </div>
        )}

        {card.kind === 'photo' && (
          <div aria-hidden="true" className="twu-cover-scrim absolute inset-0" />
        )}

        <div className="absolute inset-x-5 bottom-5 flex flex-col gap-1.5 md:inset-x-6 md:bottom-6">
          <h3 className="font-serif text-3xl leading-[0.95] text-white drop-shadow-lg md:text-4xl">
            {card.label}
          </h3>
          <p className="text-sm leading-relaxed text-white/78">{card.sublabel}</p>
          <span className="mt-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/90">
            {card.kind === 'photo' ? 'Esplora' : 'Presto'}
            <ArrowRight
              size={12}
              className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1.5"
            />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
