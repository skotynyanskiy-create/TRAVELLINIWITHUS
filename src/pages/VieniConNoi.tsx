import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { Link } from '@/src/components/TransitionLink';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  Clock3,
  Download,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Shield,
  Sparkles,
} from 'lucide-react';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import { BIO_LINKS, CONTACTS, SITE_URL } from '../config/site';
import { getContentById } from '../config/contentLibrary';
import { getPublishedReels } from '../config/reels';
import { trackEvent } from '../services/analytics';
import { appendLeadFallback } from '../lib/leadFallback';

const COVER_IMAGE = '/images/lead-magnets/posti-italiani-cover-demo.webp';

const HUB_LINKS = [
  {
    title: 'Posti particolari da salvare',
    description: 'Luoghi, esperienze e idee da tenere da parte prima del prossimo viaggio.',
    to: '/esplora?utm_source=bio_hub&utm_medium=landing&utm_campaign=discovery',
    cta: 'Apri Esplora',
  },
  {
    title: 'Risorse che usiamo',
    description: 'Assicurazione, esperienze, strumenti e servizi spiegati senza effetto coupon.',
    to: '/risorse?utm_source=bio_hub&utm_medium=landing&utm_campaign=resources',
    cta: 'Vedi risorse',
  },
  {
    title: 'Collabora con noi',
    description: 'Per hotel, territori, esperienze e brand con un progetto coerente.',
    to: '/media-kit?utm_source=bio_hub&utm_medium=landing&utm_campaign=business',
    cta: 'Media kit',
  },
];

/** Reel reali → scheda del posto (quando esiste in content-seed). */
const REEL_CARDS = getPublishedReels().map((reel) => ({
  reel,
  posto: reel.postoId ? getContentById(reel.postoId) : undefined,
}));

const GUIDE_DETAILS = [
  { icon: MapPin, label: '10 luoghi', detail: 'Schede brevi per partire da posti concreti.' },
  { icon: CalendarDays, label: 'Periodo', detail: 'Quando andarci e quando invece evitarlo.' },
  { icon: Clock3, label: 'Ritmo', detail: 'Quanto fermarsi e cosa non comprimere.' },
];

const PREVIEW_PLACES = [
  {
    name: 'Procida lenta',
    tag: 'mare fuori stagione',
    copy: 'Per capire l’isola senza rincorrere solo il porto colorato.',
  },
  {
    name: 'Maremma',
    tag: 'borghi e terme',
    copy: 'Per alternare paesi piccoli, strade vuote e soste semplici.',
  },
  {
    name: 'Val d’Orcia',
    tag: 'weekend morbido',
    copy: 'Per costruire due giorni belli anche senza una lista infinita.',
  },
];

const FAQS = [
  {
    question: 'Che tipo di guida è?',
    answer:
      'È una mini guida breve: pochi posti scelti con criterio, pensata per aiutarti a decidere da dove ripartire senza aprire mille tab.',
  },
  {
    question: 'Riceverò troppe email?',
    answer:
      'No. L’idea è una newsletter leggera: aggiornamenti quando c’è qualcosa da salvare, non sequenze automatiche aggressive.',
  },
  {
    question: 'È pensata solo per coppie?',
    answer:
      'Nasce dal modo in cui Rodrigo & Betta viaggiano insieme, ma funziona anche se cerchi posti lenti, pratici e non troppo ovvi.',
  },
];

/**
 * Landing dedicata al traffico mobile da bio Instagram/TikTok.
 * Atterra qui chi clicca "travelliniwithus.it/vieni-con-noi" dalla bio.
 */
export default function VieniConNoi() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  const utmSource = searchParams.get('utm_source') ?? 'direct';
  const utmCampaign = searchParams.get('utm_campaign') ?? 'vieni_con_noi';
  const source = `vieni_con_noi_${utmSource}`;

  useEffect(() => {
    trackEvent('landing_view', { source, utm_source: utmSource, utm_campaign: utmCampaign });
  }, [source, utmSource, utmCampaign]);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim();

    trackEvent('newsletter_submit_attempt', { source });

    if (website.trim()) {
      trackEvent('newsletter_submit_blocked', { source, reason: 'honeypot' });
      setIsSuccess(true);
      return;
    }

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      setError('Inserisci un indirizzo email valido.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, source, website }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      const leadParams = {
        route: '/vieni-con-noi',
        source,
        utm_source: utmSource,
        cta_id: 'vieni_con_noi_download_form',
        content_id: 'lead_magnet_10_posti_italiani',
      };
      trackEvent('newsletter_signup', leadParams);
      trackEvent('lead_magnet_signup', leadParams);
      sessionStorage.setItem('twu_lead_magnet_unlocked', '1');
      setIsSuccess(true);
    } catch {
      const saved = appendLeadFallback('twu_newsletter_leads', {
        email: normalizedEmail,
        source,
        date: new Date().toISOString(),
      });
      if (saved) {
        const leadParams = {
          route: '/vieni-con-noi',
          source,
          utm_source: utmSource,
          fallback: 'localStorage',
          cta_id: 'vieni_con_noi_download_form',
          content_id: 'lead_magnet_10_posti_italiani',
        };
        trackEvent('newsletter_signup', leadParams);
        trackEvent('lead_magnet_signup', leadParams);
        sessionStorage.setItem('twu_lead_magnet_unlocked', '1');
        setIsSuccess(true);
      } else {
        setError('Iscrizione non riuscita. Riprova tra poco oppure scrivici direttamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="10 posti italiani da salvare"
        description="Scarica la mini guida Travelliniwithus: 10 posti italiani da salvare, con periodo migliore, ritmo e note pratiche."
        canonical={`${SITE_URL}/vieni-con-noi`}
        image={`${SITE_URL}/og/vieni-con-noi.jpg`}
        noindex
      />

      <main className="min-h-screen overflow-x-clip bg-[var(--color-sand)] text-[var(--color-ink)]">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-12">
          <Link to="/" className="font-serif text-2xl font-medium tracking-tight">
            Travellini<span className="font-bold text-[var(--color-accent)]">with</span>us
          </Link>
          <div className="hidden items-center gap-4 text-[10px] font-bold uppercase tracking-[0.22em] text-black/45 sm:flex">
            <a href={BIO_LINKS.instagram} className="hover:text-[var(--color-ink)]">
              Link IG
            </a>
            <span className="h-3 w-px bg-black/15" />
            <span>Rodrigo &amp; Betta</span>
          </div>
        </header>

        <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-6 md:px-12 md:pb-24 lg:grid-cols-[1fr_0.88fr] lg:items-center lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              <Sparkles size={13} /> Mini guida gratuita
            </span>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.96] tracking-tight md:text-7xl">
              10 posti italiani da tenere da parte.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/68 md:text-xl">
              Una mini guida gratuita per partire da luoghi concreti, periodo migliore, ritmo giusto
              e qualche errore da evitare prima di organizzare il viaggio.
            </p>

            <a
              href="#lead-form"
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)] md:hidden"
            >
              Ricevi la guida <ArrowRight size={14} />
            </a>

            <div className="mt-8 hidden max-w-2xl gap-3 sm:grid-cols-3 md:grid">
              {GUIDE_DETAILS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="border-t border-black/10 pt-4">
                    <Icon size={18} className="text-[var(--color-accent)]" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-black/70">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-black/55">{item.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="grid overflow-hidden rounded-lg border border-black/10 bg-white shadow-[var(--shadow-premium)] sm:grid-cols-[0.85fr_1fr] lg:grid-cols-1">
              <div className="relative min-h-[360px] overflow-hidden bg-[var(--color-ink-deep)] text-white sm:min-h-[420px] lg:min-h-[520px]">
                <OptimizedImage
                  src={COVER_IMAGE}
                  alt="Copertina della mini guida 10 posti italiani da salvare"
                  className="absolute inset-0 h-full w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 520px"
                  priority
                />
                <div className="twu-cover-scrim absolute inset-0" />
                <div className="relative flex h-full flex-col justify-between p-7">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">
                    <span>Travelliniwithus</span>
                    <FileText size={16} className="text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent)]">
                      Mini guida gratuita
                    </p>
                    <p className="mt-4 max-w-[16rem] font-serif text-5xl leading-[0.9]">
                      10 posti italiani da salvare.
                    </p>
                  </div>
                </div>
              </div>

              <LeadForm
                email={email}
                website={website}
                isSubmitting={isSubmitting}
                isSuccess={isSuccess}
                error={error}
                onEmailChange={setEmail}
                onWebsiteChange={setWebsite}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-ink)] py-14 text-white md:py-18">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="grid gap-5 md:grid-cols-[0.78fr_1.22fr] md:items-end">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent)]">
                  Le Tracce
                </span>
                <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
                  Scegli da dove entrare.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-relaxed text-white/68">
                Questa pagina sostituisce il classico link in bio: meno bottoni sparsi, più percorsi
                chiari tra contenuti, risorse e collaborazioni.
              </p>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {HUB_LINKS.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  onClick={() =>
                    trackEvent('bio_hub_path_click', {
                      source,
                      path: item.to,
                      label: item.title,
                    })
                  }
                  className="group flex min-h-[190px] flex-col justify-between rounded-lg border border-white/10 bg-white/6 p-6 transition-colors hover:border-[var(--color-accent)] hover:bg-white/10"
                >
                  <div>
                    <h3 className="font-serif text-2xl leading-tight">{item.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-white/62">{item.description}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                    {item.cta}{' '}
                    <ArrowRight
                      size={12}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {REEL_CARDS.length > 0 && (
          <section className="py-14 md:py-20" aria-labelledby="reel-schede-heading">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
              <div className="grid gap-5 md:grid-cols-[0.78fr_1.22fr] md:items-end">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
                    Dai reel alle schede
                  </span>
                  <h2
                    id="reel-schede-heading"
                    className="mt-4 font-serif text-4xl leading-tight md:text-5xl"
                  >
                    Hai visto un posto nei reel? Qui trovi la sua scheda.
                  </h2>
                </div>
                <p className="max-w-2xl text-base leading-relaxed text-black/62">
                  Ogni reel racconta un posto vero: nella scheda mettiamo quello che nel video non
                  entra — dove si trova, per chi è e, quando è verificato, il prezzo.
                </p>
              </div>

              <div className="-mx-6 mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
                {REEL_CARDS.map(({ reel, posto }) => {
                  const cardBody = (
                    <>
                      <div className="relative aspect-[9/14] overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-ink-deep)]">
                        <OptimizedImage
                          src={reel.cover}
                          alt={reel.alt}
                          responsiveWidths={[320, 480]}
                          sizes="230px"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                        <div className="twu-bottom-scrim absolute inset-0" />
                        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                          {reel.location}
                        </span>
                      </div>
                      <p className="mt-3 font-serif text-lg leading-snug text-[var(--color-ink)]">
                        {reel.hook}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent-text)]">
                        {posto ? 'Apri la scheda' : 'Vedi il reel'} <ArrowRight size={12} />
                      </span>
                    </>
                  );
                  const trackClick = () =>
                    trackEvent('bio_hub_reel_click', {
                      source,
                      reel_id: reel.id,
                      has_scheda: Boolean(posto),
                    });

                  return posto ? (
                    <Link
                      key={reel.id}
                      to={`/posto/${posto.id}`}
                      onClick={trackClick}
                      className="group w-[230px] shrink-0 snap-start"
                    >
                      {cardBody}
                    </Link>
                  ) : (
                    <a
                      key={reel.id}
                      href={reel.instagramUrl ?? reel.tiktokUrl ?? CONTACTS.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={trackClick}
                      className="group w-[230px] shrink-0 snap-start"
                    >
                      {cardBody}
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section
          className="bg-[var(--color-surface)] py-16 md:py-24"
          aria-labelledby="preview-heading"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
                  Dentro la guida
                </span>
                <h2
                  id="preview-heading"
                  className="mt-4 font-serif text-4xl leading-tight md:text-6xl"
                >
                  Non solo nomi: il perché, il quando, il ritmo.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-relaxed text-black/62 md:text-lg">
                Ogni scheda serve a tagliare il rumore: cosa rende interessante il posto, quando ha
                più senso andarci e quale scelta pratica può cambiare l’esperienza.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {PREVIEW_PLACES.map((place) => (
                <article key={place.name} className="rounded-lg border border-black/8 bg-white p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]">
                    {place.tag}
                  </p>
                  <h3 className="mt-4 font-serif text-3xl">{place.name}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-black/58">{place.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-labelledby="faq-heading">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 md:px-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
                Prima di iscriverti
              </span>
              <h2 id="faq-heading" className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
                Una promessa semplice.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-black/60">
                Ti lasciamo un contenuto utile e poi ti scriviamo solo quando c’è qualcosa che vale
                la tua attenzione.
              </p>
            </div>

            <div className="grid gap-3">
              {FAQS.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-lg border border-black/8 bg-white/70 p-6"
                >
                  <h3 className="font-serif text-2xl">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-black/58">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-black/8 px-6 py-8 text-center text-xs text-black/50 md:px-12">
          Iscrivendoti accetti la nostra{' '}
          <Link
            to="/privacy"
            className="underline underline-offset-2 hover:text-[var(--color-ink)]"
          >
            privacy
          </Link>
          . Puoi disiscriverti quando vuoi.{' '}
          <a
            href={CONTACTS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[var(--color-ink)]"
          >
            Instagram
          </a>{' '}
          ·{' '}
          <a
            href={CONTACTS.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[var(--color-ink)]"
          >
            TikTok
          </a>
        </footer>
      </main>
    </>
  );
}

interface LeadFormProps {
  email: string;
  website: string;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string;
  onEmailChange: (value: string) => void;
  onWebsiteChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}

function LeadForm({
  email,
  website,
  isSubmitting,
  isSuccess,
  error,
  onEmailChange,
  onWebsiteChange,
  onSubmit,
}: LeadFormProps) {
  return (
    <div id="lead-form" className="scroll-mt-8 bg-white p-6 md:p-8">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-start gap-3 text-sm leading-relaxed text-black/62">
              <Shield size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
              <p>
                Ricevi il PDF e i prossimi aggiornamenti utili. Zero spam, disiscrizione sempre
                disponibile.
              </p>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-3" noValidate>
              <label htmlFor="vcn-email" className="sr-only">
                La tua email
              </label>
              <input
                id="vcn-email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="nome@esempio.com"
                required
                autoComplete="email"
                aria-invalid={Boolean(error)}
                className="w-full rounded-full border border-black/10 bg-[var(--color-sand)] px-5 py-3 text-sm text-[var(--color-ink)] placeholder:text-black/34 transition-all focus:border-[var(--color-accent)] focus:bg-white focus:outline-none"
              />
              <label htmlFor="vcn-website" className="sr-only">
                Lascia vuoto
              </label>
              <input
                id="vcn-website"
                type="text"
                value={website}
                onChange={(e) => onWebsiteChange(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[10000px] h-0 w-0 overflow-hidden border-0 p-0 opacity-0"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    Invio in corso <Loader2 size={15} className="animate-spin" />
                  </>
                ) : (
                  <>
                    Ricevi la guida <Download size={15} />
                  </>
                )}
              </button>

              {error && (
                <p role="alert" className="pl-2 text-sm text-[var(--color-error-text)]">
                  {error}
                </p>
              )}
            </form>

            <div className="mt-6 grid gap-2 text-[11px] font-medium text-black/52">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={12} className="text-[var(--color-accent)]" /> Una mail quando serve
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={12} className="text-[var(--color-accent)]" /> 10 posti italiani da
                salvare
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={12} className="text-[var(--color-accent)]" /> Idee pratiche, non
                solo ispirazione
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-6 text-center"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <CheckCircle size={28} />
            </div>
            <h2 className="font-serif text-3xl">Ci sei.</h2>
            <p className="mt-4 text-sm leading-relaxed text-black/62">
              La mini guida arriva via email entro qualche minuto. Puoi anche aprire subito la
              pagina download.
            </p>
            <Link
              to="/lead-magnet"
              className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent-text)] underline-offset-4 hover:underline"
            >
              Vai alla pagina download <ArrowRight size={14} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
