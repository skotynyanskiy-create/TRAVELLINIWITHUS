import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle, Loader2, Gift } from 'lucide-react';
import { trackEvent } from '../services/analytics';

interface InlineNewsletterBannerProps {
  source?: string;
}

export default function InlineNewsletterBanner({ source = 'article_inline' }: InlineNewsletterBannerProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Inserisci un indirizzo email valido.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, source }),
      });
      if (!response.ok) throw new Error('Failed');
      trackEvent('newsletter_signup', { source });
      setIsSubscribed(true);
    } catch {
      setError('Iscrizione non riuscita. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-10 overflow-hidden rounded-3xl border border-[var(--color-accent)]/20 bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-sand)]">
      <AnimatePresence mode="wait">
        {!isSubscribed ? (
          <motion.div
            key="banner-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6 p-8 sm:flex-row sm:items-center"
          >
            <div className="flex shrink-0 items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10">
                <Gift size={22} className="text-[var(--color-accent)]" />
              </div>
              <div className="flex-1 sm:min-w-[220px]">
                <p className="text-sm font-bold text-[var(--color-ink)]">Ti è piaciuto questo articolo?</p>
                <p className="mt-0.5 text-xs leading-relaxed text-black/55">
                  Ricevi i prossimi contenuti utili direttamente in inbox, senza spam e senza rumore.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="La tua email"
                required
                className="flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-[var(--color-ink)] placeholder:text-black/30 focus:border-[var(--color-accent)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <Mail size={14} />
                    Iscriviti
                  </>
                )}
              </button>
            </form>
            {error && <p className="text-xs text-red-600 sm:col-span-2">{error}</p>}
          </motion.div>
        ) : (
          <motion.div
            key="banner-success"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 p-8"
          >
            <CheckCircle className="shrink-0 text-[var(--color-accent)]" size={28} />
            <div>
              <p className="font-bold text-[var(--color-ink)]">Iscrizione confermata.</p>
              <p className="text-sm text-black/50">Ti aggiorneremo con i prossimi contenuti utili.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
