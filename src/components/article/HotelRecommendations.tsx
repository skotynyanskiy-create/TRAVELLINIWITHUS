import { ExternalLink, Star } from 'lucide-react';
import { prepareAffiliateLink } from '../../lib/affiliate';
import OptimizedImage from '../OptimizedImage';
import type { HotelRecommendation } from './types';

interface HotelRecommendationsProps {
  hotels: HotelRecommendation[];
  destination: string;
}

export default function HotelRecommendations({ hotels, destination }: HotelRecommendationsProps) {
  if (!hotels.length) return null;

  return (
    <section className="mt-14 scroll-mt-32">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
            Dove dormire
          </p>
          <h3 className="text-2xl font-serif leading-tight text-[var(--color-ink)] md:text-3xl">
            I nostri alloggi consigliati a {destination}
          </h3>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {hotels.slice(0, 3).map((hotel) => {
          const { href, onClick } = prepareAffiliateLink('booking', hotel.bookingUrl, {
            campaign: `article_hotel_${destination}`,
            placement: 'hotel_widget',
            label: hotel.name,
          });

          return (
            <a
              key={hotel.name}
              href={href}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={onClick}
              className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-sand)]">
                <OptimizedImage
                  src={hotel.image}
                  alt={hotel.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {hotel.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)] shadow-sm backdrop-blur-sm">
                    {hotel.badge}
                  </span>
                )}
              </div>

              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  {hotel.rating && (
                    <div className="flex items-center gap-1 text-[var(--color-accent)]">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-semibold">{hotel.rating}</span>
                    </div>
                  )}
                  {hotel.category && (
                    <span className="text-[10px] uppercase tracking-widest text-black/35">
                      {hotel.category}
                    </span>
                  )}
                </div>

                <h4 className="mb-3 text-lg font-serif leading-tight text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">
                  {hotel.name}
                </h4>

                {hotel.priceHint && (
                  <p className="mb-3 text-sm text-black/50">
                    Da{' '}
                    <span className="font-semibold text-[var(--color-ink)]">{hotel.priceHint}</span>{' '}
                    a notte
                  </p>
                )}

                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-affiliate-booking)] transition-colors group-hover:text-[var(--color-accent)]">
                  Vedi disponibilità <ExternalLink size={10} />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
