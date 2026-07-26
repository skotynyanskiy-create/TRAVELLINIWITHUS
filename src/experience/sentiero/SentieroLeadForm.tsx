import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { appendLeadFallback } from '../../lib/leadFallback';
import { trackEvent } from '../../services/analytics';

/**
 * Form iscrizione reale per i pannelli finali del Sentiero (desktop + mobile).
 * Stesso contratto di Newsletter.tsx: POST /api/newsletter-subscribe, honeypot,
 * fallback localStorage, eventi GA4. Stile dark, condiviso tra le due fedeltà
 * per non duplicare la logica di conversione.
 */
export default function SentieroLeadForm({
  source,
  layout = 'stacked',
}: {
  source: string;
  layout?: 'stacked' | 'inline';
}) {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim();
    trackEvent('newsletter_submit_attempt', { source });

    if (website.trim()) {
      trackEvent('newsletter_submit_blocked', { source, reason: 'honeypot' });
      setDone(true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Inserisci un indirizzo email valido.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, source, website }),
      });
      if (!response.ok) throw new Error('Subscription failed');
      trackEvent('newsletter_signup', { source });
      setDone(true);
    } catch {
      const saved = appendLeadFallback('twu_newsletter_leads', {
        email: normalizedEmail,
        source,
        date: new Date().toISOString(),
      });
      if (saved) {
        trackEvent('newsletter_signup', { source, fallback: 'localStorage' });
        setDone(true);
      } else {
        setError('Iscrizione non riuscita. Riprova tra poco o scrivici via email.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.p
          key="done"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs font-light leading-relaxed text-white/80"
        >
          <Check size={14} className="shrink-0 text-[var(--color-accent)]" />
          Ci sei. La prossima lettera delle tracce arriva nella tua casella.
        </motion.p>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className={layout === 'inline' ? 'flex flex-col gap-2' : 'flex flex-col gap-2'}
          noValidate
        >
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="hidden"
            aria-hidden="true"
          />
          <div className={layout === 'inline' ? 'flex gap-2' : 'flex flex-col gap-2'}>
            <label htmlFor={`sentiero-email-${source}`} className="sr-only">
              La tua email
            </label>
            <input
              id={`sentiero-email-${source}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@esempio.com"
              required
              disabled={submitting}
              aria-invalid={error ? true : undefined}
              className="w-full flex-grow rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white transition-colors placeholder:text-white/40 focus:border-[var(--color-accent)] focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center justify-center gap-2 rounded-full bg-white font-bold uppercase tracking-[0.16em] text-[var(--color-ink)] transition-colors duration-300 hover:bg-[var(--color-accent)] hover:text-white disabled:opacity-60 ${
                layout === 'inline' ? 'shrink-0 px-5 py-2.5 text-xs' : 'w-full px-5 py-2.5 text-xs'
              }`}
            >
              {submitting ? 'Invio…' : 'Iscriviti'}
              {!submitting && layout === 'stacked' && <ArrowRight size={14} />}
            </button>
          </div>
          {error && (
            <p role="alert" className="text-[11px] font-medium text-[var(--color-accent)]">
              {error}
            </p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
