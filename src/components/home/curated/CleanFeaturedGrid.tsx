import { ArrowUpRight, MapPin, Sparkles, Star } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import OptimizedImage from '@/src/components/OptimizedImage';
import { selectHomeGridItems } from '@/src/lib/homeGridSelection';
import { CURATED_IDS } from '../curated/CleanFeaturedPlaces';
import { PARTNERSHIP_LABEL } from '@/src/types/content';

interface GridTile {
  id: string;
  title: string;
  location: string;
  category: string;
  price: string;
  score: string;
  image: string;
  focusY: number;
  link: string;
  description: string;
  isFeatured: boolean;
}

const { items, featuredId } = selectHomeGridItems(undefined, undefined, CURATED_IDS);

const GRID_TILES: GridTile[] = items.map((item) => {
  const disclosure = PARTNERSHIP_LABEL[item.partnership.kind];
  return {
    id: item.id,
    title: item.title,
    location: item.place.city ?? item.place.region ?? item.place.country,
    category: item.types[0],
    price: item.value?.price ?? 'Scheda dal viaggio',
    score: disclosure || 'Provato di persona',
    image: item.cover,
    focusY: item.coverFocusY ?? 50,
    link: `/posto/${item.id}`,
    description: item.description,
    isFeatured: item.id === featuredId,
  };
});

export default function CleanFeaturedGrid() {
  if (GRID_TILES.length === 0) return null;

  return (
    <section className="bg-white py-20 md:py-28 text-[var(--color-ink,#1a2b3c)] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-14 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
              <Sparkles size={14} />
              Il registro dei posti
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight md:text-5xl">
              Nove posti, presi uno per uno.
            </h2>
          </div>
          <Link
            to="/esplora"
            className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-ink)] hover:text-[var(--color-accent-text)] md:mt-0"
          >
            Vedi tutte le destinazioni
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* 3x3 uniform grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {GRID_TILES.map((tile) => (
            <Link
              key={tile.id}
              to={tile.link}
              className={`group flex flex-col overflow-hidden rounded-[var(--radius-lg,16px)] border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                tile.isFeatured
                  ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]'
                  : 'border-[var(--color-border)]'
              }`}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/5">
                <OptimizedImage
                  src={tile.image}
                  alt={`${tile.title} — ${tile.location}`}
                  sizes="(max-width: 768px) 92vw, 30vw"
                  responsiveWidths={[320, 480, 768]}
                  style={{ objectPosition: `50% ${tile.focusY}%` }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute left-3 top-3 right-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    <MapPin size={10} className="text-[var(--color-accent)]" />
                    {tile.location}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[var(--color-ink)] shadow-sm">
                    <Star
                      size={10}
                      className="fill-[var(--color-accent)] text-[var(--color-accent)]"
                    />
                    {tile.score}
                  </span>
                </div>

                {tile.isFeatured && (
                  <span className="absolute left-3 bottom-[4.75rem] inline-flex items-center gap-1 rounded-full bg-[var(--color-ink,#0a0a0a)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                    In evidenza
                  </span>
                )}

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
                    {tile.category}
                  </span>
                  <h3
                    className={`mt-1 font-serif font-normal leading-snug text-white ${
                      tile.isFeatured ? 'text-2xl' : 'text-xl'
                    }`}
                  >
                    {tile.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <p className="text-xs leading-relaxed text-[var(--color-muted-fg)]">
                  {tile.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-xs font-semibold">
                  <span className="text-[var(--color-ink)]">{tile.price}</span>
                  <span className="text-[var(--color-accent-text)] group-hover:translate-x-1 transition-transform">
                    Scopri di più &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
