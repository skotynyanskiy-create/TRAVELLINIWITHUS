import { motion } from 'motion/react';
import { ArrowRight, Compass, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';
import JsonLd from '../JsonLd';
import Newsletter from '../Newsletter';
import OptimizedImage from '../OptimizedImage';
import PageLayout from '../PageLayout';
import SEO from '../SEO';
import AffiliateBar from '../article/AffiliateBar';
import SubDestinationCard from './SubDestinationCard';
import type { DestinationHub } from '../../config/destinationHubs';
import { SITE_URL } from '../../config/site';

interface DestinationHubLayoutProps {
  hub: DestinationHub;
}

export default function DestinationHubLayout({ hub }: DestinationHubLayoutProps) {
  const pageUrl = `${SITE_URL}/${hub.slug}`;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: hub.country,
    description: hub.seo.description,
    url: pageUrl,
    image: hub.heroImage,
    touristType: ['Coppie', 'Slow travellers', 'Famiglie'],
    includesAttraction: hub.subDestinations
      .filter((d) => !d.href.includes('?'))
      .map((d) => ({
        '@type': 'TouristAttraction',
        name: d.name,
        description: d.tagline,
      })),
  };

  return (
    <PageLayout>
      <SEO
        title={hub.seo.title}
        description={hub.seo.description}
        canonical={pageUrl}
        image={hub.heroImage}
      />
      <JsonLd data={collectionSchema} />

      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 opacity-40">
          <OptimizedImage
            src={hub.heroImage}
            alt={hub.country}
            priority
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/70" />

        <div className="relative mx-auto max-w-272 px-6 py-28 md:px-10 md:py-36 xl:px-12">
          <Breadcrumbs items={[{ label: hub.country }]} className="text-white/70" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/75">
              <span aria-hidden="true">{hub.flag}</span>
              {hub.heroEyebrow}
            </span>
            <h1 className="mt-5 text-5xl font-serif leading-[1.05] md:text-7xl">
              {hub.heroTitleMain}{' '}
              <span className="italic text-white/70">{hub.heroTitleAccent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
              {hub.heroDescription}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to={`/destinazioni?group=${encodeURIComponent(hub.country)}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
              >
                Apri l'archivio {hub.country}
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/inizia-da-qui"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white/90 transition-colors hover:border-white hover:text-white"
              >
                Nuovo qui? Inizia da qui
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-272 px-6 md:px-10">
          <div className="mb-10 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Perché andarci con noi
            </span>
            <h2 className="mx-auto mt-4 max-w-xl text-3xl font-serif leading-tight text-ink md:text-4xl">
              Il nostro metodo applicato a {hub.country}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {hub.methodCards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-black/5 bg-sand p-7 shadow-sm"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Compass size={18} />
                </div>
                <h3 className="mb-2 text-xl font-serif leading-tight text-ink">{card.title}</h3>
                <p className="text-sm leading-relaxed text-black/62">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand py-20 md:py-24">
        <div className="mx-auto max-w-304 px-6 md:px-10 xl:px-12">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
                Sub-destinazioni
              </span>
              <h2 className="mt-4 text-3xl font-serif leading-tight text-ink md:text-4xl">
                Dove andare in {hub.country}
              </h2>
            </div>
            <Link
              to={`/destinazioni?group=${encodeURIComponent(hub.country)}`}
              className="inline-flex items-center gap-2 self-start rounded-full border border-black/10 bg-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-ink transition-colors hover:border-accent hover:text-accent-text md:self-auto"
            >
              Archivio completo
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {hub.subDestinations.map((destination) => (
              <SubDestinationCard key={destination.href} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-272 px-6 md:px-10">
          <div className="mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Travel tips
            </span>
            <h2 className="mt-4 text-3xl font-serif leading-tight text-ink md:text-4xl">
              Cosa sapere prima di partire per {hub.country}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {hub.travelTips.map((tip) => (
              <div key={tip.title} className="rounded-2xl border border-black/5 bg-sand p-6">
                <h3 className="mb-2 text-lg font-serif leading-tight text-ink">{tip.title}</h3>
                <p className="text-sm leading-relaxed text-black/65">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {hub.foodPreview.length > 0 && (
        <section className="bg-ink py-20 text-white md:py-24">
          <div className="mx-auto max-w-272 px-6 md:px-10">
            <div className="mb-10 flex items-center gap-3">
              <UtensilsCrossed size={22} className="text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                Cosa mangiare
              </span>
            </div>
            <h2 className="mb-10 max-w-xl text-3xl font-serif leading-tight md:text-4xl">
              3 piatti di {hub.country} che non possiamo non citare
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {hub.foodPreview.map((dish) => (
                <div key={dish.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                    {dish.region}
                  </span>
                  <h3 className="mt-2 text-xl font-serif leading-tight">{dish.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{dish.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-12">
              <Link
                to="/cosa-mangiare"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent transition-colors hover:text-white"
              >
                Guida gastronomica completa
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-272 px-6 md:px-10">
          <div className="mb-8 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Prenota con i nostri link
            </span>
            <h2 className="mt-4 text-3xl font-serif leading-tight text-ink md:text-4xl">
              Strumenti che usiamo in {hub.country}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/62">{hub.affiliateIntro}</p>
          </div>
          <AffiliateBar destination={hub.country} />
        </div>
      </section>

      <section className="bg-sand py-20 md:py-24">
        <div className="mx-auto grid max-w-272 gap-10 px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-16 md:px-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Newsletter
            </span>
            <h2 className="mt-4 max-w-xl text-4xl font-serif leading-[1.05] text-ink md:text-5xl">
              Nuovi itinerari {hub.country}
              <span className="italic text-black/55"> direttamente in inbox.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-black/62">
              Ti scriviamo quando pubblichiamo una nuova guida di {hub.country}. Niente newsletter
              riempita per forza.
            </p>
          </div>
          <div className="rounded-2xl border border-black/6 bg-white p-8 md:p-10">
            <Newsletter compact variant="sand" source={`hub_${hub.slug}`} />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
