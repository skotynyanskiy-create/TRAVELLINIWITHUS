import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle,
  Compass,
  Loader2,
  Mail,
  Map,
  Sparkles,
} from 'lucide-react';
import SEO from '../components/SEO';
import LeadMagnetCover from '../components/LeadMagnetCover';
import { Link } from '../components/TransitionLink';
import { BRAND_CREDENTIALS, BRAND_STATS, SITE_URL } from '../config/site';
import { appendLeadFallback } from '../lib/leadFallback';
import { trackEvent } from '../services/analytics';

const DESTINATION_MARKS = Array.from({ length: 10 }, (_, index) => index + 1);
const TEASER_WORDS = ['fuori stagione', 'senza folla', 'fuori rotta'];

const VALUE_POINTS = [
  { icon: Compass, label: 'Provati e consigliati da noi, sul campo' },
  { icon: Map, label: 'Quando andare, che ritmo, cosa evitare' },
  { icon: Sparkles, label: 'Una lista corta, solo per chi è iscritto' },
];

export default function VieniConNoi() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  const utmSource = searchParams.get('utm_source') ?? 'direct';
  const utmCampaign = searchParams.get('utm_campaign') ?? 'lead_magnet';
  // Token evergreen, disaccoppiato da slug e titolo (entrambi possono ruotare
  // per future guide): vedi HANDOFF_lead-magnet-rework_frontend_to_gate.md.
  const source = `lead_magnet_landing_${utmSource}`;

  useEffect(() => {
    trackEvent('landing_view', { source, utm_source: utmSource, utm_campaign: utmCampaign });
  }, [source, utmSource, utmCampaign]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    trackEvent('newsletter_submit_attempt', { source });

    if (website.trim()) {
      trackEvent('newsletter_submit_blocked', { source, reason: 'honeypot' });
      setIsSuccess(true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
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

      completeSignup(false);
    } catch {
      const saved = appendLeadFallback('twu_newsletter_leads', {
        email: normalizedEmail,
        source,
        date: new Date().toISOString(),
      });

      if (saved) {
        completeSignup(true);
      } else {
        setError('Iscrizione non riuscita. Riprova tra poco.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeSignup = (fallback: boolean) => {
    const leadParams = {
      route: '/guida-in-regalo',
      source,
      utm_source: utmSource,
      cta_id: 'lead_magnet_landing_form',
      content_id: 'lead_magnet_guida',
      ...(fallback ? { fallback: 'localStorage' } : {}),
    };

    trackEvent('newsletter_signup', leadParams);
    trackEvent('lead_magnet_signup', leadParams);
    sessionStorage.setItem('twu_lead_magnet_unlocked', '1');
    setIsSuccess(true);
    // Success panel is below the fold on mobile — scroll into view
    requestAnimationFrame(() => {
      document
        .getElementById('lead-form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  return (
    <>
      <SEO
        title="Alla scoperta dell’Italia nascosta"
        description="Alla scoperta dell’Italia nascosta: 10 posti provati e consigliati da Rodrigo & Betta. La ricevi lasciando l’email; i prossimi te li mandiamo prima."
        canonical={`${SITE_URL}/guida-in-regalo`}
        image={`${SITE_URL}/og/guida-in-regalo.webp`}
        noindex
      />

      <div className="min-h-screen overflow-x-clip bg-[var(--color-sand)] pt-24 text-[var(--color-ink)] md:pt-28">
        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto grid max-w-[1360px] gap-8 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1.12fr_0.88fr] lg:grid-rows-[auto_auto] lg:gap-x-16 lg:gap-y-10 lg:py-20">
            <div className="max-w-3xl lg:col-start-1 lg:row-start-1">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
                <Sparkles size={13} />
                La prima guida di Rodrigo &amp; Betta
              </span>

              <h1 className="mt-5 max-w-3xl font-serif text-[clamp(2.75rem,7.5vw,6.7rem)] leading-[0.92] tracking-[-0.03em] md:leading-[0.88] md:tracking-[-0.045em]">
                Alla scoperta dell’Italia nascosta
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-ink-2)] md:mt-7 md:text-xl">
                10 posti provati e consigliati da noi — non un algoritmo, non una classifica.
              </p>
              <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[var(--color-muted-fg-2)] md:mt-3 md:text-lg">
                La ricevi lasciando la tua email. Da lì in poi sei nella lista: i prossimi te li
                mandiamo prima.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[240px] sm:max-w-[260px] lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:max-w-[440px] lg:self-center lg:justify-self-end">
              <div
                aria-hidden="true"
                className="absolute inset-2 -z-10 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-atlante-carta-deep)] lg:rotate-3"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-premium)] lg:-rotate-2">
                <LeadMagnetCover />
              </div>
            </div>

            <div className="max-w-2xl lg:col-start-1 lg:row-start-2">
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

              <p className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-muted-fg)]">
                <BadgeCheck size={14} className="shrink-0 text-[var(--color-accent)]" />
                <span>{BRAND_CREDENTIALS.metaVerifiedLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{BRAND_CREDENTIALS.agcomLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{BRAND_STATS.totalFollowers} community</span>
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/48 px-5 py-10 md:px-10 md:py-12">
          <div className="mx-auto max-w-[1240px]">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              Dieci posti. Nessuno spoiler.
            </p>

            <div className="relative mt-8">
              <div className="absolute top-4 right-4 left-4 h-px bg-[var(--color-accent)]/28" />
              <ol className="relative grid grid-cols-5 gap-y-6 md:grid-cols-10">
                {DESTINATION_MARKS.map((mark) => (
                  <li key={mark} className="flex flex-col items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-surface)] text-[10px] font-semibold text-[var(--color-accent-text)]">
                      {String(mark).padStart(2, '0')}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center font-serif text-base italic text-[var(--color-ink-2)] sm:text-lg">
              {TEASER_WORDS.map((word, index) => (
                <span key={word} className="flex items-center gap-x-3">
                  {index > 0 && (
                    <span aria-hidden="true" className="not-italic text-[var(--color-accent)]">
                      ·
                    </span>
                  )}
                  {word}
                </span>
              ))}
            </p>
          </div>
        </section>

        <section className="px-6 py-10 md:px-10 md:py-12">
          <div className="mx-auto grid max-w-[1080px] gap-y-6 sm:grid-cols-3 sm:gap-x-4">
            {VALUE_POINTS.map((point, index) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.label}
                  className={`flex flex-col items-center gap-3 px-6 py-6 text-center ${
                    index > 0 ? 'sm:border-l sm:border-[var(--color-border)]' : ''
                  }`}
                >
                  <Icon size={22} className="text-[var(--color-accent)]" />
                  <span className="text-sm leading-snug font-medium text-[var(--color-ink-2)]">
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mx-auto mt-9 max-w-2xl text-center text-xs leading-relaxed text-[var(--color-muted-fg)]">
            Solo posti nuovi e consigli che vale la pena salvare — niente spam. Esci quando vuoi.{' '}
            <Link
              to="/privacy"
              className="underline underline-offset-4 hover:text-[var(--color-ink)]"
            >
              Privacy
            </Link>
          </p>
        </section>

        {/* Path secondari: bio hub = non solo form */}
        <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/40 px-6 py-12 md:px-10 md:py-16">
          <div className="mx-auto max-w-[1080px]">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
              Oppure continua sul sito
            </p>
            <h2 className="mx-auto mt-3 max-w-xl text-center font-serif text-2xl md:text-3xl">
              Tre strade, senza rumore.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {(
                [
                  {
                    to: '/esplora',
                    title: 'Esplora i posti',
                    text: 'Archivio filtrabile di luoghi e storie già sul sito.',
                    id: 'guida_path_esplora',
                  },
                  {
                    to: '/mappa',
                    title: 'Apri la mappa',
                    text: 'Pin geolocalizzati dei posti che abbiamo vissuto.',
                    id: 'guida_path_mappa',
                  },
                  {
                    to: '/collaborazioni',
                    title: 'Collabora con noi',
                    text: 'Per brand, hotel e territori: media kit e contatti.',
                    id: 'guida_path_collab',
                  },
                ] as const
              ).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  data-track={item.id}
                  onClick={() =>
                    trackEvent('bio_hub_path_click', {
                      route: '/guida-in-regalo',
                      source,
                      utm_source: utmSource,
                      cta_id: item.id,
                      destination: item.to,
                    })
                  }
                  className="group rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:border-[var(--color-accent)]/40"
                >
                  <span className="font-serif text-xl text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                    {item.title}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-fg)]">
                    {item.text}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
                    Vai <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
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
  const prefersReducedMotion = useReducedMotion();

  return (
    <div id="lead-form" className="max-w-2xl">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="form"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            onSubmit={onSubmit}
            noValidate
          >
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <label htmlFor="guida-in-regalo-email" className="sr-only">
                La tua email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-[var(--color-muted-fg)]"
                />
                <input
                  id="guida-in-regalo-email"
                  type="email"
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  placeholder="La tua email"
                  required
                  autoComplete="email"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'guida-in-regalo-error' : 'guida-in-regalo-hint'}
                  className="h-14 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]/88 pr-5 pl-12 text-sm text-[var(--color-ink)] shadow-xs transition-colors placeholder:text-[var(--color-muted-fg)] focus:border-[var(--color-accent)] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-14 min-h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-6 text-[11px] font-bold tracking-[0.14em] text-white uppercase shadow-xs transition-all hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    Invio in corso <Loader2 size={15} className="animate-spin" />
                  </>
                ) : (
                  <>
                    <span className="sm:hidden">Ricevi la guida</span>
                    <span className="hidden sm:inline">Ricevi la prima guida</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>

            <label htmlFor="guida-in-regalo-website" className="sr-only">
              Lascia vuoto
            </label>
            <input
              id="guida-in-regalo-website"
              type="text"
              value={website}
              onChange={(event) => onWebsiteChange(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[10000px] h-0 w-0 overflow-hidden border-0 p-0 opacity-0"
            />

            {error && (
              <p
                id="guida-in-regalo-error"
                role="alert"
                className="mt-3 text-sm text-[var(--color-error-text)]"
              >
                {error}
              </p>
            )}

            <p id="guida-in-regalo-hint" className="mt-3 text-xs text-[var(--color-muted-fg)]">
              Con l’email entri nella lista di Travellini. La guida si apre sul sito subito dopo.
              Esci quando vuoi.
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            role="status"
            aria-live="polite"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          >
            <div className="flex items-center gap-1.5 text-[var(--color-success-text)]">
              <CheckCircle size={15} />
              <span className="text-[10px] font-bold tracking-widest uppercase">
                Iscrizione registrata
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="aspect-[4/5] h-16 w-auto shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] sm:h-20">
                <LeadMagnetCover variant="compact" />
              </div>
              <div>
                <h2 className="font-serif text-2xl">Ci sei. Scarica la guida qui.</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-2)]">
                  Il PDF è disponibile subito sulla pagina successiva. Ti avvisiamo via email quando
                  esce il prossimo posto (niente sequenze di vendita).
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to="/lead-magnet"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-6 text-xs font-bold tracking-widest text-white uppercase shadow-xs transition-all hover:bg-[var(--color-accent-hover)]"
                  >
                    Apri e scarica <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/esplora"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-5 text-xs font-bold tracking-widest uppercase text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)]"
                  >
                    Esplora il sito
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
