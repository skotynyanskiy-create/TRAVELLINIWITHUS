import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BarChart,
  BriefcaseBusiness,
  Camera,
  CheckCircle,
  ChevronDown,
  Clapperboard,
  Globe,
  Instagram,
  MessageSquareText,
  MousePointerClick,
  PenTool,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import JsonLd from '../components/JsonLd';
import OptimizedImage from '../components/OptimizedImage';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { BRAND_STATS } from '../config/site';
import { siteContentDefaults } from '../config/siteContent';
import { useSiteContent } from '../hooks/useSiteContent';
import { fetchStats, type SiteStats } from '../services/firebaseService';

const TRIAD = [
  {
    eyebrow: 'Chi siamo',
    title: 'Una coppia creator-led con taglio editoriale',
    text: 'Rodrigo e Betta raccontano luoghi, soggiorni ed esperienze con il filtro piu utile: esserci stati davvero.',
    icon: Users,
  },
  {
    eyebrow: 'Con chi lavoriamo',
    title: 'Partner travel, hospitality e lifestyle con identita',
    text: 'Cerchiamo progetti che abbiano qualcosa da dire, non solo qualcosa da promuovere.',
    icon: BriefcaseBusiness,
  },
  {
    eyebrow: 'Perche fidarsi',
    title: 'Liberta editoriale, contenuti reali, tono pulito',
    text: 'Non facciamo sponsor mascherati, recensioni costruite o pagine che promettono piu di quello che esiste.',
    icon: ShieldCheck,
  },
];

const PARTNER_AREAS = [
  {
    title: 'Hotel e hospitality',
    text: 'Boutique hotel, glamping, agriturismi, relais e soggiorni con una forte atmosfera di luogo.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Destinazioni e territori',
    text: 'DMO, enti turismo, territori e destinazioni che vogliono essere raccontati con piu profondita e meno brochure.',
    icon: Globe,
  },
  {
    title: 'Brand travel e lifestyle',
    text: 'Prodotti, servizi e strumenti coerenti con il modo in cui viaggiamo, raccontiamo e consigliamo.',
    icon: Sparkles,
  },
  {
    title: 'Esperienze e format speciali',
    text: 'Locali, experience, eventi o progetti narrativi che hanno senso dentro la nostra linea editoriale.',
    icon: Camera,
  },
];

const PROOF_SIGNALS = [
  {
    title: 'Community reale',
    text: 'Numeri pubblici, reach e engagement nascono da anni di presenza costante e contenuti salvabili.',
    icon: Users,
  },
  {
    title: 'Contenuti vissuti sul posto',
    text: 'Ogni luogo, soggiorno o esperienza viene filtrato dalla prova reale, non da un brief copiato.',
    icon: MousePointerClick,
  },
  {
    title: 'Partnership con criterio',
    text: 'Se un progetto non e coerente con il pubblico o con il nostro metodo, preferiamo non aprirlo.',
    icon: MessageSquareText,
  },
];

const ANTI_TARGETS = [
  'No sponsor mascherati da consiglio spontaneo.',
  'No recensioni finte o contenuti scritti da desk senza esperienza diretta.',
  'No campagne solo sconto, coupon o volume senza qualita.',
  'No collaborazioni incoerenti solo per "esserci".',
];

const FAQ_ITEMS = [
  {
    q: 'Come capiamo se una collaborazione ha senso?',
    a: 'Guardiamo tre cose: allineamento con il brand, utilita per il pubblico e spazio reale per un racconto credibile. Se manca uno di questi elementi, preferiamo non forzare.',
  },
  {
    q: 'Lavorate con format fissi o su misura?',
    a: 'Partiamo da format chiari per rendere piu semplice la conversazione, ma i progetti migliori nascono quasi sempre da un adattamento su misura del racconto.',
  },
  {
    q: 'Garantite copertura positiva o approvazione finale?',
    a: 'No. Garantiamo serieta, accuratezza e rispetto del brief fattuale, ma la linea editoriale resta nostra. E proprio questo che rende credibile il contenuto.',
  },
  {
    q: 'Che cosa conviene mandarvi nel primo contatto?',
    a: 'Brand o struttura, obiettivo del progetto, timing indicativo e due righe su quello che volete ottenere. Piu il contesto e chiaro, piu velocemente capiamo se c e match.',
  },
  {
    q: 'Possiamo partire dal media kit?',
    a: 'Si. E il punto di ingresso migliore quando vuoi capire tono, pubblico, format e contesto prima di entrare nella proposta vera e propria.',
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <span className="mb-2 block font-script text-xl text-[var(--color-accent-warm)]">
            FAQ per partner
          </span>
          <h2 className="text-4xl font-serif">Le domande che aiutano davvero a capire il fit</h2>
        </div>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <div key={item.q} className="overflow-hidden rounded-2xl border border-black/5 bg-white">
              <button
                type="button"
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
              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24 }}
                  >
                    <div className="px-6 pb-6 text-base leading-relaxed text-black/70">{item.a}</div>
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
  const pageContent = {
    ...siteContentDefaults.collaborations,
    ...content,
    heroEyebrow: 'Collaborazioni editoriali',
    heroTitleMain: 'Raccontiamo progetti travel',
    heroTitleAccent: 'con credibilita editoriale',
    heroDescription:
      'Lavoriamo con realta travel, hospitality e lifestyle quando esiste un allineamento reale tra progetto, pubblico e liberta editoriale. Non cerchiamo volume: cerchiamo fit.',
    heroChecklist: [
      'Hotel, destinazioni, brand travel e progetti con una storia vera da raccontare',
      'Liberta editoriale chiara, senza copioni finti o promesse cosmetiche',
      'Contenuti visivi e testuali costruiti per reggere nel tempo, non solo per il lancio',
      'Media kit, numeri e contatto business ordinati e trasparenti',
    ],
    primaryCtaLabel: 'Richiedi il media kit',
    primaryCtaLink: '/media-kit',
    secondaryCtaLabel: 'Scrivici per una proposta',
    secondaryCtaLink: '/contatti',
    statsTitle: 'Numeri utili, non rumore',
    statsDescription:
      'Community reale, reach pubblica e presenza costruita in anni di contenuti salvabili. Usiamo solo segnali che possiamo sostenere, non metriche decorative.',
    servicesTitle: 'Format con un esito chiaro',
    servicesSubtitle: 'Come puo prendere forma una collaborazione',
    services: [
      {
        title: 'Presenza editoriale',
        description:
          'Articoli, guide o inserti editoriali che servono a posizionare bene un luogo, una struttura o un progetto.',
      },
      {
        title: 'Attivazione destinazione',
        description:
          'Racconti piu ampi per territori, enti e destinazioni che hanno bisogno di un frame narrativo piu completo.',
      },
      {
        title: 'Contenuti visuali e UGC',
        description:
          'Foto, video e materiali pensati per funzionare sui nostri canali o come contenuti utili al brand, senza perdere credibilita.',
      },
      {
        title: 'Progetto su misura',
        description:
          'Quando il progetto lo merita, costruiamo un formato ad hoc che tenga insieme contenuto, ritmo e obiettivo.',
      },
    ],
    processTitle: 'Come lavoriamo',
    processSteps: [
      {
        step: '1',
        title: 'Contesto',
        description: 'Ci contatti con un progetto concreto, un obiettivo e un timing indicativo.',
      },
      {
        step: '2',
        title: 'Valutazione',
        description:
          'Capiamo se il progetto e coerente con il nostro pubblico, con il tono del brand e con il tipo di contenuto che sappiamo fare bene.',
      },
      {
        step: '3',
        title: 'Sviluppo',
        description:
          'Definiamo il perimetro e costruiamo il racconto con liberta editoriale, immagini reali e un tono coerente con il progetto.',
      },
      {
        step: '4',
        title: 'Pubblicazione',
        description:
          'Pubblichiamo in modo trasparente e poi misuriamo quello che conta davvero per il contesto del progetto.',
      },
    ],
    formatsTitle: 'Tre modi per partire bene',
    formatsDescription:
      'Partiamo da format chiari per orientare la conversazione, ma i progetti migliori restano calibrati sul contesto reale.',
    collaborationFormats: [
      {
        title: 'Presenza editoriale',
        subtitle: 'Per racconti mirati e ben contestualizzati',
        features: [
          'Articolo, guida o inserimento editoriale sul sito',
          'Menzione o supporto social coerente al formato',
          'Tono pulito e integrato nel progetto',
          'Pensato per partner che vogliono chiarezza e credibilita',
        ],
      },
      {
        title: 'Attivazione destinazione',
        subtitle: 'Per territori, soggiorni o storytelling piu ampi',
        features: [
          'Contenuto cross-canale con piu profondita',
          'Integrazione tra guida, visual e social',
          'Ideale per hospitality e destinazioni',
          'Pensato per valorizzare il contesto, non solo il lancio',
        ],
        highlight: 'true',
      },
      {
        title: 'Progetto su misura',
        subtitle: 'Per format speciali o esigenze non standard',
        features: [
          'Formato costruito sul progetto',
          'Maggiore flessibilita tra contenuto, visual e contesto',
          'Possibile uso UGC o contenuti dedicati',
          'Adatto quando il progetto merita una struttura propria',
        ],
      },
    ],
  };
  const serviceIcons = [PenTool, Globe, Clapperboard, Camera];

  useEffect(() => {
    const loadStats = async () => {
      const fetchedStats = await fetchStats();
      if (fetchedStats) {
        setStats(fetchedStats);
      }
    };

    void loadStats();
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
        description="Collaborazioni editoriali per hotel, destinazioni, brand travel e progetti lifestyle che hanno qualcosa da raccontare con credibilita."
      />
      <JsonLd data={faqStructuredData} />

      <Section className="pt-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-8 grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-[var(--color-accent)]" />
              <span className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                {pageContent.heroEyebrow}
              </span>
            </div>

            <div className="relative mb-8 inline-block">
              <h1 className="text-5xl font-serif leading-tight md:text-7xl">
                {pageContent.heroTitleMain}
                <br />
                <span className="italic text-black/60">{pageContent.heroTitleAccent}</span>
              </h1>
              <motion.span
                initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                animate={{ opacity: 1, rotate: -4, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.7 }}
                aria-hidden="true"
                className="absolute -bottom-6 right-6 hidden font-script text-2xl text-[var(--color-accent)] opacity-80 md:block"
              >
                lavoriamo bene, non tanto
              </motion.span>
            </div>

            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-black/70">
              {pageContent.heroDescription}
            </p>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pageContent.heroChecklist.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-[var(--color-accent-soft)] px-5 py-4 text-sm text-black/72"
                >
                  <CheckCircle size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button to={pageContent.primaryCtaLink} variant="primary" size="lg" className="px-8 py-4">
                {pageContent.primaryCtaLabel} <ArrowRight size={18} />
              </Button>
              <Button to={pageContent.secondaryCtaLink} variant="outline" size="lg" className="px-8 py-4">
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
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl transition-transform duration-700 lg:-rotate-2 lg:hover:rotate-0">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop"
                alt="Rodrigo e Betta in un contesto travel editoriale"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-8 -left-8 hidden rounded-2xl border border-white/30 bg-white/92 p-6 shadow-xl backdrop-blur-md md:block">
              <div className="mb-2 flex items-center gap-4">
                <BriefcaseBusiness className="text-[var(--color-accent)]" size={24} />
                <span className="text-2xl font-serif text-[var(--color-ink)]">
                  Hospitality, destinazioni, lifestyle
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/45">
                Con priorita alla qualita del racconto
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section>
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {TRIAD.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <item.icon size={22} />
              </div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-black/40">
                {item.eyebrow}
              </p>
              <h2 className="mb-4 text-2xl font-serif leading-tight">{item.title}</h2>
              <p className="leading-relaxed text-black/68">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="my-20 rounded-[3rem] bg-[var(--color-accent-soft)] p-12 md:p-20">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-serif">{pageContent.statsTitle}</h2>
          <p className="text-lg text-black/70">{pageContent.statsDescription}</p>
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

      <Section>
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-2 block font-script text-xl text-[var(--color-accent-warm)]">
            Partner ideali
          </span>
          <h2 className="mb-6 text-4xl font-serif">Con chi lavoriamo meglio</h2>
          <p className="mb-12 text-lg text-black/70">
            Restiamo aperti a progetti diversi, ma lavoriamo meglio quando c e identita, contesto e una
            storia che vale la pena raccontare.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PARTNER_AREAS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <item.icon size={24} />
              </div>
              <h3 className="mb-3 text-2xl font-serif">{item.title}</h3>
              <p className="leading-relaxed text-black/68">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="my-16 rounded-[3rem] bg-[var(--color-ink)] p-12 text-white md:p-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck size={14} className="text-[var(--color-accent-warm)]" />
              <span className="font-script text-xl text-[var(--color-accent-warm)]">Proof sobria</span>
            </div>
            <h2 className="mb-6 text-4xl font-serif leading-tight">
              Segnali che contano piu di un case study inventato.
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-white/82">
              Preferiamo mostrare numeri verificabili, metodo e criteri di lavoro chiari invece di
              riempire la pagina con risultati gonfiati o testimonianze non pronte.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {PROOF_SIGNALS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-3xl border border-white/10 bg-white/6 p-7"
              >
                <item.icon size={22} className="text-[var(--color-accent)]" />
                <h3 className="mt-5 mb-3 text-2xl font-serif">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/72">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section title={pageContent.servicesTitle} subtitle={pageContent.servicesSubtitle}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {pageContent.services.map((service, index) => {
            const Icon = serviceIcons[index] ?? Camera;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="flex flex-col rounded-3xl border border-black/5 bg-[var(--color-accent-soft)] p-8"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[var(--color-accent)] shadow-sm">
                  <Icon size={24} />
                </div>
                <h3 className="mb-3 text-2xl font-serif">{service.title}</h3>
                <p className="leading-relaxed text-black/70">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      <Section className="rounded-[3rem] bg-[var(--color-sand)] p-12 md:p-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <span className="mb-2 block font-script text-xl text-[var(--color-accent-warm)]">
              Limiti chiari
            </span>
            <h2 className="mb-4 text-4xl font-serif">Quello che non facciamo</h2>
            <p className="mx-auto max-w-2xl text-lg text-black/70">
              Mettere dei confini non ci rende rigidi: rende piu pulita la collaborazione e piu forte il
              contenuto finale.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {ANTI_TARGETS.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-black/5 bg-white px-5 py-5">
                <CheckCircle size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                <p className="text-black/72">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title={pageContent.processTitle}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {pageContent.processSteps.map((step) => (
            <div
              key={step.step}
              className="relative rounded-3xl border border-black/5 bg-white p-8 shadow-sm"
            >
              <div className="absolute right-6 top-4 text-6xl font-serif text-[var(--color-accent-soft)]">
                {step.step}
              </div>
              <h3 className="relative z-10 mb-3 text-2xl font-serif">{step.title}</h3>
              <p className="relative z-10 leading-relaxed text-black/70">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="relative overflow-hidden rounded-[3rem] bg-[var(--color-ink)] p-12 text-white md:p-20">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px] opacity-40" />
        </div>

        <div className="relative z-20">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-serif md:text-5xl">{pageContent.formatsTitle}</h2>
            <p className="text-white/80">{pageContent.formatsDescription}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pageContent.collaborationFormats.map((format, index) => {
              const isHighlighted = format.highlight === 'true';
              const ctaTargets = [pageContent.primaryCtaLink, pageContent.primaryCtaLink, pageContent.secondaryCtaLink];
              const ctaLabels = ['Apri il media kit', 'Richiedi il media kit', 'Scrivici il progetto'];

              return (
                <div
                  key={format.title}
                  className={`flex flex-col rounded-3xl border p-10 transition-transform duration-500 hover:-translate-y-2 ${
                    isHighlighted
                      ? 'border-[var(--color-accent-warm)]/50 bg-white/10 shadow-2xl shadow-[var(--color-accent-warm)]/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  {isHighlighted && (
                    <div className="mb-4 font-script text-lg text-[var(--color-accent-warm)]">
                      Il formato piu completo
                    </div>
                  )}
                  <h3 className="mb-2 text-2xl font-serif">{format.title}</h3>
                  <div className="mb-6 text-sm uppercase tracking-[0.2em] text-white/45">
                    {format.subtitle}
                  </div>
                  <ul className="mb-10 flex-grow space-y-4">
                    {format.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-white/80">
                        <CheckCircle size={16} className="shrink-0 text-[var(--color-accent)]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    to={ctaTargets[index] ?? pageContent.secondaryCtaLink}
                    variant={isHighlighted ? 'primary' : 'outline-light'}
                    className={`w-full ${isHighlighted ? 'bg-[var(--color-gold)] hover:brightness-110' : ''}`}
                  >
                    {ctaLabels[index] ?? 'Richiedi info'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      <FaqSection />

      <Section className="my-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-serif">Se ha senso, costruiamolo bene.</h2>
          <p className="mb-10 text-lg text-black/70">
            Parti dal media kit se vuoi orientarti in modo ordinato, oppure scrivici direttamente se hai
            gia una proposta chiara.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button to="/media-kit" variant="cta" size="lg" className="px-10 py-5">
              Richiedi il media kit <ArrowRight size={18} />
            </Button>
            <Button to="/contatti" variant="outline" size="lg" className="px-10 py-5">
              Scrivici per una proposta
            </Button>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
