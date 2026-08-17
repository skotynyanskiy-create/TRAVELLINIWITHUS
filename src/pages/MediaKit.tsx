import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  CheckCircle,
  Download,
  Globe,
  Loader2,
  Mail,
  MailWarning,
  ShieldCheck,
  Target,
  Wallet,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import Breadcrumbs from '../components/Breadcrumbs';
import LeadFallbackNotice from '../components/LeadFallbackNotice';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import StickyMobileCTA from '../components/StickyMobileCTA';
import FormField from '../components/FormField';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import { BRAND_STATS, BRAND_STATS_SOURCE, CONTACTS, PUBLIC_PROOF_SIGNALS } from '../config/site';
import {
  appendLeadFallback,
  buildLeadFallbackMailto,
  buildLeadFallbackWhatsAppText,
  buildLeadFallbackWhatsAppUrl,
} from '../lib/leadFallback';
import { trackEvent } from '../services/analytics';

const QUALIFYING_POINTS = [
  'Hotel, hospitality e soggiorni con una forte identità.',
  'Destinazioni, territori e progetti travel con una storia da raccontare bene.',
  'Brand lifestyle e utility coerenti con il nostro modo di viaggiare e consigliare.',
];

const NEXT_STEPS = [
  {
    title: '1. Richiesta qualificata',
    text: 'Ci lasci brand, contesto e focus del progetto. Non ci interessa il giro largo: ci interessa capire subito il fit.',
  },
  {
    title: '2. Valutazione editoriale',
    text: 'Capiamo se il progetto è coerente con il pubblico, con il tono del brand e con il tipo di contenuto che sappiamo fare bene.',
  },
  {
    title: '3. Invio materiali e dialogo',
    text: `Se c'è allineamento, ricevi il media kit e apriamo il confronto operativo con basi più serie e pulite.`,
  },
];

const PACKAGE_PREVIEWS = [
  {
    title: 'Stay editoriale',
    eyebrow: 'Hotel e soggiorni',
    output: '1 contenuto long-form + copertura social coerente',
    text: 'Per strutture con identità, atmosfera e un motivo reale per essere scelte.',
  },
  {
    title: 'Destinazione da costruire',
    eyebrow: 'Territori e DMO',
    output: 'Itinerario narrativo + contenuti cross-canale',
    text: 'Per posizionare una zona con più profondità di una singola pubblicazione.',
  },
  {
    title: 'Content kit per brand',
    eyebrow: 'Prodotti e servizi',
    output: 'UGC/editorial asset + racconto integrato',
    text: 'Per prodotti davvero usati in viaggio e raccontabili senza forzature.',
  },
];

const projectFocusOptions = [
  'Hotel / hospitality',
  'Destinazione / ente turismo',
  'Brand travel / lifestyle',
  'Experience / locale / evento',
  'UGC / contenuti per canali brand',
  'Altro',
];

const budgetOptions = [
  '< €2.000',
  '€2.000 - €5.000',
  '€5.000 - €10.000',
  '> €10.000',
  'Preferisco discutere',
];

const campaignPeriodOptions = [
  'Prossimi 30 giorni',
  'Nei prossimi 3 mesi',
  'Nei prossimi 6 mesi',
  'Oltre 6 mesi / Lungo termine',
  'Flessibile / Da concordare',
];

export default function MediaKit() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [projectFocus, setProjectFocus] = useState('');
  const [budget, setBudget] = useState('');
  const [campaignPeriod, setCampaignPeriod] = useState('');
  const [brief, setBrief] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fallbackNotice, setFallbackNotice] = useState<{ saved: boolean } | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const breadcrumbItems = [{ label: 'Media Kit' }];

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim();
    const normalizedCompany = company.trim();
    const normalizedWebsite = website.trim();
    const normalizedBrief = brief.trim();

    trackEvent('media_kit_request_attempt', {
      route: '/media-kit',
      source: 'media_kit_form',
      cta_id: 'media_kit_submit',
      topic: projectFocus || 'unset',
      budget_range: budget || 'unset',
      campaign_period: campaignPeriod || 'unset',
    });

    if (
      !normalizedEmail ||
      !normalizedCompany ||
      !projectFocus ||
      !budget ||
      !campaignPeriod ||
      !normalizedBrief
    ) {
      setSubmitError(
        'Inserisci azienda, email lavorativa, focus del progetto, budget indicativo, periodo stimato e un contesto breve ma utile.'
      );
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setSubmitError('Inserisci un indirizzo email valido.');
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/media-kit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          company: normalizedCompany,
          website: normalizedWebsite || undefined,
          topic: projectFocus,
          budget,
          period: campaignPeriod,
          message: normalizedBrief || undefined,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Invio non riuscito');
      }

      const submitParams = {
        route: '/media-kit',
        source: 'media_kit_form',
        cta_id: 'media_kit_submit',
        content_id: 'media_kit_partner_lead',
        topic: projectFocus,
        budget_range: budget,
        campaign_period: campaignPeriod,
      };
      trackEvent('media_kit_request_success', submitParams);
      trackEvent('media_kit_submit', submitParams);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error saving media kit lead:', error);
      const saved = appendLeadFallback('twu_media_kit_leads', {
        email: normalizedEmail,
        company: normalizedCompany,
        website: normalizedWebsite,
        topic: projectFocus,
        budget,
        period: campaignPeriod,
        message: normalizedBrief,
        date: new Date().toISOString(),
      });
      // Evento distinto da 'media_kit_request_success': se lo lasciassimo uguale,
      // un pixel ads che ottimizza su quel nome conterebbe come lead un contatto
      // che non e' mai arrivato al team. Non fermo qui anche media_kit_submit:
      // era il duplicato pensato per l'attribuzione conversion, stessa ragione.
      trackEvent('media_kit_request_fallback', {
        route: '/media-kit',
        source: 'media_kit_form',
        cta_id: 'media_kit_submit',
        topic: projectFocus,
        budget_range: budget,
        campaign_period: campaignPeriod,
        saved_locally: saved,
      });
      setFallbackNotice({ saved });
    } finally {
      setIsSubmitting(false);
    }
  };

  const mediaKitFallbackMailto = buildLeadFallbackMailto(
    CONTACTS.email,
    `Richiesta media kit — ${company.trim() || 'nuova richiesta'}`,
    'Il modulo del sito non è riuscito a inviare questa richiesta di media kit. La incollo qui sotto:',
    [
      { label: 'Azienda', value: company },
      { label: 'Email', value: email },
      { label: 'Sito', value: website },
      { label: 'Focus', value: projectFocus },
      { label: 'Budget', value: budget },
      { label: 'Periodo', value: campaignPeriod },
      { label: 'Contesto', value: brief },
    ]
  );
  const mediaKitFallbackWhatsAppUrl = buildLeadFallbackWhatsAppUrl(
    CONTACTS.whatsappUrl,
    buildLeadFallbackWhatsAppText(
      'Vorrei richiedere il media kit, il modulo del sito non è riuscito a inviarlo:',
      [
        { label: 'Azienda', value: company },
        { label: 'Email', value: email },
        { label: 'Focus', value: projectFocus },
        { label: 'Budget', value: budget },
      ]
    )
  );

  const pdfSlides = [
    {
      page: '01',
      title: 'Profilo editoriale di Rodrigo & Betta',
      description:
        'Chi siamo, come scegliamo cosa raccontare e quali confini proteggono il rapporto con la community.',
      content: (
        <div className="flex h-full flex-col justify-between p-6 md:p-8 bg-[var(--color-sand)] text-[var(--color-ink)] rounded-xl border border-black/5 select-none">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-widest opacity-60">
              TRAVELLINIWITHUS
            </span>
            <span className="font-mono text-xs px-2 py-0.5 bg-[var(--color-ink)] text-white rounded-full">
              PAG 01
            </span>
          </div>
          <div className="my-auto space-y-3">
            <p className="font-serif italic text-2xl text-[var(--color-accent)] leading-none">
              Rodrigo &amp; Betta
            </p>
            <h3 className="font-serif text-3xl leading-tight font-bold tracking-tight">
              Raccontare con <span className="italic">criterio</span>.
            </h3>
            <p className="text-xs max-w-md leading-relaxed text-black/60">
              Selezioniamo luoghi, soggiorni e strumenti che hanno un motivo reale per essere
              raccontati. Il contenuto resta utile prima di essere promozionale.
            </p>
          </div>
          <div className="flex justify-between items-center border-t border-black/10 pt-3 text-[10px] font-mono opacity-50">
            <span>PROFILO BRAND</span>
            <span>EDIZIONE 2026</span>
          </div>
        </div>
      ),
    },
    {
      page: '02',
      title: 'Audience & segnali da verificare',
      description:
        'Canali principali, reach pubblica e segnali utili per capire il fit prima di parlare di proposta.',
      content: (
        <div className="flex h-full flex-col justify-between p-6 md:p-8 bg-[var(--color-ink-deep)] text-white rounded-xl border border-white/10 select-none">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-widest text-[var(--color-accent-text)]">
              INSIGHTS & COMMUNITY
            </span>
            <span className="font-mono text-xs px-2 py-0.5 bg-white/15 text-white rounded-full">
              PAG 02
            </span>
          </div>
          <div className="my-auto grid grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-0.5">
              <span className="text-[9px] font-semibold tracking-wider text-white/50 uppercase">
                Instagram
              </span>
              <p className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-accent)]">
                {BRAND_STATS.instagramFollowers}
              </p>
              <p className="text-[10px] text-white/60">Community pubblica</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-semibold tracking-wider text-white/50 uppercase">
                TikTok
              </span>
              <p className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-accent)]">
                {BRAND_STATS.tiktokFollowers}
              </p>
              <p className="text-[10px] text-white/60">Canale short-form</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-semibold tracking-wider text-white/50 uppercase">
                Reach
              </span>
              <p className="text-lg md:text-xl font-serif font-bold">In call</p>
              <p className="text-[10px] text-white/60">Dai dati nativi Meta</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-semibold tracking-wider text-white/50 uppercase">
                Sito
              </span>
              <p className="text-lg md:text-xl font-serif font-bold">Owned media</p>
              <p className="text-[10px] text-white/60">Archivio e lead capture</p>
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-white/10 pt-3 text-[10px] font-mono opacity-50">
            <span>AUDIENCE SIGNALS</span>
            <span>DATI NATIVI IN CALL</span>
          </div>
        </div>
      ),
    },
    {
      page: '03',
      title: 'Format e perimetro',
      description:
        'Tre punti di partenza per capire output, fit e livello di lavoro prima della proposta su misura.',
      content: (
        <div className="flex h-full flex-col justify-between p-6 md:p-8 bg-white text-[var(--color-ink)] rounded-xl border border-black/5 select-none">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-widest opacity-60">
              FORMAT DI PARTENZA
            </span>
            <span className="font-mono text-xs px-2 py-0.5 bg-[var(--color-sand)] text-[var(--color-ink)] rounded-full">
              PAG 03
            </span>
          </div>
          <div className="my-auto space-y-2 md:space-y-3">
            <div className="flex items-start gap-2">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[10px] font-bold text-[var(--color-accent-text)] mt-0.5">
                1
              </span>
              <div>
                <h5 className="font-serif font-bold text-xs">Stay editoriale</h5>
                <p className="text-[10px] text-black/55">
                  Soggiorni con identità, articolo/guida e copertura social coerente.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[10px] font-bold text-[var(--color-accent-text)] mt-0.5">
                2
              </span>
              <div>
                <h5 className="font-serif font-bold text-xs">Destinazione da costruire</h5>
                <p className="text-[10px] text-black/55">
                  Itinerario narrativo e contenuti distribuiti per DMO e territori.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[10px] font-bold text-[var(--color-accent-text)] mt-0.5">
                3
              </span>
              <div>
                <h5 className="font-serif font-bold text-xs">Content kit per brand</h5>
                <p className="text-[10px] text-black/55">
                  Asset editoriali e UGC quando il prodotto entra davvero nel viaggio.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-black/10 pt-3 text-[10px] font-mono opacity-50">
            <span>PERIMETRO DI PARTENZA</span>
            <span>INTEGRITÀ EDITORIALE</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageLayout>
      <SEO
        title="Media kit Travelliniwithus: audience, format e condizioni"
        description="Richiedi il media kit Travelliniwithus per capire audience, format, tono editoriale e condizioni giuste per una collaborazione coerente."
      />

      <Section className="pt-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mx-auto mt-8 max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-4">
              <Link
                to="/collaborazioni"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-sand)] px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[var(--color-accent-text)] transition-all hover:bg-[var(--color-accent-hover)] hover:text-white"
              >
                ← Hub Collaborazioni B2B (Case Study &amp; Calcolatore ROI)
              </Link>
            </div>
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-[var(--color-accent)]" />
              <span className="font-script text-xl text-[var(--color-accent-text)]">Media kit</span>
              <div className="h-px w-12 bg-[var(--color-accent)]" />
            </div>
            <h1 className="mb-8 text-5xl font-serif md:text-7xl">
              Prima capiamo il fit.
              <br />
              <span className="italic text-black/60"> Poi costruiamo la proposta.</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-black/70">
              Il media kit raccoglie pubblico, posizionamento, format e criteri editoriali. Serve a
              capire se una collaborazione ha basi reali prima di parlare di deliverable e budget.
            </p>
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent-soft)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-accent-text)] md:gap-6 md:px-8">
              <span>{BRAND_STATS.instagramFollowers} Instagram</span>
              <span className="h-4 w-px bg-[var(--color-accent)]/20" />
              <span>{BRAND_STATS.tiktokFollowers} TikTok</span>
              <span className="h-4 w-px bg-[var(--color-accent)]/20" />
              <span>{BRAND_STATS.monthlyReach} reach</span>
            </div>
            <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-black/60">
              {BRAND_STATS_SOURCE.label}. Snapshot pubblico osservato il{' '}
              {BRAND_STATS_SOURCE.observedAt}; i dati completi vengono aggiornati con Insights prima
              di ogni proposta.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#media-kit-form"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                Richiedi il media kit <ArrowRight size={14} />
              </a>
              <a
                href="#media-kit-preview"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/10 px-6 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)]"
              >
                Sfoglia l'anteprima
              </a>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section className="py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--color-accent-text)]">
                Proof pubbliche
              </span>
              <h2 className="text-3xl font-serif md:text-4xl">
                Segnali verificabili prima dei dati privati.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-black/58">
              Usiamo solo riferimenti dichiarabili: progetti territoriali, menzioni partner e earned
              media. Le metriche di campagna restano nel report riservato al partner.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PUBLIC_PROOF_SIGNALS.map((item) => (
              <a
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent('public_proof_click', {
                    route: '/media-kit',
                    source: 'media_kit',
                    proof: item.title,
                  })
                }
                className="group flex min-h-[220px] flex-col rounded-[var(--radius-lg)] border border-black/5 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)]/35 hover:shadow-md"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent-text)]">
                    {item.label}
                  </span>
                  <ExternalLink
                    size={15}
                    className="text-black/25 transition-colors group-hover:text-[var(--color-accent)]"
                  />
                </div>
                <h3 className="text-xl font-serif leading-tight text-[var(--color-ink)]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-black/60">{item.description}</p>
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="order-2 lg:order-1">
            <div className="mb-10 rounded-[var(--radius-lg)] border border-black/5 bg-[var(--color-sand)] p-8 md:p-10">
              <h2 className="mb-4 text-3xl font-serif">Cosa troverai nel media kit</h2>
              <p className="leading-relaxed text-black/70">
                Non una presentazione gonfiata. Una sintesi ordinata di chi siamo, a chi parliamo,
                che cosa sappiamo fare bene e quali format possono diventare una proposta concreta.
              </p>
            </div>

            {/* Visual Book Slider preview */}
            <div
              id="media-kit-preview"
              className="mb-8 scroll-mt-28 overflow-hidden rounded-2xl border border-black/5 bg-[var(--color-surface-2)] p-4 shadow-sm md:p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black/60">
                    Sfoglia Anteprima del PDF
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSlide((prev) => (prev > 0 ? prev - 1 : pdfSlides.length - 1))
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white transition-all hover:bg-[var(--color-sand)] hover:scale-105 active:scale-95 cursor-pointer text-black/60"
                    aria-label="Pagina precedente"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-mono font-medium text-black/60 px-1 select-none">
                    {activeSlide + 1} / {pdfSlides.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSlide((prev) => (prev < pdfSlides.length - 1 ? prev + 1 : 0))
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white transition-all hover:bg-[var(--color-sand)] hover:scale-105 active:scale-95 cursor-pointer text-black/60"
                    aria-label="Pagina successiva"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Slider frame */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-white shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="h-full w-full"
                  >
                    {pdfSlides[activeSlide].content}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slide text description */}
              <div className="mt-4 border-t border-black/5 pt-4">
                <h4 className="font-serif text-lg font-bold text-[var(--color-ink)]">
                  {pdfSlides[activeSlide].title}
                </h4>
                <p className="mt-1.5 text-xs leading-relaxed text-black/60">
                  {pdfSlides[activeSlide].description}
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-[var(--radius-lg)] border border-black/5 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-serif">I 3 punti di partenza</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/62">
                  Sono punti di partenza, non listini rigidi. Aiutano a capire il perimetro prima di
                  costruire una proposta su misura.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {PACKAGE_PREVIEWS.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-black/6 bg-[var(--color-sand)]/45 p-5"
                  >
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
                      {item.eyebrow}
                    </div>
                    <h4 className="font-serif text-xl text-[var(--color-ink)]">{item.title}</h4>
                    <p className="mt-3 rounded-xl border border-black/5 bg-white/70 px-4 py-3 text-sm font-medium leading-relaxed text-black/72">
                      {item.output}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-black/62">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-[var(--radius-lg)] border border-black/5 bg-white p-8 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck size={18} className="text-[var(--color-accent)]" />
                <h3 className="text-2xl font-serif">Quando conviene scriverci</h3>
              </div>
              <div className="space-y-4">
                {QUALIFYING_POINTS.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                    <p className="leading-relaxed text-black/68">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!isSuccess && !fallbackNotice ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="order-1 relative h-fit overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-8 shadow-xl md:p-10 lg:order-2"
            >
              <div className="absolute left-0 top-0 h-2 w-full bg-[var(--color-accent)]" />
              <div className="mb-8">
                <h2 className="mb-2 text-2xl font-serif">Richiedi il media kit</h2>
                <p className="text-sm leading-relaxed text-[var(--color-muted-fg)]">
                  Ti chiediamo poche informazioni, ma utili. Servono a capire se il progetto è
                  allineato e a risponderti con materiale davvero rilevante.
                </p>
              </div>

              <form id="media-kit-form" onSubmit={handleSubmit} className="space-y-6" noValidate>
                <FormField label="Nome azienda / agenzia" htmlFor="company" required>
                  <Input
                    type="text"
                    id="company"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Es. boutique hotel, agenzia travel, destination office"
                  />
                </FormField>

                <FormField label="Sito o profilo brand" htmlFor="website">
                  <div className="relative">
                    <Globe
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-fg)]"
                      size={18}
                    />
                    <Input
                      type="url"
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="pl-11"
                      placeholder="https://..."
                    />
                  </div>
                </FormField>

                <FormField label="Email lavorativa" htmlFor="email" required>
                  <Input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@azienda.com"
                  />
                </FormField>

                <FormField label="Focus della richiesta" htmlFor="project-focus" required>
                  <div className="relative">
                    <Target
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-fg)]"
                      size={18}
                    />
                    <Select
                      id="project-focus"
                      value={projectFocus}
                      onChange={(e) => setProjectFocus(e.target.value)}
                      className="pl-11"
                    >
                      <option value="">Seleziona il tipo di progetto</option>
                      {projectFocusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </div>
                </FormField>

                <FormField label="Budget indicativo per il progetto" htmlFor="budget" required>
                  <div className="relative">
                    <Wallet
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-fg)]"
                      size={18}
                    />
                    <Select
                      id="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="pl-11"
                    >
                      <option value="">Seleziona una fascia di budget</option>
                      {budgetOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </div>
                </FormField>

                <FormField
                  label="Periodo stimato per la campagna"
                  htmlFor="campaignPeriod"
                  required
                >
                  <div className="relative">
                    <CalendarRange
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-fg)]"
                      size={18}
                    />
                    <Select
                      id="campaignPeriod"
                      value={campaignPeriod}
                      onChange={(e) => setCampaignPeriod(e.target.value)}
                      className="pl-11"
                    >
                      <option value="">Seleziona un periodo temporale</option>
                      {campaignPeriodOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </div>
                </FormField>

                <FormField label="Contesto breve ma utile" htmlFor="brief" required>
                  <Textarea
                    id="brief"
                    rows={5}
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="Obiettivo, periodo, pacchetto di partenza se lo hai già in mente e perché pensi che ci sia un fit reale."
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] px-8 py-4 font-medium text-white transition-colors hover:bg-[var(--color-ink)]/85 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Invio in corso...
                    </>
                  ) : (
                    <>
                      <Download size={20} /> Richiedi il media kit
                    </>
                  )}
                </button>

                {submitError && (
                  <p role="alert" className="text-sm text-[var(--color-error)]">
                    {submitError}
                  </p>
                )}

                <p className="text-center text-xs font-medium text-[var(--color-accent-text)]">
                  Se il contatto è coerente, ricevi il link al media kit e un riscontro entro 48 ore
                  lavorative.
                </p>

                <p className="text-center text-xs leading-relaxed text-[var(--color-muted-fg)]">
                  Inviando la richiesta accetti di essere ricontattato in merito a possibili
                  collaborazioni e al trattamento dei dati secondo la nostra{' '}
                  <Link
                    to="/privacy"
                    className="underline underline-offset-2 hover:text-[var(--color-ink-2)]"
                  >
                    privacy policy
                  </Link>
                  .
                </p>
              </form>
            </motion.div>
          ) : isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="order-1 h-fit rounded-[var(--radius-lg)] border border-[var(--color-accent)]/15 bg-[var(--color-accent-soft)] p-8 shadow-sm md:p-10 lg:order-2"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                <CheckCircle size={32} />
              </div>
              <h2 className="mb-4 text-center text-2xl font-serif text-[var(--color-ink)]">
                Richiesta ricevuta
              </h2>
              <p className="text-center leading-relaxed text-[var(--color-accent-text)]">
                Grazie. Se vediamo un allineamento reale, ti inviamo il media kit e ti rispondiamo
                con i prossimi passi più utili.
              </p>
              <div className="mt-8 space-y-4 rounded-[1.5rem] border border-[var(--color-accent)]/10 bg-white/70 p-6">
                <div className="flex gap-3">
                  <CheckCircle size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                  <p className="text-sm leading-relaxed text-black/70">
                    Ti scriviamo entro 48 ore lavorative se il progetto è in linea.
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                  <p className="text-sm leading-relaxed text-black/70">
                    Il media kit arriva via email insieme al contesto giusto per continuare la
                    conversazione.
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                  <p className="text-sm leading-relaxed text-black/70">
                    Se vuoi accelerare, puoi anche scriverci direttamente con un brief più
                    dettagliato.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/contatti"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] px-6 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-ink)]/85"
                >
                  Vai ai contatti <ArrowRight size={14} />
                </Link>
                <a
                  href={CONTACTS.mailto}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-black/10 px-6 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-text)]"
                >
                  Scrivi a {CONTACTS.email}
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="order-1 h-fit rounded-[var(--radius-lg)] border border-[var(--color-warning)]/25 bg-[var(--color-warning-soft)] p-8 shadow-sm md:p-10 lg:order-2"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-warning)]/15 text-[var(--color-warning-text)]">
                <MailWarning size={32} />
              </div>
              <h2 className="mb-4 text-center text-2xl font-serif text-[var(--color-ink)]">
                Il modulo non è riuscito a inviare la richiesta
              </h2>
              <p className="text-center leading-relaxed text-[var(--color-warning-text)]">
                Non è colpa tua: il nostro sistema di invio non era raggiungibile in questo momento.
                Per essere sicuro/a che la vediamo, scrivici direttamente.
              </p>
              <div className="mt-8 rounded-[1.5rem] border border-[var(--color-warning)]/20 bg-white/70 p-6">
                <LeadFallbackNotice
                  savedLocally={Boolean(fallbackNotice?.saved)}
                  mailtoHref={mediaKitFallbackMailto}
                  whatsappHref={mediaKitFallbackWhatsAppUrl}
                  onRetry={() => setFallbackNotice(null)}
                />
              </div>
            </motion.div>
          )}
        </div>
      </Section>

      <Section className="rounded-[var(--radius-xl)] bg-[var(--color-sand)] px-0 py-14 md:p-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-serif">Come funziona dopo il primo contatto</h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-black/70">
            Questo passaggio serve a filtrare meglio, non a complicare. Preferiamo meno richieste ma
            più coerenti, con una conversazione pulita fin dall'inizio.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {NEXT_STEPS.map((item) => (
            <div
              key={item.title}
              className="rounded-[var(--radius-lg)] border border-black/5 bg-white p-8 shadow-sm"
            >
              <h3 className="mb-3 text-2xl font-serif">{item.title}</h3>
              <p className="leading-relaxed text-black/70">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="rounded-[var(--radius-xl)] bg-[var(--color-ink)] px-0 py-14 text-white md:p-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] bg-white/10 text-[var(--color-accent)]">
            <Mail size={24} />
          </div>
          <h2 className="mb-4 text-3xl font-serif md:text-4xl">
            Vuoi partire da un contatto diretto?
          </h2>
          <p className="mb-8 leading-relaxed text-white/80">
            Se hai già un brief chiaro o una proposta ben impostata, puoi scriverci direttamente. Il
            criterio resta lo stesso: allineamento, chiarezza e poi approfondimento.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={CONTACTS.mailto}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--color-accent)] px-8 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-all hover:brightness-110"
            >
              Scrivi a {CONTACTS.email}
            </a>
            <a
              href={CONTACTS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:border-white/40 hover:bg-white/10"
            >
              Apri WhatsApp
            </a>
          </div>
        </div>
      </Section>

      {!isSuccess && !fallbackNotice && (
        <StickyMobileCTA
          label="Richiedi il media kit"
          onClick={() => {
            const form = document.getElementById('media-kit-form');
            if (form) {
              form.scrollIntoView({ behavior: 'smooth', block: 'start' });
              const firstInput = form.querySelector<HTMLInputElement>('input, select, textarea');
              firstInput?.focus({ preventScroll: true });
            }
          }}
          trackingId="media_kit_form"
          revealAfter={-1}
        />
      )}
    </PageLayout>
  );
}
