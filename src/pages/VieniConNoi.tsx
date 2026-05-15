import { useEffect, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Loader2, MapPin, Shield, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { CONTACTS, SITE_URL } from '../config/site';
import { trackEvent } from '../services/analytics';
import { appendLeadFallback } from '../lib/leadFallback';

const HERO_IMAGE = '/images/brand/couple-travel.png';

/**
 * Landing dedicata al traffico mobile da bio Instagram/TikTok.
 * Pattern minimal: no navbar, no footer, 1 CTA, lead capture diretta.
 * Atterra qui chi clicca "travelliniwithus.it/vieni-con-noi" dalla bio.
 */
export default function VieniConNoi() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
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
        title="Vieni con noi"
        description="Mini-guida 10 posti italiani non ovvi per chi viaggia in coppia. Pratica, scelta dopo 8 anni di viaggi reali. Solo via newsletter."
        canonical={`${SITE_URL}/vieni-con-noi`}
        image={`${SITE_URL}/og/vieni-con-noi.webp`}
        noindex
      />

      <div className="relative min-h-[100dvh] overflow-hidden bg-[var(--color-ink)] text-white">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center opacity-50"
            loading="eager"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.5)_0%,rgba(10,10,10,0.7)_50%,rgba(10,10,10,0.92)_100%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-xl flex-col justify-between px-6 py-12 md:py-20">
          {/* Top: brand mark */}
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-serif font-medium tracking-tight text-white">
              Travellini<span className="font-bold text-[var(--color-accent)]">with</span>us
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">
              Rodrigo &amp; Betta
            </span>
          </div>

          {/* Middle: form or success */}
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="my-12"
              >
                <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent)]">
                  Solo se viaggi in coppia
                </span>

                <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl">
                  Pochi posti, raccontati bene.
                </h1>

                <p className="mt-6 text-lg leading-relaxed text-white/82 md:text-xl">
                  Scarica{' '}
                  <strong className="font-semibold text-white">10 posti italiani non ovvi</strong>,
                  la nostra mini-guida pratica per coppie. Niente algoritmo: scelti dopo 8 anni di
                  viaggi veri.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-3" noValidate>
                  <label htmlFor="vcn-email" className="sr-only">
                    La tua email
                  </label>
                  <input
                    id="vcn-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@esempio.com"
                    required
                    autoComplete="email"
                    aria-invalid={Boolean(error)}
                    className="w-full rounded-full border border-white/20 bg-white/10 px-6 py-4 text-base text-white placeholder:text-white/45 backdrop-blur-sm transition-all focus:border-[var(--color-accent)] focus:bg-white/15 focus:outline-none"
                  />
                  <label htmlFor="vcn-website" className="sr-only">
                    Lascia vuoto
                  </label>
                  <input
                    id="vcn-website"
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute h-0 w-0 overflow-hidden border-0 p-0 opacity-0"
                    style={{ left: '-10000px' }}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-[0_18px_44px_rgba(234,88,12,0.35)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        Iscrizione <Loader2 size={16} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        Scarica la guida <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  {error && (
                    <p role="alert" className="text-sm text-[var(--color-error-soft)]">
                      {error}
                    </p>
                  )}
                </form>

                <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-medium text-white/55">
                  <span className="inline-flex items-center gap-1.5">
                    <Shield size={12} className="text-[var(--color-accent)]" /> Una mail al mese
                  </span>
                  <span aria-hidden="true">&middot;</span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={12} className="text-[var(--color-accent)]" /> 10 posti italiani
                  </span>
                  <span aria-hidden="true">&middot;</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[var(--color-accent)]" /> Zero spam
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="my-12 text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <CheckCircle size={32} />
                </div>
                <h2 className="font-serif text-3xl">Ci sei.</h2>
                <p className="mt-4 text-white/80">
                  La mini-guida arriva via email entro qualche minuto. Se non la vedi, controlla lo
                  spam.
                </p>
                <Link
                  to="/lead-magnet"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--color-accent)] underline-offset-4 hover:underline"
                >
                  Vai alla pagina download <ArrowRight size={14} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom: brand legal */}
          <div className="text-center text-[10px] text-white/40">
            Iscrivendoti accetti la nostra{' '}
            <Link to="/privacy" className="underline underline-offset-2 hover:text-white/70">
              privacy
            </Link>
            . Puoi disiscriverti quando vuoi.{' '}
            <span className="block sm:inline">
              <a
                href={CONTACTS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-white/70"
              >
                Instagram
              </a>{' '}
              &middot;{' '}
              <a
                href={CONTACTS.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-white/70"
              >
                TikTok
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
