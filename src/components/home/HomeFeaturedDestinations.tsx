import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import { motion } from 'motion/react';
import OptimizedImage from '../OptimizedImage';
import { REVEAL_EASE, IMAGE_WIPE_EASE } from '../../lib/animations';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface FeaturedDestination {
  slug: string;
  name: string;
  country: string;
  image: string;
  alt: string;
  blurb: string;
  hook: string;
  articles: number;
}

// Selezione allineata al pattern editoriale di Travelliniwithus (Puglia/Toscana cover
// sono signature gia' confermate da archivio IG e sito).
//
// TODO[asset-curator] 2026-05-29: analisi IG live (@travelliniwithus, 169K, 1236 post)
// ha rilevato che Lombardia (4 highlight: Garda, Bormio, chalet), Veneto (2 highlight)
// e Trentino sono i cluster regionali italiani piu' presenti nell'archivio reale, ma
// non hanno foto destinations/* dedicate. Quando R+B forniscono scatti reali Garda /
// Lago di Como / Bormio (4:5 portrait, 1600x2000+), sostituire la card Sardegna con
// "Lombardia" (slug da aggiungere in src/lib/regions.ts) per riflettere fedelmente
// dove R+B vanno davvero. Sardegna resta valida ma e' meno presente di Lombardia
// nell'archivio social.
const DESTINATIONS: FeaturedDestination[] = [
  {
    slug: 'puglia',
    name: 'Puglia',
    country: 'Italia',
    image: '/images/destinations/puglia.webp',
    alt: "Costa e masserie della Puglia, tra Valle d'Itria e Adriatico",
    blurb: "Valle d'Itria, masserie e costa adriatica. Tre stagioni dentro la luce del sud.",
    hook: 'Settembre 2025',
    articles: 8,
  },
  {
    slug: 'toscana',
    name: 'Toscana',
    country: 'Italia',
    image: '/images/destinations/toscana.webp',
    alt: 'Borghi e colline della Toscana fuori dai circuiti classici',
    blurb: 'Pitigliano sul tufo, Lucignano circolare, il Casentino silenzioso.',
    hook: 'Oltre Firenze e Siena',
    articles: 6,
  },
  {
    slug: 'dolomiti',
    name: 'Dolomiti',
    country: 'Italia',
    image: '/images/destinations/dolomiti.webp',
    alt: 'Vette e rifugi delle Dolomiti',
    blurb: 'Tre rifugi che hanno cambiato il nostro modo di andare in montagna.',
    hook: 'Niente catene',
    articles: 5,
  },
  {
    slug: 'sardegna',
    name: 'Sardegna',
    country: 'Italia',
    image: '/images/destinations/sardegna.webp',
    alt: 'Entroterra della Sardegna tra Barbagia e supramonti',
    blurb: "La Barbagia, i supramonti e il pani carasau caldo. L'isola che chiede tempo.",
    hook: 'Sardegna interna',
    articles: 4,
  },
];

export default function HomeFeaturedDestinations() {
  const [cover, ...rest] = DESTINATIONS;

  return (
    <section
      aria-labelledby="featured-destinations-title"
      className="relative bg-[var(--color-sand)] py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Da dove iniziare
            </span>
            <h2
              id="featured-destinations-title"
              className="mt-2 text-3xl font-serif leading-[1.05] text-ink md:text-5xl"
            >
              I posti dove torniamo,{' '}
              <span className="italic text-black/55">non quelli che spuntiamo</span>.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-black/60 md:text-lg">
              Quattro regioni dove abbiamo dormito due volte, sbagliato la prima e capito la
              seconda. Da qui parte tutto il resto del progetto.
            </p>
          </div>
          <Link
            to="/mappa"
            className="group hidden shrink-0 items-center gap-2 self-end text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)] md:inline-flex"
          >
            <MapPin size={12} className="text-[var(--color-accent)]" />
            Apri la mappa completa
            <ArrowRight
              size={12}
              className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(0,1fr)]">
          <DestinationCard
            destination={cover}
            variant="cover"
            index={0}
            className="lg:col-span-7 lg:row-span-3"
          />
          {rest.map((d, idx) => (
            <DestinationCard
              key={d.slug}
              destination={d}
              variant="row"
              index={idx + 1}
              className="lg:col-span-5 lg:row-span-1"
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link
            to="/mappa"
            className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <MapPin size={12} className="text-[var(--color-accent)]" />
            Apri la mappa
          </Link>
        </div>
      </div>
    </section>
  );
}

type Variant = 'cover' | 'row';

interface DestinationCardProps {
  destination: FeaturedDestination;
  variant: Variant;
  index: number;
  className?: string;
}

function DestinationCard({ destination, variant, index, className = '' }: DestinationCardProps) {
  const reducedMotion = useReducedMotion();

  const aspect = {
    cover: 'aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[680px]',
    row: 'aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[210px]',
  }[variant];

  const titleSize = {
    cover: 'text-4xl md:text-6xl lg:text-7xl',
    row: 'text-2xl md:text-3xl lg:text-4xl',
  }[variant];

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: REVEAL_EASE }}
      className={`group relative overflow-hidden rounded-[var(--radius-lg)] bg-ink ${aspect} ${className}`}
    >
      <Link
        to={`/destinazione/${destination.slug}`}
        className="block h-full w-full"
        aria-label={`Apri la pagina ${destination.name}`}
      >
        <motion.div
          className="absolute inset-0"
          initial={reducedMotion ? false : { clipPath: 'inset(100% 0 0 0)' }}
          whileInView={reducedMotion ? {} : { clipPath: 'inset(0% 0 0 0)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: IMAGE_WIPE_EASE, delay: index * 0.08 + 0.1 }}
        >
          <OptimizedImage
            src={destination.image}
            alt={destination.alt}
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
            responsiveWidths={[320, 480, 768]}
            sizes={
              variant === 'cover'
                ? '(max-width: 768px) 92vw, (max-width: 1024px) 50vw, 55vw'
                : '(max-width: 768px) 92vw, (max-width: 1024px) 50vw, 40vw'
            }
          />
        </motion.div>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/24 to-black/12 transition-opacity duration-500 group-hover:from-black/80"
        />

        <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] shadow-sm backdrop-blur-md md:left-7 md:top-7">
          {destination.hook}
        </div>

        <div className="absolute inset-x-5 bottom-5 flex flex-col gap-3 md:inset-x-7 md:bottom-7">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-white/75">
            {destination.country}
          </div>
          <h3 className={`font-serif leading-[0.95] text-white drop-shadow-lg ${titleSize}`}>
            {destination.name}
          </h3>
          <p className="max-w-md text-sm leading-relaxed text-white/82 md:text-base">
            {destination.blurb}
          </p>
          <span className="mt-1 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/92">
            Apri la regione
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
