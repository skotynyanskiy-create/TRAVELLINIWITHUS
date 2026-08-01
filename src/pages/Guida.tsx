import { useState } from 'react';
import { motion } from 'motion/react';
import { useParams } from 'react-router-dom';
import { Link } from '@/src/components/TransitionLink';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  Map,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import DemoContentNotice from '../components/DemoContentNotice';
import OptimizedImage from '../components/OptimizedImage';
import JsonLd from '../components/JsonLd';
import PageLayout from '../components/PageLayout';
import Section from '../components/Section';
import SEO from '../components/SEO';
import StickyMobileCTA from '../components/StickyMobileCTA';
import NotFound from './NotFound';
import { DEMO_GUIDES } from '../config/demoGuides';
import { SITE_URL } from '../config/site';
import { formatPrice } from '../utils/format';
import { trackEvent } from '../services/analytics';

export default function Guida() {
  const { slug } = useParams();
  const guide = DEMO_GUIDES.find((item) => item.slug === slug);
  const [activePreview, setActivePreview] = useState(0);

  if (!guide) return <NotFound />;

  // Galleria opzionale: alcune guide non hanno ancora una cover reale (niente
  // foto stock/AI). In quel caso la card mostra la targa editoriale sotto.
  const gallery = guide.previewImages ?? [];
  const activeImage = gallery[activePreview] ?? guide.coverImage;
  const thumbnails = [guide.coverImage, ...gallery].filter((image): image is string =>
    Boolean(image)
  );

  const handleAddToCart = () => {
    trackEvent('guide_add_to_cart_attempt', { slug: guide.slug, demo: true });
  };

  return (
    <PageLayout>
      <SEO
        title={`${guide.title} — Guida digitale`}
        description={guide.excerpt}
        canonical={`${SITE_URL}/guide/${guide.slug}`}
        image={guide.coverImage}
        noindex={guide.isDemo}
      />

      {!guide.isDemo && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: SITE_URL,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Guide',
                item: `${SITE_URL}/guide`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: guide.title,
                item: `${SITE_URL}/guide/${guide.slug}`,
              },
            ],
          }}
        />
      )}

      <Section className="pt-8">
        <Breadcrumbs items={[{ label: 'Guide', href: '/guide' }, { label: guide.title }]} />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                {guide.category}
              </span>
              {guide.isBestseller && (
                <span className="rounded-full bg-[var(--color-ink)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                  Bestseller
                </span>
              )}
              {guide.isNew && (
                <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-ink)]">
                  Nuova
                </span>
              )}
              {guide.isDemo && (
                <span className="rounded-full border border-[var(--color-accent)]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                  Anteprima
                </span>
              )}
            </div>

            <h1 className="text-5xl font-serif leading-[1.05] tracking-tight md:text-6xl">
              {guide.title}
            </h1>
            <p className="mt-4 text-xl text-black/65">{guide.subtitle}</p>

            <p className="mt-7 max-w-2xl text-base leading-relaxed text-black/72 md:text-lg">
              {guide.excerpt}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
              <SpecPill
                icon={<FileText size={14} />}
                label="Pagine"
                value={guide.pages || 'Template'}
              />
              <SpecPill icon={<Map size={14} />} label="Destinazione" value={guide.destination} />
              <SpecPill icon={<ShieldCheck size={14} />} label="Formato" value={guide.format} />
              <SpecPill icon={<Clock size={14} />} label="Aggiornata" value={guide.updatedAt} />
            </div>

            {guide.isDemo && (
              <DemoContentNotice
                className="mt-10"
                title="Guida in anteprima"
                message="Questa guida è in preparazione: la scheda mostra struttura, contenuti previsti e ritmo editoriale. Acquisto e download restano disabilitati finché file, prezzo e consegna non sono verificati."
              />
            )}

            <div className="mt-10 rounded-[var(--radius-lg)] border border-black/5 bg-white p-7 shadow-sm md:p-9">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                    Prezzo digitale
                  </p>
                  <p className="mt-2 font-serif text-5xl text-[var(--color-ink)]">
                    {formatPrice(guide.price)}
                  </p>
                  <p className="mt-1 text-xs text-black/70">
                    {guide.isDemo
                      ? 'Prezzo indicativo · download al lancio'
                      : 'IVA inclusa · download immediato'}
                  </p>
                </div>
                {guide.isDemo ? (
                  <span className="inline-flex min-w-[220px] cursor-not-allowed items-center justify-center gap-2 rounded-full bg-black/60 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white opacity-60">
                    <Lock size={16} /> In arrivo
                  </span>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    size="lg"
                    className="min-w-[220px]"
                  >
                    Acquista ora <ArrowRight size={16} />
                  </Button>
                )}
              </div>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {guide.bestFor.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-black/65">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[var(--color-accent)]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <section className="mt-14">
              <h2 className="text-3xl font-serif md:text-4xl">Cosa trovi dentro</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {guide.inside.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[var(--radius-md)] bg-[var(--color-sand)] p-5"
                  >
                    <Sparkles size={16} className="mt-1 shrink-0 text-[var(--color-accent)]" />
                    <p className="text-sm leading-relaxed text-black/68">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <div className="sticky top-32">
              <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-sand)] shadow-lg">
                <div className="relative aspect-[4/5]">
                  {activeImage ? (
                    <OptimizedImage
                      src={activeImage}
                      alt={guide.title}
                      className="h-full w-full object-cover transition-opacity duration-500"
                    />
                  ) : (
                    // Targa editoriale: nessuna cover reale ancora disponibile (niente foto stock/AI).
                    <div className="flex h-full w-full flex-col justify-end bg-[var(--color-ink-deep)] p-6">
                      <span aria-hidden="true" className="mb-3 h-px w-8 bg-[var(--color-accent)]" />
                      <p className="font-serif text-2xl leading-snug text-white">{guide.title}</p>
                      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
                        {guide.category}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {thumbnails.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {thumbnails.slice(0, 3).map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActivePreview(Math.max(0, index - 1))}
                      className={`relative aspect-[4/5] overflow-hidden rounded-xl border-2 transition-all ${
                        activePreview === Math.max(0, index - 1)
                          ? 'border-[var(--color-accent)]'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`Anteprima ${index + 1}`}
                    >
                      <OptimizedImage
                        src={image}
                        alt={`Anteprima ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Section>

      <Section className="my-16 rounded-[var(--radius-xl)] bg-[var(--color-ink)] p-12 text-white md:p-16">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
              Travellini Club
            </span>
            <h2 className="mt-4 text-4xl font-serif leading-tight md:text-5xl">
              Tutte le guide a 5 EUR al mese con il Club.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              Accesso a guide nuove e aggiornate, newsletter privata, sconti partner. Stessa
              identità editoriale, senza pagare ogni volta.
            </p>
          </div>
          <Link
            to="/club"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 py-4 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:bg-white"
          >
            Scopri il Club <ArrowRight size={14} />
          </Link>
        </div>
      </Section>
      <StickyMobileCTA
        label={guide.isDemo ? 'Avvisami al lancio' : 'Acquista ora'}
        to={guide.isDemo ? `/contatti?prodotto=${guide.slug}` : undefined}
        onClick={guide.isDemo ? undefined : handleAddToCart}
        trackingId="guida_sticky_mobile"
        revealAfter={-1}
      />
    </PageLayout>
  );
}

function SpecPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-black/5 bg-white px-4 py-3">
      <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-black/60">
        {icon} {label}
      </p>
      <p className="mt-2 text-sm font-medium text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
