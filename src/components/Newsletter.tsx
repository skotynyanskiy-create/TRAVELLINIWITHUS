import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Mail, Loader2, Gift, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent } from '../services/analytics';
import Button from './Button';

interface NewsletterProps {
  variant?: 'sand' | 'white';
  source?: string;
  /** Modalità compatta per embed in popup/card */
  compact?: boolean;
  /** Callback chiamato dopo iscrizione riuscita */
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

  // Modalità compatta per popup/embed
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
                placeholder="La tua email"
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
            <CheckCircle className="text-[var(--color-accent)] shrink-0" size={20} />
            <div>
              <p className="text-sm font-semibold text-zinc-800">Iscrizione confermata.</p>
              <p className="text-xs text-zinc-500">
                Ti aggiorneremo con i prossimi contenuti utili.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <section
      id="newsletter"
      className={`py-20 md:py-32 ${variant === 'sand' ? 'bg-[var(--color-sand)]' : 'bg-white'} px-6`}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-10 md:grid-cols-2 md:items-center lg:gap-16"
        >
          <div>
            <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-[var(--color-accent)] mb-6 block">
              Newsletter Travellini
            </span>
            <h2 className="text-display-2 mb-8 tracking-tight text-zinc-900">
              Una email ogni tanto. Posti veri, idee vere.
            </h2>

            {/* Lead magnet */}
            <div className="flex items-start gap-4 bg-[var(--color-gold-soft)] border border-[var(--color-gold)]/20 rounded-2xl px-6 py-5 mb-8">
              <Gift className="text-[var(--color-gold)] shrink-0 mt-0.5" size={22} />
              <div>
                <p className="text-sm font-semibold text-zinc-800 mb-1">
                  Solo contenuti utili, senza rumore.
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Idee viaggio, strumenti testati e aggiornamenti sui nuovi contenuti del progetto.
                  Quando prepariamo risorse bonus, le condividiamo prima qui.
                </p>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-zinc-700">
                <CheckCircle className="text-[var(--color-accent)] shrink-0 mt-1" size={18} />
                <span>Posti particolari e idee weekend da non perdere.</span>
              </li>
              <li className="flex items-start gap-3 text-zinc-700">
                <CheckCircle className="text-[var(--color-accent)] shrink-0 mt-1" size={18} />
                <span>Strumenti, app e risorse che usiamo davvero.</span>
              </li>
              <li className="flex items-start gap-3 text-zinc-700">
                <CheckCircle className="text-[var(--color-accent)] shrink-0 mt-1" size={18} />
                <span>Nuovi articoli, mappe e risorse quando sono davvero pronte.</span>
              </li>
            </ul>

            {/* Social proof */}
            <div className="flex items-center gap-3 text-sm text-zinc-500">
              <Users size={16} className="text-[var(--color-accent)]" />
              <span>
                Unisciti ai <strong className="text-zinc-700">Travellini</strong> — solo invii
                utili, zero spam.
              </span>
            </div>
          </div>

          <div className="rounded-[var(--radius-xl)] border border-zinc-100 bg-zinc-50 p-6 md:p-10">
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
                      className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider"
                    >
                      La tua email
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nome@esempio.com"
                      required
                      className="w-full px-8 py-5 rounded-[var(--radius-xl)] bg-white border border-zinc-200 focus:outline-none focus:border-[var(--color-accent)] transition-all text-zinc-900 placeholder:text-zinc-400 text-sm shadow-inner"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {isSubmitting ? (
                      <>
                        Iscrizione in corso <Loader2 size={16} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        Iscriviti alla newsletter <Mail size={16} />
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
                      privacy policy
                    </Link>
                    . Puoi disiscriverti quando vuoi.
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-8"
                >
                  <div className="w-20 h-20 rounded-full bg-[var(--color-accent-soft)] flex items-center justify-center text-[var(--color-accent)] mx-auto">
                    <CheckCircle size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif mb-3 text-zinc-900">
                      Iscrizione confermata.
                    </h3>
                    <p className="text-zinc-600 text-sm leading-relaxed">
                      Da ora ti aggiorneremo con i prossimi contenuti utili, le novita del progetto
                      e le risorse che decidiamo di condividere.
                    </p>
                  </div>
                  <div className="bg-[var(--color-accent)]/8 rounded-xl p-4 text-xs text-zinc-600">
                    Puoi disiscriverti quando vuoi direttamente dalle email della newsletter.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
