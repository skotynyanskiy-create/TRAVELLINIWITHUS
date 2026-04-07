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
  MousePointerClick,
  Clapperboard,
  BriefcaseBusiness,
  Star,
  TrendingUp,
  ChevronDown,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
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
import { BRAND_STATS } from '../config/site';

const FAQ_ITEMS = [
  {
    q: 'Quanto costa una collaborazione?',
    a: 'Dipende dal formato e dalla complessità. Il nostro Starter Package parte da un singolo articolo, mentre le campagne Destination Focus e Bespoke sono costruite su misura. Contattaci con il tuo budget indicativo e troveremo la soluzione migliore.',
  },
  {
    q: 'Quali sono le tempistiche?',
    a: 'Dalla conferma della collaborazione, servono generalmente 2-4 settimane per la produzione e pubblicazione. Per press trip o campagne complesse, i tempi possono variare — li definiamo insieme in fase di briefing.',
  },
  {
    q: 'Chi detiene i diritti sui contenuti?',
    a: 'I contenuti pubblicati sui nostri canali restano di nostra proprietà. Per uso esterno (sito, ADV, stampa) prevediamo licenze specifiche incluse nel pacchetto Bespoke o negoziabili separatamente.',
  },
  {
    q: "C'è un processo di approvazione?",
    a: 'Manteniamo totale libertà editoriale — è il nostro valore principale. Il partner può verificare la correttezza dei dati fattuali, ma non interveniamo sul tono o sulle opinioni. È così che manteniamo la fiducia della community.',
  },
  {
    q: 'Posso vedere esempi di lavori precedenti?',
    a: 'Certo. Richiedi il nostro Media Kit dalla pagina dedicata: include case study, metriche reali e campioni di contenuti prodotti per partner nei settori travel, food e hospitality.',
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

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <span className="font-script text-xl text-[var(--color-accent-warm)] mb-2 block">
            Domande frequenti
          </span>
          <h2 className="text-4xl font-serif">Tutto quello che devi sapere</h2>
        </div>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-black/5 bg-white overflow-hidden">
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

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.53V6.78a4.85 4.85 0 0 1-1.02-.09z" />
    </svg>
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
    { icon: TikTokIcon, value: BRAND_STATS.tiktokFollowers, label: 'Follower TikTok' },
    { icon: Users, value: resolvedStats.monthlyReach, label: 'Reach mensile stimata' },
    { icon: BarChart, value: resolvedStats.engagementRate, label: 'Engagement rate' },
  ];

  return (
    <PageLayout>
      <SEO
        title="Collaborazioni"
        description="Collaboriamo con destinazioni, locali, brand e prodotti travel per creare contenuti visivi autentici, utili e credibili, coerenti con lo stile Travelliniwithus."
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
            <div className="relative mb-8 inline-block">
              <h1 className="text-5xl font-serif leading-tight md:text-7xl">
                {pageContent.heroTitleMain} <br />
                <span className="italic text-black/60">{pageContent.heroTitleAccent}</span>
              </h1>
              <motion.span
                initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                animate={{ opacity: 1, rotate: -5, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                aria-hidden="true"
                className="absolute -bottom-6 right-10 hidden font-script text-2xl text-[var(--color-accent)] opacity-80 sm:block md:text-3xl"
              >
                lavoriamo insieme
              </motion.span>
            </div>
            <p className="mb-10 text-lg font-light leading-relaxed text-black/70">
              {pageContent.heroDescription}
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
              {/* TODO(@travelliniwithus): PLACEHOLDER — servono foto hero collaborazioni — coppia al lavoro con brand */}
              <OptimizedImage
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop"
                alt="Collaborazioni Travelliniwithus"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-8 -left-8 hidden rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-md md:block">
              <div className="mb-2 flex items-center gap-4">
                <BriefcaseBusiness className="text-[var(--color-accent)]" size={24} />
                <span className="text-2xl font-serif font-medium text-[var(--color-ink)]">
                  Travel, hospitality, lifestyle
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
                Ambiti con cui lavoriamo meglio
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="my-20 rounded-[3rem] bg-[var(--color-accent-soft)] p-12 md:p-20">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-serif">{pageContent.statsTitle}</h2>
          <p className="text-lg font-normal text-black/70">{pageContent.statsDescription}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
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

      {/* Settori con cui lavoriamo */}
      <Section>
        <div className="mx-auto max-w-4xl text-center">
          <span className="font-script text-xl text-[var(--color-accent-warm)] mb-2 block">
            I nostri settori
          </span>
          <h2 className="mb-6 text-4xl font-serif">Con chi lavoriamo meglio</h2>
          <p className="mb-12 text-lg font-normal text-black/70">
            Collaboriamo con realtà nei settori travel, hospitality, food e lifestyle che
            condividono i nostri valori di autenticità.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { name: 'Travel & Tourism', sector: 'Destinazioni ed enti', icon: Globe },
            { name: 'Food & Dining', sector: 'Ristoranti e locali', icon: Camera },
            { name: 'Hospitality', sector: 'Hotel, B&B, agriturismi', icon: BriefcaseBusiness },
            { name: 'Lifestyle', sector: 'Brand e prodotti travel', icon: Star },
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

      {/* Case Study */}
      <Section className="my-16 rounded-[3rem] bg-[var(--color-ink)] p-12 text-white md:p-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Star size={14} className="text-[var(--color-accent-warm)]" />
              <span className="font-script text-xl text-[var(--color-accent-warm)]">
                Case Study
              </span>
            </div>
            <h2 className="mb-6 text-4xl font-serif leading-tight">
              Contenuti autentici che generano risultati reali.
            </h2>
            <p className="mb-8 text-lg font-normal leading-relaxed text-white/85">
              Ogni collaborazione segue il nostro approccio: visitiamo, testiamo, creiamo. Niente
              contenuti generici — solo esperienze vissute che la nostra community riconosce come
              autentiche.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <TrendingUp className="mb-3 text-[var(--color-accent)]" size={24} />
                <div className="text-3xl font-serif text-[var(--color-accent)]">
                  {BRAND_STATS.engagementRate}
                </div>
                <p className="mt-1 text-xs font-medium text-white/50">Engagement rate medio</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <MousePointerClick className="mb-3 text-[var(--color-accent)]" size={24} />
                <div className="text-3xl font-serif text-[var(--color-accent)]">
                  {BRAND_STATS.monthlyReach}
                </div>
                <p className="mt-1 text-xs font-medium text-white/50">Reach mensile</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-white/5 p-8"
            >
              <div className="mb-4 text-4xl font-serif text-[var(--color-accent)] opacity-30">
                "
              </div>
              <p className="mb-6 text-base font-light italic leading-relaxed text-white/80">
                Questi numeri non sono teoria: sono il risultato di anni di contenuti autentici,
                community reale e collaborazioni costruite con criterio.
              </p>
              <p className="mb-8 text-sm font-normal leading-relaxed text-white/80">
                Nel media kit trovi i dati completi, i case study e i feedback dei brand che hanno
                già lavorato con noi.
              </p>
              <Link
                to="/media-kit"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-gold)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
              >
                Richiedi il media kit <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
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
                'Richiedi preventivo Base',
                'Richiedi preventivo Pro',
                'Contattaci per un progetto',
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
                    <div className="mb-4 font-script text-lg text-[var(--color-accent-warm)]">
                      Formato più completo
                    </div>
                  )}
                  <h3 className="mb-2 text-2xl font-serif">{pkg.title}</h3>
                  <div className="mb-6 text-sm uppercase tracking-[0.2em] text-white/45">
                    {pkg.subtitle}
                  </div>
                  <ul className="mb-10 flex-grow space-y-4">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-white/80">
                        <CheckCircle size={16} className="shrink-0 text-[var(--color-accent)]" />{' '}
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

      {/* FAQ */}
      <FaqSection />

      {/* Final CTA */}
      <Section className="my-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-serif">Pronto a creare qualcosa di autentico?</h2>
          <p className="mb-10 text-lg font-normal text-black/70">
            Raccontaci il tuo progetto. Ti rispondiamo entro 48 ore con una proposta su misura.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button to="/media-kit" variant="cta" size="lg" className="px-10 py-5">
              Richiedi il Media Kit <ArrowRight size={18} />
            </Button>
            <Button to="/contatti" variant="outline" size="lg" className="px-10 py-5">
              Contattaci direttamente
            </Button>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
