import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Mail, Loader2, Gift, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent } from '../services/analytics';
import Button from './Button';
import { siteContentDefaults } from '../config/siteContent';
import { useSiteContent } from '../hooks/useSiteContent';

interface NewsletterProps {
  variant?: 'sand' | 'white';
  source?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

export default function Newsletter({
  variant = 'sand',
  source = 'newsletter_form',
  compact = false,
  onSuccess,
}: NewsletterProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { data: content } = useSiteContent('newsletter');
  const newsletter = content ?? siteContentDefaults.newsletter;

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError('Inserisci un indirizzo email.');
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
        body: JSON.stringify({ email: normalizedEmail, source }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      trackEvent('newsletter_signup', { source });
      setIsSubscribed(true);
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (submitError) {
      console.error('Error saving newsletter lead:', submitError);
      setError('Iscrizione non riuscita. Riprova tra poco oppure scrivici direttamente via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (compact) {
    return (
      <AnimatePresence mode="wait">
        {!isSubscribed ? (
          <motion.form
            key="form-compact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubscribe}
            className="space-y-3"
          >
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletter.emailLabel}
                required
                className="flex-1 rounded-full border border-black/10 px-5 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[var(--color-accent)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <Mail size={14} /> Iscriviti
                  </>
                )}
              </button>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </motion.form>
        ) : (
          <motion.div
            key="success-compact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 rounded-2xl bg-[var(--color-accent-soft)] px-5 py-4"
          >
            <CheckCircle className="shrink-0 text-[var(--color-accent)]" size={20} />
            <div>
              <p className="text-sm font-semibold text-zinc-800">{newsletter.successTitle}</p>
              <p className="text-xs text-zinc-500">{newsletter.successDescription}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <section
      id="newsletter"
      className={`py-32 ${variant === 'sand' ? 'bg-[var(--color-sand)]' : 'bg-white'} px-6`}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-zinc-100 border-t-2 border-t-[var(--color-gold)]/40 bg-white p-12 shadow-[var(--shadow-premium)] md:p-24"
        >
          <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[var(--color-gold)]/10 blur-[128px]" />

          <div className="relative z-10 grid items-center gap-20 md:grid-cols-2">
            <div>
              <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-accent)]">
                {newsletter.eyebrow}
              </span>
              <h2 className="text-display-2 mb-8 tracking-tight text-zinc-900">
                {newsletter.title}
              </h2>

              <div className="mb-8 flex items-start gap-4 rounded-2xl border border-[var(--color-gold)]/20 bg-[var(--color-gold-soft)] px-6 py-5">
                <Gift className="mt-0.5 shrink-0 text-[var(--color-gold)]" size={22} />
                <div>
                  <p className="mb-1 text-sm font-semibold text-zinc-800">
                    {newsletter.leadTitle}
                  </p>
                  <p className="text-xs leading-relaxed text-zinc-500">
                    {newsletter.leadDescription}
                  </p>
                </div>
              </div>

              <ul className="mb-8 space-y-4">
                {newsletter.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-zinc-700">
                    <CheckCircle className="mt-1 shrink-0 text-[var(--color-accent)]" size={18} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <Users size={16} className="text-[var(--color-accent)]" />
                <span>{newsletter.proofLine}</span>
              </div>
            </div>

            <div className="rounded-[var(--radius-xl)] border border-zinc-100 bg-zinc-50 p-12">
              <AnimatePresence mode="wait">
                {!isSubscribed ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubscribe}
                    className="space-y-6"
                  >
                    <div>
                      <label
                        htmlFor="newsletter-email"
                        className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                      >
                        {newsletter.emailLabel}
                      </label>
                      <input
                        id="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nome@esempio.com"
                        required
                        className="w-full rounded-[var(--radius-xl)] border border-zinc-200 bg-white px-8 py-5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-inner transition-all focus:border-[var(--color-accent)] focus:outline-none"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {isSubmitting ? (
                        <>
                          Iscrizione in corso <Loader2 size={16} className="animate-spin" />
                        </>
                      ) : (
                        <>
                          {newsletter.submitLabel} <Mail size={16} />
                        </>
                      )}
                    </Button>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <p className="text-center text-xs leading-relaxed text-zinc-400">
                      Iscrivendoti accetti il trattamento dei dati secondo la nostra{' '}
                      <Link
                        to="/privacy"
                        className="underline underline-offset-2 hover:text-zinc-600"
                      >
                        {newsletter.privacyLabel}
                      </Link>
                      . Puoi disiscriverti quando vuoi.
                    </p>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8 text-center"
                  >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                      <CheckCircle size={40} />
                    </div>
                    <div>
                      <h3 className="mb-3 text-2xl font-serif text-zinc-900">
                        {newsletter.successTitle}
                      </h3>
                      <p className="text-sm leading-relaxed text-zinc-600">
                        {newsletter.successDescription}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[var(--color-accent)]/8 p-4 text-xs text-zinc-600">
                      {newsletter.successNote}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
