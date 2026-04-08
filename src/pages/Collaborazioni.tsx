import { useEffect, useState } from 'react';
import {
  Camera,
  PenTool,
  Users,
  BarChart,
  CheckCircle,
  ArrowRight,
  Globe,
  Instagram,
  Clapperboard,
  BriefcaseBusiness,
  ChevronDown,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Breadcrumbs from '../components/Breadcrumbs';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Button from '../components/Button';
import OptimizedImage from '../components/OptimizedImage';
import Section from '../components/Section';
import JsonLd from '../components/JsonLd';
import { fetchStats, SiteStats } from '../services/firebaseService';
import { siteContentDefaults } from '../config/siteContent';
import { useSiteContent } from '../hooks/useSiteContent';
import { BRAND_STATS, SITE_URL } from '../config/site';

const FAQ_ITEMS = [
  {
    q: 'Quanto costa una collaborazione?',
    a: 'Dipende da formato, obiettivo e complessita. Partiamo da una base chiara, poi definiamo il progetto sul contesto reale.',
  },
  {
    q: 'Quali sono le tempistiche?',
    a: 'Di solito servono da due a quattro settimane dalla conferma. Per press trip o progetti piu ampi i tempi vengono definiti insieme.',
  },
  {
    q: 'Chi detiene i diritti sui contenuti?',
    a: 'I contenuti pubblicati sui nostri canali restano nostri. Se serve utilizzo esterno, definiamo la licenza nel progetto.',
  },
  {
    q: "C'e un processo di approvazione?",
    a: 'Manteniamo liberta editoriale piena. Il partner puo controllare i dati fattuali, non il giudizio o il tono del racconto.',
  },
  {
    q: 'Posso vedere esempi di lavori precedenti?',
    a: 'Si. Quando il contatto e in linea condividiamo il materiale utile dal media kit e apriamo il confronto con piu contesto.',
  },
];

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

function FaqSection({ title, description }: { title: string; description: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            FAQ
          </span>
          <h2 className="text-4xl font-serif">{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-black/65">
            {description}
          </p>
        </div>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} className="overflow-hidden rounded-2xl border border-black/5 bg-white">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-[var(--color-sand)]"
                aria-expanded={openIndex === idx}
              >
                <span className="text-lg font-serif font-medium">{item.q}</span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-black/40 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-base font-normal leading-relaxed text-black/70">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default function Collaborazioni() {
  const breadcrumbItems = [{ label: 'Collaborazioni' }];
  const [stats, setStats] = useState<SiteStats | null>(null);
  const { data: content } = useSiteContent('collaborations');
  const pageContent = content ?? siteContentDefaults.collaborations;
  const serviceIcons = [Camera, Clapperboard, PenTool, Globe];

  useEffect(() => {
    const loadStats = async () => {
      const fetchedStats = await fetchStats();
      if (fetchedStats) {
        setStats(fetchedStats);
      }
    };

    loadStats();
  }, []);

  const resolvedStats = stats ?? {
    igFollowers: BRAND_STATS.instagramFollowers,
    monthlyReach: BRAND_STATS.monthlyReach,
    uniqueUsers: BRAND_STATS.totalFollowers,
    engagementRate: BRAND_STATS.engagementRate,
  };

  const statsCards = [
    { icon: Instagram, value: resolvedStats.igFollowers, label: 'Follower Instagram' },
    { icon: Users, value: resolvedStats.monthlyReach, label: 'Reach mensile stimata' },
    { icon: BarChart, value: resolvedStats.engagementRate, label: 'Engagement rate' },
  ];

  return (
    <PageLayout>
      <SEO
        title="Collaborazioni"
        description="Collaboriamo con destinazioni, hospitality e brand travel per creare contenuti autentici, utili e coerenti con lo stile Travelliniwithus."
        canonical={`${SITE_URL}/collaborazioni`}
      />
      <JsonLd data={faqStructuredData} />

      <Section className="pt-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-8 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="h-[1px] w-12 bg-[var(--color-accent)]"></div>
              <span className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                {pageContent.heroEyebrow}
              </span>
            </div>

            <div className="mb-8 inline-block">
              <h1 className="text-5xl font-serif leading-tight md:text-7xl">
                {pageContent.heroTitleMain} <br />
                <span className="italic text-black/60">{pageContent.heroTitleAccent}</span>
              </h1>
            </div>

            <p className="mb-8 text-lg font-light leading-relaxed text-black/70">
              {pageContent.heroDescription}
            </p>

            <p className="mb-8 max-w-2xl text-sm font-medium leading-relaxed text-[var(--color-accent-text)]">
              {pageContent.heroProofLine}
            </p>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pageContent.heroChecklist.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-[var(--color-accent-soft)] px-5 py-4 text-sm text-black/70"
                >
                  <CheckCircle size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                to={pageContent.primaryCtaLink}
                variant="primary"
                size="lg"
                className="px-8 py-4"
              >
                {pageContent.primaryCtaLabel} <ArrowRight size={18} />
              </Button>
              <Button
                to={pageContent.secondaryCtaLink}
                variant="outline"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-black/10 bg-white px-8 py-4 text-xs font-bold uppercase tracking-widest text-black shadow-sm transition-all duration-300 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:shadow-md"
              >
                {pageContent.secondaryCtaLabel}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl transition-transform duration-700 hover:rotate-0 lg:-rotate-2">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop"
                alt={pageContent.heroImageAlt}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-8 -left-8 hidden rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-md md:block">
              <div className="mb-2 flex items-center gap-4">
                <BriefcaseBusiness className="text-[var(--color-accent)]" size={24} />
                <span className="text-2xl font-serif font-medium text-[var(--color-ink)]">
                  Progetti selezionati
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
                Partnership con fit editoriale reale
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section className="my-20 rounded-[3rem] bg-[var(--color-accent-soft)] p-12 md:p-20">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-serif">{pageContent.statsTitle}</h2>
          <p className="text-lg font-normal text-black/70">{pageContent.statsDescription}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {statsCards.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <item.icon size={24} />
              </div>
              <div className="mb-2 text-4xl font-serif text-[var(--color-ink)]">{item.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Partner ideali
          </span>
          <h2 className="mb-6 text-4xl font-serif">{pageContent.partnerTitle}</h2>
          <p className="mb-12 text-lg font-normal text-black/70">{pageContent.partnerDescription}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { name: 'Travel & Tourism', sector: 'Destinazioni ed enti', icon: Globe },
            { name: 'Food & Dining', sector: 'Ristoranti e locali', icon: Camera },
            { name: 'Hospitality', sector: 'Hotel, B&B, agriturismi', icon: BriefcaseBusiness },
            { name: 'Lifestyle', sector: 'Brand e prodotti travel', icon: PenTool },
          ].map((brand, idx) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <brand.icon size={28} />
              </div>
              <h3 className="mb-1 text-lg font-serif font-medium">{brand.name}</h3>
              <p className="text-xs font-medium uppercase tracking-widest text-black/40">
                {brand.sector}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section title={pageContent.servicesTitle} subtitle={pageContent.servicesSubtitle}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pageContent.services.map((service, i) => {
            const Icon = serviceIcons[i] ?? Camera;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col rounded-3xl border border-black/5 bg-[var(--color-accent-soft)] p-8 transition-all duration-500 hover:shadow-xl hover:shadow-black/5"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[var(--color-accent)] shadow-sm">
                  <Icon size={24} />
                </div>
                <h3 className="mb-3 text-2xl font-serif">{service.title}</h3>
                <p className="font-normal leading-relaxed text-black/70">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      <Section title={pageContent.processTitle}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {pageContent.processSteps.map((step) => (
            <div
              key={step.step}
              className="relative rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="absolute right-6 top-4 text-6xl font-serif text-[var(--color-accent-soft)]">
                {step.step}
              </div>
              <h3 className="relative z-10 mb-3 text-2xl font-serif">{step.title}</h3>
              <p className="relative z-10 font-normal leading-relaxed text-black/70">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="relative overflow-hidden rounded-[3rem] bg-[var(--color-ink)] p-12 text-white md:p-20">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-full opacity-10">
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-[var(--color-ink)] via-transparent to-[var(--color-ink)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px] opacity-40"></div>
        </div>

        <div className="relative z-20">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-serif md:text-5xl">{pageContent.formatsTitle}</h2>
            <p className="font-normal text-white/80">{pageContent.formatsDescription}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pageContent.collaborationFormats.map((pkg, pkgIdx) => {
              const isHighlighted = pkg.highlight === 'true';
              const ctaLabels = [
                'Apri un confronto base',
                'Apri il confronto completo',
                'Parliamone insieme',
              ];

              return (
                <div
                  key={pkg.title}
                  className={`flex flex-col rounded-3xl border p-10 transition-transform duration-500 hover:-translate-y-2 ${
                    isHighlighted
                      ? 'border-[var(--color-accent-warm)]/50 bg-white/10 shadow-2xl shadow-[var(--color-accent-warm)]/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  {isHighlighted && (
                    <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-warm)]">
                      Formato centrale
                    </div>
                  )}
                  <h3 className="mb-2 text-2xl font-serif">{pkg.title}</h3>
                  <div className="mb-6 text-sm uppercase tracking-[0.2em] text-white/45">
                    {pkg.subtitle}
                  </div>
                  <ul className="mb-10 flex-grow space-y-4">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-white/80">
                        <CheckCircle size={16} className="shrink-0 text-[var(--color-accent)]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    to={isHighlighted ? pageContent.primaryCtaLink : '/contatti'}
                    variant={isHighlighted ? 'primary' : 'outline'}
                    className={`w-full ${isHighlighted ? 'bg-[var(--color-gold)] hover:brightness-110' : 'border-white/20 hover:bg-white hover:text-black'}`}
                  >
                    {ctaLabels[pkgIdx] ?? 'Richiedi info'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      <FaqSection title={pageContent.faqTitle} description={pageContent.faqDescription} />

      <Section className="my-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-serif">{pageContent.finalCtaTitle}</h2>
          <p className="mb-10 text-lg font-normal text-black/70">{pageContent.finalCtaDescription}</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button to={pageContent.finalPrimaryCtaLink} variant="cta" size="lg" className="px-10 py-5">
              {pageContent.finalPrimaryCtaLabel} <ArrowRight size={18} />
            </Button>
            <Button to={pageContent.finalSecondaryCtaLink} variant="outline" size="lg" className="px-10 py-5">
              {pageContent.finalSecondaryCtaLabel}
            </Button>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
