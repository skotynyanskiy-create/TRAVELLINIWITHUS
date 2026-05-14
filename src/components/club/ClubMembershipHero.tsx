import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, Lock, Mail, Sparkles, Star } from 'lucide-react';
import { trackEvent } from '../../services/analytics';
import { appendLeadFallback } from '../../lib/leadFallback';

const FREE_BENEFITS = [
  'Articoli editoriali pubblici',
  'Mappa interattiva e quiz',
  'Newsletter mensile',
  'Carrello shop con guide singole',
];

const CLUB_BENEFITS = [
  'Accesso a tutte le guide digitali, sempre aggiornate',
  'Anteprima nuovi itinerari prima della pubblicazione',
  'Cancellazione in un click, nessun vincolo',
];

const PRICING_TIERS = [
  {
    id: 'monthly',
    label: 'Mensile',
    price: '5,90',
    period: 'al mese',
    sub: 'Cancellazione in qualsiasi momento',
  },
  {
    id: 'annual',
    label: 'Annuale',
    price: '49',
    period: 'all anno',
    sub: '2 mesi in regalo · paga una volta sola',
    badge: 'Risparmia 20%',
  },
];

export default function ClubMembershipHero() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePlanSelect = (planId: string) => {
    trackEvent('club_interest', { plan: planId, demo: true });
  };

  const handleWaitlist = async (e: FormEvent) => {
    e.preventDefault();
    const normalized = email.trim();
    if (!normalized) {
      setError('Inserisci un indirizzo email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setError('Inserisci un indirizzo email valido.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    trackEvent('club_waitlist_attempt');
    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalized, source: 'club_waitlist', website: '' }),
      });
      if (!response.ok) throw new Error('save failed');
      trackEvent('club_waitlist_success', { fallback: false });
      setIsSubscribed(true);
    } catch {
      const saved = appendLeadFallback('twu_club_waitlist', {
        email: normalized,
        source: 'club_waitlist',
        date: new Date().toISOString(),
      });
      if (saved) {
        trackEvent('club_waitlist_success', { fallback: true });
        setIsSubscribed(true);
      } else {
        setError('Iscrizione non riuscita. Riprova tra poco oppure scrivici via email.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[var(--color-ink)] py-20 text-white md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)]/15 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            <Star size={12} /> Travellini Club
          </span>
          <h1 className="mt-6 text-5xl font-serif leading-[1.05] tracking-tight md:text-6xl">
            Una piccola quota.
            <br />
            <span className="italic text-white/55">Tutte le guide. Senza pubblicita.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/72">
            Il Club e l accesso continuo a tutto cio che pubblichiamo: guide digitali, itinerari
            aggiornati, contenuti riservati. Pensato per chi viaggia spesso e vuole leggere meno
            rumore.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[var(--radius-lg)] border border-white/10 bg-white/5 p-8 md:p-10"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/55">
              Lettore — Gratis
            </p>
            <p className="mt-4 font-serif text-4xl">0 EUR</p>
            <p className="mt-1 text-xs text-white/50">Sempre. Per chi vuole leggere.</p>
            <ul className="mt-7 space-y-3">
              {FREE_BENEFITS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-white/72">
                  <CheckCircle2 size={16} className="mt-1 shrink-0 text-white/40" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-accent)]/40 bg-gradient-to-br from-[var(--color-accent)]/12 to-white/4 p-8 md:p-10"
          >
            <div className="absolute right-8 top-8 inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--color-ink)]">
              <Sparkles size={11} /> Consigliato
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent)]">
              Travellini Club — Premium
            </p>
            <p className="mt-4 font-serif text-4xl">Da 5,90 EUR al mese</p>
            <p className="mt-1 text-xs text-white/50">
              IVA inclusa · accesso immediato a tutto il catalogo
            </p>
            <ul className="mt-7 space-y-3">
              {CLUB_BENEFITS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-white/82">
                  <CheckCircle2 size={16} className="mt-1 shrink-0 text-[var(--color-accent)]" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {PRICING_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => handlePlanSelect(tier.id)}
                  className="group relative flex flex-col items-start gap-2 rounded-[var(--radius-md)] border border-white/12 bg-white/5 p-5 text-left transition-all hover:border-[var(--color-accent)]/60 hover:bg-white/10"
                >
                  {tier.badge && (
                    <span className="absolute right-4 top-4 rounded-full bg-[var(--color-accent)] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)]">
                      {tier.badge}
                    </span>
                  )}
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/55">
                    {tier.label}
                  </p>
                  <p className="font-serif text-3xl">
                    {tier.price} <span className="text-base text-white/55">EUR</span>
                  </p>
                  <p className="text-xs text-white/55">{tier.period}</p>
                  <p className="mt-2 text-xs text-white/45">{tier.sub}</p>
                </button>
              ))}
            </div>

            <p className="mt-7 flex items-center gap-2 rounded-[var(--radius-md)] border border-white/10 bg-white/5 p-4 text-sm text-white/68">
              <Lock size={14} className="shrink-0 text-[var(--color-accent)]" />
              Checkout in arrivo. Lascia l email e ti avvisiamo appena il Club apre alle prime
              iscrizioni.
            </p>

            {isSubscribed ? (
              <div className="mt-4 flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/12 p-4 text-sm text-white">
                <CheckCircle2 size={18} className="shrink-0 text-[var(--color-accent)]" />
                <span>
                  Sei in waitlist. Ti scriviamo appena il Club apre alle prime iscrizioni.
                </span>
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="la-tua@email.com"
                  required
                  disabled={isSubmitting}
                  aria-invalid={error ? 'true' : undefined}
                  className="w-full rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/35 focus:border-[var(--color-accent)] focus:outline-none disabled:opacity-50 sm:flex-1"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:bg-white disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Invio
                    </>
                  ) : (
                    <>
                      <Mail size={14} /> Avvisami al lancio
                    </>
                  )}
                </button>
              </form>
            )}
            {error && !isSubscribed && (
              <p className="mt-2 text-xs text-[var(--color-accent)]" role="alert">
                {error}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
