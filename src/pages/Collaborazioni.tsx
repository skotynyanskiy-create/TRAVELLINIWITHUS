import { useState } from 'react';
import {
  ArrowRight,
  BarChart,
  BriefcaseBusiness,
  Camera,
  CheckCircle,
  ChevronDown,
  Clapperboard,
  ExternalLink,
  Globe,
  Instagram,
  MessageSquareText,
  MousePointerClick,
  PenTool,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { trackEvent } from '../services/analytics';
import { AnimatePresence, motion } from 'motion/react';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import InterestPicker from '../components/InterestPicker';
import JsonLd from '../components/JsonLd';
import OptimizedImage from '../components/OptimizedImage';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import StickyMobileCTA from '../components/StickyMobileCTA';
import { getPublishedReels } from '../config/reels';
import { getAudienceInterest } from '../config/audienceInterests';
import { BRAND_STATS, BRAND_STATS_SOURCE, PUBLIC_PROOF_SIGNALS } from '../config/site';
import { siteContentDefaults } from '../config/siteContent';
import { useSiteContent } from '../hooks/useSiteContent';
import { usePersonalizedInterest } from '../hooks/usePersonalizedInterest';
import CaseStudiesSection from '../components/collaborazioni/CaseStudiesSection';
import PressProofSection from '../components/collaborazioni/PressProofSection';

const PARTNER_AREAS = [
  {
    title: 'Hotel e hospitality',
    text: 'Boutique hotel, glamping, agriturismi, relais e soggiorni con una forte atmosfera di luogo.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Destinazioni e territori',
    text: 'DMO, enti turismo, territori e destinazioni che vogliono essere raccontati con più profondità e meno brochure.',
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
    text: 'Se un progetto non è coerente con il pubblico o con il nostro metodo, preferiamo non aprirlo.',
    icon: MessageSquareText,
  },
];

const ANTI_TARGETS = [
  'No sponsor mascherati da consiglio spontaneo.',
  'No recensioni finte o contenuti scritti da desk senza esperienza diretta.',
  'No campagne solo sconto, coupon o volume senza qualità.',
  'No collaborazioni incoerenti solo per "esserci".',
];

const FAQ_ITEMS = [
  {
    q: 'Come capiamo se una collaborazione ha senso?',
    a: 'Guardiamo tre cose: allineamento con il brand, utilità per il pubblico e spazio reale per un racconto credibile. Se manca uno di questi elementi, preferiamo non forzare.',
  },
  {
    q: 'Lavorate con format fissi o su misura?',
    a: 'Partiamo da format chiari per rendere più semplice la conversazione, ma i progetti migliori nascono quasi sempre da un adattamento su misura del racconto.',
  },
  {
    q: 'Garantite copertura positiva o approvazione finale?',
    a: 'No. Garantiamo serietà, accuratezza e rispetto del brief fattuale, ma la linea editoriale resta nostra. È proprio questo che rende credibile il contenuto.',
  },
  {
    q: 'Che cosa conviene mandarvi nel primo contatto?',
    a: `Brand o struttura, obiettivo del progetto, timing indicativo e due righe su quello che volete ottenere. Più il contesto è chiaro, più velocemente capiamo se c'è match.`,
  },
  {
    q: 'Possiamo partire dal media kit?',
    a: 'Sì. È il punto di ingresso migliore quando vuoi capire tono, pubblico, format e contesto prima di entrare nella proposta vera e propria.',
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
          <span className="mb-2 block font-script text-xl text-[var(--color-accent-text)]">
            FAQ per partner
          </span>
          <h2 className="text-4xl font-serif">Le domande che aiutano davvero a capire il fit</h2>
        </div>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={item.q}
              className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white/70 backdrop-blur-md hover:bg-white/95 hover:border-[var(--color-accent)]/20 transition-all duration-500 shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors cursor-pointer"
                aria-expanded={openIndex === idx}
              >
                <span className="text-lg font-serif font-medium text-[var(--color-ink)]">
                  {item.q}
                </span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-[var(--color-accent)] transition-transform duration-500 ${openIndex === idx ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-6 pb-6 text-base leading-relaxed text-[var(--color-ink-2)] border-t border-[var(--color-border)] pt-4">
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

/** 4 frame reali dai reel per il collage hero — prova visiva del contenuto. */
const COLLAB_REELS = getPublishedReels().slice(0, 4);

export default function Collaborazioni() {
  const { interest } = usePersonalizedInterest();
  const collabReels = COLLAB_REELS;
  const breadcrumbItems = [{ label: 'Collaborazioni' }];
  const { data: content } = useSiteContent('collaborations');
  const pageContent = {
    ...siteContentDefaults.collaborations,
    ...content,
    heroEyebrow: 'Collaborazioni editoriali',
    heroTitleMain: 'Raccontiamo progetti travel',
    heroTitleAccent: 'con credibilità editoriale',
    heroDescription:
      'Lavoriamo con realtà travel, hospitality e lifestyle quando esiste un allineamento reale tra progetto, pubblico e libertà editoriale. Non cerchiamo volume: cerchiamo fit.',
    heroChecklist: [
      'Hotel, destinazioni, brand travel e progetti con una storia vera da raccontare',
      'Libertà editoriale chiara, senza copioni finti o promesse cosmetiche',
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
    servicesSubtitle: 'Come può prendere forma una collaborazione',
    services: [
      {
        title: 'Presenza editoriale',
        description:
          'Articoli, guide o inserti editoriali che servono a posizionare bene un luogo, una struttura o un progetto.',
      },
      {
        title: 'Attivazione destinazione',
        description:
          'Racconti più ampi per territori, enti e destinazioni che hanno bisogno di un frame narrativo più completo.',
      },
      {
        title: 'Contenuti visuali e UGC',
        description:
          'Foto, video e materiali pensati per funzionare sui nostri canali o come contenuti utili al brand, senza perdere credibilità.',
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
          'Capiamo se il progetto è coerente con il nostro pubblico, con il tono del brand e con il tipo di contenuto che sappiamo fare bene.',
      },
      {
        step: '3',
        title: 'Sviluppo',
        description:
          'Definiamo il perimetro e costruiamo il racconto con libertà editoriale, immagini reali e un tono coerente con il progetto.',
      },
      {
        step: '4',
        title: 'Pubblicazione',
        description:
          'Pubblichiamo in modo trasparente e poi misuriamo quello che conta davvero per il contesto del progetto.',
      },
    ],
    formatsTitle: 'Tre punti di partenza per capire subito il perimetro',
    formatsDescription:
      'Sono tracce di lavoro, non listini rigidi. Servono a capire cosa può uscire da una collaborazione prima di costruire una proposta su misura.',
    collaborationFormats: [
      {
        title: 'Stay editoriale',
        subtitle: 'Per hotel, masserie, relais e soggiorni speciali',
        output: '1 contenuto long-form + copertura social coerente',
        idealFor: 'Quando la struttura ha identità, atmosfera e un motivo reale per essere scelta.',
        features: [
          'Articolo o guida editoriale sul sito con disclosure chiara',
          'Reel o short video pensato per salvabilità, non solo reach',
          'Stories di contesto durante o dopo l’esperienza',
          'Asset visuali selezionati per uso editoriale e report sintetico',
        ],
      },
      {
        title: 'Destinazione da costruire',
        subtitle: 'Per territori, DMO e progetti travel più ampi',
        output: 'Itinerario narrativo + contenuti cross-canale',
        idealFor:
          'Quando serve posizionare una zona con più profondità di una singola pubblicazione.',
        features: [
          'Itinerario o pillar editoriale con tappe e motivazione',
          'Più contenuti social distribuiti nel tempo',
          'Possibile integrazione newsletter o mappa editoriale',
          'Report finale con link, contenuti pubblicati e segnali utili',
        ],
        highlight: 'true',
      },
      {
        title: 'Content kit per brand',
        subtitle: 'Per travel gear, servizi e lifestyle compatibili',
        output: 'UGC/editorial asset + racconto integrato',
        idealFor:
          'Quando il prodotto è davvero usato in viaggio e può essere raccontato senza forzature.',
        features: [
          'Review o contenuto editoriale con pro e limiti dichiarabili',
          'Video breve o serie visuale orientata all’uso reale',
          'Possibile codice o link affiliato se coerente',
          'Materiali riutilizzabili dal brand secondo accordo',
        ],
      },
    ],
  };
  const brandInterest = getAudienceInterest(interest);
  const primaryCta = brandInterest?.cta ?? {
    label: pageContent.primaryCtaLabel,
    to: pageContent.primaryCtaLink,
  };
  const serviceIcons = [PenTool, Globe, Clapperboard, Camera];

  /* I numeri pubblici vengono SOLO da `BRAND_STATS`, costante di build.
   *
   * Fino al 2026-08-15 questa pagina preferiva a quella costante il documento
   * Firestore letto da `fetchStats()`, e quel documento e' scrivibile dalla tab
   * «stats» del pannello admin — che si apriva pre-compilata con `250K+`
   * follower, `500K+` reach e `8.5%` di engagement, valori che nessuno aveva
   * misurato. Bastava aprire e salvare senza toccare niente per pubblicarli
   * sotto la didascalia «Snapshot pubblico osservato il 2026-07-23», che e' una
   * costante e non si aggiorna mai.
   *
   * Finche' i numeri sono decorativi un errore e' un'esagerazione; su una
   * pagina che apre una trattativa commerciale e' una dichiarazione sbagliata.
   * Un numero pubblico deve stare in un file che passa da una code review, non
   * in un campo di testo. Il documento Firestore resta per la dashboard interna
   * (`AdminDashboard`), dove serve a leggere, non a pubblicare. */
  const statsCards = [
    { icon: Instagram, rawValue: BRAND_STATS.instagramFollowers, label: 'Follower Instagram' },
    { icon: TikTokIcon, rawValue: BRAND_STATS.tiktokFollowers, label: 'Follower TikTok' },
    { icon: Users, rawValue: BRAND_STATS.monthlyReach, label: 'Reach mensile stimata' },
    { icon: BarChart, rawValue: BRAND_STATS.engagementRate, label: 'Engagement rate' },
  ];
  const trackPartnerCta = (ctaId: string) => {
    trackEvent('partner_cta_click', {
      route: '/collaborazioni',
      source: 'collaborazioni',
      cta_id: ctaId,
      content_id: 'partner_funnel',
    });
  };

  return (
    <PageLayout>
      <SEO
        title="Collaborazioni travel con hotel e brand"
        description="Collaborazioni editoriali con hotel, destinazioni, brand travel e progetti lifestyle che hanno qualcosa da raccontare con credibilità."
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
              <span className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent-text)]">
                {pageContent.heroEyebrow}
              </span>
            </div>

            <div className="relative mb-8 inline-block">
              <h1 className="text-5xl font-serif leading-tight md:text-7xl">
                {pageContent.heroTitleMain} <br />
                <span className="italic text-[var(--color-muted-fg)]">
                  {pageContent.heroTitleAccent}
                </span>
              </h1>
            </div>

            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-2)]">
              {pageContent.heroDescription}
            </p>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pageContent.heroChecklist.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] px-5 py-4 text-sm text-[var(--color-ink-2)]"
                >
                  <CheckCircle size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                to={primaryCta.to}
                variant="primary"
                size="lg"
                className="px-8 py-4"
                trackingId="collaborazioni_hero_primary"
                onClick={() => trackPartnerCta('collaborazioni_hero_primary')}
                magnetic={true}
              >
                {primaryCta.label} <ArrowRight size={18} />
              </Button>
              <Button
                to={pageContent.secondaryCtaLink}
                variant="outline"
                size="lg"
                className="px-8 py-4"
                trackingId="collaborazioni_hero_secondary"
                onClick={() => trackPartnerCta('collaborazioni_hero_secondary')}
                magnetic={true}
              >
                {pageContent.secondaryCtaLabel}
              </Button>
            </div>
            <Button
              to="/media-kit#media-kit-preview"
              variant="outline"
              size="sm"
              onClick={() =>
                trackEvent('media_kit_preview_click', { source: 'collaborazioni_hero' })
              }
              className="mt-5 w-fit"
            >
              Sfoglia l&apos;anteprima del media kit
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Collage di frame REALI dai reel del brand: la prova migliore
                del tipo di contenuto che un partner riceve (truth rule). */}
            <div className="grid aspect-[4/5] grid-cols-2 gap-3 transition-transform duration-700 lg:-rotate-2 lg:hover:rotate-0">
              {collabReels.map((reel, index) => (
                <div
                  key={reel.id}
                  className="overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-ink-deep)] shadow-[var(--shadow-lg)]"
                >
                  <OptimizedImage
                    src={reel.cover}
                    alt={reel.alt}
                    priority={index === 0}
                    responsiveWidths={[320, 480]}
                    sizes="(max-width: 1024px) 50vw, 23vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted-fg)]">
              Frame reali dai nostri reel
            </p>

            <div className="absolute -bottom-8 -left-8 hidden rounded-[var(--radius-md)] border border-white/30 bg-white/92 p-6 shadow-xl backdrop-blur-md md:block">
              <div className="mb-2 flex items-center gap-4">
                <BriefcaseBusiness className="text-[var(--color-accent)]" size={24} />
                <span className="text-2xl font-serif text-[var(--color-ink)]">
                  Hospitality, destinazioni, lifestyle
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted-fg)]">
                Con priorità alla qualità del racconto
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      <InterestPicker />

      <Section className="my-20 border-y border-black/10 bg-[var(--color-accent-soft)]/45 py-16 md:py-20">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-serif">{pageContent.statsTitle}</h2>
          <p className="text-lg text-[var(--color-ink-2)]">{pageContent.statsDescription}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {statsCards.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center border-t border-[var(--color-accent)]/20 pt-7 text-center"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--color-accent)]">
                <item.icon size={26} />
              </div>
              <div className="mb-2 text-4xl font-serif text-[var(--color-ink)]">
                {item.rawValue}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted-fg)]">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-[var(--color-muted-fg)]">
          {BRAND_STATS_SOURCE.label}. Snapshot pubblico osservato il {BRAND_STATS_SOURCE.observedAt}
          ; le proposte partner vanno sempre aggiornate con export Meta Business Suite, TikTok
          Analytics e report campagna.
        </p>
      </Section>

      <Section id="partner-fit">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <span className="mb-2 block font-script text-xl text-[var(--color-accent-text)]">
              Partner ideali
            </span>
            <h2 className="mb-4 text-4xl font-serif">Con chi lavoriamo meglio</h2>
            <p className="text-lg text-[var(--color-ink-2)]">
              Restiamo aperti a progetti diversi, ma lavoriamo meglio quando c'è identità, contesto
              e una storia che vale la pena raccontare.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PARTNER_AREAS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="flex items-start gap-4 border-t border-black/10 pt-6"
              >
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="mb-1.5 text-lg font-serif leading-tight text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-muted-fg)]">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="my-16 bg-[var(--color-ink-deep)] p-10 text-white md:p-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] relative z-10">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck size={14} className="text-[var(--color-accent)]" />
              <span className="font-script text-xl text-[var(--color-accent-text)]">
                Proof sobria
              </span>
            </div>
            <h2 className="mb-6 text-4xl font-serif leading-tight">
              Segnali che contano più di un case study inventato.
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
                className="border-t border-white/12 pt-7"
              >
                <item.icon size={22} className="text-[var(--color-accent)]" />
                <h3 className="mt-5 mb-3 text-2xl font-serif text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/72">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="mb-10 max-w-3xl">
          <span className="mb-3 block font-script text-xl text-[var(--color-accent-text)]">
            Proof pubbliche
          </span>
          <h2 className="text-4xl font-serif">Cosa si può già verificare online</h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-muted-fg)]">
            Prima dei dati riservati di campagna, questi sono segnali esterni già collegabili al
            profilo pubblico: progetti territoriali, menzioni partner e contenuti ripresi da media.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {PUBLIC_PROOF_SIGNALS.map((item, idx) => (
            <motion.a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('public_proof_click', {
                  route: '/collaborazioni',
                  source: 'collaborazioni',
                  proof: item.title,
                })
              }
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="group flex min-h-[230px] flex-col border-t border-black/10 pt-7"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                  {item.label}
                </span>
                <ExternalLink
                  size={15}
                  className="text-[var(--color-muted-fg)] opacity-40 transition-colors group-hover:text-[var(--color-accent)] group-hover:opacity-100"
                />
              </div>
              <h3 className="text-2xl font-serif leading-tight text-[var(--color-ink)]">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted-fg)]">
                {item.description}
              </p>
            </motion.a>
          ))}
        </div>
      </Section>

      {/* B2B Case Studies Showcase */}
      <CaseStudiesSection />

      {/* Press & Social Proof Section */}
      <PressProofSection />

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
                className="flex flex-col border-t border-black/10 pt-8"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <Icon size={24} />
                </div>
                <h3 className="mb-3 text-2xl font-serif">{service.title}</h3>
                <p className="leading-relaxed text-[var(--color-ink-2)]">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      <Section className="rounded-[var(--radius-xl)] bg-[var(--color-sand)] p-12 md:p-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <span className="mb-2 block font-script text-xl text-[var(--color-accent-text)]">
              Limiti chiari
            </span>
            <h2 className="mb-4 text-4xl font-serif">Quello che non facciamo</h2>
            <p className="mx-auto max-w-2xl text-lg text-[var(--color-ink-2)]">
              Mettere dei confini non ci rende rigidi: rende più pulita la collaborazione e più
              forte il contenuto finale.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {ANTI_TARGETS.map((item) => (
              <div
                key={item}
                className="group flex gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-5 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--color-border)] hover:bg-[var(--color-muted-bg)]"
              >
                <CheckCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-[var(--color-accent)] transition-transform duration-300 group-hover:scale-110"
                />
                <p className="text-[var(--color-ink-2)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title={pageContent.processTitle}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {pageContent.processSteps.map((step) => (
            <div key={step.step} className="relative border-l border-black/10 pl-8">
              <div className="absolute right-6 top-4 text-6xl font-serif text-[var(--color-accent-soft)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                {step.step}
              </div>
              <h3 className="relative z-10 mb-3 text-2xl font-serif">{step.title}</h3>
              <p className="relative z-10 leading-relaxed text-[var(--color-ink-2)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="collaboration-formats"
        className="relative scroll-mt-28 overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-ink)] px-0 py-16 text-white md:p-20"
      >
        <div className="relative z-20">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-serif md:text-5xl">{pageContent.formatsTitle}</h2>
            <p className="text-white/80">{pageContent.formatsDescription}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pageContent.collaborationFormats.map((format, index) => {
              const isHighlighted = format.highlight === 'true';
              const ctaTargets = [
                pageContent.primaryCtaLink,
                pageContent.primaryCtaLink,
                pageContent.secondaryCtaLink,
              ];
              const ctaLabels = [
                'Richiedi il media kit',
                'Richiedi il media kit',
                'Scrivici il progetto',
              ];

              return (
                <div
                  key={format.title}
                  className={`flex flex-col rounded-2xl border p-10 transition-transform duration-500 hover:-translate-y-2 ${
                    isHighlighted
                      ? 'border-[var(--color-accent)]/50 bg-white/10 shadow-2xl shadow-[var(--color-accent)]/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  {isHighlighted && (
                    <div className="mb-4 font-script text-lg text-[var(--color-accent-text)]">
                      Il formato più completo
                    </div>
                  )}
                  <h3 className="mb-2 text-2xl font-serif text-white">{format.title}</h3>
                  <div className="mb-6 text-sm uppercase tracking-[0.2em] text-white/45">
                    {format.subtitle}
                  </div>
                  {'output' in format && (
                    <div className="mb-4 rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                      <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent-text)]">
                        Output indicativo
                      </div>
                      <p className="text-sm leading-relaxed text-white/78">{format.output}</p>
                    </div>
                  )}
                  {'idealFor' in format && (
                    <p className="mb-6 text-sm leading-relaxed text-white/62">{format.idealFor}</p>
                  )}
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
                    className={`w-full ${isHighlighted ? 'bg-[var(--color-accent)] hover:brightness-110' : ''}`}
                    trackingId={`collaborazioni_package_${index}`}
                    onClick={() => trackPartnerCta(`collaborazioni_package_${index}`)}
                    magnetic={true}
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
          <p className="mb-10 text-lg text-[var(--color-ink-2)]">
            Parti dal media kit se vuoi orientarti in modo ordinato, oppure scrivici direttamente se
            hai già una proposta chiara.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              to="/media-kit"
              variant="cta"
              size="lg"
              className="px-10 py-5"
              trackingId="collaborazioni_footer_mediakit"
              onClick={() => trackPartnerCta('collaborazioni_footer_mediakit')}
              magnetic={true}
            >
              Richiedi il media kit <ArrowRight size={18} />
            </Button>
            <Button
              to="/contatti"
              variant="outline"
              size="lg"
              className="px-10 py-5"
              trackingId="collaborazioni_footer_contact"
              onClick={() => trackPartnerCta('collaborazioni_footer_contact')}
              magnetic={true}
            >
              Scrivici per una proposta
            </Button>
          </div>
        </div>
      </Section>

      <StickyMobileCTA
        label="Richiedi il media kit"
        to="/media-kit"
        trackingId="collaborazioni_sticky_mobile"
        revealAfter={-1}
      />
    </PageLayout>
  );
}
