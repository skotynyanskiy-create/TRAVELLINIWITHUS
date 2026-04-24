import { motion } from 'motion/react';
import { ArrowRight, Hotel } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import HotelRecommendations from '../components/article/HotelRecommendations';
import type { HotelRecommendation } from '../components/article';
import JsonLd from '../components/JsonLd';
import Newsletter from '../components/Newsletter';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import { getHotelsByDestination } from '../config/hotelDirectory';
import { slugifyGuideCategory } from '../config/contentTaxonomy';
import { SITE_URL } from '../config/site';

interface DestinationBlock {
  slug: string;
  name: string;
  tagline: string;
  hubHref: string;
  articleHref?: string;
  hotels: HotelRecommendation[];
}

const DOVE_DORMIRE_GUIDE_PATH = `/guide?cat=${slugifyGuideCategory('Dove dormire')}`;
const HOTELS_BY_DESTINATION = getHotelsByDestination();

const DESTINATIONS: DestinationBlock[] = [
  {
    slug: 'dolomiti',
    name: 'Dolomiti',
    tagline: 'Rifugi contemporanei tra le cime UNESCO: cena lenta, vista verticale.',
    hubHref: '/destinazioni/italia',
    articleHref: '/itinerari/dolomiti-rifugi-design',
    hotels: HOTELS_BY_DESTINATION.Dolomiti ?? [],
  },
  {
    slug: 'puglia',
    name: 'Puglia',
    tagline: 'Masserie e borghi bianchi: tempo dilatato, olio, pietra e mare.',
    hubHref: '/destinazioni/italia',
    hotels: HOTELS_BY_DESTINATION.Puglia ?? [],
  },
  {
    slug: 'grecia',
    name: 'Grecia delle isole',
    tagline: 'Cicladi e Dodecanneso, tra calette e taverne fuori dai radar.',
    hubHref: '/destinazioni/grecia',
    hotels: HOTELS_BY_DESTINATION['Grecia delle isole'] ?? [],
  },
  {
    slug: 'portogallo',
    name: 'Portogallo',
    tagline: 'Lisbona lenta, Alentejo profondo, scogliere dell Algarve.',
    hubHref: '/destinazioni/portogallo',
    hotels: HOTELS_BY_DESTINATION.Portogallo ?? [],
  },
];

export default function DoveDormire() {
  const pageUrl = `${SITE_URL}/dove-dormire`;
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Dove dormire - Hotel consigliati dai Travellini',
    description:
      'Una selezione curata di hotel e masserie collegata al layer guide Travelliniwithus, con criteri dichiarati e link affiliati Booking.',
    url: pageUrl,
    inLanguage: 'it-IT',
    mainEntity: {
      '@type': 'ItemList',
      name: 'Hotel curati Travelliniwithus',
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: DESTINATIONS.reduce((sum, destination) => sum + destination.hotels.length, 0),
      itemListElement: DESTINATIONS.flatMap((destination, destinationIndex) =>
        destination.hotels.map((hotel, hotelIndex) => ({
          '@type': 'ListItem',
          position: destinationIndex * 10 + hotelIndex + 1,
          item: {
            '@type': 'LodgingBusiness',
            name: hotel.name,
            image: hotel.image,
            address: { '@type': 'PostalAddress', addressLocality: destination.name },
            aggregateRating: hotel.rating
              ? {
                  '@type': 'AggregateRating',
                  ratingValue: hotel.rating,
                  bestRating: 10,
                }
              : undefined,
            priceRange: hotel.priceHint,
            url: hotel.slug ? `${SITE_URL}/dove-dormire/${hotel.slug}` : hotel.bookingUrl,
          },
        }))
      ),
    },
  };

  return (
    <PageLayout>
      <SEO
        title="Dove dormire - Hotel consigliati dai Travellini"
        description="Una sezione verticale del layer guide Travelliniwithus: hotel e masserie scelti con criterio, note editoriali e link affiliati dichiarati."
        canonical={pageUrl}
      />
      <JsonLd data={webPageSchema} />

      <section className="bg-sand py-24 md:py-32">
        <div className="mx-auto max-w-272 px-6 md:px-10 xl:px-12">
          <Breadcrumbs
            items={[{ label: 'Guide', href: '/guide' }, { label: 'Dove dormire' }]}
            className="justify-center"
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <Hotel size={22} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Guide / Dove dormire
            </span>
            <h1 className="mt-5 text-5xl font-serif leading-[1.05] text-ink md:text-6xl">
              Gli hotel che consigliamo davvero,
              <span className="italic text-black/55"> non un archivio generico.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-black/62">
              Questa e la parte planning del sito dedicata agli alloggi: strutture che entrano nella
              selezione solo quando hanno atmosfera, fit chiaro e un motivo concreto per restarci
              davvero.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={DOVE_DORMIRE_GUIDE_PATH}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-accent"
              >
                Apri la sezione hotel
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/inizia-da-qui"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:border-accent hover:text-accent-text"
              >
                Vai al funnel Pianifica
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-304 space-y-24 px-6 md:px-10 xl:px-12">
          {DESTINATIONS.map((destination, index) => (
            <motion.div
              key={destination.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: Math.min(index * 0.05, 0.2),
              }}
            >
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent-text">
                    {destination.name}
                  </span>
                  <h2 className="mt-3 max-w-xl text-3xl font-serif leading-tight text-ink md:text-4xl">
                    {destination.tagline}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {destination.articleHref ? (
                    <Link
                      to={destination.articleHref}
                      className="inline-flex items-center gap-2 self-start rounded-full border border-black/10 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-ink transition-colors hover:border-accent hover:text-accent-text"
                    >
                      Leggi l itinerario collegato
                      <ArrowRight size={14} />
                    </Link>
                  ) : null}
                  <Link
                    to={destination.hubHref}
                    className="inline-flex items-center gap-2 self-start rounded-full border border-black/10 bg-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-black/55 transition-colors hover:border-accent hover:text-accent-text"
                  >
                    Apri destinazione
                  </Link>
                </div>
              </div>

              <HotelRecommendations hotels={destination.hotels} destination={destination.name} />

              <div className="mt-6 flex flex-wrap gap-3">
                {destination.hotels.slice(0, 3).map((hotel) =>
                  hotel.slug ? (
                    <Link
                      key={hotel.slug}
                      to={`/dove-dormire/${hotel.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-ink transition-colors hover:border-accent hover:text-accent-text"
                    >
                      Scheda {hotel.name}
                      <ArrowRight size={12} />
                    </Link>
                  ) : null
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-sand py-20 md:py-24">
        <div className="mx-auto grid max-w-272 gap-10 px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-16 md:px-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Newsletter
            </span>
            <h2 className="mt-4 max-w-xl text-4xl font-serif leading-[1.05] text-ink md:text-5xl">
              Nuovi hotel e guide,
              <span className="italic text-black/55"> solo quando hanno senso.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-black/62">
              Ti scriviamo quando una struttura entra davvero nella shortlist o quando pubblichiamo
              una guida che aiuta a scegliere meglio dove dormire.
            </p>
          </div>
          <div className="rounded-2xl border border-black/6 bg-white p-8 md:p-10">
            <Newsletter compact variant="sand" source="dove_dormire" />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
