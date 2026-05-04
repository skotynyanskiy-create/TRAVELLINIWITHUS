import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle, Loader2, Mail, MapPin, Plane, Stamp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent } from '../../services/analytics';

/**
 * Premium newsletter component styled as a vintage travel envelope.
 * Requested by the owner: "qualcosa di raffinato, professionale e elegante,
 * tipo una busta delle lettere da viaggio".
 */
export default function NewsletterEnvelope() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: FormEvent) => {
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
        body: JSON.stringify({ email: normalizedEmail, source: 'homepage_envelope' }),
      });

      if (!response.ok) throw new Error('Subscription failed');

      trackEvent('newsletter_signup', { source: 'homepage_envelope' });
      setIsSubscribed(true);
    } catch {
      try {
        const stored = JSON.parse(localStorage.getItem('twu_newsletter_leads') || '[]');
        stored.push({
          email: normalizedEmail,
          source: 'homepage_envelope',
          date: new Date().toISOString(),
        });
        localStorage.setItem('twu_newsletter_leads', JSON.stringify(stored));
        trackEvent('newsletter_signup', { source: 'homepage_envelope', fallback: 'localStorage' });
        setIsSubscribed(true);
      } catch {
        setError('Iscrizione non riuscita. Riprova tra poco.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[var(--color-sand)] py-20 md:py-28">
      {/* Subtle texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 md:px-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Left: Copy */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <Mail size={16} className="text-[var(--color-accent)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
                Cartoline di viaggio
              </span>
            </div>
            <h2 className="max-w-lg font-serif text-4xl leading-[1.05] text-ink md:text-5xl">
              Ricevi le nostre <span className="italic text-black/60">cartoline di viaggio</span>.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-black/65">
              Una email ogni tanto con i posti migliori che abbiamo scoperto, itinerari pronti,
              consigli pratici e codici sconto esclusivi. Niente spam, solo ispirazione vera.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                'Destinazioni e itinerari testati da noi',
                'Consigli pratici per organizzare il viaggio',
                'Codici sconto esclusivi dei nostri partner',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                  <span className="text-sm leading-relaxed text-black/62">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Envelope card */}
          <div className="relative">
            {/* Envelope shape */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]"
            >
              {/* Envelope flap pattern */}
              <div className="relative h-16 overflow-hidden bg-gradient-to-b from-[var(--color-accent)]/8 to-transparent">
                <svg
                  viewBox="0 0 400 64"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full"
                >
                  <path d="M0,0 L200,48 L400,0 L400,64 L0,64 Z" fill="white" />
                  <path
                    d="M0,0 L200,48 L400,0"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeOpacity="0.15"
                    strokeWidth="1.5"
                    strokeDasharray="8 4"
                  />
                </svg>

                {/* Stamp */}
                <div className="absolute right-5 top-2 flex h-12 w-12 items-center justify-center rounded-sm border-2 border-dashed border-[var(--color-accent)]/25 bg-[var(--color-accent)]/5">
                  <Stamp size={20} className="text-[var(--color-accent)]/60" />
                </div>

                {/* Air mail stripe */}
                <div className="absolute left-5 top-3 flex items-center gap-2">
                  <Plane size={12} className="text-[var(--color-accent)]/50" />
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent)]/40">
                    Par Avion
                  </span>
                </div>
              </div>

              {/* Envelope content */}
              <div className="px-6 pb-8 pt-2 md:px-10 md:pb-10">
                <AnimatePresence mode="wait">
                  {!isSubscribed ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="mb-6 border-b border-dashed border-black/8 pb-4">
                        <p className="font-serif text-lg text-black/70">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                            Da:
                          </span>{' '}
                          Rodrigo & Betta
                        </p>
                        <p className="mt-1 font-serif text-lg text-black/70">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                            A:
                          </span>{' '}
                          <span className="italic text-black/40">il tuo prossimo viaggio</span>
                        </p>
                      </div>

                      <form onSubmit={handleSubscribe} className="space-y-4">
                        <div>
                          <label
                            htmlFor="newsletter-envelope-email"
                            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.22em] text-black/40"
                          >
                            Il tuo indirizzo
                          </label>
                          <input
                            id="newsletter-envelope-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nome@esempio.com"
                            required
                            className="w-full rounded-xl border border-black/8 bg-[var(--color-sand)]/50 px-5 py-3.5 text-sm text-[var(--color-ink)] transition-all placeholder:text-black/28 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[var(--color-accent)] disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Invio in corso...
                            </>
                          ) : (
                            <>
                              <Mail size={14} />
                              Ricevi le cartoline
                            </>
                          )}
                        </button>

                        {error && <p className="text-center text-sm text-red-500">{error}</p>}

                        <p className="text-center text-[11px] leading-relaxed text-black/35">
                          Iscrivendoti accetti la{' '}
                          <Link
                            to="/privacy"
                            className="underline underline-offset-2 hover:text-black/50"
                          >
                            privacy policy
                          </Link>
                          . Disiscrizione sempre disponibile.
                        </p>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-6 text-center"
                    >
                      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                        <CheckCircle size={28} className="text-[var(--color-accent)]" />
                      </div>
                      <p className="font-serif text-2xl text-[var(--color-ink)]">
                        Cartolina in arrivo! ✈️
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-black/55">
                        Ti abbiamo aggiunto alla lista. Riceverai i nostri consigli di viaggio
                        migliori direttamente nella tua inbox.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom stripe — airmail pattern */}
              <div className="flex h-3 w-full">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 ${i % 2 === 0 ? 'bg-[var(--color-accent)]/12' : 'bg-transparent'}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
