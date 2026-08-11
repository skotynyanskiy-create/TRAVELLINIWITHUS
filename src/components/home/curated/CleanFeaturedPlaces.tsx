import { ArrowUpRight, MapPin, Sparkles, Star } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import OptimizedImage from '@/src/components/OptimizedImage';
import { useMemo } from 'react';
import { usePersonalizedInterest } from '@/src/hooks/usePersonalizedInterest';
import { CURATED_IDS, selectHomeFeaturedItems } from '@/src/lib/homeContentSelection';
import { PARTNERSHIP_LABEL } from '@/src/types/content';

interface PlaceItem {
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
}

/**
 * Selezione curata di posti REALI dal content-seed (cover ufficiali, scheda
 * /posto/:id). ID scelti a mano per varietà di categoria e forza visiva —
 * volutamente diversi dall'hero e dai primi reel, per non ripetere gli stessi
 * posti in più sezioni della home.
 */
export { CURATED_IDS };

function toPlaceItem(item: NonNullable<ReturnType<typeof selectHomeFeaturedItems>[number]>): PlaceItem {
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
    };
}

export default function CleanFeaturedPlaces() {
  const { interest } = usePersonalizedInterest();
  const featuredPlaces = useMemo(
    () => selectHomeFeaturedItems(interest).map(toPlaceItem),
    [interest]
  );

  if (featuredPlaces.length === 0) return null;

  return (
    <section className="bg-white py-20 md:py-28 text-[var(--color-ink,#1a2b3c)] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-14 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
              <Sparkles size={14} />
              Selezione della Settimana
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight md:text-5xl">
              I posti che ci hanno conquistato.
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

        {/* 3 Clean Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {featuredPlaces.map((place) => (
            <Link
              key={place.id}
              to={place.link}
              className="group flex flex-col overflow-hidden rounded-[var(--radius-lg,16px)] border border-[var(--color-border)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/5">
                <OptimizedImage
                  src={place.image}
                  alt={place.title}
                  sizes="(max-width: 768px) 92vw, 30vw"
                  responsiveWidths={[320, 480, 768]}
                  style={{ objectPosition: `50% ${place.focusY}%` }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute left-3 top-3 right-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    <MapPin size={10} className="text-[var(--color-accent)]" />
                    {place.location}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[var(--color-ink)] shadow-sm">
                    <Star
                      size={10}
                      className="fill-[var(--color-accent)] text-[var(--color-accent)]"
                    />
                    {place.score}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
                    {place.category}
                  </span>
                  <h3 className="mt-1 font-serif text-xl font-normal leading-snug text-white">
                    {place.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <p className="text-xs leading-relaxed text-[var(--color-muted-fg)]">
                  {place.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-xs font-semibold">
                  <span className="text-[var(--color-ink)]">{place.price}</span>
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
