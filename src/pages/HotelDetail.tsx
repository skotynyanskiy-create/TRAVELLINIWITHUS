import { useEffect, useState } from 'react';
import { ExternalLink, MapPin, ShieldCheck, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import DemoContentNotice from '../components/DemoContentNotice';
import Newsletter from '../components/Newsletter';
import OptimizedImage from '../components/OptimizedImage';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import { SITE_URL } from '../config/site';
import { prepareAffiliateLink } from '../lib/affiliate';
import { fetchHotelBySlug } from '../services/firebaseService';
import type { HotelEntry } from '../types';
import NotFound from './NotFound';

export default function HotelDetail() {
  const { slug } = useParams();
  const [hotel, setHotel] = useState<HotelEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadHotel = async () => {
      if (!slug) {
        setHotel(null);
        setLoading(false);
        return;
      }

      const result = await fetchHotelBySlug(slug);
      if (!active) return;

      setHotel(result);
      setLoading(false);
    };

    loadHotel();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <PageLayout>
        <section className="min-h-screen bg-sand px-6 py-32">
          <div className="mx-auto max-w-6xl animate-pulse rounded-[2rem] border border-black/5 bg-white p-12" />
        </section>
      </PageLayout>
    );
  }

  if (!hotel) {
    return <NotFound />;
  }

  const canonical = `${SITE_URL}/dove-dormire/${hotel.slug}`;
  const bookingLink = prepareAffiliateLink('booking', hotel.bookingUrl, {
    campaign: `hotel_${hotel.slug}`,
    placement: 'hotel_detail',
    label: hotel.name,
  });

  return (
    <PageLayout>
      <SEO
        title={`${hotel.name} - Dove dormire a ${hotel.destination}`}
        description={hotel.summary}
        canonical={canonical}
        noindex={hotel.isFallback}
      />

      <section className="bg-sand pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-12">
          <Breadcrumbs
            items={[
              { label: 'Guide', href: '/guide' },
              { label: 'Dove dormire', href: '/dove-dormire' },
              { label: hotel.name },
            ]}
          />

          {hotel.isFallback ? (
            <DemoContentNotice
              className="mt-8"
              message="Scheda hotel da fallback locale: utile per QA e anteprima del template. Prima del lancio deve essere sostituita o confermata nella collection Firestore hotels."
            />
          ) : null}

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
              <div className="aspect-[4/3] bg-[var(--color-sand)]">
                <OptimizedImage
                  src={hotel.image}
                  alt={hotel.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/5 bg-white p-8 md:p-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
                Dove dormire / {hotel.destination}
              </p>
              <h1 className="mt-4 text-4xl font-serif leading-tight text-[var(--color-ink)] md:text-5xl">
                {hotel.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-black/55">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-[var(--color-accent-text)]">
                  <MapPin size={14} />
                  {hotel.mapLabel ?? hotel.destination}
                </span>
                <span className="rounded-full border border-black/8 px-3 py-1">
                  {hotel.category}
                </span>
                {hotel.rating ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-black/8 px-3 py-1">
                    <Star size={14} className="text-[var(--color-accent)]" fill="currentColor" />
                    {hotel.rating}
                  </span>
                ) : null}
              </div>
              <p className="mt-6 text-base leading-relaxed text-black/65">{hotel.summary}</p>
              <p className="mt-5 rounded-2xl bg-[var(--color-accent-soft)] p-4 text-sm leading-relaxed text-[var(--color-accent-text)]">
                <strong className="font-semibold text-[var(--color-ink)]">
                  Quando lo consigliamo:
                </strong>{' '}
                {hotel.fit}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={bookingLink.href}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  onClick={bookingLink.onClick}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
                >
                  Vedi disponibilita
                  <ExternalLink size={14} />
                </a>
                <Link
                  to="/dove-dormire"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)]"
                >
                  Torna agli hotel
                </Link>
              </div>

              <p className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-black/35">
                <ShieldCheck size={13} />
                Disclosure: link affiliato Booking, prezzo invariato per chi prenota.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:px-10 lg:grid-cols-3 xl:px-12">
          <article className="rounded-[2rem] border border-black/5 bg-sand p-8 lg:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
              Nota editoriale
            </p>
            <h2 className="mt-4 text-3xl font-serif leading-tight text-[var(--color-ink)]">
              Perche entra davvero nella nostra selezione
            </h2>
            <p className="mt-5 text-base leading-relaxed text-black/65">{hotel.editorialNote}</p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-serif text-[var(--color-ink)]">Punti forti</h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-black/65">
                  {hotel.pros.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-serif text-[var(--color-ink)]">Da sapere prima</h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-black/65">
                  {hotel.cons.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-black/5 bg-white p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
              Fit
            </p>
            <h2 className="mt-4 text-2xl font-serif leading-tight text-[var(--color-ink)]">
              Ideale per
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {hotel.idealFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-black/8 bg-[var(--color-accent-soft)] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--color-accent-text)]"
                >
                  {item}
                </span>
              ))}
            </div>
            {hotel.priceHint ? (
              <p className="mt-6 text-sm leading-relaxed text-black/65">
                Fascia prezzo indicativa:{' '}
                <strong className="text-[var(--color-ink)]">{hotel.priceHint}</strong> a notte.
              </p>
            ) : null}
            {hotel.relatedGuideHref ? (
              <Link
                to={hotel.relatedGuideHref}
                className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent-text)] transition-colors hover:text-[var(--color-accent)]"
              >
                Apri guida collegata
              </Link>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="bg-[var(--color-ink)] py-20 text-white md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent)]">
              Pianifica meglio
            </p>
            <h2 className="mt-4 text-4xl font-serif leading-tight md:text-5xl">
              Ricevi nuovi hotel e guide
              <span className="italic text-white/60"> solo quando meritano davvero.</span>
            </h2>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-10">
            <Newsletter compact variant="business" source={`hotel_${hotel.slug}`} />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
